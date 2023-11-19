import { Request, Response, NextFunction } from "express";
import {
  createCommentModel,
  getAllCommentsModel,
  replyToCommentModel,
} from "../models/commentModels";

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, comment_content} = req.body;
  const { post_id } = req.params

  try {
    const comment = await createCommentModel(+post_id, user_id, comment_content);

    res.status(201).send({ comment });
  } catch (error) {
    console.log(error)
    next(error)
  }
};

export const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
  const { post_id } = req.params;

  try {
    const comments = await getAllCommentsModel(+post_id);

    res.status(200).send({ comments });
  } catch (error) {
    console.log(error)
    next(error)
  }
};

export const replyToComment = async (req: Request, res: Response, next: NextFunction) => {
  const { comment_content, user_id, post_id } = req.body;
  const { reply_to_comment_id } = req.params

  try {
    const reply = await replyToCommentModel(
      comment_content,
      user_id,
      post_id,
      +reply_to_comment_id,
    );

    res.status(201).send({ reply });
  } catch (error) {
    console.log(error)
    next(error)
  }
};
