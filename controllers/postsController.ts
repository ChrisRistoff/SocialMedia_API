import { Request, Response } from "express"
import { getPostsModel } from "../models/postsModels"

export const getPosts = async (_: Request, res: Response) => {
  try {
    const result = await getPostsModel()
    res.status(200).send(result?.rows)
  } catch (error) {
    console.log(error)
  }
}
