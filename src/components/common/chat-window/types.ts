/**
 * Shared types for the chat-window feature.
 *
 * The chat message shape is intentionally loose (the API response is dynamic
 * and mapped in `utils/chatMessageMapper.ts`), so `ChatMessage` documents the
 * fields the UI actually reads without over-constraining the payload.
 */

export type ChatMessageSender = "user" | "ai";

export type ChatSuggestion = {
  message?: string;
  list?: string[];
};

export type ChatMessage = {
  sender: ChatMessageSender;
  text?: string;
  type?: string;
  // Survey payload (present when `type === "surveydata"`).
  sdata?: SurveyData;
  studyID?: string;
  // Questionnaire preview payload — dynamic shape (array | { add, questions }).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions?: any;
  instruction?: string;
  // Generic key/value response, or a list of studies — dynamic API shape.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response?: any;
  crosstab?: unknown;
  liveLink?: string;
  suggestion?: unknown;
  source?: "history" | "live" | string;
  createdAt?: string;
};

/** Active view toggle per message index. */
export type SurveyTab = "chart" | "table";

export type SurveyChartPoint = {
  name: string;
  y: number;
};

export type SurveyChartSeries = {
  name: string;
  color: string;
  data: SurveyChartPoint[];
};

export type SurveyTableRow = {
  rowLabel: string;
  values: string[];
};

/**
 * Fully-parsed survey message, ready to render as a chart or table.
 * Produced by `buildSurveyView`.
 */
export type SurveyView = {
  qid: string;
  // Parsed survey question payload — dynamic API shape.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questionData: Record<string, any>;
  isCrosstab: boolean;
  isExternalImage: boolean;
  chartData: SurveyChartSeries[];
  categories: string[];
  headers: string[];
  rows: SurveyTableRow[];
  baseRow: (string | number)[];
  baseText: string;
};
