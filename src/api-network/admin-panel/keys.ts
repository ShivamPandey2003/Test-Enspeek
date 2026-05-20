export const adminPanelKeys = {
  all: ["admin-panel"] as const,

  users: () => [...adminPanelKeys.all, "users"] as const,
};

export default adminPanelKeys;
