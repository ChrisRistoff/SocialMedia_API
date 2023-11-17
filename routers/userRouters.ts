import { Router } from "express";
import { createUser, signIn } from "../controllers/userController";
import { body } from "express-validator";
import { handleInputError } from "../middleware/validationError";

export const userRouter = Router();

userRouter.post(
  "/signup",
  body("username")
    .notEmpty()
    .withMessage("Username can not be empty")
    .isLength({ min: 4 })
    .withMessage("Username needs to be longer than 4 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email can not be empty")
    .isEmail()
    .withMessage("Email can not be empty")
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password can not be empty")
    .isLength({ min: 8 })
    .withMessage("Password needs to be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password needs to contain at least one digit")
    .matches(/.*[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password needs to contain at least one special character"),
  handleInputError,
  createUser,
);

userRouter.post(
  "/signin",
  body("email")
    .notEmpty()
    .withMessage("Email can not be empty")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password can not be empty")
    .isLength({ min: 8 })
    .withMessage("Password needs to be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password needs to contain at least one digit")
    .matches(/.*[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password needs to contain at least one special character"),
  handleInputError,
  signIn,
);
