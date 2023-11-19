import * as db from "../db/index";

interface FlexibleObject {
  [key: string]: any;
}

export const createPostInGroupModel = async (
  user_id: number,
  group_id: number,
  title: string,
  post_content: string,
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

  const result: FlexibleObject = await db.query(
    `
    INSERT INTO posts (user_id, group_id, title, content)
    VALUES ($1, $2, $3, $4) RETURNING *;
    `,
    [user_id, group_id, title, post_content],
  );

  result.rows[0].user = username;

  return result.rows[0];
};

export const getAllPostsInGroupModel = async (group_id: number) => {
  const posts = await db.query(
    `
    SELECT p.group_id, p.post_id, p.title, p.content, u.username AS creator_username,
    COUNT(c.comment_id) AS comment_count,
    MAX(c.created_at) AS last_comment_date
    FROM posts p
    LEFT JOIN comments c ON c.post_id = p.post_id
    LEFT JOIN users u ON p.user_id = u.user_id
    WHERE p.group_id = $1
    GROUP BY p.group_id, p.post_id, p.title, p.content, u.username;
    `,
    [group_id],
  );

  if (posts.rows.length < 1)
    return Promise.reject({
      errCode: 404,
      errMsg: `Group with ID ${group_id} not found`,
    });

  return posts.rows;
};

export const getAllPostsOfUserModel = async (user_id: number) => {
  const user = await db.query(
    `
    SELECT * FROM users WHERE user_id = $1;
    `,
    [user_id],
  );

  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User does not exist" });

  const posts = await db.query(
    `
      SELECT * FROM posts WHERE user_id = $1
    `,
    [user_id],
  );

  if (posts.rows.length < 1)
    return Promise.reject({
      errCode: 404,
      errMsg: `User with ID ${user_id} not found`,
    });

  return posts.rows;
};
