import { HISTORY_TYPE, REQUEST_PRIORITY, REQUEST_STATUS } from "@/enums/enums";

export interface Note {
  _id: string;
  note: string;
  createdAt: string;
}

export interface History {
  _id: string;
  type: HISTORY_TYPE;
  from: string | null;
  to: string | null;
  createdAt: string;
}

export interface Request {
  _id: string;
  title: string;
  submitter: string;
  status: REQUEST_STATUS;
  priority: REQUEST_PRIORITY;
  owner: string | null;
  dueDate: string | null;
  requiredFieldsComplete: boolean;
  rejectionReason: string | null;
  notes: Note[];
  history: History[];
  createdAt: string;
  updatedAt: string;
}
