import mongoose, { Schema } from "mongoose";
import { HISTORY_TYPE_VALUES, REQUEST_PRIORITY, REQUEST_PRIORITY_VALUES, REQUEST_STATUS, REQUEST_STATUS_VALUES } from "../enums.js";

const NoteSchema = new Schema(
  {
    note: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const HistorySchema = new Schema(
  {
    type: {
      type: String,
      enum: HISTORY_TYPE_VALUES,
      required: true,
    },
    from: {
      type: String,
      default: null,
    },
    to: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const RequestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    submitter: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: REQUEST_STATUS_VALUES,
      default: REQUEST_STATUS.NEW,
    },
    priority: {
      type: String,
      enum: REQUEST_PRIORITY_VALUES,
      default: REQUEST_PRIORITY.MEDIUM,
    },
    owner: {
      type: String,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    requiredFieldsComplete: {
      type: Boolean,
      default: false,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    notes: [NoteSchema],
    history: [HistorySchema],
  },
  { timestamps: true },
);

const RequestModel = mongoose.model("Request", RequestSchema);

export default RequestModel;
