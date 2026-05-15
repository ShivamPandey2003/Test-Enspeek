import axios from "axios";
import { toast } from "sonner";
import { store } from "../store/store";

const platform_url = import.meta.env.VITE_REACT_APP_API_URL || "";

export type ApiMethod = "get" | "post" | "put" | "delete";
const AUTH_EXCLUDED_PATHS = new Set(["user/login", "uam/login"]);

const apiClient = axios.create({
  baseURL: platform_url,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.url !== "/uam/login") {
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

const normalizePath = (url: string) => url.replace(/^\/+/, "");

const shouldSkipApiToken = (url: string) => AUTH_EXCLUDED_PATHS.has(normalizePath(url));

const injectApiToken = (url: string, data: any) => {
  if (shouldSkipApiToken(url)) {
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
      } else if (response?.data?.code === 401) {
        toast.error("Session expired, logging out.");
        handleSessionExpiration();
        return response.data;
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
    } else if (
      error.response?.status === 400 ||
      error?.status === 400 ||
      error?.data?.code === 400
    ) {
      console.log(error);
      toast.error(error.data.message);
    }
  }
};
