import { Router } from "express";
import requestController from "../controllers/request.controller.js";

const router: Router = Router();

router.get("/", requestController.listRequests);
router.post("/", requestController.createRequest);
router.get("/:id", requestController.getRequest);
router.patch("/:id/status", requestController.updateStatus);
router.patch("/:id/owner", requestController.updateOwner);
router.post("/:id/notes", requestController.addNote);
router.get("/:id/history", requestController.getRequestHistory);

export default router;
