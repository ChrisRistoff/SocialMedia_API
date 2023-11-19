import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

interface CustomRequest extends Request {
  user: any;
}

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const createJWT = (user: any): string => {
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
    },
    secret,
    {
      expiresIn: "1h"
    }
  );

  return token;
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const customReq = req as CustomRequest;
  const bearer = customReq.headers.authorization;

  console.log(req.body.payload)

  if (!bearer) {
    res.status(401).send({ msg: "You need to be logged in" });
    return;
  }

  const split_token = bearer.split(" ");
  const token = split_token[1];

  if (!token) {
    res.status(401).send({ msg: "Token is not valid" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const user = jwt.verify(token, secret);
    customReq.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ msg: "Token not valid" });
  }
};
