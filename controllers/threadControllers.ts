import { NextFunction, Request, Response } from "express";
import { createPostInGroupModel, getAllPostsInGroupModel } from "../models/threadModels";

export const createPostInGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, group_id, title, content } = req.body;

  try {
    const post = await createPostInGroupModel(
      user_id,
      group_id,
      title,
      content,
    );

    if (!post) throw new Error("Internal server error");

    res.status(201).send({ post });
  } catch (error) {
    console.log(error)
    next(error)
  }
};

export const getAllThreadsInGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { group_id } = req.body;

  try {
    const posts = await getAllPostsInGroupModel(group_id);

    res.status(200).send({ posts });
  } catch (error) {
    console.log(error);
    next(error)
  }
};
