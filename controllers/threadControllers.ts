import { Request, Response } from "express";
import { createThreadModel, getAllThreadsModel } from "../models/threadModels";

export const createThread = async (req: Request, res: Response) => {
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
    res.status(500).send({ error: error.message });
  }
};

export const getAllThreads = async (req: Request, res: Response) => {
  const { category_id } = req.body;

  try {
    const threads = await getAllThreadsModel(1);

    res.status(200).send({ threads });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};
