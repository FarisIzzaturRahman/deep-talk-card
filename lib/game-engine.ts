import type { Question } from "./data";
import type { CategoryDeck, GameConfig, GameState, Player } from "./game-types";
import { shuffleArray } from "./utils";

const WILDCARD_CATEGORY_ID = "wildcard";
const MIN_CARDS_BETWEEN_WILDCARDS = 8;
const WILDCARD_PROBABILITY = {
    SHARED: 0.06,
    DRAFT: 0.12,
} as const;

interface DrawResult {
    cards: Question[];
    deck: CategoryDeck;
}

export function createGameState(config: GameConfig, players: Player[]): GameState {
    return {
        session: {
            id: `session-${Date.now()}`,
            config,
            players,
            turnOrder: [],
            roundCount: 0,
            decks: {},
            cardsSinceWildcard: MIN_CARDS_BETWEEN_WILDCARDS,
            startedAt: Date.now(),
            answeredCount: 0,
            skippedCount: 0,
        },
        round: {
            phase: "IDLE",
            availableCards: [],
            currentQuestion: null,
            currentTurnIndex: 0,
            turnStatus: "PICKING",
        },
    };
}

function drawCategoryCards(
    categoryId: string,
    count: number,
    allQuestions: Question[],
    currentDeck?: CategoryDeck,
): DrawResult {
    const categoryQuestions = allQuestions.filter(
        (question) => question.categoryId === categoryId,
    );

    if (categoryQuestions.length < count) {
        throw new Error(
            `Kategori ${categoryId} membutuhkan ${count} kartu, tetapi hanya memiliki ${categoryQuestions.length}.`,
        );
    }

    const questionById = new Map(
        categoryQuestions.map((question) => [question.id, question]),
    );
    const remaining = currentDeck
        ? [...currentDeck.remaining]
        : shuffleArray(categoryQuestions.map((question) => question.id));
    const used = currentDeck ? [...currentDeck.used] : [];
    let drawnIds: string[];
    let nextRemaining: string[];
    let nextUsed: string[];

    if (remaining.length >= count) {
        drawnIds = remaining.slice(0, count);
        nextRemaining = remaining.slice(count);
        nextUsed = [...used, ...drawnIds];
    } else {
        const cardsFromNextCycle = count - remaining.length;
        const nextCycle = shuffleArray(used);
        const repeatedIds = nextCycle.slice(0, cardsFromNextCycle);

        drawnIds = [...remaining, ...repeatedIds];
        nextRemaining = nextCycle.slice(cardsFromNextCycle);
        nextUsed = drawnIds;
    }

    const cards = drawnIds.map((id) => {
        const question = questionById.get(id);
        if (!question) {
            throw new Error(`Kartu ${id} tidak ditemukan di kategori ${categoryId}.`);
        }
        return question;
    });

    return {
        cards,
        deck: {
            remaining: nextRemaining,
            used: nextUsed,
        },
    };
}

export function startRound(state: GameState, allQuestions: Question[]): GameState {
    const { config, players } = state.session;
    const cardsNeeded = config.mode === "DRAFT" ? players.length : 1;
    const cardsSinceWildcard = state.session.cardsSinceWildcard ?? MIN_CARDS_BETWEEN_WILDCARDS;
    const canIncludeWildcard = cardsSinceWildcard >= MIN_CARDS_BETWEEN_WILDCARDS;
    const includeWildcard = canIncludeWildcard && Math.random() < WILDCARD_PROBABILITY[config.mode];
    const decks = { ...state.session.decks };
    let cards: Question[];

    if (includeWildcard) {
        const categoryDraw = drawCategoryCards(
            config.categoryId,
            Math.max(0, cardsNeeded - 1),
            allQuestions,
            decks[config.categoryId],
        );
        const wildcardDraw = drawCategoryCards(
            WILDCARD_CATEGORY_ID,
            1,
            allQuestions,
            decks[WILDCARD_CATEGORY_ID],
        );

        decks[config.categoryId] = categoryDraw.deck;
        decks[WILDCARD_CATEGORY_ID] = wildcardDraw.deck;
        cards = shuffleArray([...categoryDraw.cards, ...wildcardDraw.cards]);
    } else {
        const categoryDraw = drawCategoryCards(
            config.categoryId,
            cardsNeeded,
            allQuestions,
            decks[config.categoryId],
        );
        decks[config.categoryId] = categoryDraw.deck;
        cards = categoryDraw.cards;
    }

    return {
        session: {
            ...state.session,
            turnOrder: config.mode === "DRAFT"
                ? shuffleArray(players.map((player) => player.id))
                : players.map((player) => player.id),
            roundCount: state.session.roundCount + 1,
            decks,
            cardsSinceWildcard: includeWildcard ? 0 : cardsSinceWildcard + cardsNeeded,
        },
        round: {
            phase: config.mode === "DRAFT" ? "DRAFTING" : "ANSWERING",
            availableCards: config.mode === "DRAFT" ? cards : [],
            currentQuestion: config.mode === "SHARED" ? cards[0] : null,
            currentTurnIndex: 0,
            turnStatus: "PICKING",
        },
    };
}

export function pickCard(state: GameState, cardId: string): GameState {
    if (
        state.round.phase !== "DRAFTING"
        || state.round.turnStatus !== "PICKING"
    ) {
        return state;
    }

    const selectedCard = state.round.availableCards.find((card) => card.id === cardId);
    if (!selectedCard) return state;

    return {
        ...state,
        round: {
            ...state.round,
            availableCards: state.round.availableCards.filter((card) => card.id !== cardId),
            currentQuestion: selectedCard,
            turnStatus: "REVEALED",
        },
    };
}

function advanceDraftTurn(
    state: GameState,
    outcome: "answered" | "skipped",
): GameState {
    if (
        state.round.phase !== "DRAFTING"
        || state.round.turnStatus !== "REVEALED"
    ) {
        return state;
    }

    const nextTurnIndex = state.round.currentTurnIndex + 1;
    const roundComplete = nextTurnIndex >= state.session.players.length;

    return {
        session: {
            ...state.session,
            answeredCount: state.session.answeredCount + (outcome === "answered" ? 1 : 0),
            skippedCount: state.session.skippedCount + (outcome === "skipped" ? 1 : 0),
        },
        round: {
            ...state.round,
            phase: roundComplete ? "COMPLETE" : "DRAFTING",
            currentQuestion: null,
            currentTurnIndex: nextTurnIndex,
            turnStatus: "PICKING",
        },
    };
}

export function confirmTurn(state: GameState): GameState {
    return advanceDraftTurn(state, "answered");
}

export function nextQuestion(
    state: GameState,
    allQuestions: Question[],
): GameState {
    if (
        state.session.config.mode !== "SHARED"
        || state.round.phase !== "ANSWERING"
    ) {
        return state;
    }

    const nextState = startRound(state, allQuestions);
    return {
        ...nextState,
        session: {
            ...nextState.session,
            answeredCount: nextState.session.answeredCount + 1,
        },
    };
}

export function skipQuestion(
    state: GameState,
    allQuestions: Question[],
): GameState {
    if (
        state.session.config.mode === "SHARED"
        && state.round.phase === "ANSWERING"
    ) {
        const nextState = startRound(state, allQuestions);
        return {
            ...nextState,
            session: {
                ...nextState.session,
                skippedCount: nextState.session.skippedCount + 1,
            },
        };
    }

    if (state.session.config.mode === "DRAFT") {
        return advanceDraftTurn(state, "skipped");
    }

    return state;
}
