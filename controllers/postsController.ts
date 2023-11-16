import { Request, Response, NextFunction } from "express";
import {
  createPostsModel,
  getAllPostsModel,
  replyToPostModel,
} from "../models/postsModels";

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const { thread_id, user_id, post_content } = req.body;

  try {
    const post = await createPostsModel(thread_id, user_id, post_content);

    res.status(201).send({ post });
  } catch (error) {
    console.log(error)
    next(error)
  }
};

export const replyToPost = async (req: Request, res: Response, next: NextFunction) => {
  const { post_content, user_id, thread_id, reply_to_post_id } = req.body;

  try {
    const reply = await replyToPostModel(
      post_content,
      user_id,
      thread_id,
      reply_to_post_id,
    );

    res.status(201).send({ reply });
  } catch (error) {
    console.log(error)
    next(error)
  }
};

export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  const { thread_id } = req.body;

  try {
    const posts = await getAllPostsModel(thread_id);

    res.status(200).send({ posts });
  } catch (error) {
    console.log(error)
    next(error)
  }
};
