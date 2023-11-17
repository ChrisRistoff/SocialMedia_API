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
  it("POST 200: Should create a new user when all the fields are valid", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "testUser",
      email: "test@test.com",
      password: "password1@",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("POST 409: Should return an error if user tries to signup with an exisitng email", async () => {
    const response2 = await supertest(app).post("/signup").send({
      username: "testUser",
      email: "test@test.com",
      password: "password1@",
    });

    expect(response2.statusCode).toBe(409);
    expect(response2.body.msg).toBe("User with this email already exists")
    expect(response2.body.token).not.toBeDefined();
  });

  it("POST 400: Should return an error when username is missing or empty", async () => {
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

  it("POST 400: Should return an error when email is missing or empty", async () => {
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

  it("POST 400: Should return an error when password is empty or missing", async () => {
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

  it("POST 409: Should return an error if user tries to sign up with an existing username", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "username",
      email: "test@test.test",
      password: "password1@"
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.msg).toBe("User with this email already exists");
    expect(response.body.token).not.toBeDefined();
  });

  it("POST 400: Returns an error when password is too short", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "username2",
      email: "test@test2.test",
      password: "pass"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Password needs to be at least 8 characters long");
    expect(response.body.token).not.toBeDefined();
  });

  it("POST 400: Password must contain at least one digit", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "username2",
      email: "test@test2.test",
      password: "password"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Password needs to contain at least one digit");
    expect(response.body.token).not.toBeDefined();
  });

  it("POST 400: Password must contain special characters", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "username2",
      email: "test@test2.test",
      password: "password1"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Password needs to contain at least one special character");
    expect(response.body.token).not.toBeDefined();
 });

  it("POST 409: Username already exists", async () => {
    const response = await supertest(app).post("/signup").send({
      username: "testUser",
      email: "test@test23.test",
      password: "password1@"
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.msg).toBe("Username already taken");
    expect(response.body.token).not.toBeDefined();
  });
});

describe("sign in", () => {
  it("POST 200: User signed in", async () => {
    await supertest(app).post("/signup").send({
      username: "testUser",
      email: "test@test.com",
      password: "password1@",
    });

    const response = await supertest(app).post("/signin").send({
      email: "test@test.com",
      password: "password1@",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("POST 400: Password must be at least 8 characters long", async () => {
    const response = await supertest(app).post("/signin").send({
      email: "test@test.com",
      password: "paswo",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Password needs to be at least 8 characters long");
    expect(response.body.token).not.toBeDefined();
  });

  it("POST 400: Password must contain at least one number", async () => {
    const response = await supertest(app).post("/signin").send({
      email: "test@test.com",
      password: "password",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Password needs to contain at least one digit");
    expect(response.body.token).not.toBeDefined();
  });

  it("POST 400: Password must contain at least one special character", async () => {
    const response = await supertest(app).post("/signin").send({
      email: "test@test.com",
      password: "paswords1",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Password needs to contain at least one special character");
    expect(response.body.token).not.toBeDefined();
  });


  it("POST 404: Return an error when user tries to sign in with non existent email", async () => {
    const response = await supertest(app).post("/signin").send({
      email: "testaa@test.com",
      password: "password1@",
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.msg).toBe("User not found");
    expect(response.body.token).not.toBeDefined();
  });

  it("POST 404: Return an error when email is not valid", async () => {
    const response = await supertest(app).post("/signin").send({
      email: "testaatest.com",
      password: "password1@",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Invalid email");
    expect(response.body.token).not.toBeDefined();
  });
});
