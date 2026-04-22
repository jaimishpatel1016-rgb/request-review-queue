import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { Request } from "@/types/request";

export interface RequestFilters {
  status?: string;
  owner?: string;
  due?: string;
}

export function useRequests(filters: RequestFilters = {}) {
  return useQuery<Request[]>({
    queryKey: ["requests", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.owner) params.set("owner", filters.owner);
      if (filters.due) params.set("due", filters.due);
      const res = await apiClient.get(`/requests?${params}`);
      return res.data.data;
    },
  });
}
