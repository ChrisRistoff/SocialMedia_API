import { Request, Response } from "express";
import { createThreadModel } from "../models/threadModels";

export const createThread = async (req: Request, res: Response) => {
  const { user_id, category_id, title, content } = req.body

  try {
    const thread = await createThreadModel(user_id, category_id, title, content)

    if(!thread) throw new Error("Internal server error")

    res.status(201).send({ thread })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}
