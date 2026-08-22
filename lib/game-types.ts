import type { Question } from "./data";

export type GameMode = "SHARED" | "DRAFT";
export type RoundPhase = "IDLE" | "DRAFTING" | "ANSWERING" | "COMPLETE";
export type TurnStatus = "PICKING" | "REVEALED";

export interface Player {
    id: string;
    name: string;
}

export interface GameConfig {
    mode: GameMode;
    categoryId: string;
}

export interface CategoryDeck {
    remaining: string[];
    used: string[];
}

export interface GameSession {
    id: string;
    config: GameConfig;
    players: Player[];
    turnOrder: string[];
    roundCount: number;
    decks: Record<string, CategoryDeck>;
    cardsSinceWildcard?: number;
}

export interface RoundState {
    phase: RoundPhase;
    availableCards: Question[];
    currentQuestion: Question | null;
    currentTurnIndex: number;
    turnStatus: TurnStatus;
}

export interface GameState {
    session: GameSession;
    round: RoundState;
}
