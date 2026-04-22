"use client";

import { useState } from "react";
import { useRequests, type RequestFilters } from "@/hooks/use-requests";
import RequestTable from "@/components/requests/requestTable";
import CreateRequestDialog from "@/components/requests/createRequestDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REQUEST_STATUS } from "@/enums/enums";
import { OWNERS } from "@/lib/constants";
import { Label } from "../ui/label";

export default function RequestsPage() {
  const [filters, setFilters] = useState<RequestFilters>({
    status: "",
    owner: "",
    due: "",
  });
  const { data: requests, isLoading, error } = useRequests(filters);

  function setFilter(key: keyof RequestFilters, value: string | null) {
    setFilters((prev) => {
      if (!value || value === "all") {
        const rest = { ...prev };
        delete rest[key];
        return rest;
      }
      return { ...prev, [key]: value };
    });
  }

  return (
    <div className="mx-auto max-w-5xl w-full px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and manage submitted requests.
          </p>
        </div>
        <CreateRequestDialog />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex flex-col items-start gap-3">
          <Label htmlFor="status">Status</Label>
          <Select id="status" value={filters.status || "All Statuses"} onValueChange={(v) => setFilter("status", v)}>
            <SelectTrigger size="sm" className={'w-[150px]'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(REQUEST_STATUS).map((s) => (
                <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-start gap-3">
          <Label htmlFor="owner">Owner</Label>
          <Select id="owner" value={filters.owner || "All Owners"} onValueChange={(v) => setFilter("owner", v)}>
            <SelectTrigger size="sm" className={'w-[150px]'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Owners</SelectItem>
              {OWNERS.map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-start gap-3">
          <Label htmlFor="due">Due</Label>
          <Select id="due" value={filters.due || "All Due Dates"} onValueChange={(v) => setFilter("due", v)}>
            <SelectTrigger size="sm" className={'w-[150px]'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Due Dates</SelectItem>
              <SelectItem value="soon">Due Soon</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <p className="text-sm w-full text-center h-64 flex items-center justify-center text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-sm w-full text-center h-64 flex items-center justify-center text-destructive">{error.message}</p>
        ) : !requests || requests.length === 0 ? (
          <p className="text-sm w-full text-center h-64 flex items-center justify-center text-muted-foreground">No requests found.</p>
        ) : (
          <RequestTable requests={requests} />
        )}
      </div>
    </div>
  );
}
