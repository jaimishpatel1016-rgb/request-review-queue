import { Router } from "express";
import requestController from "../controllers/request.controller.js";

const router: Router = Router();

router.get("/", requestController.listRequests);
router.post("/", requestController.createRequest);
router.get("/:id", requestController.getRequestById);
router.patch("/:id/status", requestController.updateStatus);
router.patch("/:id/owner", requestController.updateOwner);
router.post("/:id/notes", requestController.addNote);
router.get("/:id/history", requestController.getRequestHistory);
router.patch("/:id/required-fields", requestController.updateRequiredFields);

export default router;
