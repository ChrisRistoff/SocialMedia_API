import supertest from "supertest";
import app from "../app";
import * as db from "../db/index"
import { Server } from "http";

describe('create post', () => {
  let server: Server
  let token: string
  beforeAll(async () => {
    server = app.listen(8080)
    await db.query("BEGIN", [])

    const auth = await supertest(app)
      .post("/signin")
      .send({
        email: "krsnhrstv@gmail.com",
        password: "krasen"
      })

    token = auth.body.token
  })

  afterAll(async() => {
    await db.query("ROLLBACK", [])
    server.close()
    db.pool.end()
  });

  describe('create post', () => {
    it('should not create a new post if user is not authorised', async () => {
      const res = await supertest(app)
        .post("/posts")
        .send({
          thread_id: 26,
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
          thread_id: 26,
          user_id: 1,
          post_content: "test post content"
        })

      const post = res.body.post
      expect(res.statusCode).toBe(201)
      expect(post.user.username).toBe("krasen")
      expect(post.post_content).toBe("test post content")
    })
  })

  it('should return error if post_content is blank', async() => {
    const res = await supertest(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 26,
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
        thread_id: 26,
        user_id: 145,
        post_content: "test post content"
      })

    expect(res2.statusCode).toBe(500)
    expect(res2.body.error).toBe("Internal server error")
  })

})
