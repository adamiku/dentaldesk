/**
 * Centralized API client
 * Provides type-safe HTTP methods with consistent error handling
 *
 * IMPORTANT: This client returns raw JSON responses. Consumers MUST validate
 * responses using runtime validation (e.g., Zod schemas) to ensure type safety
 * and handle unexpected API responses gracefully.
 *
 * @example
 * ```typescript
 * // ✅ Correct: Validate response with Zod
 * const data = await apiClient.get("/treatments");
 * return TreatmentsResponseSchema.parse(data);
 *
 * // ❌ Incorrect: Using response directly without validation
 * const data = await apiClient.get<TreatmentsResponse>("/treatments");
 * return data; // Type assertion only, no runtime safety!
 * ```
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL = "") {
    this.baseURL = baseURL;
  }

  private buildURL(path: string, params?: RequestConfig["params"]): string {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const url = new URL(path, base || "http://localhost");

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private async request<T>(
    path: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const { params, ...fetchConfig } = config;
    const url = this.buildURL(`${this.baseURL}${path}`, params);

    const response = await fetch(url, {
      ...fetchConfig,
      headers: {
        "Content-Type": "application/json",
        ...fetchConfig.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText,
      );
    }

    return response.json();
  }

  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: "GET" });
  }

  async post<T>(
    path: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(
    path: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: "DELETE" });
  }
}

export const apiClient = new ApiClient("/api");
