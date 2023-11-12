import * as dotenv from "dotenv"
dotenv.config()
import express, { json } from "express";
import { threadsRouterProtected } from "./routers/threadRouters";
import { createUser, signIn } from "./controllers/userController";
import { postsRouter, protectedPostsRouter } from "./routers/postRoutes";


const app = express()
app.use(json())

//threads
app.use("/", threadsRouterProtected)

// posts
app.use("/", protectedPostsRouter)
app.use("/", postsRouter)


// user routes
app.post("/signup", createUser)
app.post("/signin", signIn)


export default app
