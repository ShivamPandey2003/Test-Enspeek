export type AdminPanelTabId = "users" | "admins" | "tickets";

type UserAccessConfig = {
  canAccessAdminPanel: boolean;
  canRequestSupport: boolean;
  adminPanelTabs: AdminPanelTabId[];
};

const DEFAULT_USER_ACCESS: UserAccessConfig = {
  canAccessAdminPanel: false,
  canRequestSupport: true,
  adminPanelTabs: [],
};

export const ADMIN_PANEL_TAB_LABELS: Record<AdminPanelTabId, string> = {
  users: "Users",
  admins: "Admins",
  tickets: "Tickets",
};

export const USER_ACCESS_BY_LOGIN_TYPE: Record<string, UserAccessConfig> = {
  admin: {
    canAccessAdminPanel: true,
    canRequestSupport: false,
    adminPanelTabs: ["users", "admins"],
  },
  client: {
    canAccessAdminPanel: false,
    canRequestSupport: true,
    adminPanelTabs: [],
  },
  support: {
    canAccessAdminPanel: true,
    canRequestSupport: false,
    adminPanelTabs: ["tickets"],
  },
  user: DEFAULT_USER_ACCESS,
};

export const normalizeLoginType = (loginType?: string, userType?: string) =>
  (loginType || userType || "").trim().toLowerCase();

export const getUserAccessConfig = (loginType?: string, userType?: string) => {
  const normalizedLoginType = normalizeLoginType(loginType, userType);

  return USER_ACCESS_BY_LOGIN_TYPE[normalizedLoginType] ?? DEFAULT_USER_ACCESS;
};
