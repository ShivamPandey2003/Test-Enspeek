export const supportKeys = {
  all: ["support"] as const,

  requestInfo: () => [...supportKeys.all, "request-info"] as const,
  assistanceTypes: () => [...supportKeys.all, "assistance-types"] as const,
  tickets: () => [...supportKeys.all, "tickets"] as const,
};

export default supportKeys;
