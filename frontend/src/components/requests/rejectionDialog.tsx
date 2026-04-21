"use client";

import { useState } from "react";
import { useUpdateStatus } from "@/hooks/use-request-mutations";
import { REQUEST_STATUS } from "@/enums/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface RejectionDialogProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RejectionDialog({ id, open, onOpenChange }: RejectionDialogProps) {
  const [reason, setReason] = useState("");

  const updateStatusMutation = useUpdateStatus(id, () => {
    setReason("");
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejection Reason</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (reason.trim()) {
              updateStatusMutation.mutate({
                status: REQUEST_STATUS.REJECTED,
                rejectionReason: reason.trim(),
              });
            }
          }}
          className="flex flex-col gap-4"
        >
          <Input
            placeholder="Why is this request being rejected?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={!reason.trim() || updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
