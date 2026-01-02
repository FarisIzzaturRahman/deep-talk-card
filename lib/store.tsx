"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ALL_QUESTIONS, CATEGORIES, Category, Question } from "./data";
import { shuffleArray } from "./utils";

interface GameState {
    currentCategory: Category | null;
    currentQuestion: Question | null;
    history: Question[];
    queue: Question[];
    favorites: string[];
    isGroupMode: boolean;
    activeFollowUp: string | null;
    isGenerating: boolean;
}

interface GameContextType extends GameState {
    selectCategory: (categoryId: string) => void;
    nextQuestion: () => void;
    resetGame: () => void;
    toggleFavorite: (questionId: string) => void;
    toggleGroupMode: () => void;
    showFollowUp: (text: string) => void;
    closeFollowUp: () => void;
    generateQuestions: (context: string, audience: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = "deep-talk-game-state-v3";

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // Game State
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [queue, setQueue] = useState<Question[]>([]);
    const [history, setHistory] = useState<Question[]>([]);
    const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

    // Settings & UI State
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isGroupMode, setIsGroupMode] = useState(false);
    const [activeFollowUp, setActiveFollowUp] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [customCategory, setCustomCategory] = useState<Category | null>(null);

    // Load state
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFavorites(parsed.favorites || []);
                setIsGroupMode(parsed.isGroupMode || false);

                if (parsed.currentCategoryId) {
                    const category = CATEGORIES.find(c => c.id === parsed.currentCategoryId);
                    if (category) {
                        setCurrentCategory(category);
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
        const questions = ALL_QUESTIONS.filter((q) => q.categoryId === categoryId);
        const shuffled = shuffleArray(questions);

        const first = shuffled[0];
        const remaining = shuffled.slice(1);

        setActiveQuestions(questions);
        setCurrentQuestion(first);
        setQueue(remaining);
        setHistory([first]);
        setActiveFollowUp(null);
    };

    const nextQuestion = () => {
        setActiveFollowUp(null);

        if (queue.length === 0) {
            if (activeQuestions.length > 1) {
                const available = activeQuestions.filter(q => q.id !== currentQuestion?.id);
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

    const generateQuestions = async (context: string, audience: string) => {
        setIsGenerating(true);
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ context, audience }),
            });

            if (!response.ok) throw new Error("Failed to generate questions");

            const data = await response.json();
            const questions = data.questions as Question[];

            const aiCategory: Category = {
                id: `ai-custom-${Date.now()}`,
                label: "AI Magic ✨",
                description: `Hasil generate untuk: ${context}`,
                color: "bg-amber-500",
                gradient: "from-amber-400 to-amber-600"
            };

            setCustomCategory(aiCategory);
            setCurrentCategory(aiCategory);

            const shuffled = shuffleArray(questions);
            const first = shuffled[0];
            const remaining = shuffled.slice(1);

            setActiveQuestions(questions);
            setCurrentQuestion(first);
            setQueue(remaining);
            setHistory([first]);
            setActiveFollowUp(null);
        } catch (error) {
            console.error(error);
            alert("Maaf, gagal membuat pertanyaan. Coba lagi nanti.");
        } finally {
            setIsGenerating(false);
        }
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
                currentCategory: currentCategory?.id.startsWith("ai-custom") ? customCategory : currentCategory,
                currentQuestion,
                history,
                queue,
                favorites,
                isGroupMode,
                activeFollowUp,
                isGenerating,
                selectCategory,
                nextQuestion,
                resetGame,
                toggleFavorite,
                toggleGroupMode,
                showFollowUp,
                closeFollowUp,
                generateQuestions
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
