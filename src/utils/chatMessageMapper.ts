type ChatStudyResponse = Record<string, any>;

const CHAT_HISTORY_FALLBACK_MESSAGES = {
  ai: "Unable to load the AI response.",
  user: "Unable to load the your message.",
};

const toRecord = (value: unknown): ChatStudyResponse | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as ChatStudyResponse)
    : null;

const toText = (value: unknown) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return "";
};

export const createUserChatMessage = (text: unknown, createdAt?: string) => {
  const messageText = toText(text);

  if (!messageText) return null;

  return {
    sender: "user",
    text: messageText,
    createdAt,
  };
};

export const createAiChatMessageFromResponse = (
  response: unknown,
  options: { fallbackText?: string; source?: "history" | "live" } = {}
) => {
  const data = toRecord(response);
  if (!data) return null;

  const messageText = toText(data.message || options.fallbackText);

  if (data.showGraph) {
    return {
      sender: "ai",
      type: "surveydata",
      sdata: data.sdata,
      text: messageText,
      studyID: data.studyID,
      suggestion: data.suggestion,
      source: options.source,
    };
  }

  return {
    sender: "ai",
    text: messageText,
    questions: data.questions,
    instruction: data.instruction,
    response: data.response || {},
    liveLink: data.liveLink,
    suggestion: data.suggestion,
    source: options.source,
  };
};

export const normalizeChatHistoryRows = (rows: unknown[]) =>
  rows.flatMap((row) => {
    const historyRow = toRecord(row);
    if (!historyRow) return [];

    const messages = [];
    const createdAt = toText(historyRow.created_at);
    const userMessage =
      createUserChatMessage(historyRow.user, createdAt) ??
      createUserChatMessage(CHAT_HISTORY_FALLBACK_MESSAGES.user, createdAt);
    const aiMessage =
      createAiChatMessageFromResponse(historyRow.response, { source: "history" }) ??
      createAiChatMessageFromResponse({
        message: CHAT_HISTORY_FALLBACK_MESSAGES.ai,
      }, { source: "history" });

    if (userMessage) {
      messages.push(userMessage);
    }

    if (aiMessage) {
      messages.push(aiMessage);
    }

    return messages;
  });
