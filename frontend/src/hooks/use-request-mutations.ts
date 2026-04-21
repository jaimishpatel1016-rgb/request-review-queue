import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

export function useAddNote(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (note: string) =>
      apiClient.post(`/requests/${id}/notes`, { note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      onSuccess?.();
      toast.success("Note added");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export function useUpdateOwner(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (owner: string) =>
      apiClient.patch(`/requests/${id}/owner`, { owner }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      toast.success("Owner updated");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export function useUpdateRequiredFields(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requiredFieldsComplete: boolean) =>
      apiClient.patch(`/requests/${id}/required-fields`, { requiredFieldsComplete }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      toast.success("Required fields status updated");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export function useUpdateStatus(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { status: string; rejectionReason?: string }) =>
      apiClient.patch(`/requests/${id}/status`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request", id] });
      onSuccess?.();
      toast.success("Status updated");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}
