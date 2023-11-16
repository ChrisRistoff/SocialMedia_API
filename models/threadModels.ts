import * as db from "../db/index";

interface FlexibleObject {
  [key: string]: any;
}

export const createThreadModel = async (
  user_id: number,
  category_id: number,
  title: string,
  post_content: string,
) => {
  const result: FlexibleObject = await db.query(
    `
    INSERT INTO threads (user_id, category_id, title, content)
    VALUES ($1, $2, $3, $4) RETURNING *;
    `,
    [user_id, category_id, title, post_content],
  );

  const user = await db.query(`SELECT * FROM users WHERE user_id = $1`, [
    user_id,
  ]);

  result.rows[0].user = {
    username: user.rows[0].username,
    created_at: user.rows[0].created_at,
  };

  return result.rows[0];
};

export const getAllThreadsModel = async (category_id: number) => {
  console.log(category_id)
  const threads = await db.query(
    `
    SELECT t.category_id, t.thread_id, t.title, t.content, u.username AS creator_username,
    COUNT(p.post_id) AS post_count,
    MAX(p.created_at) AS last_post_date
    FROM threads t
    LEFT JOIN posts p ON p.thread_id = t.thread_id
    LEFT JOIN users u ON t.user_id = u.user_id
    WHERE t.category_id = $1
    GROUP BY t.category_id, t.thread_id, t.title, t.content, u.username;
    `,
    [category_id],
  );

  if (threads.rows.length < 1) return Promise.reject({errCode: 400, errMsg: "ID not found"})

  return threads.rows;
};
