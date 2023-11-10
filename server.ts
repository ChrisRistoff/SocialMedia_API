import express, { json } from "express";
import postsRouter from "./routers/postRoutes";

const app = express()
app.use(json())

app.use("/posts", postsRouter)

app.listen(8080, () => {
  console.log("Server listening on port 8080")
})
