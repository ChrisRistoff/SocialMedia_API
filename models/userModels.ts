import * as db from "../db/index"

export const createUserModel = async (username: string, email: string, password: string) => {

  try {
    const existingUser = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    )

    if (existingUser.rows.length > 0) return

    const user = await db.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username`, [username, email, password])

    return user.rows[0]

  } catch (err) {
    console.log(err)
    return "err"
  }
}


export const singInModel = async (email: string) => {
  try {
    const user = await db.query(`SELECT * FROM USERS WHERE email=$1`, [email])

    if (!user) return

    return user.rows[0]

  } catch (err) {
    console.log(err)
    return "err"
  }
}
