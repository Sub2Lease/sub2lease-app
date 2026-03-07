export function handleApiResponse<T>(response: T | { error: string; status: string }): T {
  if (typeof response === "object" && response !== null && "error" in response) {
    throw new Error(response.error);
  }
  return response as T;
}
