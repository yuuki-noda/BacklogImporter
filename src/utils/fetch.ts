export interface FetchRequest {
  url: string;
  options: RequestInit;
}

export async function fetchAsync(request: FetchRequest): Promise<Response> {
  return await fetch(request.url, request.options);
}

export async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
