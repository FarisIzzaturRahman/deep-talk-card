import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { CATEGORIES } from "../lib/data";
import { createQuestionLoader, QUESTION_DATA_VERSION } from "../lib/question-loader";

const EXPECTED_QUESTION_COUNT = 1_100;
const EXPECTED_MAIN_CATEGORY_COUNT = 175;
const EXPECTED_WILDCARD_COUNT = 50;
const UNSAFE_CONTENT_PATTERNS = [
    /\bmantan\b|\bex\b/i,
    /\bseks(?:ual)?\b|\bpercabulan\b|\branjang\b|\bkeintiman\b|\bciuman\b|\bbercinta\b/i,
    /\btrauma\b|\bluka batin\b|\bkekerasan\b|\bpelecehan\b|\bperundungan\b/i,
    /\bselingkuh\b|\bperselingkuhan\b|\bperceraian\b/i,
    /\bbunuh diri\b|\bkematian\b|\bmeninggal\b|\bbatu nisan\b|\bsakit parah\b|\bdepresi\b/i,
    /\bagama\b|\bpolitik\b/i,
    /\bpatah hati\b|\bsusah punya anak\b|\bkondisi keuangan\b|\bketakutan finansial\b/i,
    /\bgaji\b|\butang\b|\bhutang\b|\bbangkrut\b/i,
];

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
        [`/questions/${QUESTION_DATA_VERSION}/deep-talk.json`]: [categoryQuestion],
        [`/questions/${QUESTION_DATA_VERSION}/wildcard.json`]: [wildcardQuestion],
    });
    const loadQuestions = createQuestionLoader(fetcher);

    const firstResult = await loadQuestions("deep-talk");
    const secondResult = await loadQuestions("deep-talk");

    assert.deepEqual(firstResult, [categoryQuestion, wildcardQuestion]);
    assert.deepEqual(secondResult, firstResult);
    assert.deepEqual(calls, [
        `/questions/${QUESTION_DATA_VERSION}/deep-talk.json`,
        `/questions/${QUESTION_DATA_VERSION}/wildcard.json`,
    ]);
});

test("rejects a bank containing questions from another category", async () => {
    const { fetcher } = createFetchStub({
        [`/questions/${QUESTION_DATA_VERSION}/deep-talk.json`]: [
            { ...categoryQuestion, categoryId: "fun" },
        ],
        [`/questions/${QUESTION_DATA_VERSION}/wildcard.json`]: [wildcardQuestion],
    });
    const loadQuestions = createQuestionLoader(fetcher);

    await assert.rejects(loadQuestions("deep-talk"), /deep-talk/);
});

test("ships 1,100 safe and evenly distributed questions", async () => {
    const seenIds = new Set<string>();
    const seenTexts = new Set<string>();

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
            text: string;
            depth: number;
            followUps?: string[];
        }>;

        const expectedCount = categoryId === "wildcard"
            ? EXPECTED_WILDCARD_COUNT
            : EXPECTED_MAIN_CATEGORY_COUNT;
        assert.equal(questions.length, expectedCount, `${categoryId} must be balanced`);

        for (const question of questions) {
            assert.equal(question.categoryId, categoryId);
            assert.ok(question.id.trim().length > 0, `${categoryId} has an empty id`);
            assert.ok(question.text.trim().length > 0, `${question.id} has empty text`);
            assert.ok(
                question.depth === 1 || question.depth === 2 || question.depth === 3,
                `${question.id} has invalid depth`,
            );
            assert.ok(
                question.followUps?.every((followUp) => followUp.trim().length > 0) ?? true,
                `${question.id} has an empty follow-up`,
            );
            assert.ok(!seenIds.has(question.id), `duplicate question id: ${question.id}`);

            const normalizedText = question.text.toLocaleLowerCase("id-ID")
                .replace(/[^a-z0-9]+/g, " ")
                .trim();
            assert.ok(
                !seenTexts.has(normalizedText),
                `duplicate question text: ${question.text}`,
            );
            const completeText = [question.text, ...(question.followUps ?? [])].join(" ");
            for (const unsafePattern of UNSAFE_CONTENT_PATTERNS) {
                assert.ok(
                    !unsafePattern.test(completeText),
                    `unsafe content in ${question.id}: ${question.text}`,
                );
            }

            seenIds.add(question.id);
            seenTexts.add(normalizedText);
        }
    }

    assert.equal(seenIds.size, EXPECTED_QUESTION_COUNT);
});

test("presents the romance category as PDKT & Chemistry", () => {
    const romanceCategory = CATEGORIES.find((category) => category.id === "asmara");

    assert.equal(romanceCategory?.label, "PDKT & Chemistry");
});
