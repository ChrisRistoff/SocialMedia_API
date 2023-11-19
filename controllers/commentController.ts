import { Request, Response, NextFunction } from "express";
import {
  createCommentModel,
  getAllCommentsModel,
  replyToCommentModel,
} from "../models/commentModels";

interface CustomRequest extends Request {
  user: any;
}

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const custReq = req as CustomRequest
  const { comment_content} = req.body;
  const { post_id } = req.params
  const { user_id, username } = custReq.user

  try {
    const comment = await createCommentModel(+post_id, user_id, comment_content, username);

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
  const custReq = req as CustomRequest
  const { comment_content, post_id } = req.body;
  const { reply_to_comment_id } = req.params
  const { user_id, username } = custReq.user


  try {
    const reply = await replyToCommentModel(
      comment_content,
      user_id,
      post_id,
      +reply_to_comment_id,
      username
    );

    res.status(201).send({ reply });
  } catch (error) {
    console.log(error)
    next(error)
  }
};
