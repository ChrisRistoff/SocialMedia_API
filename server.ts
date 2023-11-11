import * as dotenv from "dotenv"
dotenv.config()
import express, { json } from "express";
import {postsRouter, protectedRouter} from "./routers/postRoutes";
import { createUser, signIn } from "./controllers/userController";


const app = express()
app.use(json())

app.use("/", postsRouter)

app.use("/", protectedRouter)

// user routes
app.post("/user", createUser)
app.post("/signin", signIn)

app.listen(8080, () => {
  console.log("Server listening on port 8080")
})
