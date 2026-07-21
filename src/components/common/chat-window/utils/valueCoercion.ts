/**
 * Defensive value coercion helpers for the dynamic chat/survey payload.
 * Behaviour is identical to the inline helpers previously defined in chat.tsx.
 */

export const toArray = <T,>(value: unknown): T[] => {
  return Array.isArray(value) ? value : [];
};

export const toRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
};

export const toDisplayText = (value: unknown, fallback = "") => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return fallback;
};

export const toChartNumber = (value: unknown) => {
  if (typeof value === "number") return value;

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};
