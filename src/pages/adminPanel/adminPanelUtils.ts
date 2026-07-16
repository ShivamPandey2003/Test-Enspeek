import { modalDefinitions } from "../../config/modalDefinitions";
import type { AdminPanelActionType } from "../../components/common/UserManagement/UserCard";
import type { AdminPanelUser } from "../../api-network/admin-panel/query";

/**
 * Pure, self-contained helpers for the admin panel. Extracted verbatim from
 * admin-panel.tsx so the page component can shrink toward orchestration only.
 * No React/state dependencies — safe to unit test in isolation.
 */

export type SubscriptionFormState = {
  allowedPrompt: string;
  allowedStudies: string;
  allowedQuestions: string;
};

export const toPositiveInteger = (value: string) => {
  if (!/^\d+$/.test(value.trim())) return null;

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) ? parsedValue : null;
};

export const toOptionalUpdatedLimit = (value: string) => {
  const normalizedValue = value.trim();

  if (!normalizedValue) return undefined;

  return toPositiveInteger(normalizedValue);
};

export const normalizeNumericInput = (value: string) => value.replace(/\D/g, "");

export const blockedNumericKeys = new Set(["e", "E", "-", "+", "."]);

export const isTicketResolvedStatus = (status: string) =>
  ["resolved", "closed", "completed"].includes(status.trim().toLowerCase());

export const getUserActionDefinitionKey = (
  action: AdminPanelActionType,
  user: AdminPanelUser
): keyof typeof modalDefinitions => {
  if (action === "status") {
    return user.status === "active" ? "deactivateUser" : "activateUser";
  }

  if (action === "plan") {
    return user.plan === "free" ? "changeToPaidUser" : "changeToFreeUser";
  }

  if (action === "verification") {
    return "verifyUser";
  }

  return "updateUserSubscription";
};

export const getTableEmptyMessage = (
  error: unknown,
  label: "users" | "admins" | "tickets"
) => {
  if (error instanceof globalThis.Error) {
    return error.message;
  }

  if (error) {
    return `Unable to load ${label}.`;
  }

  return `No ${label} found`;
};

export const formatStatusLabel = (status: string) => {
  const normalizedStatus = status.trim();

  if (!normalizedStatus) return "-";

  return normalizedStatus
    .split(/\s+/)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ");
};

export const getTicketStatusTone = (
  status: string
): "primary" | "success" | "danger" | "warning" | "neutral" => {
  const normalizedStatus = status.toLowerCase();

  if (["resolved", "closed", "completed"].includes(normalizedStatus)) {
    return "success";
  }

  if (["rejected", "failed", "cancelled"].includes(normalizedStatus)) {
    return "danger";
  }

  if (["pending", "in progress", "open"].includes(normalizedStatus)) {
    return "warning";
  }

  return "neutral";
};
