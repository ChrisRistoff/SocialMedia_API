import { Router } from "express";
import { createThread } from "../controllers/threadControllers";
import { protect } from "../middleware/authMiddleware";

export const threadsRouterProtected = Router()
export const threadsRouter = Router()

threadsRouterProtected.post("/threads", protect, createThread)
