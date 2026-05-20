import queryStructure from "../query-template";
import adminPanelKeys from "./keys";

export type AdminPanelPlan = "free" | "paid";
export type AdminPanelStatus = "active" | "inactive";

export type AdminPanelUserApiResponse = {
  firstname?: string;
  lastname?: string;
  email: string;
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

const toNumber = (value: unknown) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
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

const dummyUserList: AdminPanelUserApiResponse[] = [
  {
    firstname: "Aakash",
    lastname: "Bohra",
    email: "aakash.bohra@knowledgeexcel.com",
    is_active: true,
    user_type: 0,
    is_approved: 0,
    createdstudies: 3,
    allowedstudies: 10,
    used_prompt: 20,
    allowed_prompt: 100,
    created_questions: 5,
    allowed_questions: 20,
  },
  {
    firstname: "Priya",
    lastname: "Sharma",
    email: "priya.sharma@enspeek.com",
    is_active: false,
    user_type: 1,
    is_approved: 1,
    createdstudies: 6,
    allowedstudies: 18,
    used_prompt: 42,
    allowed_prompt: 150,
    created_questions: 14,
    allowed_questions: 60,
  },
  {
    firstname: "Research",
    lastname: "Manager",
    email: "research.manager@enspeek.com",
    is_active: true,
    user_type: 0,
    is_approved: 1,
    createdstudies: 1,
    allowedstudies: 8,
    used_prompt: 12,
    allowed_prompt: 80,
    created_questions: 8,
    allowed_questions: 40,
  },
  {
    firstname: "Sample",
    lastname: "Buyer",
    email: "sample.buyer@enspeek.com",
    is_active: true,
    user_type: 1,
    is_approved: 0,
    createdstudies: 8,
    allowedstudies: 25,
    used_prompt: 67,
    allowed_prompt: 200,
    created_questions: 31,
    allowed_questions: 120,
  },
  {
    firstname: "Insight",
    lastname: "Analyst",
    email: "insight.analyst@enspeek.com",
    is_active: false,
    user_type: 0,
    is_approved: 0,
    createdstudies: 0,
    allowedstudies: 5,
    used_prompt: 4,
    allowed_prompt: 50,
    created_questions: 2,
    allowed_questions: 25,
  },
];

export const useAdminPanelUsers = () => {
  const fetchUsers = async () => dummyUserList.map(normalizeUser);

  const { data, isLoading, error } = queryStructure({
    queryKey: adminPanelKeys.users(),
    queryFn: fetchUsers,
    enable: true,
  });

  const users = (data ?? []) as AdminPanelUser[];

  return { users, isLoading, error };
};
