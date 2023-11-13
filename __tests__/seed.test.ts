import * as db from "../db/index"
require("dotenv").config()

afterAll(() => db.pool.end())

describe('seed', () => {
  describe('user', () => {
    it('user is created', async () => {
      const res = await db.query(`
        SELECT * FROM users WHERE username = 'test'
      `, [])

      const user = res.rows[0]
      expect(user).toHaveProperty("user_id")
      expect(user).toHaveProperty("username")
      expect(user).toHaveProperty("email")
      expect(user).toHaveProperty("password")
      expect(user.user_id).toBe(1)
      expect(user.username).toBe("test")
      expect(user.email).toBe("test@test.test")
    })
  })

  describe('categories', () => {
    it('categories are created', async () => {
      const res = await db.query(`
        SELECT * FROM categories;
      `, [])

      const category = res.rows[0]
      expect(category).toHaveProperty("category_name")
      expect(category).toHaveProperty("description")
      expect(category.category_name).toBe("JavaScript BE")
      expect(category.description).toBe("Everything JS backend")
      expect(category.category_id).toBe(1)

      const category1 = res.rows[1]
      expect(category1).toHaveProperty("category_name")
      expect(category1).toHaveProperty("description")
      expect(category1.category_name).toBe("DATABASES")
      expect(category1.description).toBe("Everything DATABASES")
      expect(category1.category_id).toBe(2)
    })
  })

  describe('threads', () => {
    it('thread is created', async () => {
      const res = await db.query(`
        SELECT * FROM threads WHERE thread_id = 1;
      `, [])

      const thread = res.rows[0]
      expect(thread).toHaveProperty("title")
      expect(thread).toHaveProperty("content")
      expect(thread).toHaveProperty("category_id")
      expect(thread).toHaveProperty("user_id")
      expect(thread.title).toBe("test thread title")
      expect(thread.content).toBe("test thread content")
      expect(thread.category_id).toBe(1)
      expect(thread.user_id).toBe(1)
    })
  })

  describe('posts', () => {
    it('post is created', async () => {
      const res = await db.query(`
        SELECT * FROM posts WHERE post_id = 1
      `, [])

      const post = res.rows[0]
      expect(post).toHaveProperty("post_content")
      expect(post).toHaveProperty("thread_id")
      expect(post).toHaveProperty("user_id")
      expect(post.post_content).toBe("test post content")
      expect(post.thread_id).toBe(1)
      expect(post.user_id).toBe(1)
    })
  })

  describe('replies', () => {
    it('reply is created', async () => {
      const res = await db.query(`
        SELECT * FROM posts WHERE post_content = 'test reply content'
      `, [])

      const reply = res.rows[0]
      expect(reply).toHaveProperty("post_content")
      expect(reply).toHaveProperty("user_id")
      expect(reply).toHaveProperty("thread_id")
      expect(reply).toHaveProperty("reply_to_post_id")
      expect(reply.post_content).toBe("test reply content")
      expect(reply.user_id).toBe(1)
      expect(reply.thread_id).toBe(1)
      expect(reply.reply_to_post_id).toBe(1)
    })
  })
})
