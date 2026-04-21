import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { Request } from "@/types/request";

export function useRequests() {
  return useQuery<Request[]>({
    queryKey: ["requests"],
    queryFn: async () => {
      const res = await apiClient.get("/requests");
      return res.data.data;
    },
  });
}
