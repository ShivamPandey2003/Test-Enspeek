export type ValidSuggestion = {
  message: string;
  list: string[];
};

const toRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
};

const toArray = <T,>(value: unknown): T[] => {
  return Array.isArray(value) ? value : [];
};

const toDisplayText = (value: unknown) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return "";
};

export const getValidSuggestion = (suggestion: unknown): ValidSuggestion | null => {
  const suggestionValue = toRecord(suggestion);
  const message = toDisplayText(suggestionValue.message).trim();
  const list = toArray<unknown>(suggestionValue.list)
    .map((item) => toDisplayText(item).trim())
    .filter(Boolean);

  if (!message && list.length === 0) return null;

  return { message, list };
};

export const hasCompleteSuggestionContent = (suggestion: unknown) => {
  const validSuggestion = getValidSuggestion(suggestion);

  return Boolean(validSuggestion?.message && validSuggestion.list.length > 0);
};
