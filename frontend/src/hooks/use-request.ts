import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { Request } from "@/types/request";

export function useRequest(id: string) {
  return useQuery<Request>({
    queryKey: ["request", id],
    queryFn: async () => {
      const res = await apiClient.get(`/requests/${id}`);
      return res.data.data;
    },
  });
}
