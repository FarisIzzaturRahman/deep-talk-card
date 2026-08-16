import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { CATEGORIES } from "../lib/data";
import { createQuestionLoader, QUESTION_DATA_VERSION } from "../lib/question-loader";

const EXPECTED_QUESTION_COUNT = 898;

const categoryQuestion = {
    id: "deep-1",
    categoryId: "deep-talk",
    text: "Pertanyaan kategori",
    depth: 2,
};
const wildcardQuestion = {
    id: "wild-1",
    categoryId: "wildcard",
    text: "Pertanyaan wildcard",
    depth: 2,
    type: "wildcard",
    intensity: 1,
};

function createFetchStub(payloads: Record<string, unknown>) {
    const calls: string[] = [];
    const fetcher = async (input: string | URL | Request) => {
        const url = String(input);
        calls.push(url);
        const payload = payloads[url];

        return {
            ok: payload !== undefined,
            json: async () => payload,
        } as Response;
    };

    return { calls, fetcher };
}

test("loads the selected category and wildcard bank once", async () => {
    const { calls, fetcher } = createFetchStub({
        "/questions/v1/deep-talk.json": [categoryQuestion],
        "/questions/v1/wildcard.json": [wildcardQuestion],
    });
    const loadQuestions = createQuestionLoader(fetcher);

    const firstResult = await loadQuestions("deep-talk");
    const secondResult = await loadQuestions("deep-talk");

    assert.deepEqual(firstResult, [categoryQuestion, wildcardQuestion]);
    assert.deepEqual(secondResult, firstResult);
    assert.deepEqual(calls, [
        "/questions/v1/deep-talk.json",
        "/questions/v1/wildcard.json",
    ]);
});

test("rejects a bank containing questions from another category", async () => {
    const { fetcher } = createFetchStub({
        "/questions/v1/deep-talk.json": [{ ...categoryQuestion, categoryId: "fun" }],
        "/questions/v1/wildcard.json": [wildcardQuestion],
    });
    const loadQuestions = createQuestionLoader(fetcher);

    await assert.rejects(loadQuestions("deep-talk"), /deep-talk/);
});

test("ships a valid, non-empty static bank for every category", async () => {
    const seenIds = new Set<string>();

    for (const categoryId of [...CATEGORIES.map((category) => category.id), "wildcard"]) {
        const filePath = path.join(
            process.cwd(),
            "public",
            "questions",
            QUESTION_DATA_VERSION,
            `${categoryId}.json`,
        );
        const questions = JSON.parse(await readFile(filePath, "utf8")) as Array<{
            id: string;
            categoryId: string;
        }>;

        assert.ok(questions.length > 0, `${categoryId} must not be empty`);
        for (const question of questions) {
            assert.equal(question.categoryId, categoryId);
            assert.ok(!seenIds.has(question.id), `duplicate question id: ${question.id}`);
            seenIds.add(question.id);
        }
    }

    assert.equal(seenIds.size, EXPECTED_QUESTION_COUNT);
});
