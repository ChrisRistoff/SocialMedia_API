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
    email: "tester@test.test",
    password: "password1@",
  });

  const auth = await supertest(app).post("/signin").send({
    email: "tester@test.test",
    password: "password1@",
  });

  token = auth.body.token;
  console.log(token)
});

afterAll(async () => {
  server.close();
  db.pool.end();
});

describe("create comment", () => {
  it("POST 201: Should create a new comment", async () => {
    const res = await supertest(app)
      .post("/post/1/comment")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: 1,
        comment_content: "test comment content",
      });

    const comment = res.body.comment;
    expect(res.statusCode).toBe(201);
    expect(comment.user.username).toBe("test");
    expect(comment.comment_content).toBe("test comment content");
  });

  it("POST 401: Should return an error if user is not signed in", async () => {
    const res = await supertest(app).post("/post/1/comment").send({
      user_id: 1,
      content: "test comment content",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("You need to be logged in");
  });

  it("POST 400: Should return an error when comment content is blank", async () => {
    const res = await supertest(app)
      .post("/post/1/comment")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: 1,
        comment_content: "",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Comment content can not be empty")
  });

  it("POST 400: Should return an error when post content is missing", async () => {
    const res = await supertest(app)
      .post("/post/1/comment")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: 1,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Comment content can not be empty")
  });

  it("POST 400: Should return an error if thread ID is not found", async () => {
    const res = await supertest(app)
      .post("/post/45/comment")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: 1,
        comment_content: "test comment content",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });

  it("POST 400: Should return an error if user ID is not found", async () => {
    const res = await supertest(app)
      .post("/post/1/comment")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: 45,
        comment_content: "test comment content",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });

  it("POST 400: Should return an error if comment content is too short", async () => {
    const res = await supertest(app)
      .post("/post/1/comment")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: 1,
        comment_content: "test",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Comment content needs to be at least 10 characters long");
  });
});

describe("replies", () => {
  it("POST 200: Should create a reply", async () => {
    const res = await supertest(app)
      .post("/comment/1/reply")
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_id: 1,
        user_id: 1,
        comment_content: "test reply content",
      });

    expect(res.statusCode).toBe(201);
    const reply = res.body.reply;
    expect(reply.user.username).toBe("test");
    expect(reply.comment_content).toBe("test reply content");
    expect(reply.comment.comment_id).toBe(1);
  });

  it("POST 401: Should return an error when user is not signed in", async () => {
    const res = await supertest(app).post("/comment/1/reply").send({
      post_id: 1,
      user_id: 1,
      comment_content: "test comment content",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("You need to be logged in");
  });
  it("POST 400: Should return an error when comment content is empty", async () => {
    const res = await supertest(app)
      .post("/comment/1/reply")
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_id: 1,
        user_id: 1,
        comment_content: "",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Reply content can not be empty");
  });

  it("POST 400: Should return an error when comment content is too short", async () => {
    const res = await supertest(app)
      .post("/comment/1/reply")
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_id: 1,
        user_id: 1,
        comment_content: "test",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Reply content needs to be at least 10 characters long");
  });

  it("POST 400: Should return an error when reply_to_comment ID can not be found", async () => {
    const res = await supertest(app)
      .post("/comment/5000/reply")
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_id: 1,
        user_id: 1,
        comment_content: "test reply content",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });

  it("POST 400: Should return an error when post ID can not be found", async () => {
    const res = await supertest(app)
      .post("/comment/1/reply")
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_id: 312,
        user_id: 1,
        comment_content: "test reply content",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });

  it("POST 400: Should return an error when user ID can not be found", async () => {
    const res = await supertest(app)
      .post("/comment/1/reply")
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_id: 1,
        user_id: 2000,
        comment_content: "test reply content",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });
});

describe("get all comments to a post", () => {
  it("POST 200: Should return an array of all comments to the user", async () => {
    const res = await supertest(app).get("/post/1/comments")

    console.log(res.body.comments)

    expect(res.statusCode).toBe(200);
    expect(typeof res.body.comments[0]).toBe("object");
    expect(Array.isArray(res.body.comments)).toBe(true);
    expect(res.body.comments.length > 0).toBe(true)

    expect(res.body.comments[0].comment_content).toBe("test comment content")
    expect(res.body.comments[0].username).toBe("test")
    expect(Array.isArray(res.body.comments[0].replies)).toBe(true)
    expect(res.body.comments[0].replies.length > 0).toBe(true)
  });

  it("GET 400: Should return an error when ID can not be found", async () => {
    const res = await supertest(app).get("/post/500/comments")

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });
});
