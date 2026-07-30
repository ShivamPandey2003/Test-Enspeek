type ChatStudyResponse = Record<string, any>;

const CHAT_HISTORY_FALLBACK_MESSAGES = {
  ai: "Unable to load the AI response.",
  user: "Unable to load your message.",
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

const toTextArray = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item) => toText(item).trim()).filter(Boolean)
    : [];

const createSuggestion = (message: unknown, list: unknown) => {
  const suggestionMessage = toText(message).trim();
  const suggestionList = toTextArray(list);

  if (!suggestionMessage && suggestionList.length === 0) return undefined;

  return {
    message: suggestionMessage,
    list: suggestionList,
  };
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
  const suggestion = data.suggestion ?? createSuggestion("", data.suggestions);

  if (data.showGraph) {
    return {
      sender: "ai",
      type: "surveydata",
      sdata: data.sdata,
      text: messageText,
      studyID: data.studyID,
      suggestion,
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
    suggestion,
    source: options.source,
    message_id: data.message_id
  };
};

const createAiChatMessageFromHistoryRow = (
  historyRow: ChatStudyResponse,
  createdAt?: string
) => {
  const responseMessage = createAiChatMessageFromResponse(historyRow.response, {
    fallbackText: historyRow.assistant,
    source: "history",
  });

  if (responseMessage) {
    return {
      ...responseMessage,
      createdAt,
      suggestion:
        responseMessage.suggestion ??
        createSuggestion("", historyRow.suggestions),
    };
  }

  const assistantText = toText(historyRow.assistant);
  if (!assistantText) return null;

  return {
    sender: "ai",
    text: assistantText,
    suggestion: createSuggestion("", historyRow.suggestions),
    source: "history",
    createdAt,
  };
};

export const normalizeChatHistoryRows = (rows: unknown) => {
  if (!Array.isArray(rows)) return [];

  return [...rows].reverse().flatMap((row) => {
    const historyRow = toRecord(row);
    if (!historyRow) return [];

    const messages = [];
    const createdAt = toText(historyRow.created_at);
    const userMessage =
      createUserChatMessage(historyRow.user, createdAt) ??
      createUserChatMessage(CHAT_HISTORY_FALLBACK_MESSAGES.user, createdAt);
    const aiMessage =
      createAiChatMessageFromHistoryRow(historyRow, createdAt) ??
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
};
