import { env } from "../lib/env";

export interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: unknown;
}

const DEFAULT_TIMEOUT_MS = 30_000;

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async get<T>(path: string, timeoutMs?: number): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await this.fetchWithTimeout(
      url,
      { method: "GET" },
      timeoutMs,
    );
    return this.handleResponse<T>(response, "GET", path);
  }

  async post<T>(path: string, body: unknown, timeoutMs?: number): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await this.fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      timeoutMs ?? DEFAULT_TIMEOUT_MS,
    );
    return this.handleResponse<T>(response, "POST", path);
  }

  private async fetchWithTimeout(
    url: string,
    init: RequestInit,
    timeoutMs?: number,
  ): Promise<Response> {
    if (!timeoutMs) return fetch(url, init);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw {
          code: "TIMEOUT",
          message: `Request timeout setelah ${timeoutMs}ms`,
          status: 0,
        } satisfies ApiError;
      }
      throw {
        code: "NETWORK_ERROR",
        message:
          error instanceof TypeError
            ? error.message
            : "Tidak dapat terhubung ke server.",
        status: 0,
      } satisfies ApiError;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async handleResponse<T>(
    response: Response,
    method: string,
    path: string,
  ): Promise<T> {
    if (response.ok) return response.json() as Promise<T>;
    throw await this.parseError(response, method, path);
  }

  private async parseError(
    response: Response,
    method: string,
    path: string,
  ): Promise<ApiError> {
    const body = await response.json().catch(() => null);
    const code = body?.error_code ?? body?.code ?? `HTTP_${response.status}`;
    const message =
      body?.message ?? body?.detail ?? `Server error (${response.status})`;
    const details = body?.errors ?? body?.detail ?? undefined;

    const bodyPreview =
      body !== null ? JSON.stringify(body).slice(0, 500) : "<no body>";
    console.error(
      `[ApiClient] ${method} ${path} -> ${response.status} ${code}: ${message}`,
      { details: bodyPreview },
    );

    return { code, message, status: response.status, details };
  }
}

export const apiClient = new ApiClient(env.VITE_API_BASE_URL);
