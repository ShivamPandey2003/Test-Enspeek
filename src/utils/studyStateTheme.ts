type StudyTheme = {
  textClass: string;
  accentClass: string;
  avatarClass: string;
};

const themeMap: Record<string, StudyTheme> = {
  progress: {
    textClass: "study-state-progress-text",
    accentClass: "study-state-progress-accent",
    avatarClass: "study-state-progress-avatar",
  },
  launched: {
    textClass: "study-state-launched-text",
    accentClass: "study-state-launched-accent",
    avatarClass: "study-state-launched-avatar",
  },
  activated: {
    textClass: "study-state-activated-text",
    accentClass: "study-state-activated-accent",
    avatarClass: "study-state-activated-avatar",
  },
  collecting: {
    textClass: "study-state-collecting-text",
    accentClass: "study-state-collecting-accent",
    avatarClass: "study-state-collecting-avatar",
  },
  report: {
    textClass: "study-state-report-text",
    accentClass: "study-state-report-accent",
    avatarClass: "study-state-report-avatar",
  },
  archived: {
    textClass: "study-state-archived-text",
    accentClass: "study-state-archived-accent",
    avatarClass: "study-state-archived-avatar",
  },
  default: {
    textClass: "study-state-default-text",
    accentClass: "study-state-default-accent",
    avatarClass: "study-state-default-avatar",
  },
};

export const getStudyStateTheme = (state?: string | null): StudyTheme => {
  const normalized = (state || "").toLowerCase();

  if (normalized.includes("collect")) return themeMap.collecting;
  if (normalized.includes("launch")) return themeMap.launched;
  if (normalized.includes("activ")) return themeMap.activated;
  if (normalized.includes("progress")) return themeMap.progress;
  if (normalized.includes("report")) return themeMap.report;
  if (normalized.includes("archiv")) return themeMap.archived;

  return themeMap.default;
};
