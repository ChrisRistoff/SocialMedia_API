import * as db from "../db/index";

export const createPostsModel = async (
  thread_id: number,
  user_id: number,
  post_content: string,
) => {
  try {
    const result = await db.query(
      `
      INSERT INTO posts (thread_id, user_id, post_content)
      VALUES ($1, $2, $3) RETURNiNG *
    `,
      [thread_id, user_id, post_content],
    );

    const user = await db.query(
      `
      SELECT username, created_at FROM users
      WHERE user_id = $1
    `,
      [user_id],
    );

    result.rows[0].user = user.rows[0];

    return result.rows[0];
  } catch (error) {
    return false;
  }
};

export const replyToPostModel = async (
  post_content: string,
  user_id: number,
  thread_id: number,
  reply_to_post_id: number,
) => {
  try {
    const result = await db.query(
      `
      INSERT INTO posts (post_content, user_id, thread_id, reply_to_post_id)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `,
      [post_content, user_id, thread_id, reply_to_post_id],
    );

    const post = await db.query(
      `
      SELECT * FROM posts WHERE post_id = $1;
    `,
      [reply_to_post_id],
    );

    const user = await db.query(
      `
      SELECT username, created_at FROM users WHERE user_id = $1;
    `,
      [user_id],
    );

    result.rows[0].post = post.rows[0];
    result.rows[0].user = user.rows[0];

    return result.rows[0];
  } catch (error) {
    return false;
  }
};

export const getAllPostsModel = async (thread_id) => {
  try {
    const thread = await db.query(
      `SELECT title FROM threads WHERE thread_id=$1`,
      [thread_id],
    );

    if (thread.rows.length < 1) return false;

    const posts = await db.query(
      `
      SELECT
        p.post_id,
        p.post_content,
        p.created_at AS post_created_at,
        p.reply_to_post_id,
        u.user_id,
        u.username,
        u.email,
        rp.post_content AS reply_to_content,
        rp.created_at AS reply_to_created_at
      FROM
        posts p
      JOIN
        users u ON p.user_id = u.user_id
      LEFT JOIN
        posts rp ON p.reply_to_post_id = rp.post_id
      WHERE
        p.thread_id = $1
      ORDER BY
        p.created_at;
    `,
      [thread_id],
    );

    return posts.rows;
  } catch (error) {
    return false;
  }
};
