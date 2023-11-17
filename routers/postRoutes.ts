import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createPost,
  getAllPosts,
  replyToPost,
} from "../controllers/postsController";
import { body, param } from "express-validator";
import { handleInputError } from "../middleware/validationError";

export const postsRouter = Router();
export const protectedPostsRouter = Router();

protectedPostsRouter.post(
  "/posts",
  protect,
  body("post_content")
    .notEmpty()
    .withMessage("Post content can not be empty")
    .isLength({ min: 10 })
    .withMessage("Post content needs to be at least 10 characters long"),
  handleInputError,
  createPost,
);

protectedPostsRouter.post(
  "/replies",
  protect,
  body("post_content").notEmpty().withMessage("Reply content can not be empty"),
  handleInputError,
  replyToPost,
);

postsRouter.get(
  "/posts",
  body("thread_id").notEmpty().withMessage("Thread ID required"),
  getAllPosts,
);
