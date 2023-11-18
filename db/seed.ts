import * as db from "./index";
import { post, post2} from "./seed_data/post";
import { user } from "./seed_data/user";
import { comment } from "./seed_data/comment";
import { reply } from "./seed_data/reply";
import { hashPassword } from "../middleware/authMiddleware";
require("dotenv").config();

export const seed = async (thread: any, user: any, post: any, reply: any) => {
  try {
    const ctgs = await createGroups();
    console.log(ctgs.rows);
    const usr = await createUser(user);
    console.log(usr.rows);
    const thrd = await createPost(post);
    const thrd2 = await createPost(post2);
    console.log(thrd.rows);
    console.log(thrd2.rows);
    const pst = await createComment(comment);
    console.log(pst.rows);
    const rpl = await createReply(reply);
    console.log(rpl.rows);
  } catch (err) {
    console.log(err);
  }
};

const createUser = async (user: any) => {
  user.password = await hashPassword(user.password);
  console.log(user.password);
  return await db.query(
    `
    INSERT INTO users(username, email, password)
    VALUES ($1, $2, $3) RETURNING *
  `,
    [user.username, user.email, user.password],
  );
};

const createGroups = async () => {
  return await db.query(
    `
    INSERT INTO groups(group_name, description) VALUES
    ( 'JavaScript BE', 'Everything JS backend' ),
    ( 'DATABASES', 'Everything DATABASES' ) RETURNING *;
  `,
    [],
  );
};

const createPost = async (post: any) => {
  return await db.query(
    `
    INSERT INTO posts(title, content, group_id, user_id)
    VALUES ($1, $2, $3, $4) RETURNING *
  `,
    [post.title, post.content, post.group_id, post.user_id],
  );
};

const createComment = async (comment: any) => {
  return await db.query(
    `
    INSERT INTO comments(comment_content, user_id, post_id)
    VALUES ($1, $2, $3) RETURNING *
  `,
    [comment.comment_content, comment.user_id, comment.post_id],
  );
};

const createReply = async (reply: any) => {
  return await db.query(
    `
    INSERT INTO comments(comment_content, user_id, post_id, reply_to_comment_id)
    VALUES ($1, $2, $3, $4) RETURNING *
  `,
    [
      reply.comment_content,
      reply.user_id,
      reply.post_id,
      reply.reply_to_comment_id,
    ],
  );
};

seed(post, user, comment, reply).then(() => {
  console.log("Seeding done!");
});
