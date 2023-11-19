import { Request, Response, NextFunction } from "express";
import {
  createGroupModel,
  getGroupsOfUserModel,
  getMembersOfGroupModel,
  joinGroupModel,
} from "../models/groupModel";


interface CustomRequest extends Request {
  user: any;
}

export const createGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const custReq = req as CustomRequest
  const { group_name, description } = req.body;
  const { user_id } = custReq.user

  try {
    const group = await createGroupModel(group_name, description, user_id);

    res.status(201).send({ group });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const joinGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const custReq = req as CustomRequest
  const { user_id } = custReq.user;
  const { group_id } = req.params;

  try {
    const msg = await joinGroupModel(+group_id, user_id);

    res.status(201).send({ msg });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getMembersOfGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { group_id } = req.params;

  try {
    const members = await getMembersOfGroupModel(+group_id);

    res.status(200).send({ members });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getGroupsOfUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.params

  try {
    const groups = await getGroupsOfUserModel(+user_id)

    res.status(200).send({ groups })
  } catch (err) {
    console.log(err)
    next(err)
  }
}
