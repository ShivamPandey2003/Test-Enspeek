import queryStructure from "../query-template";
import { apiRequest } from "../../services/apiService";
import url from "../url";
import supportKeys from "./keys";
import { toTitleCase } from "../../utils";

export type SupportAssistanceTypeApiResponse = {
  show?: string;
  code?: string;
};

export type SupportAssistanceType = {
  label: string;
  code: string;
};

export type SupportTicketApiResponse = {
  ticket_id?: string | number;
  ticket_number?: string | number;
  ticketNumber?: string | number;
  ticket_no?: string | number;
  id?: string | number;
  firstname?: string;
  firstName?: string;
  lastname?: string;
  lastName?: string;
  full_name?: string;
  fullName?: string;
  name?: string;
  user_name?: string;
  email?: string;
  status?: string;
  assistance_type?: string[] | string;
  assistance_types?: string[] | string;
  assistance?: string[] | string;
  message?: string;
  request?: string;
  description?: string;
  subject?: string;
  admin_subject?: string;
  admin_message?: string;
  response_message?: string;
  is_resolved?: 0 | 1 | number | boolean;
  created_at?: string;
  updated_at?: string;
};

export type SupportRequestInfoApiResponse = {
  ticket_id?: string;
  ticket_number?: string;
  assistance_types?: SupportAssistanceTypeApiResponse[] | string;
  assistance_type?: SupportAssistanceTypeApiResponse[] | string;
  message?: string;
  is_resolved?: 0 | 1 | number | boolean;
  created_at?: string;
  updated_at?: string;
};

export type SupportRequestInfo = {
  ticketId: string;
  assistanceTypes: SupportAssistanceType[];
  message: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SupportTicket = {
  id: string;
  ticketNumber: string;
  name: string;
  email: string;
  status: string;
  assistanceTypes: string[];
  assistanceTypeText: string;
  message: string;
  subject: string;
  adminMessage: string;
  createdAt: string;
  updatedAt: string;
};

type ListResponse<T> = {
  response?: T[] | { response?: T[] };
};

const getArrayFromResponse = <T,>(response?: ListResponse<T>) => {
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

const toStringArray = (value: string[] | string | undefined) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeAssistanceType = (
  item: SupportAssistanceTypeApiResponse
): SupportAssistanceType => ({
  label: item.show?.trim() || item.code?.trim() || "Support option",
  code: item.code?.trim() || item.show?.trim() || "",
});

const normalizeAssistanceTypeList = (
  value: SupportAssistanceTypeApiResponse[] | string | undefined
) => {
  if (Array.isArray(value)) {
    return value.map(normalizeAssistanceType).filter((item) => item.code);
  }

  return toStringArray(value).map((item) => ({
    label: item,
    code: item,
  }));
};

const getTicketUserName = (ticket: SupportTicketApiResponse) => {
  const directName =
    ticket.full_name ?? ticket.fullName ?? ticket.name ?? ticket.user_name ?? "";
  const firstName = ticket.firstname ?? ticket.firstName ?? "";
  const lastName = ticket.lastname ?? ticket.lastName ?? "";
  const fullName = directName || [firstName, lastName].filter(Boolean).join(" ");

  return fullName.trim() ? toTitleCase(fullName) : "";
};

const normalizeRequestInfo = (
  requestInfo?: SupportRequestInfoApiResponse | null
): SupportRequestInfo | null => {
  if (!requestInfo) return null;

  const ticketId = requestInfo.ticket_id ?? requestInfo.ticket_number ?? "";

  if (!ticketId && !requestInfo.message) {
    return null;
  }

  return {
    ticketId,
    assistanceTypes: normalizeAssistanceTypeList(
      requestInfo.assistance_types ?? requestInfo.assistance_type
    ),
    message: requestInfo.message ?? "",
    isResolved: Number(requestInfo.is_resolved) === 1,
    createdAt: requestInfo.created_at ?? "",
    updatedAt: requestInfo.updated_at ?? "",
  };
};

const normalizeTicket = (ticket: SupportTicketApiResponse): SupportTicket => {
  const ticketNumber =
    ticket.ticket_id ??
    ticket.ticket_number ??
    ticket.ticketNumber ??
    ticket.ticket_no ??
    ticket.id ??
    "";
  const id = String(ticket.id ?? ticketNumber);
  const assistanceTypes = toStringArray(
    ticket.assistance_type ?? ticket.assistance_types ?? ticket.assistance
  );
  const isResolved = Number(ticket.is_resolved) === 1;

  return {
    id,
    ticketNumber: String(ticketNumber || id || ""),
    name: getTicketUserName(ticket),
    email: ticket.email ?? "",
    status: ticket.status ?? (isResolved ? "resolved" : "open"),
    assistanceTypes,
    assistanceTypeText: assistanceTypes.join(", "),
    message: ticket.message ?? ticket.request ?? ticket.description ?? "",
    subject: ticket.subject ?? ticket.admin_subject ?? "",
    adminMessage: ticket.admin_message ?? ticket.response_message ?? "",
    createdAt: ticket.created_at ?? "",
    updatedAt: ticket.updated_at ?? "",
  };
};

export const useSupportAssistanceTypes = (enable = true) => {
  const fetchAssistanceTypes = async () => {
    const response = await apiRequest(
      url.supportList.method,
      url.supportList.endpoint,
      {}
    );

    return getArrayFromResponse<SupportAssistanceTypeApiResponse>(response)
      .map(normalizeAssistanceType)
      .filter((item) => item.code);
  };

  const { data, isLoading, error } = queryStructure({
    queryKey: supportKeys.assistanceTypes(),
    queryFn: fetchAssistanceTypes,
    enable,
  });

  return {
    assistanceTypes: (data ?? []) as SupportAssistanceType[],
    isLoading,
    error,
  };
};

export const useSupportRequestInfo = (enable = true) => {
  const fetchRequestInfo = async () => {
    const response = await apiRequest(
      url.supportRequestInfo.method,
      url.supportRequestInfo.endpoint,
      {}
    );

    return normalizeRequestInfo(response?.response);
  };

  const { data, isLoading, isFetching, error } = queryStructure({
    queryKey: supportKeys.requestInfo(),
    queryFn: fetchRequestInfo,
    enable,
  });

  return {
    requestInfo: (data ?? null) as SupportRequestInfo | null,
    isLoading,
    isFetching,
    error,
  };
};

export const useSupportTickets = (enable = true) => {
  const fetchTickets = async () => {
    const response = await apiRequest(
      url.getSupportTickets.method,
      url.getSupportTickets.endpoint,
      {}
    );

    return getArrayFromResponse<SupportTicketApiResponse>(response).map(
      normalizeTicket
    );
  };

  const { data, isLoading, error } = queryStructure({
    queryKey: supportKeys.tickets(),
    queryFn: fetchTickets,
    enable,
  });

  return {
    tickets: (data ?? []) as SupportTicket[],
    isLoading,
    error,
  };
};
