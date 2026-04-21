import type { HISTORY_TYPE, REQUEST_PRIORITY, REQUEST_STATUS } from "./enums.js";

export interface Note {
  _id: string;
  note: string;
  createdAt: Date;
}

export interface History {
  _id: string;
  type: HISTORY_TYPE;
  from: string | null;
  to: string | null;
  createdAt: Date;
}
export interface Request {
  _id: string;
  title: string;
  submitter: string;
  status: REQUEST_STATUS;
  priority: REQUEST_PRIORITY;
  owner: string | null;
  dueDate: Date | null;
  requiredFieldsComplete: boolean;
  rejectionReason: string | null;
  notes: Note[];
  history: History[];
  createdAt: Date;
  updatedAt: Date;
}
