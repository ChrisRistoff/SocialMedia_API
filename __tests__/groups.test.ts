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
});

afterAll(async () => {
  server.close();
  db.pool.end();
});

describe("create group", () => {
  it("POST 201: Should create a new group", async () => {
    const res = await supertest(app)
      .post("/groups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        group_name: "new test group",
        description: "new test group description",
        user_id: 1,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.group.group_name).toBe("new test group");
    expect(res.body.group.description).toBe("new test group description");
  });

  it("POST 409: Should return an error when user is not authorized", async () => {
    const res = await supertest(app).post("/groups").send({
      group_name: "new test group",
      description: "new test group description",
      user_id: 4,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("You need to be logged in");
  });

  it("POST 400: Should return an error when group name is missing", async () => {
    const res = await supertest(app)
      .post("/groups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "new test group description",
        user_id: 4,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Group name can not be empty");
  });

  it("POST 400: Should return an error when group name is empty", async () => {
    const res = await supertest(app)
      .post("/groups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        group_name: "",
        description: "new test group description",
        user_id: 4,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Group name can not be empty");
  });

  it("POST 400: Should return an error when description is missing", async () => {
    const res = await supertest(app)
      .post("/groups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        group_name: "test group name",
        user_id: 4,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Group description can not be empty");
  });

  it("POST 400: Should return an error when description is empty", async () => {
    const res = await supertest(app)
      .post("/groups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        group_name: "test group name",
        description: "",
        user_id: 4,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Group description can not be empty");
  });

  it("POST 400: Should return an error when description is too short", async () => {
    const res = await supertest(app)
      .post("/groups")
      .set("Authorization", `Bearer ${token}`)
      .send({
        group_name: "test group name",
        description: "test",
        user_id: 4,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe(
      "Group description needs to be at least 10 characters long",
    );
  });

});

describe("join a group as a member", () => {
  it("POST 201: Should return a message saying user successfully joined the group", async () => {
    const res = await supertest(app)
      .post("/join_group/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ user_id: 4 });

    expect(res.statusCode).toBe(201);
    expect(res.body.msg).toBe("You have successfully joined the group");
  });

  it("POST 409: Should return an error if a user who is part of the group tries to join it", async () => {
    await supertest(app)
      .post("/join_group/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ user_id: 4 });

    const res = await supertest(app)
      .post("/join_group/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ user_id: 4 });

    expect(res.statusCode).toBe(409);
    expect(res.body.msg).toBe("You are already a member of the group");
  });

  it("POST 400: Should return an error when group ID can not be found", async () => {
    const res = await supertest(app)
      .post("/join_group/100")
      .set("Authorization", `Bearer ${token}`)
      .send({ user_id: 4 });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("ID not found");
  });
});

describe("get all members of a group", () => {
  it("POST 200: Should return all members of a group to the user", async () => {
    const res = await supertest(app).get("/group/1/members");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.members)).toBe(true);
    expect(res.body.members.length).toBe(3);
    expect(res.body.members[0].username).toBe("test");
    expect(res.body.members[2].username).toBe("test3");
  });

  it("POST 400: Should return an error when group ID is not found", async () => {
    const res = await supertest(app).get("/group/123/members");

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Group with ID 123 not found");
  });
});

describe('get all groups of a user', () => {
  it('POST 200: Should return an array of all groups a user has joined', async () => {
    const res = await supertest(app).get("/user/1/groups")

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.groups)).toBe(true)
    expect(res.body.groups.length > 0).toBe(true)
  })
})
