import assert from "node:assert/strict";
import test from "node:test";
import type { Question } from "../lib/data";
import { confirmTurn, createGameState, nextQuestion, pickCard, skipQuestion, startRound } from "../lib/game-engine";

const QUESTIONS: Question[] = [
    { id: "fun-1", categoryId: "fun", text: "Pertanyaan pertama", depth: 1 },
    { id: "fun-2", categoryId: "fun", text: "Pertanyaan kedua", depth: 1 },
    { id: "fun-3", categoryId: "fun", text: "Pertanyaan ketiga", depth: 1 },
    {
        id: "wildcard-1",
        categoryId: "wildcard",
        text: "Pertanyaan kejutan",
        depth: 1,
        type: "wildcard",
        intensity: 1,
    },
];

function withRandom<T>(value: number, run: () => T): T {
    const originalRandom = Math.random;
    Math.random = () => value;

    try {
        return run();
    } finally {
        Math.random = originalRandom;
    }
}

function withoutWildcard<T>(run: () => T): T {
    return withRandom(0.99, run);
}

test("skipping in Main Bareng draws a different question", () => {
    withoutWildcard(() => {
        const initialState = createGameState(
            { mode: "SHARED", categoryId: "fun" },
            [{ id: "group", name: "Semua" }],
        );
        const activeState = startRound(initialState, QUESTIONS);

        const skippedState = skipQuestion(activeState, QUESTIONS);

        assert.notEqual(
            skippedState.round.currentQuestion?.id,
            activeState.round.currentQuestion?.id,
        );
        assert.equal(skippedState.round.phase, "ANSWERING");
        assert.equal(skippedState.session.roundCount, 2);
    });
});

test("skipping in Giliran Kartu passes play to the next person", () => {
    withoutWildcard(() => {
        const initialState = createGameState(
            { mode: "DRAFT", categoryId: "fun" },
            [
                { id: "p-1", name: "Pemain 1" },
                { id: "p-2", name: "Pemain 2" },
            ],
        );
        const activeState = startRound(initialState, QUESTIONS);
        const revealedState = pickCard(activeState, activeState.round.availableCards[0].id);

        const skippedState = skipQuestion(revealedState, QUESTIONS);

        assert.equal(skippedState.round.currentTurnIndex, 1);
        assert.equal(skippedState.round.turnStatus, "PICKING");
        assert.equal(skippedState.round.currentQuestion, null);
        assert.equal(skippedState.round.phase, "DRAFTING");
    });
});

test("skipping the final Giliran Kartu turn completes the round", () => {
    withoutWildcard(() => {
        const initialState = createGameState(
            { mode: "DRAFT", categoryId: "fun" },
            [
                { id: "p-1", name: "Pemain 1" },
                { id: "p-2", name: "Pemain 2" },
            ],
        );
        const firstTurn = startRound(initialState, QUESTIONS);
        const firstReveal = pickCard(firstTurn, firstTurn.round.availableCards[0].id);
        const secondTurn = skipQuestion(firstReveal, QUESTIONS);
        const secondReveal = pickCard(secondTurn, secondTurn.round.availableCards[0].id);

        const completedRound = skipQuestion(secondReveal, QUESTIONS);

        assert.equal(completedRound.round.currentTurnIndex, 2);
        assert.equal(completedRound.round.currentQuestion, null);
        assert.equal(completedRound.round.phase, "COMPLETE");
    });
});

