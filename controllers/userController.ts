import { Request, Response } from "express";
import { comparePassword, createJWT, hashPassword } from "../middleware/authMiddleware";
import { createUserModel, singInModel } from "../models/userModels";

export const createUser = async (req: Request, res: Response) => {
  try {
    const username = req.body.username
    const email = req.body.email
    if(!username || !email || !req.body.password) return res.status(400).send({error: "Missing parameters"})
    const password = await hashPassword(req.body.password)


    const user = await createUserModel(username, email, password)

    if(!user) return res.status(409).send({error: "User already exists"})

    if(user === "err") throw new Error()

    const token = createJWT(user)

    res.status(200).send({ token })
  } catch (err) {
    res.status(500).send({error: "Server error"})
  }
}

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await singInModel(email)

    if(!user) return res.status(404).send({ error: "No such user"})
    if(user === "err") throw new Error()

    const isValid = await comparePassword(password, user.password)

    if (!isValid) {
      return res.status(401).send({ error: "Incorrect password" })
    }

    const token = createJWT(user)

    res.status(200).send({ token })

  } catch (err) {
    res.status(400).send({ error: "Invalid input" })
  }
}
