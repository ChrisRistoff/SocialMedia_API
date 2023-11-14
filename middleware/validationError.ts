import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const handleInputError = (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors.array())
    res.status(400).send({ errors: errors.array() })
  }
}