test("reshuffling a depleted deck moves newly drawn remainder cards to used", () => {
    withoutWildcard(() => {
        const fiveQuestions: Question[] = [
            ...QUESTIONS,
            { id: "fun-4", categoryId: "fun", text: "Pertanyaan keempat", depth: 1 },
            { id: "fun-5", categoryId: "fun", text: "Pertanyaan kelima", depth: 1 },
        ];
        const initialState = createGameState(
            { mode: "DRAFT", categoryId: "fun" },
            [
                { id: "p-1", name: "Pemain 1" },
                { id: "p-2", name: "Pemain 2" },
                { id: "p-3", name: "Pemain 3" },
            ],
        );

        const round1 = startRound(initialState, fiveQuestions);
        const remainderBeforeWrap = [...round1.session.decks.fun.remaining];
        assert.equal(remainderBeforeWrap.length, 2);

        const round2 = startRound(round1, fiveQuestions);
        const round2Ids = round2.round.availableCards.map((card) => card.id);
        const deckAfterWrap = round2.session.decks.fun;

        for (const id of remainderBeforeWrap) {
            assert.ok(round2Ids.includes(id), "remainder card should be drawn in wrap round");
            assert.ok(!deckAfterWrap.remaining.includes(id), "just-drawn card must not stay in remaining");
            assert.ok(deckAfterWrap.used.includes(id), "just-drawn card must move to used");
        }
        assert.equal(deckAfterWrap.remaining.length + deckAfterWrap.used.length, 5);
    });
});

test("wildcard cooldown in Giliran Kartu counts drawn cards instead of rounds", () => {
    const eightQuestions: Question[] = [
        ...Array.from({ length: 8 }, (_, index) => ({
            id: `fun-${index + 1}`,
            categoryId: "fun",
            text: `Pertanyaan ${index + 1}`,
            depth: 1 as const,
        })),
        QUESTIONS[3],
    ];
    const fourPlayers = Array.from({ length: 4 }, (_, index) => ({
        id: `p-${index + 1}`,
        name: `Pemain ${index + 1}`,
    }));
    const initialState = createGameState(
        { mode: "DRAFT", categoryId: "fun" },
        fourPlayers,
    );

    const round1 = withRandom(0.01, () => startRound(initialState, eightQuestions));
    assert.ok(round1.round.availableCards.some((card) => card.type === "wildcard"));
    assert.equal(round1.session.cardsSinceWildcard, 0);

    const round2 = withRandom(0.01, () => startRound(round1, eightQuestions));
    assert.ok(!round2.round.availableCards.some((card) => card.type === "wildcard"));
    assert.equal(round2.session.cardsSinceWildcard, 4);

    const round3 = withRandom(0.01, () => startRound(round2, eightQuestions));
    assert.ok(!round3.round.availableCards.some((card) => card.type === "wildcard"));
    assert.equal(round3.session.cardsSinceWildcard, 8);

    const round4 = withRandom(0.01, () => startRound(round3, eightQuestions));
    assert.ok(round4.round.availableCards.some((card) => card.type === "wildcard"));
    assert.equal(round4.session.cardsSinceWildcard, 0);
});

test("tracks answered and skipped counts separately in both modes", () => {
    withoutWildcard(() => {
        const sharedInit = createGameState(
            { mode: "SHARED", categoryId: "fun" },
            [{ id: "group", name: "Semua" }],
        );
        const sharedStart = startRound(sharedInit, QUESTIONS);
        const sharedAnswered = nextQuestion(sharedStart, QUESTIONS);
        const sharedSkipped = skipQuestion(sharedAnswered, QUESTIONS);

        assert.equal(sharedSkipped.session.answeredCount, 1);
        assert.equal(sharedSkipped.session.skippedCount, 1);

        const draftInit = createGameState(
            { mode: "DRAFT", categoryId: "fun" },
            [
                { id: "p-1", name: "Pemain 1" },
                { id: "p-2", name: "Pemain 2" },
            ],
        );
        const draftStart = startRound(draftInit, QUESTIONS);
        const turn1Reveal = pickCard(draftStart, draftStart.round.availableCards[0].id);
        const turn1Done = confirmTurn(turn1Reveal);
        const turn2Reveal = pickCard(turn1Done, turn1Done.round.availableCards[0].id);
        const turn2Skipped = skipQuestion(turn2Reveal, QUESTIONS);

        assert.equal(turn2Skipped.session.answeredCount, 1);
        assert.equal(turn2Skipped.session.skippedCount, 1);
    });
});
