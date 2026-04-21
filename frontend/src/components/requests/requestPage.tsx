"use client";

import { useRequests } from "@/hooks/use-requests";
import RequestTable from "@/components/requests/requestTable";
import CreateRequestDialog from "@/components/requests/createRequestDialog";

export default function RequestsPage() {
  const { data: requests, isLoading, error } = useRequests();

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

      <div className="mt-6">
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
