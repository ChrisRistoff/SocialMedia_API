import { Request, Response, NextFunction } from "express";
import { createGroupModel } from "../models/groupModel";

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { group_name, description, user_id } = req.body

  try {
    const group = await createGroupModel(group_name, description, user_id)

    res.status(201).send({ group })
  } catch (err) {
    console.log(err)
    next(err)
  }
}
