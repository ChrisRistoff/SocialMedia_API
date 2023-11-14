import { Request, Response } from "express"
import { createPostsModel, getAllPostsModel, replyToPostModel } from "../models/postsModels"

export const createPost = async (req: Request, res: Response) => {
  const {thread_id, user_id, post_content} = req.body

  try {
    const post = await createPostsModel(thread_id, user_id, post_content)

    if(!post) throw new Error ()

    res.status(201).send({ post })
  } catch (error) {
    res.status(500).send({ error: "Internal server error" })
  }
}

export const replyToPost = async (req: Request, res: Response) => {
  const { post_content, user_id, thread_id, reply_to_post_id } = req.body

  try {
    const reply = await replyToPostModel(post_content, user_id, thread_id, reply_to_post_id)

    if(!reply) throw new Error()

    res.status(201).send({ reply })

  } catch (error) {
    res.status(500).send({ error: "Internal server error"})
  }
}

export const getAllPosts = async (req: Request, res: Response) => {
  const { thread_id } = req.body

  try {
    const posts = await getAllPostsModel(thread_id)
    if(!posts) throw new Error()

    res.status(200).send({ posts })
  } catch (error) {
    res.status(500).send({ error: "Internal server error" })
  }
}
