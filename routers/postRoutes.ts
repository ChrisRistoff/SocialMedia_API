import { Router } from "express";
import { getPosts } from "../controllers/postsController";
import { protect } from "../middleware/authMiddleware";
export const postsRouter = Router()
export const protectedRouter = Router()

postsRouter.get("/get", getPosts)

protectedRouter.get("/getp", protect, getPosts)

