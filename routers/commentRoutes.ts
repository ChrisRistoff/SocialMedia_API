import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createComment,
  getAllComments,
  replyToComment,
} from "../controllers/commentController";
import { body } from "express-validator";
import { handleInputError } from "../middleware/validationError";

export const commentsRouter = Router();
export const protectedCommentsRouter = Router();

protectedCommentsRouter.post(
  "/post/:post_id/comment",
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
  "/comment/:reply_to_comment_id/reply",
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
  "/post/:post_id/comments",
  body("post_id").notEmpty().withMessage("Post ID required"),
  getAllComments,
);
