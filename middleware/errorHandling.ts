import { Request, Response, Errback, NextFunction } from "express";

export const sqlErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.code === "23503") {
    res.status(400).send({ msg: "ID not found" });
  }

  next();
};

export const customErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.errCode) {
    res.status(err.errCode).send({ msg: err.errMsg });
  } else {
    res.status(500).send({ msg: "Internal server error" });
  }

  next();
};
