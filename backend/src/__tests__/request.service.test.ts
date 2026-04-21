import { describe, it, expect } from "vitest";
import requestService from "../services/request.service.js";
import RequestModel from "../models/request.model.js";
import { REQUEST_STATUS } from "../enums.js";
import { HISTORY_TYPE } from "../enums.js";

async function createTestRequest(overrides = {}) {
  const doc = await RequestModel.create({
    title: "Test Request",
    submitter: "John",
    priority: "MEDIUM",
    dueDate: new Date("2026-06-01"),
    ...overrides,
  });
  return doc;
}

describe("updateStatus", () => {
  it("should reject approval when required fields are incomplete", async () => {
    const request = await createTestRequest({ requiredFieldsComplete: false });

    await expect(
      requestService.updateStatus(request._id.toString(), {
        status: REQUEST_STATUS.APPROVED,
      })
    ).rejects.toThrow("Cannot approve: required fields are not complete");
  });

  it("should allow approval when required fields are complete", async () => {
    const request = await createTestRequest({ requiredFieldsComplete: true });

    const result = await requestService.updateStatus(request._id.toString(), {
      status: REQUEST_STATUS.APPROVED,
    });

    expect(result.status).toBe(REQUEST_STATUS.APPROVED);
  });

  it("should reject rejection without a reason", async () => {
    const request = await createTestRequest();

    await expect(
      requestService.updateStatus(request._id.toString(), {
        status: REQUEST_STATUS.REJECTED,
      }),
    ).rejects.toThrow("Rejection reason is required");
  });

  it("should reject rejection with an empty reason", async () => {
    const request = await createTestRequest();

    await expect(
      requestService.updateStatus(request._id.toString(), {
        status: REQUEST_STATUS.REJECTED,
        rejectionReason: "   ",
      }),
    ).rejects.toThrow("Rejection reason is required");
  });

  it("should allow rejection with a valid reason", async () => {
    const request = await createTestRequest();

    const result = await requestService.updateStatus(request._id.toString(), {
      status: REQUEST_STATUS.REJECTED,
      rejectionReason: "Missing documents",
    });

    expect(result.status).toBe(REQUEST_STATUS.REJECTED);
    expect(result.rejectionReason).toBe("Missing documents");
  });

  it("should create a history entry on status change", async () => {
    const request = await createTestRequest();
    expect(request.history).toHaveLength(0);

    const result = await requestService.updateStatus(request._id.toString(), {
      status: REQUEST_STATUS.IN_REVIEW,
    });

    expect(result.history).toHaveLength(1);
    expect(result.history[0]!.type).toBe(HISTORY_TYPE.STATUS_CHANGE);
    expect(result.history[0]!.from).toBe(REQUEST_STATUS.NEW);
    expect(result.history[0]!.to).toBe(REQUEST_STATUS.IN_REVIEW);
  });

  it("should accumulate history entries on multiple status changes", async () => {
    const request = await createTestRequest({ requiredFieldsComplete: true });

    await requestService.updateStatus(request._id.toString(), {
      status: REQUEST_STATUS.IN_REVIEW,
    });

    const result = await requestService.updateStatus(request._id.toString(), {
      status: REQUEST_STATUS.APPROVED,
    });

    expect(result.history).toHaveLength(2);
    expect(result.history[0]!.from).toBe(REQUEST_STATUS.NEW);
    expect(result.history[0]!.to).toBe(REQUEST_STATUS.IN_REVIEW);
    expect(result.history[1]!.from).toBe(REQUEST_STATUS.IN_REVIEW);
    expect(result.history[1]!.to).toBe(REQUEST_STATUS.APPROVED);
  });
});

describe("updateOwner", () => {
  it("should create a history entry on owner reassignment", async () => {
    const request = await createTestRequest({ owner: "Alice" });
    expect(request.history).toHaveLength(0);

    const result = await requestService.updateOwner(request._id.toString(), {
      owner: "Bob",
    });

    expect(result.history).toHaveLength(1);
    expect(result.history[0]!.type).toBe(HISTORY_TYPE.OWNER_CHANGE);
    expect(result.history[0]!.from).toBe("Alice");
    expect(result.history[0]!.to).toBe("Bob");
  });

  it("should create a history entry when assigning from unassigned", async () => {
    const request = await createTestRequest({ owner: null });

    const result = await requestService.updateOwner(request._id.toString(), {
      owner: "Alice",
    });

    expect(result.history).toHaveLength(1);
    expect(result.history[0]!.type).toBe(HISTORY_TYPE.OWNER_CHANGE);
    expect(result.history[0]!.from).toBeNull();
    expect(result.history[0]!.to).toBe("Alice");
  });

  it("should accumulate history for multiple owner changes", async () => {
    const request = await createTestRequest({ owner: null });

    await requestService.updateOwner(request._id.toString(), { owner: "Alice" });
    const result = await requestService.updateOwner(request._id.toString(), { owner: "Bob" });

    expect(result.history).toHaveLength(2);
    expect(result.history[1]!.from).toBe("Alice");
    expect(result.history[1]!.to).toBe("Bob");
  });
});
