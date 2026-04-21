import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Request } from "@/types/request";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RequestTable({ requests }: { requests: Request[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Submitter</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <TableRow key={req._id}>
            <TableCell className="font-medium">{req.title}</TableCell>
            <TableCell>{req.submitter}</TableCell>
            <TableCell>
              <Badge>
                {req.status.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={req.priority === "HIGH" ? "destructive" : req.priority === "MEDIUM" ? "outline" : "secondary"}>
                {req.priority}
              </Badge>
            </TableCell>
            <TableCell>{req.owner ?? "—"}</TableCell>
            <TableCell>{formatDate(req.dueDate)}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(req.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
