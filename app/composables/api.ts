import type { ApiResponse } from "~/types";

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl as string;

  const getAuthHeaders = (): Record<string, string> => {
    const token = useCookie("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }
    return headers;
  };

  const apiFetch = async <T>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE";
      body?: unknown;
      query?: Record<string, string | number | undefined>;
    } = {},
  ): Promise<ApiResponse<T>> => {
    const { method = "GET", body, query } = options;

    try {
      const response = await $fetch<ApiResponse<T>>(endpoint, {
        baseURL,
        method,
        headers: getAuthHeaders(),
        body, // $fetch automatically handles JSON serialization
        query,
      });
      return response;
    } catch (error: unknown) {
      // Handle fetch errors
      const fetchError = error as {
        data?: ApiResponse<T>;
        statusCode?: number;
      };
      if (fetchError.data) {
        return fetchError.data;
      }
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  };

  // GET request helper
  const get = <T>(
    endpoint: string,
    query?: Record<string, string | number | undefined>,
  ) => apiFetch<T>(endpoint, { method: "GET", query });

  // POST request helper
  const post = <T>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: "POST", body });

  // PUT request helper
  const put = <T>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: "PUT", body });

  // DELETE request helper
  const del = <T>(endpoint: string) =>
    apiFetch<T>(endpoint, { method: "DELETE" });

  // Download helper
  const download = async (
    endpoint: string,
    filename: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error("Download error:", error);
      return false;
    }
  };

  return {
    apiFetch,
    get,
    post,
    put,
    del,
    download,
    baseURL,
  };
};
