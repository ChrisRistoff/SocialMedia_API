import * as db from "../db/index";

export const createCommentModel = async (
  thread_id: number,
  user_id: number,
  comment_content: string,
  username: string,
) => {
  const user = await db.query(
    `
    SELECT * FROM users WHERE user_id = $1;
  `,
    [user_id],
  );

  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User does not exist" });

  const result = await db.query(
    `
      INSERT INTO comments (post_id, user_id, comment_content)
      VALUES ($1, $2, $3) RETURNiNG *
    `,
    [thread_id, user_id, comment_content],
  );
  result.rows[0].user = username;

  return result.rows[0];
};

export const replyToCommentModel = async (
  comment_content: string,
  user_id: number,
  thread_id: number,
  reply_to_comment_id: number,
  username: string,
) => {
  const user = await db.query(
    `
    SELECT * FROM users WHERE user_id = $1;
    `,
    [user_id],
  );

  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User does not exist" });

  const result = await db.query(
    `
    INSERT INTO comments (comment_content, user_id, post_id, reply_to_comment_id)
    VALUES ($1, $2, $3, $4) RETURNING *;
    `,
    [comment_content, user_id, thread_id, reply_to_comment_id],
  );
  const comment = await db.query(
    `
    SELECT * FROM comments WHERE comment_id = $1;
    `,
    [reply_to_comment_id],
  );

  result.rows[0].comment = comment.rows[0];
  result.rows[0].user = username;

  return result.rows[0];
};

export const getAllCommentsModel = async (post_id: number) => {
  const thread = await db.query(`SELECT title FROM posts WHERE post_id=$1`, [
    post_id,
  ]);

  if (thread.rows.length < 1)
    return Promise.reject({
      errCode: 404,
      errMsg: `Post with ID ${post_id} not found`,
    });

  const comments = await db.query(
    `
    SELECT
      c.comment_id,
      c.comment_content,
      c.created_at AS comment_created_at,
      u.user_id,
      u.username
    FROM
      comments c
    JOIN
      users u ON c.user_id = u.user_id
    WHERE
      c.post_id = $1 AND
      c.reply_to_comment_id IS NULL
    ORDER BY
      c.created_at;
    `,
    [post_id],
  );

  const commentsIndId = new Map();

  for (let i = 0; i < comments.rows.length; i++) {
    commentsIndId.set(comments.rows[i].comment_id, i);
    comments.rows[i].replies = [];
  }

  const replies = await db.query(
    `
    SELECT
      r.comment_id,
      r.comment_content,
      r.created_at AS reply_created_at,
      r.reply_to_comment_id,
      u.user_id,
      u.username
    FROM
      comments r
    JOIN
      users u ON r.user_id = u.user_id
    WHERE
      r.post_id = $1 AND
      r.reply_to_comment_id IS NOT NULL
    ORDER BY
      r.created_at;
    `,
    [post_id],
  );

  for (let i = 0; i < replies.rows.length; i++) {
    if (commentsIndId.get(replies.rows[i].reply_to_comment_id) !== undefined) {
      comments.rows[
        commentsIndId.get(replies.rows[i].reply_to_comment_id)
      ].replies.push(replies.rows[i]);
    }
  }

  return comments.rows;
};
