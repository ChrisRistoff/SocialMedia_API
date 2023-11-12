import * as dotenv from "dotenv"
dotenv.config()
import express, { json } from "express";
import { threadsRouterProtected } from "./routers/threadRouters";
import { createUser, signIn } from "./controllers/userController";
import { protectedPostsRouter } from "./routers/postRoutes";


const app = express()
app.use(json())

//threads
app.use("/", threadsRouterProtected)

// posts
app.use("/", protectedPostsRouter)


// user routes
app.post("/user", createUser)
app.post("/signin", signIn)


export default app
