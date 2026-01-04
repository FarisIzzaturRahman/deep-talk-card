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
            turnOrder: [], // Will be set on startRound
            roundCount: 0
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

    // --- Round Management ---

    public startRound(pool: Question[]) {
        this.session.roundCount++;

        // 1. Randomize Turn Order for Draft Mode
        if (this.session.config.mode === 'DRAFT') {
            // Fisher-Yates shuffle for players
            const playerIds = this.session.players.map(p => p.id);
            this.session.turnOrder = shuffleArray(playerIds);
        } else {
            // Shared mode doesn't really have turn order, but we can set it anyway
            this.session.turnOrder = this.session.players.map(p => p.id);
        }

        // 2. Deal Cards
        const cardsNeeded = this.session.config.mode === 'DRAFT'
            ? this.session.players.length
            : 1;

        // Ensure pool is shuffled before picking
        const shuffledPool = shuffleArray([...pool]);
        const deck = shuffledPool.slice(0, cardsNeeded);

        // 3. Init Round State
        this.round = {
            phase: this.session.config.mode === 'DRAFT' ? RoundPhase.DRAFTING : RoundPhase.ANSWERING,
            deck,
            availableCards: this.session.config.mode === 'DRAFT' ? [...deck] : [],
            currentTurnIndex: 0,
            turnStatus: 'PICKING',
            picks: {},
            playerAnswers: {} // Reset answers
        };

        // For Shared Mode, auto-assign the single card to everyone
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
