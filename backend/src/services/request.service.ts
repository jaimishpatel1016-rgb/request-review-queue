import type { Request } from "express";
import { HISTORY_TYPE, REQUEST_PRIORITY_VALUES, REQUEST_STATUS, REQUEST_STATUS_VALUES, type REQUEST_PRIORITY } from "../enums.js";
import { NotFoundError, ValidationError } from "../middleware/error.middleware.js";
import RequestModel from "../models/request.model.js";

export interface CreateRequestPayload {
  title: string;
  submitter: string;
  priority: REQUEST_PRIORITY;
  owner?: string | null;
  dueDate: Date;
}

export interface ListRequestsQuery {
  status?: REQUEST_STATUS;
  owner?: string;
  due?: "soon" | "overdue";
}

export interface UpdateStatusPayload {
  status: REQUEST_STATUS;
  rejectionReason?: string;
}

export interface UpdateOwnerPayload {
  owner: string;
}

export interface AddNotePayload {
  note: string;
}

async function createRequest(payload: CreateRequestPayload) {
  const { title, submitter, priority, owner = null, dueDate } = payload;
  const trimmedTitle = title.trim();
  const trimmedSubmitter = submitter.trim();

  if (!trimmedTitle) {
    throw new ValidationError("Title is required");
  }

  if (!trimmedSubmitter) {
    throw new ValidationError("Submitter is required");
  }

  const dueDateObj = new Date(dueDate);
  if (dueDate && isNaN(dueDateObj.getTime())) {
    throw new ValidationError("Invalid due date");
  }

  if (owner !== null && !owner.trim()) {
    throw new ValidationError("Owner cannot be an empty string");
  }

  if (!REQUEST_PRIORITY_VALUES.includes(priority)) {
    throw new ValidationError("Invalid priority value");
  }

  await RequestModel.create({
    title: trimmedTitle,
    submitter: trimmedSubmitter,
    priority,
    owner: owner ? owner.trim() : null,
    dueDate: dueDateObj || null,
  });

  return {
    title: trimmedTitle,
    submitter: trimmedSubmitter,
    priority,
    owner: owner ? owner.trim() : null,
    dueDate: dueDateObj || null,
  };
}

async function listRequests(query: Request["query"]) {
  const status = query.status as string | undefined;
  const owner = query.owner as string | undefined;
  const due = query.due as string | undefined;

  const filters: {
    status?: REQUEST_STATUS;
    owner?: string;
    dueDate?: { $gte?: Date; $lte?: Date; $lt?: Date };
  } = {};

  if (status && REQUEST_STATUS_VALUES.includes(status as REQUEST_STATUS)) {
    filters.status = status as REQUEST_STATUS;
  }

  if (owner) {
    filters.owner = owner;
  }

  if (due === "soon") {
    filters.dueDate = {
      $gte: new Date(),
      $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  } else if (due === "overdue") {
    filters.dueDate = { $lt: new Date() };
  }

  const requests = await RequestModel.find(filters).lean();

  return requests;
}

async function getRequestById(id: string) {
  const request = await RequestModel.findById(id).lean();
  if (!request) {
    throw new NotFoundError(`Request ${id} not found`);
  }
  return request;
}

async function updateStatus(id: string, payload: UpdateStatusPayload) {
  const { status, rejectionReason } = payload;

  if (!REQUEST_STATUS_VALUES.includes(status)) {
    throw new ValidationError("Invalid status value");
  }

  const request = await RequestModel.findById(id);
  if (!request) {
    throw new NotFoundError(`Request ${id} not found`);
  }

  if (status === REQUEST_STATUS.APPROVED && !request.requiredFieldsComplete) {
    throw new ValidationError("Cannot approve: required fields are not complete");
  }

  if (status === REQUEST_STATUS.REJECTED) {
    if (!rejectionReason || !rejectionReason.trim()) {
      throw new ValidationError("Rejection reason is required");
    }
    request.rejectionReason = rejectionReason.trim();
  }

  const previousStatus = request.status;
  request.status = status;
  request.history.push({
    type: HISTORY_TYPE.STATUS_CHANGE,
    from: previousStatus,
    to: status,
  } as any);

  await request.save();
  return request.toObject();
}

async function updateOwner(id: string, payload: UpdateOwnerPayload) {
  const { owner } = payload;

  if (!owner || !owner.trim()) {
    throw new ValidationError("Owner is required");
  }

  const request = await RequestModel.findById(id);
  if (!request) {
    throw new NotFoundError(`Request not found`);
  }

  const previousOwner = request.owner;
  request.owner = owner.trim();
  request.history.push({
    type: HISTORY_TYPE.OWNER_CHANGE,
    from: previousOwner,
    to: owner.trim(),
  } as any);

  await request.save();
  return request.toObject();
}

async function addNote(id: string, payload: AddNotePayload) {
  const { note } = payload;

  if (!note || !note.trim()) {
    throw new ValidationError("Note is required");
  }

  const request = await RequestModel.findById(id);
  if (!request) {
    throw new NotFoundError(`Request not found`);
  }

  request.notes.push({ note: note.trim() } as any);
  await request.save();

  return request.toObject();
}

async function getRequestHistory(id: string) {
  const request = await RequestModel.findById(id).lean();
  if (!request) {
    throw new NotFoundError(`Request not found`);
  }
  return request.history;
}

export default {
  createRequest,
  listRequests,
  getRequestById,
  updateStatus,
  updateOwner,
  addNote,
  getRequestHistory,
};
