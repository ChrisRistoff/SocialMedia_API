import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const handleInputError = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = errors.array()[0] as any;
    return next({ errCode: 400, errMsg: `${err.msg}` });
  }

  next();
};
