import { Router } from "express";
import { createThread, getAllThreads } from "../controllers/threadControllers";
import { protect } from "../middleware/authMiddleware";
import { body } from "express-validator";

export const threadsRouterProtected = Router();
export const threadsRouter = Router();

threadsRouterProtected.post(
  "/threads",
  body("title")
    .notEmpty().withMessage("")
    .isLength({ min: 20 })
    .withMessage("Thread title needs to be longer than 20 characters"),
  body("description")
    .isString()
    .isLength({ min: 100 })
    .withMessage("Thread description is too short"),
  protect,
  createThread,
);

threadsRouter.get("/threads", getAllThreads);
