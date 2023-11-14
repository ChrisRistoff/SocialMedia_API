import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { createPost, getAllPosts, replyToPost } from "../controllers/postsController";
import { body } from "express-validator";
import { handleInputError } from "../middleware/validationError";

export const postsRouter = Router()
export const protectedPostsRouter = Router()

protectedPostsRouter.post("/posts",
  protect,
  body("post_content").isString().notEmpty().isLength({min: 100}),
  handleInputError,
  createPost)

protectedPostsRouter.post("/replies",
  protect,
  body("post_content").isString().notEmpty().isLength({min: 100}),
  handleInputError,
  replyToPost)

postsRouter.get("/posts", getAllPosts)
