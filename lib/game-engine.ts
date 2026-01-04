import { Question } from "./data";
import { GameConfig, GameSession, Player, RoundPhase, RoundState } from "./game-types";
import { shuffleArray } from "./utils";

export class GameEngine {
    private session: GameSession;
    private round: RoundState;

    // --- Initialization ---

    /**
     * Start a new session from scratch (No-Login flow)
     */
    constructor(config: GameConfig, players: Player[]) {
        this.session = {
            id: `session-${Date.now()}`,
            config,
            players,
            turnOrder: [],
            roundCount: 0,
            decks: {} // Initialized empty, lazy-loaded on startRound
        };

        this.round = {
            phase: RoundPhase.IDLE,
            deck: [],
            availableCards: [],
            currentTurnIndex: 0,
            turnStatus: 'PICKING',
            picks: {},
            playerAnswers: {}
        };
    }

    // --- Session Accessors ---
    public getSession() { return this.session; }
    public getRound() { return this.round; }

    // --- Deck Logic ---

    /**
     * Ensures a deck exists for the given category.
     * If missing, initializes 'remaining' with all card IDs and 'used' as empty.
     */
    private ensureDeckInitialized(categoryId: string, allCards: Question[]) {
        if (!this.session.decks[categoryId]) {
            const categoryCardIds = allCards
                .filter(q => q.categoryId === categoryId)
                .map(q => q.id);

            this.session.decks[categoryId] = {
                remaining: shuffleArray(categoryCardIds),
                used: []
            };
        }
    }

    /**
     * Draws N unique cards from the specified category deck.
     * Auto-reshuffles if remaining cards are insufficient.
     * Throws error if total unique cards < N (impossible to fulfill unique constraint).
     */
    private drawUniqueCards(categoryId: string, count: number, allCards: Question[]): Question[] {
        this.ensureDeckInitialized(categoryId, allCards);
        const deck = this.session.decks[categoryId];

        // Check if total cards in category is enough for one round
        const totalCards = deck.remaining.length + deck.used.length;
        if (totalCards < count) {
            throw new Error(`Insufficient cards in category. Needed ${count}, found ${totalCards}.`);
        }

        // Reshuffle if needed
        if (deck.remaining.length < count) {
            // Combine remaining + used, then reshuffle
            deck.remaining = shuffleArray([...deck.remaining, ...deck.used]);
            deck.used = [];
        }

        // Draw cards
        const drawnIds = deck.remaining.splice(0, count);

        // Add to used
        deck.used.push(...drawnIds);

        // Map IDs back to Question objects
        return drawnIds.map(id => allCards.find(q => q.id === id)!);
    }

    // --- Round Management ---

    public startRound(allCards: Question[]) {
        this.session.roundCount++;

        // 1. Randomize Turn Order for Draft Mode
        if (this.session.config.mode === 'DRAFT') {
            const playerIds = this.session.players.map(p => p.id);
            this.session.turnOrder = shuffleArray(playerIds);
        } else {
            this.session.turnOrder = this.session.players.map(p => p.id);
        }

        // 2. Determine Draw Count
        const cardsNeeded = this.session.config.mode === 'DRAFT'
            ? this.session.players.length
            : 1;

        // 3. Determine if a Wildcard should be included
        // 25% chance in Draft, 15% in Shared.
        const wildcardProb = this.session.config.mode === 'DRAFT' ? 0.25 : 0.15;
        const includeWildcard = Math.random() < wildcardProb;

        // 4. Draw Cards
        let deck: Question[] = [];
        try {
            if (includeWildcard) {
                const normalCount = Math.max(0, cardsNeeded - 1);
                const categoryCards = normalCount > 0
                    ? this.drawUniqueCards(this.session.config.categoryId, normalCount, allCards)
                    : [];

                const wildcard = this.drawUniqueCards("wildcard", 1, allCards)[0];
                deck = shuffleArray([...categoryCards, wildcard]);
            } else {
                deck = this.drawUniqueCards(this.session.config.categoryId, cardsNeeded, allCards);
            }
        } catch (error) {
            console.error(error);
            // Fallback: Just draw randoms from category
            deck = shuffleArray(allCards.filter(q => q.categoryId === this.session.config.categoryId))
                .slice(0, cardsNeeded);
        }

        // 5. Init Round State
        this.round = {
            phase: this.session.config.mode === 'DRAFT' ? RoundPhase.DRAFTING : RoundPhase.ANSWERING,
            deck,
            availableCards: this.session.config.mode === 'DRAFT' ? [...deck] : [],
            currentTurnIndex: 0,
            turnStatus: 'PICKING',
            picks: {},
            playerAnswers: {}
        };

        // For Shared Mode, auto-assign
        if (this.session.config.mode === 'SHARED') {
            const cardId = deck[0].id;
            this.session.players.forEach(p => {
                this.round.picks[p.id] = cardId;
            });
        }
    }

    // --- Draft Logic ---

    /**
     * Player picks a card from available pool. 
     * Transitions turnStatus from PICKING -> REVEALED.
     */
    public draftCard(userId: string, cardId: string): boolean {
        // Validation
        if (this.round.phase !== RoundPhase.DRAFTING) return false;

        // Is it this user's turn?
        const currentTurnUserId = this.session.turnOrder[this.round.currentTurnIndex];
        if (userId !== currentTurnUserId) return false;

        // Is turn state correct?
        if (this.round.turnStatus !== 'PICKING') return false;

        // Is card available?
        const cardIndex = this.round.availableCards.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return false;

        // Execute Pick
        this.round.picks[userId] = cardId;
        this.round.availableCards.splice(cardIndex, 1);

        // Update Status: Card is revealed, waiting for user to click "Done"
        this.round.turnStatus = 'REVEALED';

        return true;
    }

    /**
     * Confirm turn completion ("Selesai" button).
     * Advances to next player or Post-Draft phase.
     */
    public confirmTurn(userId: string): boolean {
        // Validation
        const currentTurnUserId = this.session.turnOrder[this.round.currentTurnIndex];
        if (userId !== currentTurnUserId) return false;
        if (this.round.turnStatus !== 'REVEALED') return false;

        // Advance Turn
        this.round.currentTurnIndex++;

        // Check if Draft is Complete
        if (this.round.currentTurnIndex >= this.session.players.length) {
            this.round.phase = RoundPhase.ANSWERING;
            // Optionally could go to SCORING if we want a summary first
        } else {
            // Next player starts picking
            this.round.turnStatus = 'PICKING';
        }

        return true;
    }

    // --- Shared/Answering Logic ---

    // Optional: Shared mode "Next Round" logic is just calling startRound() again externally.
}
