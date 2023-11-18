import * as db from "../db/index";

export const createCommentModel = async (
  thread_id: number,
  user_id: number,
  comment_content: string,
) => {
  const result = await db.query(
    `
      INSERT INTO comments (thread_id, user_id, comment_content)
      VALUES ($1, $2, $3) RETURNiNG *
    `,
    [thread_id, user_id, comment_content],
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
};

export const replyToCommentModel = async (
  comment_content: string,
  user_id: number,
  thread_id: number,
  reply_to_comment_id: number,
) => {
  const result = await db.query(
    `
    INSERT INTO comments (comment_content, user_id, thread_id, reply_to_comment_id)
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

  const user = await db.query(
    `
    SELECT username, created_at FROM users WHERE user_id = $1;
    `,
    [user_id],
  );

  result.rows[0].comment= comment.rows[0];
  result.rows[0].user = user.rows[0];

  return result.rows[0];
};

export const getAllCommentsModel = async (thread_id) => {
  const thread = await db.query(
    `SELECT title FROM threads WHERE thread_id=$1`,
    [thread_id],
  );

  if (thread.rows.length < 1) return Promise.reject({errCode: 400, errMsg: "ID not found"});

  const comments = await db.query(
    `
      SELECT
        c.comment_id,
        c.comment_content,
        c.created_at AS comment_created_at,
        c.reply_to_comment_id,
        u.user_id,
        u.username,
        u.email,
        rc.comment_content AS reply_to_content,
        rc.created_at AS reply_to_created_at
      FROM
        comments c
      JOIN
        users u ON p.user_id = u.user_id
      LEFT JOIN
        comments rc ON c.reply_to_comment_id = rc.comment_id
      WHERE
        c.thread_id = $1
      ORDER BY
        c.created_at;
    `,
    [thread_id],
  );

  return comments.rows;
};
