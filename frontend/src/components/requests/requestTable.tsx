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

const MS_PER_DAY = 86400 * 1000;

function daysUntilDue(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / MS_PER_DAY);
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
        {requests.map((req) => {
          const days = req.dueDate ? daysUntilDue(req.dueDate) : null;
          const overdue = days !== null && days < 0;
          const dueSoon = days !== null && days >= 0 && days <= 7;

          return (
            <TableRow key={req._id} className="cursor-pointer">
              <TableCell className="font-medium">
                <Link href={`/requests/${req._id}`} className="hover:underline">
                  {req.title}
                </Link>
              </TableCell>
              <TableCell>{req.submitter}</TableCell>
              <TableCell>
                <Badge>{req.status.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={req.priority === "HIGH" ? "destructive" : req.priority === "MEDIUM" ? "outline" : "secondary"}>
                  {req.priority}
                </Badge>
              </TableCell>
              <TableCell>{req.owner ?? "—"}</TableCell>
              <TableCell className={overdue ? "text-destructive" : dueSoon ? "text-orange-500" : ""}>
                {formatDate(req.dueDate)}
                {overdue && <span className="block text-xs font-medium">Overdue</span>}
                {dueSoon && <span className="block text-xs font-medium">Due soon</span>}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(req.createdAt)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
