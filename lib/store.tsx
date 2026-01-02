"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ALL_QUESTIONS, CATEGORIES, Category, Question } from "./data";
import { shuffleArray } from "./utils";

interface GameState {
    currentCategory: Category | null;
    currentQuestion: Question | null;
    history: Question[];
    queue: Question[];
    // V2 State
    favorites: string[];
    isGroupMode: boolean;
    activeFollowUp: string | null; // Text of the currently active follow-up being displayed, if any
}

interface GameContextType extends GameState {
    selectCategory: (categoryId: string) => void;
    nextQuestion: () => void;
    resetGame: () => void;
    // V2 Actions
    toggleFavorite: (questionId: string) => void;
    toggleGroupMode: () => void;
    showFollowUp: (text: string) => void;
    closeFollowUp: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = "deep-talk-game-state-v2";

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // Game State
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [queue, setQueue] = useState<Question[]>([]);
    const [history, setHistory] = useState<Question[]>([]);

    // V2 State
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isGroupMode, setIsGroupMode] = useState(false);
    const [activeFollowUp, setActiveFollowUp] = useState<string | null>(null);

    // Load state
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFavorites(parsed.favorites || []);
                setIsGroupMode(parsed.isGroupMode || false);

                // Restore session
                if (parsed.currentCategoryId) {
                    const category = CATEGORIES.find(c => c.id === parsed.currentCategoryId);
                    if (category) {
                        setCurrentCategory(category);
                        // We won't restore exact queue for now to keep it simple, but we could
                    }
                }
            } catch (e) {
                console.error("Failed to parse saved state", e);
            }
        }
    }, []);

    // Persist State
    useEffect(() => {
        if (!mounted) return;
        const stateToSave = {
            favorites,
            isGroupMode,
            currentCategoryId: currentCategory?.id
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, [favorites, isGroupMode, currentCategory, mounted]);

    const selectCategory = (categoryId: string) => {
        const category = CATEGORIES.find((c) => c.id === categoryId);
        if (!category) return;

        setCurrentCategory(category);
        // V2: Add simple transition or wait logic if needed

        const questions = ALL_QUESTIONS.filter((q) => q.categoryId === categoryId);
        const shuffled = shuffleArray(questions);

        // Pick first
        const first = shuffled[0];
        const remaining = shuffled.slice(1);

        setCurrentQuestion(first);
        setQueue(remaining);
        setHistory([first]);
        setActiveFollowUp(null);
    };

    const nextQuestion = () => {
        // If showing followup, clear it first? Or just move on.
        // Let's move on.
        setActiveFollowUp(null);

        // Add delay for visual rhythm? Handled in UI usually, but state update is instant.

        if (queue.length === 0) {
            // Reshuffle
            if (currentCategory) {
                const questions = ALL_QUESTIONS.filter((q) => q.categoryId === currentCategory.id);
                const available = questions.filter(q => q.id !== currentQuestion?.id);
                const shuffled = shuffleArray(available);
                const next = shuffled[0];
                const remaining = shuffled.slice(1);

                setCurrentQuestion(next);
                setQueue(remaining);
                setHistory(prev => [...prev, next]);
            }
            return;
        }

        const next = queue[0];
        const remaining = queue.slice(1);
        setCurrentQuestion(next);
        setQueue(remaining);
        setHistory(prev => [...prev, next]);
    };

    const resetGame = () => {
        setCurrentCategory(null);
        setCurrentQuestion(null);
        setQueue([]);
        setHistory([]);
        setActiveFollowUp(null);
        // We do NOT clear favorites or group mode on "reset game" (changing topic)
        // Only if we want a Hard Reset.
    };

    const toggleFavorite = (questionId: string) => {
        setFavorites(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const toggleGroupMode = () => {
        setIsGroupMode(prev => !prev);
    };

    const showFollowUp = (text: string) => {
        setActiveFollowUp(text);
    };

    const closeFollowUp = () => {
        setActiveFollowUp(null);
    };

    return (
        <GameContext.Provider
            value={{
                currentCategory,
                currentQuestion,
                history,
                queue,
                favorites,
                isGroupMode,
                activeFollowUp,
                selectCategory,
                nextQuestion,
                resetGame,
                toggleFavorite,
                toggleGroupMode,
                showFollowUp,
                closeFollowUp
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}
