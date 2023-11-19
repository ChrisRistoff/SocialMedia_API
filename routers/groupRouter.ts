import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { createGroup, getMembersOfGroup, joinGroup } from "../controllers/groupController";
import { body } from "express-validator";
import { handleInputError } from "../middleware/validationError";

export const protectedGroupRouter = Router();
export const groupRouter = Router()

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
  createGroup,
);

protectedGroupRouter.post("/join_group/:group_id", protect, joinGroup);

groupRouter.get("/group/:group_id/members", getMembersOfGroup)
