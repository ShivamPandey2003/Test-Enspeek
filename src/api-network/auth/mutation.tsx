import mutationStructure from "../mutation-template";
import { apiRequest } from "../../services/apiService";
import url from "../url";
import type { LoginOtpResponse, ResendOtpResponse, SignupResponse, VerifyCaptchaResponse, VerifyOtpResponse } from "../../components/common/Auth/otp-login/types";
import authKeys from "./keys";

const unwrapResponse = <T extends { header?: unknown; code?: number }>(payload: any) => {
  if (payload?.response && typeof payload.response === "object" && ("header" in payload.response || "code" in payload.response)) {
    return payload.response as T;
  }

  return payload as T;
};

export const useVerifyCaptchaMutation = () =>
  mutationStructure({
    mutationKey: authKeys.verifyCaptcha(),
    mutationFn: async (captchaToken: string) => {
      const response = await apiRequest(
        url.verifyCaptcha.method,
        url.verifyCaptcha.endpoint,
        {
          captcha_token: captchaToken,
        }
      );

      return unwrapResponse<VerifyCaptchaResponse>(response);
    },
  });

export const useSignupOtpMutation = () =>
  mutationStructure({
    mutationKey: authKeys.signup(),
    mutationFn: async (payload: {
      email: string;
      firstname: string;
      lastname: string;
    }) => {
      const response = await apiRequest(
        url.userSignup.method,
        url.userSignup.endpoint,
        payload
      );

      return unwrapResponse<SignupResponse>(response);
    },
  });

export const useSendOtpLoginMutation = () =>
  mutationStructure({
    mutationKey: authKeys.loginOtp(),
    mutationFn: async (payload: { email: string }) => {
      const response = await apiRequest(
        url.userLoginOtp.method,
        url.userLoginOtp.endpoint,
        payload
      );

      return unwrapResponse<LoginOtpResponse>(response);
    },
  });

export const useResendOtpMutation = (email?: string) =>
  mutationStructure({
    mutationKey: authKeys.resendOtp(email),
    mutationFn: async (payload: { email: string }) => {
      const response = await apiRequest(
        url.userResendOtp.method,
        url.userResendOtp.endpoint,
        payload
      );

      return unwrapResponse<ResendOtpResponse>(response);
    },
  });

export const useVerifyOtpMutation = (email?: string) =>
  mutationStructure({
    mutationKey: authKeys.verifyOtp(email),
    mutationFn: async (payload: { email: string; otp: string }) => {
      const response = await apiRequest(
        url.userVerifyOtp.method,
        url.userVerifyOtp.endpoint,
        payload
      );

      return response as VerifyOtpResponse;
    },
  });
