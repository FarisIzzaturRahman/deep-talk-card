"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ALL_QUESTIONS, CATEGORIES, type Category, type Question } from "./data";
import { confirmTurn, createGameState, pickCard, startRound } from "./game-engine";
import type { GameConfig, GameSession, GameState, Player, RoundState } from "./game-types";

export type GameStatus = "LOBBY" | "SETUP" | "PLAYING" | "FINISHED";

interface GameContextType {
    gameStatus: GameStatus;
    session: GameSession;
    round: RoundState;
    currentCategory: Category | null;
    currentPlayer: Player | null;
    currentQuestion: Question | null;
    selectCategory: (categoryId: string) => void;
    setupGame: (config: GameConfig, players: Player[]) => void;
    startRound: () => void;
    draftCard: (cardId: string) => void;
    confirmTurn: () => void;
    endGame: () => void;
    resetGame: () => void;
    favorites: string[];
    toggleFavorite: (id: string) => void;
    activeFollowUp: string | null;
    showFollowUp: (text: string) => void;
    closeFollowUp: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);
const STORAGE_KEY = "deep-talk-session-v1";
const DEFAULT_CONFIG: GameConfig = {
    mode: "SHARED",
    categoryId: "default",
};
const DEFAULT_PLAYERS: Player[] = [{ id: "default", name: "Player" }];

function createInitialGame(): GameState {
    return createGameState(DEFAULT_CONFIG, DEFAULT_PLAYERS);
}

function readStoredFavorites(): string[] {
    if (typeof window === "undefined") return [];

    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (!savedState) return [];

        const favorites = (JSON.parse(savedState) as { favorites?: unknown }).favorites;
        if (!Array.isArray(favorites)) return [];

        return favorites.filter((favorite): favorite is string => typeof favorite === "string");
    } catch {
        return [];
    }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [gameStatus, setGameStatus] = useState<GameStatus>("LOBBY");
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [game, setGame] = useState<GameState>(createInitialGame);
    const [favorites, setFavorites] = useState<string[]>(readStoredFavorites);
    const [activeFollowUp, setActiveFollowUp] = useState<string | null>(null);

    const selectCategory = (categoryId: string) => {
        const category = CATEGORIES.find((candidate) => candidate.id === categoryId);
        if (!category) return;

        setCurrentCategory(category);
        setActiveFollowUp(null);
        setGameStatus("SETUP");
    };

    const setupGame = (config: GameConfig, players: Player[]) => {
        const newGame = createGameState(config, players);
        setGame(startRound(newGame, ALL_QUESTIONS));
        setActiveFollowUp(null);
        setGameStatus("PLAYING");
    };

    const beginNextRound = () => {
        setGame((currentGame) => startRound(currentGame, ALL_QUESTIONS));
        setActiveFollowUp(null);
    };

    const draftCard = (cardId: string) => {
        setGame((currentGame) => pickCard(currentGame, cardId));
    };

    const finishCurrentTurn = () => {
        setGame((currentGame) => confirmTurn(currentGame));
    };

    const endGame = () => {
        setActiveFollowUp(null);
        setGameStatus("FINISHED");
    };

    const resetGame = () => {
        setGameStatus("LOBBY");
        setCurrentCategory(null);
        setActiveFollowUp(null);
        setGame(createInitialGame());
    };

    const toggleFavorite = (id: string) => {
        setFavorites((currentFavorites) => currentFavorites.includes(id)
            ? currentFavorites.filter((favoriteId) => favoriteId !== id)
            : [...currentFavorites, id]);
    };

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ favorites }));
        } catch {
            // Favorites remain usable for this session when storage is unavailable.
        }
    }, [favorites]);

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
            selectCategory,
            setupGame,
            startRound: beginNextRound,
            draftCard,
            confirmTurn: finishCurrentTurn,
            endGame,
            resetGame,
            favorites,
            toggleFavorite,
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
