import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { createPost, getAllPosts, replyToPost } from "../controllers/postsController";
export const postsRouter = Router()
export const protectedPostsRouter = Router()

protectedPostsRouter.post("/posts", protect, createPost)
protectedPostsRouter.post("/replies", protect, replyToPost)

postsRouter.get("/posts", getAllPosts)
