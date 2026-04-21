import type { NextFunction, Request, Response } from "express";
import requestService from "../services/request.service.js";

const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newRequest = await requestService.createRequest(req.body);
    return res.status(201).json({
      message: "Request created successfully",
      data: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

const listRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await requestService.listRequests(req.query);
    return res.json({
      message: "Requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

const getRequestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await requestService.getRequestById(req.params.id as string);
    res.json({
      message: "Request retrieved successfully",
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await requestService.updateStatus(req.params.id as string, req.body);
    res.json({
      message: "Request status updated successfully",
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

const updateOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await requestService.updateOwner(req.params.id as string, req.body);
    res.json({
      message: "Request owner updated successfully",
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

const addNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await requestService.addNote(req.params.id as string, req.body);
    res.json({
      message: "Note added successfully",
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

const getRequestHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const history = await requestService.getRequestHistory(req.params.id as string);
    res.json({
      message: "Request history retrieved successfully",
      data: history,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createRequest,
  listRequests,
  getRequestById,
  updateStatus,
  updateOwner,
  addNote,
  getRequestHistory,
};
