import { NextFunction, Request, Response } from "express";
import {
  createJWT,
  hashPassword,
} from "../middleware/authMiddleware";
import { createUserModel, singInModel } from "../models/userModels";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.body.username;
    const email = req.body.email;

    const password = await hashPassword(req.body.password);

    const user = await createUserModel(username, email, password);

    const token = createJWT(user);

    res.status(200).send({ token });
  } catch (error) {
    console.log(error)
    next(error)
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await singInModel(email, password);

    const token = createJWT(user);

    res.status(200).send({ token });
  } catch (error) {
    console.log(error)
    next(error)
  }
};
