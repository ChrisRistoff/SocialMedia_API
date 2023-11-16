import { NextFunction, Request, Response } from "express";
import { createThreadModel, getAllThreadsModel } from "../models/threadModels";

export const createThread = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, category_id, title, content } = req.body;

  try {
    const thread = await createThreadModel(
      user_id,
      category_id,
      title,
      content,
    );

    if (!thread) throw new Error("Internal server error");

    res.status(201).send({ thread });
  } catch (error) {
    console.log(error)
    next(error)
  }
};

export const getAllThreads = async (req: Request, res: Response, next: NextFunction) => {
  const { category_id } = req.body;

  try {
    const threads = await getAllThreadsModel(category_id);

    res.status(200).send({ threads });
  } catch (error) {
    console.log(error);
    next(error)
  }
};
