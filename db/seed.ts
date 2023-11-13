import * as db from "./index"
import { thread } from "./seed_data/thread"
import { user } from "./seed_data/user"
import { post } from "./seed_data/post"
import { reply } from "./seed_data/reply"
import { hashPassword } from "../middleware/authMiddleware"
require('dotenv').config()

const seed = async (thread: any, user: any, post: any, reply: any) => {
  try {
    const ctgs = await createCategories()
    console.log(ctgs.rows)
    const usr = await createUser(user)
    console.log(usr.rows)
    const thrd = await createThread(thread)
    console.log(thrd.rows)
    const pst = await createPost(post)
    console.log(pst.rows)
    const rpl = await createReply(reply)
    console.log(rpl.rows)
  } catch (err) {
    console.log(err)
  }
}

const createUser = async (user: any) => {
  user.password = await hashPassword(user.password)
  console.log(user.password)
  return await db.query(`
    INSERT INTO users(username, email, password)
    VALUES ($1, $2, $3) RETURNING *
  `, [user.username, user.email, user.password])
}

const createCategories = async () => {
  return await db.query(`
    INSERT INTO categories(category_name, description) VALUES
    ( 'JavaScript BE', 'Everything JS backend' ),
    ( 'DATABASES', 'Everything DATABASES' ) RETURNING *;
  `, [])
}

const createThread = async (thread: any) => {
  return await db.query(`
    INSERT INTO threads(title, content, category_id, user_id)
    VALUES ($1, $2, $3, $4) RETURNING *
  `, [thread.title, thread.content, thread.category_id, thread.user_id])
}

const createPost = async (post: any) => {
  return await db.query(`
    INSERT INTO posts(post_content, user_id, thread_id)
    VALUES ($1, $2, $3) RETURNING *
  `, [post.post_content, post.user_id, post.thread_id])
}

const createReply = async (reply: any) => {
  return await db.query(`
    INSERT INTO posts(post_content, user_id, thread_id, reply_to_post_id)
    VALUES ($1, $2, $3, $4) RETURNING *
  `, [reply.post_content, reply.user_id, reply.thread_id, reply.reply_to_post_id])
}

seed(thread, user, post, reply).then(() => {
  console.log("Seeding done!")
})
