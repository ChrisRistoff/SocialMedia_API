import supertest from "supertest";
import app from "../app";
import * as db from "../db/index";
import { Server } from "http";

let server: Server;
beforeAll(async () => {
  server = app.listen(0);
  await db.query("BEGIN", []);
});

afterAll(async () => {
  await db.query("ROLLBACK", []);
  server.close();
  db.pool.end();
});

describe("Create User", () => {
  it("should create a new user", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "testUser",
      email: "test@test.com",
      password: "password1@",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("should return an error if user already exists", async () => {
    const response2 = await supertest(app).post("/signup").send({
      username: "testUser",
      email: "test@test.com",
      password: "password1@",
    });

    expect(response2.statusCode).toBe(409);
    expect(response2.body.token).not.toBeDefined();
  });

  it("should return an error when username is missing or empty", async () => {
    const response = await supertest(app).post("/signup").send({
      emai: "test@test.test",
      password: "password1",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Username can not be empty");
    expect(response.body.token).not.toBeDefined();

    const response2 = await supertest(app).post("/signup").send({
      username: "",
      emai: "test@test.test",
      password: "password1",
    });

    expect(response2.statusCode).toBe(400);
    expect(response2.body.msg).toBe("Username can not be empty");
    expect(response2.body.token).not.toBeDefined();
  });

  it("should return an error when email is missing or empty", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "username",
      password: "password1",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Email can not be empty");
    expect(response.body.token).not.toBeDefined();

    const response2 = await supertest(app).post("/signup").send({
      username: "asdasda",
      email: "",
      password: "password1",
    });

    expect(response2.statusCode).toBe(400);
    expect(response2.body.msg).toBe("Email can not be empty");
    expect(response2.body.token).not.toBeDefined();
  });

  it("should return an error when password is missing or empty", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "username",
      email: "test@test.test",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Password can not be empty");
    expect(response.body.token).not.toBeDefined();

    const response2 = await supertest(app).post("/signup").send({
      username: "username",
      email: "test@test.test",
      password: "",
    });

    expect(response2.statusCode).toBe(400);
    expect(response2.body.msg).toBe("Password can not be empty");
    expect(response2.body.token).not.toBeDefined();
  });

  it("should return an error when user already exists", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "username",
      email: "test@test.test",
      password: "password1@"
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.msg).toBe("User with this email already exists");
    expect(response.body.token).not.toBeDefined();
  });

  it("should return an error when password is too short", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "username2",
      email: "test@test2.test",
      password: "pass"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Password needs to be at least 8 characters long");
    expect(response.body.token).not.toBeDefined();
  });

  it("should return an error when password does not include a number", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "username2",
      email: "test@test2.test",
      password: "password"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Password needs to contain at least one digit");
    expect(response.body.token).not.toBeDefined();
  });

  it("should return an error when password does not include a special character", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "username2",
      email: "test@test2.test",
      password: "password1"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Password needs to contain at least one special character");
    expect(response.body.token).not.toBeDefined();
 });

  it("should return an error when username is taken by another user", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "testUser",
      email: "test@test2.test",
      password: "password1@"
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.msg).toBe("Username already taken");
    expect(response.body.token).not.toBeDefined();
  });
});

describe.only("sign in", () => {
  it("should sign in user if it exists", async () => {
    await supertest(app).post("/signup").send({
      username: "testUser",
      email: "test@test.com",
      password: "password",
    });

    const response = await supertest(app).post("/signin").send({
      email: "test@test.com",
      password: "password",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("wrong password", async () => {
    const response = await supertest(app).post("/signin").send({
      email: "test@test.com",
      password: "pasword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Incorrect password");
    expect(response.body.token).not.toBeDefined();
  });

  it("wrong email", async () => {
    const response = await supertest(app).post("/signin").send({
      email: "testaa@test.com",
      password: "password",
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("No such user");
    expect(response.body.token).not.toBeDefined();
  });
});
