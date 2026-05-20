import { apiRequest } from "../../services/apiService";
import url from "../url";
import mutationStructure from "../mutation-template";

export type AdminPanelUpdateUserPayload = {
  email: string;
  apiToken?: string;
  is_active?: boolean;
  user_type?: 0 | 1;
  is_approved?: 0 | 1;
  allowedstudies?: number;
  allowed_prompt?: number;
  allowed_question?: number;
};

export const useUpdateAdminPanelUserMutation = () =>
  mutationStructure<unknown, Error, AdminPanelUpdateUserPayload>({
    mutationFn: async (payload) => {
      const response = await apiRequest(
        url.updateUser.method,
        url.updateUser.endpoint,
        payload
      );

      if (!response) {
        throw new Error("Unable to update user.");
      }

      return response;
    },
  });
