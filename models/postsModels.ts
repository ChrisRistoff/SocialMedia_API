import * as db from "../db/index"

export const createPostsModel = async (thread_id: number, user_id: number, post_content: string) => {
  try {
    const result = await db.query(`
      INSERT INTO posts (thread_id, user_id, post_content)
      VALUES ($1, $2, $3) RETURNiNG *
    `, [thread_id, user_id, post_content])

    const user = await db.query(`
      SELECT username, created_at FROM users
      WHERE user_id = $1
    `, [user_id])

    result.rows[0].user = user.rows[0]

    return result.rows[0]
  } catch (error) {
    return false
  }
}

export const replyToPostModel = async (post_content: string, user_id: number, thread_id: number, reply_to_post_id: number) => {

  try {
    const result = await db.query(`
      INSERT INTO posts (post_content, user_id, thread_id, reply_to_post_id)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `, [post_content, user_id, thread_id, reply_to_post_id])

    const post = await db.query(`
      SELECT * FROM posts WHERE post_id = $1;
    `, [reply_to_post_id])

    const user = await db.query(`
      SELECT username, created_at FROM users WHERE user_id = $1;
    `, [user_id])

    result.rows[0].post = post.rows[0]
    result.rows[0].user = user.rows[0]

    return result.rows[0]

  } catch (error) {
    return false
  }
}
