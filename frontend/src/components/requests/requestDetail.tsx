"use client";

import { useState } from "react";
import Link from "next/link";
import { useRequest } from "@/hooks/use-request";
import { useUpdateStatus } from "@/hooks/use-request-mutations";
import { REQUEST_STATUS, REQUEST_STATUS_VALUES } from "@/enums/enums";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft } from "@hugeicons/core-free-icons";
import RequestInfo from "@/components/requests/requestInfo";
import RequestNotes from "@/components/requests/requestNotes";
import RequestHistory from "@/components/requests/requestHistory";
import RejectionDialog from "@/components/requests/rejectionDialog";

export default function RequestDetail({ id }: { id: string }) {
  const { data: request, isLoading, error } = useRequest(id);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);

  const updateStatusMutation = useUpdateStatus(id);

  function handleStatusChange(status: string) {
    if (status === REQUEST_STATUS.REJECTED) {
      setRejectionDialogOpen(true);
      return;
    }
    updateStatusMutation.mutate({ status });
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl w-full px-6 py-10">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="mx-auto max-w-3xl w-full px-6 py-10">
        <p className="text-sm text-destructive">
          {error?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl w-full px-6 py-10 space-y-6">
      <Link href="/requests">
        <Button variant="ghost" size="sm" className="mb-4">
          <HugeiconsIcon icon={ArrowLeft} strokeWidth={2} />
          Back to requests
        </Button>
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium">{request.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submitted by {request.submitter} on {formatDate(request.createdAt)}
          </p>
        </div>
        <Select
          value={request.status}
          onValueChange={(val) => handleStatusChange(val as string)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REQUEST_STATUS_VALUES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-6" />

      <RequestInfo request={request} />

      <Separator className="my-6" />

      <RequestNotes id={id} notes={request.notes} />

      <RequestHistory history={request.history} />

      <RejectionDialog
        id={id}
        open={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
      />
    </div>
  );
}
