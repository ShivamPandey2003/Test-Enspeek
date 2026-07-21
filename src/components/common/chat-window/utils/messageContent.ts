import type { ChatMessage } from "../types";

/**
 * Keys of a message's generic `response` object (empty when `response` is an
 * array or not a plain object). Mirrors the original inline computation.
 */
export const getResponseKeys = (response: unknown): string[] =>
  response && !Array.isArray(response) && typeof response === "object"
    ? Object.keys(response)
    : [];

/**
 * Whether the plain-text body of a message should be rendered.
 *
 * Preserves the two original conditions:
 *   1. (!questions || questions.add) && !sdata
 *   2. Array.isArray(questions) && questions.length === 0 && !sdata
 */
export const shouldRenderMessageText = (msg: ChatMessage): boolean => {
  if (msg.sdata) return false;

  const { questions } = msg;

  if (!questions || questions.add) return true;
  if (Array.isArray(questions) && questions.length === 0) return true;

  return false;
};

/** Whether to render the questionnaire preview (`Question_Format`). */
export const shouldRenderQuestionFormat = (msg: ChatMessage): boolean =>
  Boolean(msg.questions && !msg.questions.add);

/** Whether the `response` is a study list rendered as bullet points. */
export const isStudyListResponse = (
  response: unknown
): response is Array<{ studyID: string; name: string }> =>
  Array.isArray(response);
