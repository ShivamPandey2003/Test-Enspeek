type QuestionTypeTheme = {
  badgeClass: string;
};

const questionTypeThemes: Record<string, QuestionTypeTheme> = {
  "multiple-select": { badgeClass: "question-type-multi" },
  "single-select": { badgeClass: "question-type-single" },
  "open-end-medium": { badgeClass: "question-type-open" },
  "text-only": { badgeClass: "question-type-text" },
  stop: { badgeClass: "question-type-stop" },
  default: { badgeClass: "question-type-default" },
};

export const getQuestionTypeTheme = (type?: string | null): QuestionTypeTheme =>
  questionTypeThemes[type || ""] || questionTypeThemes.default;

export const formatQuestionTypeLabel = (type?: string | null) => {
  switch (type) {
    case "multiple-select":
      return "Multi Select";
    case "single-select":
      return "Single Select";
    case "open-end-medium":
      return "Open End";
    case "text-only":
      return "Text Only";
    case "stop":
      return "Stop";
    default:
      return type || "Question";
  }
};
