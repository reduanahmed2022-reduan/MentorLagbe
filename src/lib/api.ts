import { clearSession, getToken } from "./auth";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

/** Friendly, non-technical messages for transient upstream failures. */
const FRIENDLY_STATUS_MESSAGES: Record<number, string> = {
  503: "Service temporarily unavailable, please try again.",
  504: "Upload timed out, please retry.",
};

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Attach the stored JWT. Protected endpoints always need this. */
  auth?: boolean;
}

/**
 * A private-route reload fires several authenticated requests in parallel.
 * Re-validate once (single-flight) before clearing the session so a single
 * transient 401 cannot log out an otherwise valid user.
 */
let profileRevalidation: Promise<boolean> | null = null;

function revalidateSession(token: string): Promise<boolean> {
  if (!profileRevalidation) {
    profileRevalidation = (async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        // Network failures and non-401 responses keep the session intact.
        return response.status === 401;
      } catch {
        return false;
      }
    })().finally(() => {
      profileRevalidation = null;
    });
  }

  return profileRevalidation;
}

/**
 * Single place for every call to the Express API.
 * Keeps auth headers, JSON parsing and error messages consistent.
 */
export async function apiFetch<T>(
  path: string,
  { body, auth = false, headers, ...init }: ApiOptions = {}
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders = new Headers(headers);

  if (body !== undefined && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const usedToken = auth && typeof window !== "undefined" ? getToken() : null;

  if (usedToken) {
    requestHeaders.set("Authorization", `Bearer ${usedToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: requestHeaders,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Network error, please check your connection and try again.",
      0
    );
  }

  const data = await response.json().catch(() => ({}));

  // Only a confirmed auth failure for the token this request actually used
  // may clear the session. Another tab logging in/out must not log us out.
  if (
    response.status === 401 &&
    auth &&
    usedToken &&
    typeof window !== "undefined" &&
    getToken() === usedToken
  ) {
    void revalidateSession(usedToken).then((invalid) => {
      if (invalid && getToken() === usedToken) {
        clearSession();
        // Hard-navigate so in-memory auth state is dropped too; replace()
        // keeps the stale page out of the back history.
        window.location.replace("/sign-in");
      }
    });
  }

  if (!response.ok || data.success === false) {
    throw new ApiError(
      data?.message ||
        FRIENDLY_STATUS_MESSAGES[response.status] ||
        `Request failed with status ${response.status}`,
      response.status
    );
  }

  return data as T;
}

/** Upload an image file to the ImgBB-backed server endpoint. */
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);

  const data = await apiFetch<{ success: boolean; imageUrl: string }>(
    "/upload/image",
    { method: "POST", body: form, auth: true }
  );

  return data.imageUrl;
}
