import mutationStructure from "../mutation-template";
import { apiRequest } from "../../services/apiService";
import url from "../url";

export type RequestSupportPayload = {
  assistance_type: string[];
  message: string;
  apiToken?: string;
};

export type RequestSupportResponse = {
  header?: {
    code?: number;
    message?: string;
  };
  code?: number;
  message?: string;
  response?: {
    ticket_id?: string;
    ticket_number?: string;
  };
};

export type ResolveSupportTicketPayload = {
  ticket_number: string;
  subject: string;
  message: string;
  status?: string;
  apiToken?: string;
};

const getResponseMessage = (response: any, fallback: string) =>
  response?.header?.message ||
  response?.message ||
  response?.response?.header?.message ||
  response?.response?.message ||
  fallback;

export const useRequestSupportMutation = () =>
  mutationStructure<RequestSupportResponse, Error, RequestSupportPayload>({
    mutationFn: async (payload) => {
      const response = await apiRequest(
        url.requestSupport.method,
        url.requestSupport.endpoint,
        payload
      );

      if (!response) {
        throw new Error("Unable to request support.");
      }

      return response;
    },
  });

export const useResolveSupportTicketMutation = () =>
  mutationStructure<unknown, Error, ResolveSupportTicketPayload>({
    mutationFn: async (payload) => {
      const response = await apiRequest(
        url.resolveSupportTicket.method,
        url.resolveSupportTicket.endpoint,
        payload
      );

      if (!response) {
        throw new Error("Unable to update support ticket.");
      }

      return response;
    },
  });

export const getSupportResponseMessage = getResponseMessage;
