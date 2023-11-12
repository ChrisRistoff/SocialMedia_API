import { Request, Response } from "express"
import { createPostsModel } from "../models/postsModels"

export const createPost = async (req: Request, res: Response) => {
  const {thread_id, user_id, post_content} = req.body

  if(!post_content) return res.status(400).send({error: "Missing parameters"})

  try {
    const post = await createPostsModel(thread_id, user_id, post_content)

    if(!post) throw new Error ()

    res.status(201).send({ post })
  } catch (error) {
    res.status(500).send({ error: "Internal server error" })
  }
}
