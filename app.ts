import * as dotenv from "dotenv"
dotenv.config()
import express, { json } from "express";
import {postsRouter, protectedRouter} from "./routers/postRoutes";
import { threadsRouterProtected, threadsRouter } from "./routers/threadRouters";
import { createUser, signIn } from "./controllers/userController";


const app = express()
app.use(json())

//threads
app.use("/", threadsRouterProtected)

// posts
app.use("/", postsRouter)


// user routes
app.post("/user", createUser)
app.post("/signin", signIn)


export default app
