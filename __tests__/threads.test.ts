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
    email: "test@test2.test",
    password: "password1@",
  });

  const auth = await supertest(app).post("/signin").send({
    email: "test@test2.test",
    password: "password1@",
  });

  token = auth.body.token;
});

afterAll(async () => {
  await db.query("ROLLBACK", []);
  server.close();
  db.pool.end();
});

describe("createThread", () => {
  it("POST 200: Should create a new thread", async () => {
    const res = await supertest(app)
      .post("/threads")
      .set("Authorization", `Bearer ${token}`)
      .send({
        category_id: 1,
        user_id: 1,
        title: "test title",
        content: "test content",
      });

    expect(res.statusCode).toBe(201);
    expect(typeof res.body).toBe("object");
    expect(res.body.thread.user.username).toBe("test");
    expect(res.body.thread.title).toBe("test title");
    expect(res.body.thread.content).toBe("test content");
  });

  it("POST 401: Should return an error if the user is not signed in", async () => {
    const res = await supertest(app).post("/threads").send({
      category_id: 1,
      user_id: 1,
      title: "test titlte",
      content: "test content",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("You need to be logged in");
  });

  it("POST 400: Should return an error when category ID is not found", async () => {
    const res = await supertest(app)
      .post("/threads")
      .set("Authorization", `Bearer ${token}`)
      .send({
        category_id: 24,
        user_id: 1,
        title: "test title",
        content: "test content",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });

  it("POST 400: Should return an error when user ID is not found", async () => {
    const res = await supertest(app)
      .post("/threads")
      .set("Authorization", `Bearer ${token}`)
      .send({
        category_id: 1,
        user_id: 300,
        title: "test title",
        content: "test content",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });
});

describe("get all threads by category_id", () => {
  it("GET 200: Should return all threads of category id", async () => {
    const res = await supertest(app).get("/threads").send({
      category_id: 1,
    });

    const thread = res.body.threads[0];

    expect(res.statusCode).toBe(200);
    expect(thread.creator_username).toBe("test");
    expect(thread.title).toBe("test thread title");
    expect(thread.content).toBe("test thread content");
    expect(thread.thread_id).toBe(1);
    expect(thread.post_count).toBe("2");
    expect(thread.category_id).toBe(1);
  });

  it('GET 400: Should return an error when category ID is not found', async () => {
    const res = await supertest(app).get("/threads").send({
      category_id: 500
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.msg).toBe("ID not found")
  })

  it('GET 400: Should return an error when category ID is not given', async () => {
    const res = await supertest(app).get("/threads").send({})

    expect(res.statusCode).toBe(400)
    expect(res.body.msg).toBe("ID not found")
  })


});
