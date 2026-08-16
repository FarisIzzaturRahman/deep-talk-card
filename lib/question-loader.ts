import type { Question } from "./data";

// Bump this whenever a question bank changes because responses are cached as immutable.
export const QUESTION_DATA_VERSION = "v1";
const QUESTION_DATA_BASE_PATH = `/questions/${QUESTION_DATA_VERSION}`;

type QuestionFetcher = (input: string) => Promise<Pick<Response, "ok" | "json">>;

function isQuestion(value: unknown, categoryId: string): value is Question {
    if (!value || typeof value !== "object") return false;

    const question = value as Record<string, unknown>;
    const hasValidFollowUps = question.followUps === undefined
        || (Array.isArray(question.followUps)
            && question.followUps.every((followUp) => typeof followUp === "string"));
    const hasValidType = question.type === undefined
        || question.type === "normal"
        || question.type === "wildcard";
    const hasValidIntensity = question.intensity === undefined
        || question.intensity === 1
        || question.intensity === 2
        || question.intensity === 3;

    return typeof question.id === "string"
        && question.categoryId === categoryId
        && typeof question.text === "string"
        && (question.depth === 1 || question.depth === 2 || question.depth === 3)
        && hasValidFollowUps
        && hasValidType
        && hasValidIntensity;
}

function parseQuestionBank(value: unknown, categoryId: string): Question[] {
    if (
        !Array.isArray(value)
        || value.length === 0
        || !value.every((question) => isQuestion(question, categoryId))
    ) {
        throw new Error(`Bank pertanyaan ${categoryId} tidak valid.`);
    }

    return value;
}

export function createQuestionLoader(fetcher: QuestionFetcher = fetch) {
    const bankCache = new Map<string, Promise<Question[]>>();

    const loadBank = (categoryId: string) => {
        const cachedBank = bankCache.get(categoryId);
        if (cachedBank) return cachedBank;

        const bankRequest = fetcher(
            `${QUESTION_DATA_BASE_PATH}/${encodeURIComponent(categoryId)}.json`,
        )
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`Bank pertanyaan ${categoryId} tidak ditemukan.`);
                }

                return parseQuestionBank(await response.json(), categoryId);
            })
            .catch((error: unknown) => {
                bankCache.delete(categoryId);
                throw error;
            });

        bankCache.set(categoryId, bankRequest);
        return bankRequest;
    };

    return async (categoryId: string): Promise<Question[]> => {
        const [categoryQuestions, wildcardQuestions] = await Promise.all([
            loadBank(categoryId),
            loadBank("wildcard"),
        ]);

        return [...categoryQuestions, ...wildcardQuestions];
    };
}

export const loadQuestions = createQuestionLoader();
