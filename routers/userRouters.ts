import { Router } from "express";
import { createUser, signIn } from "../controllers/userController";
import { body } from "express-validator";

export const userRouter = Router();

userRouter.post(
  "/signup",
  body("username").notEmpty().isLength({ min: 4 }),
  body("email").isEmail(),
  body("password").notEmpty().isLength({ min: 8 }),
  createUser,
);

userRouter.post(
  "/signin",
  body("email").isEmail(),
  body("password").notEmpty(),
  signIn,
);
