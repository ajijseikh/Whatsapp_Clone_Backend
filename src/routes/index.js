import express from "express";
import authRoutes from "./auth.route.js";

const router = express.Router();

// this routes is global route
router.use("/auth",authRoutes)

export default router