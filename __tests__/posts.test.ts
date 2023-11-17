import supertest from "supertest";
import app from "../app";
import * as db from "../db/index";
import { Server } from "http";

beforeEach(async () => {
  await db.query("BEGIN", []);
});

afterEach(async () => {
  await db.query("ROLLBACK", []);
});

let server: Server;
let token: string;
beforeAll(async () => {
  server = app.listen(0);

  await supertest(app).post("/signup").send({
    username: "tester",
    email: "test@test2.test",
    password: "password1@",
  });

  const auth = await supertest(app).post("/signin").send({
    email: "test@test2.test",
    password: "password1@",
  });

  token = auth.body.token;
  console.log(token)
});

afterAll(async () => {
  server.close();
  db.pool.end();
});

describe("create post", () => {
  it("POST 401: Should return an error if user is not signed in", async () => {
    const res = await supertest(app).post("/posts").send({
      thread_id: 1,
      user_id: 1,
      content: "test post content",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("You need to be logged in");
  });

  it("POST 201: Should create a new post", async () => {
    const res = await supertest(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 1,
        post_content: "test post content",
      });

    const post = res.body.post;
    expect(res.statusCode).toBe(201);
    expect(post.user.username).toBe("test");
    expect(post.post_content).toBe("test post content");
  });

  it("POST 400: Should return an error when post content is blank", async () => {
    const res = await supertest(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 1,
        post_content: "",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Post content can not be empty")
  });

  it("POST 400: Should return an error when post content is missing", async () => {
    const res = await supertest(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 1,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Post content can not be empty")
  });

  it("POST 400: Should return an error if thread ID is not found", async () => {
    const res = await supertest(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 45,
        user_id: 1,
        post_content: "test post content",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });

  it("POST 400: Should return an error if user ID is not found", async () => {
    const res = await supertest(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 45,
        post_content: "test post content",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });

  it("POST 400: Should return an error if post content is too short", async () => {
    const res = await supertest(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 45,
        post_content: "test",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Post content needs to be at least 10 characters long");
  });
});

describe("replies", () => {
  it("POST 401: Should return an error when user is not signed in", async () => {
    const res = await supertest(app).post("/posts").send({
      thread_id: 1,
      user_id: 1,
      post_content: "test post content",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("You need to be logged in");
  });

  it("POST 200: Should create a reply", async () => {
    const res = await supertest(app)
      .post("/replies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 1,
        post_content: "test reply content",
        reply_to_post_id: 1,
      });

    expect(res.statusCode).toBe(201);
    const reply = res.body.reply;
    expect(reply.user.username).toBe("test");
    expect(reply.post_content).toBe("test reply content");
    expect(reply.post.post_id).toBe(1);
  });

  it("POST 400: Should return an error when post content is empty", async () => {
    const res = await supertest(app)
      .post("/replies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 1,
        post_content: "",
        reply_to_post_id: 1,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Reply content can not be empty");
  });

  it("POST 400: Should return an error when post content is too short", async () => {
    const res = await supertest(app)
      .post("/replies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 1,
        post_content: "test",
        reply_to_post_id: 1,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Reply content needs to be at least 10 characters long");
  });

  it("POST 400: Should return an error when reply_to_post ID can not be found", async () => {
    const res = await supertest(app)
      .post("/replies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 1,
        post_content: "test reply content",
        reply_to_post_id: 50000,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });

  it("POST 400: Should return an error when thread ID can not be found", async () => {
    const res = await supertest(app)
      .post("/replies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 312,
        user_id: 1,
        post_content: "test reply content",
        reply_to_post_id: 1,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });

  it("POST 400: Should return an error when user ID can not be found", async () => {
    const res = await supertest(app)
      .post("/replies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        thread_id: 1,
        user_id: 2000,
        post_content: "test reply content",
        reply_to_post_id: 1,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });
});

describe("get all posts", () => {
  it("POST 200: Should return an array of all posts to the user", async () => {
    const res = await supertest(app).get("/posts").send({ thread_id: 1 });

    expect(res.statusCode).toBe(200);
    expect(typeof res.body.posts[0]).toBe("object");
    expect(Array.isArray(res.body.posts)).toBe(true);
    expect(res.body.posts.length > 0).toBe(true)
  });

  it("POST 400: Should return an error when ID can not be found", async () => {
    const res = await supertest(app).get("/posts").send({ thread_id: 5000 });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });

  it("POST 400: Should return an error if ID is not found", async () => {
    const res = await supertest(app).get("/posts").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });

});
