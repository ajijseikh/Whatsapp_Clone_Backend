import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js"
import conversationRoutes from "./conversation.route.js"
import messageRoutes from "./message.route.js"

const router = express.Router();

// this routes is global route
router.use("/auth",authRoutes)
router.use("/user",userRoutes)

router.use("/conversation",conversationRoutes)
router.use("/message",messageRoutes)

export default router