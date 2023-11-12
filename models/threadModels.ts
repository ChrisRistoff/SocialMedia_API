import * as db from "../db/index"

interface FlexibleObject {
  [key: string]: any;
}

export const createThreadModel = async (user_id: number, category_id: number, title: string, content: string) => {

  try {
    const result: FlexibleObject = await db.query(`
    INSERT INTO threads (user_id, category_id, title, content)
    VALUES ($1, $2, $3, $4) RETURNING *;
    `, [user_id, category_id, title, content])


    const user = await db.query(`SELECT * FROM users WHERE user_id = $1`, [user_id])

    result.rows[0].user = {
      username: user.rows[0].username,
      created_at: user.rows[0].created_at
    }

    return result.rows[0]

  } catch (err) {
    return false
  }
}
