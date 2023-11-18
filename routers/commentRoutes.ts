import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createComment,
  getAllComments,
  replyToComment,
} from "../controllers/commentController";
import { body, param } from "express-validator";
import { handleInputError } from "../middleware/validationError";

export const commentsRouter = Router();
export const protectedCommentsRouter = Router();

protectedCommentsRouter.post(
  "/comments",
  protect,
  body("comment_content")
    .notEmpty()
    .withMessage("Comment content can not be empty")
    .isLength({ min: 10 })
    .withMessage("Comment content needs to be at least 10 characters long"),
  handleInputError,
  createComment,
);

protectedCommentsRouter.post(
  "/replies",
  protect,
  body("comment_content")
    .notEmpty()
    .withMessage("Reply content can not be empty")
    .isLength({ min: 10 })
    .withMessage("Reply content needs to be at least 10 characters long"),
  handleInputError,
  replyToComment,
);

commentsRouter.get(
  "/comments",
  body("post_id").notEmpty().withMessage("Post ID required"),
  getAllComments,
);
