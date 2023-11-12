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
