import { Router } from "express";
import requestRoutes from "./request.route.js";

const router: Router = Router();

router.use("/requests", requestRoutes);

export default router;
