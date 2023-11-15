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

afterAll(async () => {
  await db.query("ROLLBACK", [])
  server.close()
  db.pool.end()
});

describe('createThread', () => {
  it('should not create a new thread if user is not signed in', async () => {
    const res = await supertest(app)
      .post("/threads")
      .send({
        category_id: 1,
        user_id: 1,
        title: "test titlte",
        content: "test content"
      })

    expect(res.statusCode).toBe(401)
    expect(res.body.error).toBe("You need to be logged in")
  })

  it('should create a new post if user is logged in', async () => {
    const res = await supertest(app)
      .post("/threads")
      .set('Authorization', `Bearer ${token}`)
      .send({
        category_id: 1,
        user_id: 1,
        title: "test title",
        content: "test content"
      })

    expect(res.statusCode).toBe(201)
    expect(typeof res.body).toBe("object")
    expect(res.body.thread.user.username).toBe("test")
    expect(res.body.thread.title).toBe("test title")
    expect(res.body.thread.content).toBe("test content")
  })

  it('should return an error if any of the IDs are wrong', async () => {
    const res = await supertest(app)
      .post("/threads")
      .set('Authorization', `Bearer ${token}`)
      .send({
        category_id: 24,
        user_id: 1,
        title: "test title",
        content: "test content"
      })

    expect(res.statusCode).toBe(500)
    expect(res.body.error).toBe("Internal server error")

    const res2 = await supertest(app)
      .post("/threads")
      .set('Authorization', `Bearer ${token}`)
      .send({
        category_id: 1,
        user_id: 25,
        title: "test title",
        content: "test content"
      })

    expect(res2.statusCode).toBe(500)
    expect(res2.body.error).toBe("Internal server error")
  })
})

describe('get all threads by category_id', () => {
  it('should return threads when given an id', async () => {
    const res = await supertest(app)
      .get("/threads")
      .send({
        category_id: 1
      })

    const thread = res.body.threads[0]

    expect(res.statusCode).toBe(200)
    expect(thread.creator_username).toBe("test")
    expect(thread.title).toBe("test thread title")
    expect(thread.content).toBe("test thread content")
    expect(thread.thread_id).toBe(1)
    expect(thread.post_count).toBe("2")
    expect(thread.category_id).toBe(1)
  })
})
