import { useUpdateOwner, useUpdateRequiredFields } from "@/hooks/use-request-mutations";
import { OWNERS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Request } from "@/types/request";

export default function RequestInfo({ request }: { request: Request }) {
  const updateOwnerMutation = useUpdateOwner(request._id);
  const updateRequiredFieldsMutation = useUpdateRequiredFields(request._id);

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-muted-foreground">Priority</p>
        <Badge
          variant={
            request.priority === "HIGH"
              ? "destructive"
              : request.priority === "MEDIUM"
                ? "outline"
                : "secondary"
          }
          className="mt-1"
        >
          {request.priority}
        </Badge>
      </div>
      <div>
        <p className="text-muted-foreground">Owner</p>
        <Select
          value={request.owner ?? ""}
          onValueChange={(val) => updateOwnerMutation.mutate(val as string)}
        >
          <SelectTrigger className="mt-1 w-37.5">
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            {OWNERS.map((owner) => (
              <SelectItem key={owner} value={owner}>
                {owner}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-muted-foreground">Due Date</p>
        <p className="mt-1">{formatDate(request.dueDate)}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Required Fields</p>
        <label className="mt-1 flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={request.requiredFieldsComplete}
            onChange={(e) => updateRequiredFieldsMutation.mutate(e.target.checked)}
            disabled={updateRequiredFieldsMutation.isPending}
            className="accent-primary"
          />
          <span className="text-sm">
            {request.requiredFieldsComplete ? "Complete" : "Incomplete"}
          </span>
        </label>
      </div>
      {request.rejectionReason && (
        <div className="col-span-2">
          <p className="text-muted-foreground">Rejection Reason</p>
          <p className="mt-1">{request.rejectionReason}</p>
        </div>
      )}
    </div>
  );
}
