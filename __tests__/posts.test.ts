import supertest from "supertest";
import app from "../app";
import * as db from "../db/index";
import { Server } from "http";

let server: Server;
let token: string;
beforeAll(async () => {
  server = app.listen(0);
  await db.query("BEGIN", []);

  const register = await supertest(app).post("/signup").send({
    username: "tester",
    email: "tester@test.test",
    password: "password1@",
  });

  const auth = await supertest(app).post("/signin").send({
    email: "tester@test.test",
    password: "password1@",
  });

  token = auth.body.token;
});

afterAll(async () => {
  await db.query("ROLLBACK", []);
  server.close();
  db.pool.end();
});

describe("create post in a group", () => {
  it("POST 201: Should create a new post", async () => {
    const res = await supertest(app)
      .post("/group/1/post")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "test title",
        content: "test content",
      });

    expect(res.statusCode).toBe(201);
    expect(typeof res.body).toBe("object");
    expect(res.body.post.user).toBe("tester");
    expect(res.body.post.title).toBe("test title");
    expect(res.body.post.content).toBe("test content");
  });

  it("POST 401: Should return an error if the user is not signed in", async () => {
    const res = await supertest(app).post("/group/1/post").send({
      title: "test title",
      content: "test content",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("You need to be logged in");
  });

  it("POST 400: Should return an error when group ID is not found", async () => {
    const res = await supertest(app)
      .post("/group/24/post")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "test title",
        content: "test content",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });
});

describe("get all posts in a group", () => {
  it("GET 200: Should return all posts", async () => {
    const res = await supertest(app).get("/group/1/posts")

    const post = res.body.posts[0];

    expect(res.statusCode).toBe(200);
    expect(post.creator_username).toBe("test");
    expect(post.title).toBe("test post title");
    expect(post.content).toBe("test post content");
    expect(post.post_id).toBe(1);
    expect(post.comment_count).toBe("2");
    expect(post.group_id).toBe(1);
  });

  it('GET 400: Should return an error when group ID is not found', async () => {
    const res = await supertest(app).get("/group/500/posts")

    expect(res.statusCode).toBe(404)
    expect(res.body.msg).toBe("Group with ID 500 not found")
  })

});

describe('get all posts of user', () => {
  it("GET 200: Should return all posts", async () => {
    const res = await supertest(app).get("/posts/1")


    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.posts)).toBe(true)
    expect(res.body.posts.length).toBe(2)
  });

  it('GET 400: Should return an error when user ID is not found', async () => {
    const res = await supertest(app).get("/posts/2200")

    expect(res.statusCode).toBe(404)
    expect(res.body.msg).toBe("User does not exist")
  })
})
