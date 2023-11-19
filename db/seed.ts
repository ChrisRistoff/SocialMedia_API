import * as db from "./index";
import { posts } from "./seed_data/posts";
import { users } from "./seed_data/users";
import { comments } from "./seed_data/comments";
import { replies } from "./seed_data/replies";
import { hashPassword } from "../middleware/authMiddleware";
import { groups } from "./seed_data/groups";

console.log(process.env.DB_NAME);

export const seed = async (
  groups: any,
  posts: any,
  users: any,
  comments: any,
  replies: any,
) => {
  try {
    const grps = await createGroups(groups);
    console.log(grps);
    const usr = await createUsers(users);
    console.log(usr);
    const psts = await createPosts(posts);
    console.log(psts);
    const cmts = await createComments(comments);
    console.log(cmts);
    const rpls = await createReplies(replies);
    console.log(rpls);
    if (process.env.NODE_ENV !== "test") db.pool.end();
  } catch (err) {
    console.log(err);
  }
};

const createUsers = async (users: any) => {
  const result = []

  for (const user of users) {
    user.password = await hashPassword(user.password);
    const newUser = await db.query(
      `
      INSERT INTO users(username, email, password)
      VALUES ($1, $2, $3) RETURNING *
      `,
      [user.username, user.email, user.password],
    );
    result.push(newUser.rows[0])
  }

  return result
};

const createGroups = async (groups: any) => {
  const result = [];

  for (const group of groups) {
    const newGroup = await db.query(
      `
      INSERT INTO groups(group_name, description) VALUES
      ($1, $2) RETURNING *;
      `,
      [group.group_name, group.description],
    );

    result.push(newGroup.rows[0]);
  }

  return result;
};

const createPosts = async (posts: any) => {
  const result = [];
  for (let post of posts) {
    const newPost = await db.query(
      `
      INSERT INTO posts(title, content, group_id, user_id)
      VALUES ($1, $2, $3, $4) RETURNING *
      `,
      [post.title, post.content, post.group_id, post.user_id],
    );

    result.push(newPost.rows[0]);
  }

  return result;
};

const createComments = async (comments: any) => {
  const result = []

  for (const comment of comments) {
    const newComment = await db.query(
      `
      INSERT INTO comments(comment_content, user_id, post_id)
      VALUES ($1, $2, $3) RETURNING *
      `,
      [comment.comment_content, comment.user_id, comment.post_id],
    );
    result.push(newComment.rows[0])
  }

  return result
};

const createReplies = async (replies: any) => {
  const result = []

  for (const reply of replies) {
    const newReply = await db.query(
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
    result.push(newReply.rows[0])
  }
  return result
};

seed(groups, posts, users, comments, replies).then(() => {
  console.log("Seeding done!");
});
