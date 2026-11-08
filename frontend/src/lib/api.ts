import type { PrototypePayload } from "@/data/prototype";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export async function fetchPrototypeData(signal?: AbortSignal): Promise<PrototypePayload> {
  const response = await fetch(`${getApiBaseUrl()}/api/prototype`, {
    method: "GET",
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Prototype API request failed with ${response.status}`);
  }

  return (await response.json()) as PrototypePayload;
}
