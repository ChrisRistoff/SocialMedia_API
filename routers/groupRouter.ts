import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { createGroup } from "../controllers/groupController";
import { body } from "express-validator";
import { handleInputError } from "../middleware/validationError";

export const protectedGroupRouter = Router();

protectedGroupRouter.post(
  "/groups",
  protect,
  body("group_name").notEmpty().withMessage("Group name can not be empty"),
  body("description")
    .notEmpty()
    .withMessage("Group description can not be empty")
    .isLength({ min: 10 })
    .withMessage("Group description needs to be at least 10 characters long"),
  handleInputError,
  createGroup
);
