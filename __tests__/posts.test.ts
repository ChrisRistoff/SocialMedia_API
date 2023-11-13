import supertest from "supertest";
import app from "../app";
import * as db from "../db/index"
import { Server } from "http";

let server: Server
let token: string
beforeAll(async () => {
  server = app.listen(0)
  await db.query("BEGIN", [])

  const register = await supertest(app)
    .post("/signup")
    .send({
      username: "test",
      email: "test@test.test",
      password: "test"
    })

  const auth = await supertest(app)
    .post("/signin")
    .send({
      email: "test@test.test",
      password: "test"
    })

  token = auth.body.token
})

afterAll(async() => {
  await db.query("ROLLBACK", [])
  server.close()
  db.pool.end()
});

describe('create post', () => {
  describe('create post', () => {
    it('should not create a new post if user is not authorised', async () => {
      const res = await supertest(app)
        .post("/posts")
        .send({
          thread_id: 1,
          user_id: 1,
          content: "test post content"
        })

      expect(res.statusCode).toBe(401)
      expect(res.body.error).toBe("You need to be logged in")
    })

    it('should create a new post when the user is logged in', async() => {
       const res = await supertest(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          thread_id: 1,
          user_id: 1,
          post_content: "test post content"
        })

      const post = res.body.post
      expect(res.statusCode).toBe(201)
      expect(post.user.username).toBe("test")
      expect(post.post_content).toBe("test post content")
    })
  })

  it('should return error if post_content is blank', async() => {
    const res = await supertest(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 1,
        post_content: ""
      })

      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe("Missing parameters")
  })

  it('should return an error if any of the IDs are wrong', async() => {
    const res = await supertest(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 45,
        user_id: 1,
        post_content: "test post content"
      })

    expect(res.statusCode).toBe(500)
    expect(res.body.error).toBe("Internal server error")


    const res2 = await supertest(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 145,
        post_content: "test post content"
      })

    expect(res2.statusCode).toBe(500)
    expect(res2.body.error).toBe("Internal server error")
  })


  describe('replies', () => {

    it('should return an error when the user is not signed in', async () => {
      const res = await supertest(app)
        .post("/posts")
        .send({
          thread_id: 1,
          user_id: 1,
          post_content: "test post content"
      })

      expect(res.statusCode).toBe(401)
      expect(res.body.error).toBe("You need to be logged in")
    })

    it('should create a new reply when all of the parameters are given', async () => {
      const res = await supertest(app)
        .post("/replies")
        .set("Authorization", `Bearer ${token}`)
        .send({
          thread_id: 1,
          user_id: 1,
          post_content: "test reply content",
          reply_to_post_id: 1
      })

      expect(res.statusCode).toBe(201)
      const reply = res.body.reply
      expect(reply.user.username).toBe("test")
      expect(reply.post_content).toBe("test reply content")
      expect(reply.post.post_id).toBe(1)
    })

    it('should throw an error when content is empty', async () => {
       const res = await supertest(app)
        .post("/replies")
        .set("Authorization", `Bearer ${token}`)
        .send({
          thread_id: 1,
          user_id: 1,
          post_content: "",
          reply_to_post_id: 1
      })

      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe("Missing parameters")

    })

    it('should throw an error when wrong IDs are given', async () => {
      const res = await supertest(app)
        .post("/replies")
        .set("Authorization", `Bearer ${token}`)
        .send({
          thread_id: 1,
          user_id: 1,
          post_content: "test reply content",
          reply_to_post_id: 50000
      })

      expect(res.statusCode).toBe(500)
      expect(res.body.error).toBe("Internal server error")

      const res2 = await supertest(app)
        .post("/replies")
        .set("Authorization", `Bearer ${token}`)
        .send({
          thread_id: 1,
          user_id: 5000,
          post_content: "test reply content",
          reply_to_post_id: 1
      })

      expect(res2.statusCode).toBe(500)
      expect(res2.body.error).toBe("Internal server error")

      const res3 = await supertest(app)
        .post("/replies")
        .set("Authorization", `Bearer ${token}`)
        .send({
          thread_id: 5000,
          user_id: 1,
          post_content: "test reply content",
          reply_to_post_id: 1
      })

      expect(res3.statusCode).toBe(500)
      expect(res3.body.error).toBe("Internal server error")
    })
  })

  describe('get all posts', () => {
    it('should return an error if thread ID is not existent', async () => {
      const res = await supertest(app)
        .get("/posts")
        .send({thread_id: 5000})

      expect(res.statusCode).toBe(500)
      expect(res.body.error).toBe("Internal server error")
    })

    it('should return an error when ID is not provided', async () => {
       const res = await supertest(app)
        .get("/posts")
        .send({})

      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe("Missing parameters")
    })

    it('should return all post in an array of objects', async () => {
      const res = await supertest(app)
        .get("/posts")
        .send({thread_id: 1})

      expect(res.statusCode).toBe(200)
      expect(typeof res.body.posts[0]).toBe("object")
      expect(Array.isArray(res.body.posts)).toBe(true)
    })
  })

})
