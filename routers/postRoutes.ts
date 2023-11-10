import { Router } from "express";
import { getPosts } from "../controllers/postsController";
const postsRouter = Router()

postsRouter.get("/get", getPosts)

export default postsRouter
