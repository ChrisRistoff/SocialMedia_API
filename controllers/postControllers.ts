import { NextFunction, Request, Response } from "express";
import {
  createPostInGroupModel,
  getAllPostsInGroupModel,
  getAllPostsOfUserModel,
} from "../models/postModels";

export const createPostInGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user_id, title, content } = req.body;
  const { group_id } = req.params;

  try {
    const post = await createPostInGroupModel(
      user_id,
      +group_id,
      title,
      content,
    );

    if (!post) throw new Error("Internal server error");

    res.status(201).send({ post });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllPostsInGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { group_id } = req.params;

  try {
    const posts = await getAllPostsInGroupModel(+group_id);

    res.status(200).send({ posts });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllPostsOfUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user_id } = req.params;

  try {
    const posts = await getAllPostsOfUserModel(+user_id);

    res.status(200).send({ posts });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
