"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { CATEGORIES, type Category, type Question } from "./data";
import {
    confirmTurn,
    createGameState,
    nextQuestion,
    pickCard,
    skipQuestion as skipGameQuestion,
    startRound,
} from "./game-engine";
import type { GameConfig, GameSession, GameState, Player, RoundState } from "./game-types";
import { loadQuestions } from "./question-loader";

export type GameStatus = "LOBBY" | "SETUP" | "PLAYING" | "FINISHED";
export type QuestionLoadStatus = "IDLE" | "LOADING" | "READY" | "ERROR";

interface GameContextType {
    gameStatus: GameStatus;
    session: GameSession;
    round: RoundState;
    currentCategory: Category | null;
    currentPlayer: Player | null;
    currentQuestion: Question | null;
    questionLoadStatus: QuestionLoadStatus;
    selectCategory: (categoryId: string) => void;
    retryQuestionLoad: () => void;
    setupGame: (config: GameConfig, players: Player[]) => void;
    startRound: () => void;
    draftCard: (cardId: string) => void;
    confirmTurn: () => void;
    skipQuestion: () => void;
    endGame: () => void;
    resetGame: () => void;
    endedAt: number | null;
    activeFollowUp: string | null;
    showFollowUp: (text: string) => void;
    closeFollowUp: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);
const DEFAULT_CONFIG: GameConfig = {
    mode: "SHARED",
    categoryId: "default",
};
const DEFAULT_PLAYERS: Player[] = [{ id: "default", name: "Player" }];

function createInitialGame(): GameState {
    return createGameState(DEFAULT_CONFIG, DEFAULT_PLAYERS);
}

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [gameStatus, setGameStatus] = useState<GameStatus>("LOBBY");
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [game, setGame] = useState<GameState>(createInitialGame);
    const [endedAt, setEndedAt] = useState<number | null>(null);
    const [activeFollowUp, setActiveFollowUp] = useState<string | null>(null);
    const [questionLoadStatus, setQuestionLoadStatus] = useState<QuestionLoadStatus>("IDLE");
    const [loadedQuestions, setLoadedQuestions] = useState<{
        categoryId: string;
        questions: Question[];
    } | null>(null);
    const questionRequestId = useRef(0);

    const loadCategoryQuestions = (categoryId: string) => {
        const requestId = ++questionRequestId.current;
        setQuestionLoadStatus("LOADING");
        setLoadedQuestions(null);

        void loadQuestions(categoryId)
            .then((questions) => {
                if (questionRequestId.current !== requestId) return;

                setLoadedQuestions({ categoryId, questions });
                setQuestionLoadStatus("READY");
            })
            .catch(() => {
                if (questionRequestId.current !== requestId) return;

                setQuestionLoadStatus("ERROR");
            });
    };

    const selectCategory = (categoryId: string) => {
        const category = CATEGORIES.find((candidate) => candidate.id === categoryId);
        if (!category) return;

        setCurrentCategory(category);
        setActiveFollowUp(null);
        setGameStatus("SETUP");
        loadCategoryQuestions(category.id);
    };

    const setupGame = (config: GameConfig, players: Player[]) => {
        if (loadedQuestions?.categoryId !== config.categoryId) return;

        const newGame = createGameState(config, players);
        setGame(startRound(newGame, loadedQuestions.questions));
        setEndedAt(null);
        setActiveFollowUp(null);
        setGameStatus("PLAYING");
        track("game_started", {
            mode: config.mode,
            category: config.categoryId,
            playerCount: config.mode === "DRAFT" ? players.length : 1,
        });
    };

    const beginNextRound = () => {
        if (!loadedQuestions) return;

        setGame((currentGame) => currentGame.session.config.mode === "SHARED"
            ? nextQuestion(currentGame, loadedQuestions.questions)
            : startRound(currentGame, loadedQuestions.questions));
        setActiveFollowUp(null);
    };

    const draftCard = (cardId: string) => {
        setGame((currentGame) => pickCard(currentGame, cardId));
    };

    const finishCurrentTurn = () => {
        setGame((currentGame) => confirmTurn(currentGame));
    };

    const skipCurrentQuestion = () => {
        if (!loadedQuestions) return;

        setGame((currentGame) => skipGameQuestion(currentGame, loadedQuestions.questions));
        setActiveFollowUp(null);
    };

    const endGame = () => {
        const finishedAt = Date.now();
        const durationMinutes = Math.floor(Math.max(0, finishedAt - game.session.startedAt) / 60_000);
        track("game_finished", {
            mode: game.session.config.mode,
            category: game.session.config.categoryId,
            playerCount: game.session.config.mode === "DRAFT" ? game.session.players.length : 1,
            answeredCount: game.session.answeredCount,
            skippedCount: game.session.skippedCount,
            durationMinutes,
        });
        setEndedAt(finishedAt);
        setActiveFollowUp(null);
        setGameStatus("FINISHED");
    };

    const resetGame = () => {
        questionRequestId.current += 1;
        setGameStatus("LOBBY");
        setCurrentCategory(null);
        setEndedAt(null);
        setActiveFollowUp(null);
        setQuestionLoadStatus("IDLE");
        setLoadedQuestions(null);
        setGame(createInitialGame());
    };

    const currentPlayerId = game.session.turnOrder[game.round.currentTurnIndex];
    const currentPlayer = game.session.players.find(
        (player) => player.id === currentPlayerId,
    ) ?? null;

    return (
        <GameContext.Provider value={{
            gameStatus,
            session: game.session,
            round: game.round,
            currentCategory,
            currentPlayer,
            currentQuestion: game.round.currentQuestion,
            questionLoadStatus,
            selectCategory,
            retryQuestionLoad: () => {
                if (currentCategory) loadCategoryQuestions(currentCategory.id);
            },
            setupGame,
            startRound: beginNextRound,
            draftCard,
            confirmTurn: finishCurrentTurn,
            skipQuestion: skipCurrentQuestion,
            endGame,
            resetGame,
            endedAt,
            activeFollowUp,
            showFollowUp: setActiveFollowUp,
            closeFollowUp: () => setActiveFollowUp(null),
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}
