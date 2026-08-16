import assert from "node:assert/strict";
import test from "node:test";
import type { Question } from "../lib/data";
import { createGameState, pickCard, skipQuestion, startRound } from "../lib/game-engine";

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

function withoutWildcard<T>(run: () => T): T {
    const originalRandom = Math.random;
    Math.random = () => 0.99;

    try {
        return run();
    } finally {
        Math.random = originalRandom;
    }
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
