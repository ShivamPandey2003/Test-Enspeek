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

export type AssistanceReplyPayload = {
  apiToken?: string;
  email: string;
  subject: string;
  body: string;
  ticket_id: string;
};

export type SubscriptionRequestPayload = {
  apiToken?: string;
  request_types: string[];
  message: string;
};

type SupportMutationMessageResponse = {
  header?: {
    message?: string;
  };
  message?: string;
  response?: {
    header?: {
      message?: string;
    };
    message?: string;
  };
};

const getSupportMutationMessageResponse = (
  response: unknown
): SupportMutationMessageResponse =>
  response && typeof response === "object"
    ? (response as SupportMutationMessageResponse)
    : {};

const getResponseMessage = (response: unknown, fallback: string) => {
  const normalizedResponse = getSupportMutationMessageResponse(response);

  return (
    normalizedResponse.header?.message ||
    normalizedResponse.message ||
    normalizedResponse.response?.header?.message ||
    normalizedResponse.response?.message ||
    fallback
  );
};

export const useRequestSupportMutation = () =>
  mutationStructure<RequestSupportResponse, Error, RequestSupportPayload>({
    mutationFn: async (payload) => {
      const response = await apiRequest(
        url.requestSupport.method,
        url.requestSupport.endpoint,
        payload
      );

      if (!response) {
        throw new Error("Unable to request assistance.");
      }

      return response;
    },
  });

export const useAssistanceReplyMutation = () =>
  mutationStructure<unknown, Error, AssistanceReplyPayload>({
    mutationFn: async (payload) => {
      const response = await apiRequest(
        url.assistanceReply.method,
        url.assistanceReply.endpoint,
        payload
      );

      if (!response) {
        throw new Error("Unable to send support ticket reply.");
      }

      return response;
    },
  });

export const useSubscriptionRequestMutation = () =>
  mutationStructure<unknown, Error, SubscriptionRequestPayload>({
    mutationFn: async (payload) => {
      const response = await apiRequest(
        url.subscriptionRequest.method,
        url.subscriptionRequest.endpoint,
        payload
      );

      if (!response) {
        throw new Error("Unable to submit subscription request.");
      }

      return response;
    },
  });

export const getSupportResponseMessage = getResponseMessage;
