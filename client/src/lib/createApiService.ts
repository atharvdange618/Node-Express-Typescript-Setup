import { get, post } from "@/lib/apiClient";

export const createApiService = <T extends object>(baseUrl: string) => ({
  list: ({ signal }: { signal: AbortSignal }) => get<T[]>(baseUrl, { signal }),
  getById: (id: string, { signal }: { signal: AbortSignal }) =>
    get<T>(`${baseUrl}/${id}`, { signal }),
  create: (data: Partial<T>) => post<T>(baseUrl, data),
});
