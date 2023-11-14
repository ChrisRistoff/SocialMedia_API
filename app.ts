import * as dotenv from "dotenv"
dotenv.config()
import express, { json } from "express";
import { threadsRouter, threadsRouterProtected } from "./routers/threadRouters";
import { postsRouter, protectedPostsRouter } from "./routers/postRoutes";
import { userRouter } from "./routers/userRouters";


const app = express()
app.use(json())

//threads
app.use("/", threadsRouterProtected)
app.use("/", threadsRouter)

// posts
app.use("/", protectedPostsRouter)
app.use("/", postsRouter)


// user routes
app.use("/", userRouter)

export default app
