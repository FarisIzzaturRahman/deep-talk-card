"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { ALL_QUESTIONS, CATEGORIES, Category, Question } from "./data";
import { shuffleArray } from "./utils";
import { GameEngine } from "./game-engine";
import { GameSession, RoundState, GameConfig, Player } from "./game-types";

// --- Types ---

export type GameStatus = 'LOBBY' | 'SETUP' | 'PLAYING';

interface GameContextType {
    // Core State
    gameStatus: GameStatus;
    session: GameSession;
    round: RoundState;
    currentCategory: Category | null;

    // Computed / Helpers
    currentPlayer: Player | null;
    currentQuestion: Question | null; // Active card to show (Shared or Revealed Draft)

    // Actions
    selectCategory: (categoryId: string) => void;
    setupGame: (config: GameConfig, players: Player[]) => void;
    startRound: () => void; // Deals cards
    draftCard: (cardId: string) => void; // Pick
    confirmTurn: () => void; // Done
    resetGame: () => void; // Back to Lobby

    // Features
    favorites: string[];
    toggleFavorite: (id: string) => void;

    // Speed Mode / Timer (UI Feature)
    timerMode: 'normal' | 'speed';
    timer: number;
    startSpeedMode: () => void;
    stopSpeedMode: () => void;

    // AI Generation
    isGenerating: boolean;
    generateQuestions: (context: string, audience: string) => Promise<void>;

    // Helpers
    activeFollowUp: string | null;
    showFollowUp: (text: string) => void;
    closeFollowUp: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = "deep-talk-session-v1";

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // --- Core State ---
    const [gameStatus, setGameStatus] = useState<GameStatus>('LOBBY');
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    // --- Engine ---
    const engineRef = useRef<GameEngine>(new GameEngine(
        { mode: 'SHARED', categoryId: 'default', playerCount: 1 },
        [{ id: 'default', name: 'Player' }]
    ));

    const [session, setSession] = useState<GameSession>(() => engineRef.current.getSession());
    const [round, setRound] = useState<RoundState>(() => engineRef.current.getRound());

    // --- UI/Feature State ---
    const [timerMode, setTimerMode] = useState<'normal' | 'speed'>('normal');
    const [timer, setTimer] = useState(60);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeFollowUp, setActiveFollowUp] = useState<string | null>(null);

    // --- Sync Helper ---
    const refreshEngineState = useCallback(() => {
        setSession({ ...engineRef.current.getSession() });
        setRound({ ...engineRef.current.getRound() });
    }, []);

    // --- Actions ---

    const selectCategory = (categoryId: string) => {
        const cat = CATEGORIES.find(c => c.id === categoryId);
        if (cat) {
            setCurrentCategory(cat);
            setGameStatus('SETUP'); // Move to Setup Modal

            // Pre-load questions
            const qs = ALL_QUESTIONS.filter(q => q.categoryId === categoryId);
            setActiveQuestions(shuffleArray(qs));
        }
    };

    const setupGame = (config: GameConfig, players: Player[]) => {
        // Re-init engine
        engineRef.current = new GameEngine(config, players);

        // Start first round immediately? Or wait for explicit "Start"?
        // Let's start immediately so we go to gameplay
        engineRef.current.startRound(activeQuestions);

        refreshEngineState();
        setGameStatus('PLAYING');
    };

    const startRound = () => {
        engineRef.current.startRound(activeQuestions);
        refreshEngineState();
    };

    const draftCard = (cardId: string) => {
        if (!currentPlayer) return;
        const success = engineRef.current.draftCard(currentPlayer.id, cardId);
        if (success) refreshEngineState();
    };

    const confirmTurn = () => {
        if (!currentPlayer) return;
        const success = engineRef.current.confirmTurn(currentPlayer.id);
        if (success) refreshEngineState();
    };

    const resetGame = () => {
        setGameStatus('LOBBY');
        setCurrentCategory(null);
        setTimerMode('normal');
        engineRef.current = new GameEngine(
            { mode: 'SHARED', categoryId: 'default', playerCount: 1 },
            [{ id: 'default', name: 'Player' }]
        );
        refreshEngineState();
    };

    // --- AI Generation ---
    const generateQuestions = async (context: string, audience: string) => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context, audience }),
            });
            if (!response.ok) throw new Error("Failed to generate");

            const data = await response.json();
            const newCategory: Category = {
                id: `ai-${Date.now()}`,
                label: "AI Magic ✨",
                description: `Context: ${context.substring(0, 20)}...`,
                color: "bg-gradient-to-br from-amber-400 to-orange-600",
                gradient: "from-amber-400 to-orange-600"
            };

            setCurrentCategory(newCategory);
            setActiveQuestions(shuffleArray(data.questions || []));
            setGameStatus('SETUP'); // Go to setup with AI category

        } catch (error) {
            console.error("AI Gen Error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    // --- Helpers ---
    const toggleFavorite = (id: string) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const startSpeedMode = () => { setTimerMode('speed'); setTimer(60); };
    const stopSpeedMode = () => { setTimerMode('normal'); };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerMode === 'speed' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0 && timerMode === 'speed') {
            stopSpeedMode();
        }
        return () => clearInterval(interval);
    }, [timerMode, timer]);

    const showFollowUp = (text: string) => setActiveFollowUp(text);
    const closeFollowUp = () => setActiveFollowUp(null);

    // --- Computed ---
    const currentTurnUserId = session.turnOrder[round.currentTurnIndex];
    const currentPlayer = session.players.find(p => p.id === currentTurnUserId) || null;

    // Current Question Logic
    // In Shared: The one active card.
    // In Draft: The card picked by current user IF revealed.
    let currentQuestion: Question | null = null;
    if (session.config.mode === 'SHARED') {
        const cardId = round.picks[session.players[0]?.id]; // Anyone's pick is the shared card
        currentQuestion = round.deck.find(c => c.id === cardId) || null;
    } else {
        // Draft Mode
        // If status REVEALED, show current player's pick
        if (round.turnStatus === 'REVEALED' && currentPlayer) {
            const cardId = round.picks[currentPlayer.id];
            currentQuestion = round.deck.find(c => c.id === cardId) || null;
        }
    }

    // Persistence
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.favorites) setFavorites(parsed.favorites);
            } catch (e) { }
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ favorites }));
    }, [favorites, mounted]);

    return (
        <GameContext.Provider value={{
            gameStatus,
            session,
            round,
            currentCategory,
            currentPlayer,
            currentQuestion,
            selectCategory,
            setupGame,
            startRound,
            draftCard,
            confirmTurn,
            resetGame,
            favorites,
            toggleFavorite,
            timerMode,
            timer,
            startSpeedMode,
            stopSpeedMode,
            isGenerating,
            generateQuestions,
            activeFollowUp,
            showFollowUp,
            closeFollowUp
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame must be used within a GameProvider");
    return context;
}
