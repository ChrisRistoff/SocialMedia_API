import { Request, Response, NextFunction } from "express";
import * as db from "../db/index"
import { comparePassword, createJWT, hashPassword } from "../middleware/authMiddleware";

export const createUser = async (req: Request, res: Response) => {
  try {
    const username = req.body.username
    const email = req.body.email
    const password = await hashPassword(req.body.password)

    const existingUser = await db.query(
      `SELECT * FROM users WHERE username = $1 OR email = $2`,
      [username, email]
    )

    if (existingUser.rows.length) return res.status(409).send({error: "Username or email taken"})

    const user = await db.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username`, [username, email, password])

    const token = createJWT(user.rows[0])

    res.status(200).send({ token })
  } catch (err) {
    console.log(err)
    res.status(500).send({error: "Server error"})
  }
}

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await db.query(`SELECT * FROM users WHERE email=$1`, [email])

    if(!user) {
      return res.status(404).send({ error: "No such user"})
    }

    const isValid = await comparePassword(password, user.rows[0].password)

    if (!isValid) {
      return res.status(404).send({ error: "Incorrect password" })
    }

    const token = createJWT(user.rows[0])

    res.status(200).send({ token })
  } catch (err) {
    res.status(400).send({ error: "Invalid input" })
  }
}
