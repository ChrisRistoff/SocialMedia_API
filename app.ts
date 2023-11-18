import * as dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import { postsRouter, protectedPostsRouter } from "./routers/postRouters";
import {
  commentsRouter,
  protectedCommentsRouter,
} from "./routers/commentRoutes";
import { userRouter } from "./routers/userRouters";
import { customErrors, sqlErrors } from "./middleware/errorHandling";

const app = express();
app.use(json());

//threads
app.use("/", protectedPostsRouter);
app.use("/", postsRouter);

// posts
app.use("/", protectedCommentsRouter);
app.use("/", commentsRouter);

// user routes
app.use("/", userRouter);

//errors
app.use(sqlErrors, customErrors);
export default app;
