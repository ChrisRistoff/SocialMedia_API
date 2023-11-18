import { Router } from "express";
import { createPostInGroup, getAllPostsInGroup, getAllPostsOfUser} from "../controllers/postControllers";
import { protect } from "../middleware/authMiddleware";
import { body } from "express-validator";

export const protectedPostsRouter= Router();
export const postsRouter = Router();

protectedPostsRouter.post(
  "/posts",
  body("title")
    .notEmpty().withMessage("")
    .isLength({ min: 10 })
    .withMessage("Post title needs to be longer than 10 characters"),
  body("description")
    .isString()
    .isLength({ min: 100 })
    .withMessage("Post description is too short"),
  protect,
  createPostInGroup,
);

postsRouter.get("/posts", getAllPostsInGroup);

postsRouter.get("/posts/:user_id", getAllPostsOfUser)
