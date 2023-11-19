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
import { groupRouter, protectedGroupRouter } from "./routers/groupRouter";

const app = express();
app.use(json());

//groups
app.use("/", protectedGroupRouter)
app.use("/", groupRouter)

// posts
app.use("/", protectedPostsRouter);
app.use("/", postsRouter);

// comments
app.use("/", protectedCommentsRouter);
app.use("/", commentsRouter);

// user routes
app.use("/", userRouter);

//errors
app.use(sqlErrors, customErrors);
export default app;
