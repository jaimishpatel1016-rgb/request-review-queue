import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { Request } from "@/types/request";

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
          <TableRow key={req._id} className="cursor-pointer">
            <TableCell className="font-medium">
              <Link href={`/requests/${req._id}`} className="hover:underline">
                {req.title}
              </Link>
            </TableCell>
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
