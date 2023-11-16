import { Request, Response, Errback, NextFunction } from "express";

export const sqlErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.code === "23503") {
    return res.status(400).send({ msg: "ID not found" });
  }

  next(err);
};

export const customErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.errCode) {
    return res.status(err.errCode).send({ msg: err.errMsg });
  } else {
    return res.status(500).send({ msg: "Internal server error" });
  }
};
