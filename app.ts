import * as dotenv from "dotenv"
dotenv.config()
import express, { json } from "express";
import { threadsRouterProtected } from "./routers/threadRouters";
import { createUser, signIn } from "./controllers/userController";
import { postsRouter, protectedPostsRouter } from "./routers/postRoutes";
import { userRouter } from "./routers/userRouters";


const app = express()
app.use(json())

//threads
app.use("/", threadsRouterProtected)

// posts
app.use("/", protectedPostsRouter)
app.use("/", postsRouter)


// user routes
app.use("/", userRouter)

export default app
