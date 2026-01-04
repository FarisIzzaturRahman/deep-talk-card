import { Question } from "./data";

export type GameMode = 'SHARED' | 'DRAFT';

export enum RoundPhase {
    IDLE = 'IDLE',
    DRAFTING = 'DRAFTING', // Players picking unique cards
    ANSWERING = 'ANSWERING', // Shared mode: everyone answers same card. Draft: post-draft discussion.
    SCORING = 'SCORING',
}

export interface Player {
    id: string;
    name: string;
    score?: number; // Optional session score
}

export interface GameConfig {
    mode: GameMode;
    categoryId: string;
    playerCount: number;
}

export interface GameSession {
    id: string;
    config: GameConfig;
    players: Player[];
    turnOrder: string[]; // List of Player IDs in order for the current round
    roundCount: number;
}

export interface RoundState {
    phase: RoundPhase;
    deck: Question[];

    // Logic specific to Draft Mode
    availableCards: Question[]; // Pool to pick from
    currentTurnIndex: number; // Index into session.turnOrder
    turnStatus: 'PICKING' | 'REVEALED' | 'DONE'; // Sub-state for the active turn

    // Data tracking
    picks: Record<string, string>; // PlayerID -> QuestionID
    playerAnswers: Record<string, boolean>; // For completion tracking
}
