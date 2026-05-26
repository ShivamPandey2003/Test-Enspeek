import axios from "axios";
import { toast } from "sonner";
import { store } from "../store/store";

const platform_url = import.meta.env.VITE_REACT_APP_API_URL || "";

export type ApiMethod = "get" | "post" | "put" | "delete";
const AUTH_EXCLUDED_PATHS = new Set([
  "user/login",
  "user/login2",
  "user/signup",
  "user/resend-otp",
  "user/verify-otp",
  "verify-captcha",
  "uam/login",
]);

const normalizePath = (url: string) => url.replace(/^\/+/, "");

const shouldSkipAuth = (url?: string) =>
  Boolean(url) && AUTH_EXCLUDED_PATHS.has(normalizePath(url ?? ""));

const apiClient = axios.create({
  baseURL: platform_url,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !shouldSkipAuth(config.url)) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    const token = response.headers['access-token'];
    if (token) {
      localStorage.setItem('token', token)
    }
    return response;
  },
  (error) => Promise.reject(error.response || error.message)
);

const handleSessionExpiration = (): void => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "/login";
};

const getApiErrorMessage = (error: any, fallback: string) =>
  error?.data?.detail ||
  error?.response?.data?.detail ||
  error?.data?.message ||
  error?.data?.header?.message ||
  error?.response?.data?.message ||
  error?.response?.data?.header?.message ||
  error?.message ||
  fallback;

const createToastedError = (message: string) =>
  Object.assign(new Error(message), { hasToast: true });

const injectApiToken = (url: string, data: any) => {
  if (shouldSkipAuth(url)) {
    return data;
  }

  const apiToken = store.getState().user.apiToken;

  if (!apiToken) {
    return data;
  }

  if (data instanceof FormData) {
    if (!data.has("apiToken")) {
      data.append("apiToken", apiToken);
    }
    return data;
  }

  if (data && typeof data === "object" && !Array.isArray(data)) {
    if ("apiToken" in data) {
      return data;
    }

    return {
      ...data,
      apiToken,
    };
  }

  return { apiToken };
};

export const apiRequest = async (
  method: ApiMethod,
  url: string,
  data: any = null,
  responseType: "json" | "blob" = "json"
) => {
  try {
    const requestData = injectApiToken(url, data);
    const response = await apiClient.request({ method, url, data: requestData, responseType });
    if (responseType === "json") {
      if (response?.data?.code === 200) {
        return response.data;
      } else if (response?.data?.detail) {
        const message = response.data.detail;
        toast.error(message);
        throw createToastedError(message);
      } else if (response?.data?.code === 401) {
        toast.error("Session expired, logging out.");
        handleSessionExpiration();
        return response.data;
      } else if (response?.data?.code === 400) {
        const message =
          response?.data?.message ||
          response?.data?.header?.message ||
          "Unable to complete this request.";
        toast.error(message);
        throw createToastedError(message);
      } else if (response?.data?.code === 429) {
        const message =
          response?.data?.message ||
          response?.data?.header?.message ||
          "Too many requests. Please try again later.";
        toast.error(message);
        throw createToastedError(message);
      } else if (response?.data?.code === 500) {
        const message =
          response?.data?.message ||
          response?.data?.header?.message ||
          "Something went wrong. Please try again.";
        toast.error(message);
        throw createToastedError(message);
      } else if (response?.data?.code === 403) {
        if (shouldSkipAuth(url)) {
          return response.data;
        }

        const message =
          response?.data?.message ||
          "You don't have permission to perform this action.";
        toast.error(message);
        throw createToastedError(message);
      } else {
        return {
          response: response.data,
        };
      }
    } else {
      return { response: response.data, headers: response.headers };
    }
  } catch (error: any) {
    if (error?.status === 401) {
      toast.error("Session expired, logging out.");
      handleSessionExpiration();
    } else if (error?.data?.detail || error?.response?.data?.detail) {
      const message = getApiErrorMessage(error, "Unable to complete this request.");
      toast.error(message);
      throw createToastedError(message);
    } else if (error.response?.status === 403 || error?.status === 403 || error?.data?.code === 403) {
      if (shouldSkipAuth(url)) {
        return error?.data || error?.response?.data;
      }

      const message = getApiErrorMessage(error,"You don't have permission to perform this action.");
      toast.error(message);
      throw createToastedError(message);
    } else if (error.response?.status === 400 || error?.status === 400 || error?.data?.code === 400) {
      const message = getApiErrorMessage(error, "Unable to complete this request.");
      toast.error(message);
      throw createToastedError(message);
    } else if (error.response?.status === 429 || error?.status === 429 || error?.data?.code === 429) {
      const message = getApiErrorMessage(error, "Too many requests. Please try again later.");
      toast.error(message);
      throw createToastedError(message);
    } else if (error.response?.status === 500 || error?.status === 500 || error?.data?.code === 500) {
      const message = getApiErrorMessage(error, "Something went wrong. Please try again.");
      toast.error(message);
      throw createToastedError(message);
    }
  }
};
