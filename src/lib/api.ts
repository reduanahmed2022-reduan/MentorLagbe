export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Attach the stored JWT. Protected endpoints always need this. */
  auth?: boolean;
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

  if (auth && typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
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

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}`,
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
