import { HISTORY_TYPE } from "@/enums/enums";
import { formatDateTime } from "@/lib/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { History } from "@/types/request";

export default function RequestHistory({ history }: { history: History[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No history yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((entry) => (
              <div key={entry._id} className="flex items-start justify-between gap-4">
                <div className="text-sm">
                  {entry.type === HISTORY_TYPE.STATUS_CHANGE ? (
                    <p>
                      Status changed from{" "}
                      <span className="font-medium">
                        {(entry.from ?? "—").replace(/_/g, " ")}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {(entry.to ?? "—").replace(/_/g, " ")}
                      </span>
                    </p>
                  ) : (
                    <p>
                      Owner changed from{" "}
                      <span className="font-medium">{entry.from ?? "Unassigned"}</span>{" "}
                      to{" "}
                      <span className="font-medium">{entry.to ?? "Unassigned"}</span>
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {formatDateTime(entry.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
