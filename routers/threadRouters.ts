import { Router } from "express";
import { createThread, getAllThreads } from "../controllers/threadControllers";
import { protect } from "../middleware/authMiddleware";
import { body } from "express-validator";

export const threadsRouterProtected = Router();
export const threadsRouter = Router();

threadsRouterProtected.post(
  "/threads",
  body("title").isString().isLength({ min: 100 }),
  body("description").isString().isLength({ min: 100 }),
  protect,
  createThread,
);

threadsRouter.get("/threads", getAllThreads);
