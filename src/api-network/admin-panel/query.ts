import queryStructure from "../query-template";
import { apiRequest } from "../../services/apiService";
import url from "../url";
import adminPanelKeys from "./keys";
import { toNumber } from "../../utils";

export type AdminPanelPlan = "free" | "paid";
export type AdminPanelStatus = "active" | "inactive";

export type AdminPanelUserApiResponse = {
  firstname?: string;
  lastname?: string;
  email: string;
  created_at?: string;
  last_login?: string;
  is_active?: boolean;
  user_type?: 0 | 1 | number;
  is_approved?: 0 | 1 | number;
  createdstudies?: number;
  allowedstudies?: number;
  used_prompt?: number;
  allowed_prompt?: number;
  created_questions?: number;
  allowed_questions?: number;
};

export type AdminPanelUser = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin: string;
  status: AdminPanelStatus;
  plan: AdminPanelPlan;
  isApproved: boolean;
  createdStudies: number;
  allowedStudies: number;
  usedPrompt: number;
  allowedPrompt: number;
  createdQuestions: number;
  allowedQuestions: number;
};

const toDisplayName = (firstName: string, lastName: string, email: string) => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || email;
};

const normalizeUser = (user: AdminPanelUserApiResponse): AdminPanelUser => {
  const firstName = user.firstname?.trim() ?? "";
  const lastName = user.lastname?.trim() ?? "";
  const email = user.email;

  return {
    id: email,
    firstName,
    lastName,
    name: toDisplayName(firstName, lastName, email),
    email,
    createdAt: user.created_at ?? "",
    lastLogin: user.last_login ?? "",
    status: user.is_active ? "active" : "inactive",
    plan: Number(user.user_type) === 1 ? "paid" : "free",
    isApproved: Number(user.is_approved) === 1,
    createdStudies: toNumber(user.createdstudies),
    allowedStudies: toNumber(user.allowedstudies),
    usedPrompt: toNumber(user.used_prompt),
    allowedPrompt: toNumber(user.allowed_prompt),
    createdQuestions: toNumber(user.created_questions),
    allowedQuestions: toNumber(user.allowed_questions),
  };
};

type AdminPanelListResponse = {
  response?: AdminPanelUserApiResponse[] | { response?: AdminPanelUserApiResponse[] };
};

const getUsersFromResponse = (response?: AdminPanelListResponse) => {
  if (Array.isArray(response?.response)) {
    return response.response;
  }

  if (
    response?.response &&
    !Array.isArray(response.response) &&
    Array.isArray(response.response.response)
  ) {
    return response.response.response;
  }

  return [];
};

const fetchAdminPanelList = async (
  method: "get" | "post" | "put" | "delete",
  endpoint: string
) => {
  const response = await apiRequest(method, endpoint, {});

  return getUsersFromResponse(response).map(normalizeUser);
};

export const useAdminPanelUsers = (enable = true) => {
  const fetchUsers = async () => {
    return fetchAdminPanelList(
      url.getUserList.method,
      url.getUserList.endpoint
    );
  };

  const { data, isLoading, error } = queryStructure({
    queryKey: adminPanelKeys.users(),
    queryFn: fetchUsers,
    enable,
  });

  const users = (data ?? []) as AdminPanelUser[];

  return { users, isLoading, error };
};

export const useAdminPanelAdmins = (enable = true) => {
  const fetchAdmins = async () => {
    return fetchAdminPanelList(
      url.getAdminList.method,
      url.getAdminList.endpoint
    );
  };

  const { data, isLoading, error } = queryStructure({
    queryKey: adminPanelKeys.admins(),
    queryFn: fetchAdmins,
    enable,
  });

  const admins = (data ?? []) as AdminPanelUser[];

  return { admins, isLoading, error };
};
