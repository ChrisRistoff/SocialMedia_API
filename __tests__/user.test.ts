import supertest from "supertest";
import app from "../app"
import * as db from "../db/index"
import { Server } from "http";


describe('Create User', () => {
  let server: Server
  beforeAll(async () => {
    server = app.listen(8080)
    await db.query("BEGIN", [])
  })

  afterAll(async() => {
    await db.query("ROLLBACK", [])
    server.close()
  });

/*
  beforeEach(async () => {
  })

  afterEach(async () => {

  })
*/

  it('should create a new user', async () => {
    const response = await supertest(app)
      .post("/user")
      .send({
        username: "testUser",
        email: "test@test.com",
        password: "password"
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.token).toBeDefined()
  })

  it('should return an error if user already exists', async () => {
     const response2 = await supertest(app)
      .post("/user")
      .send({
        username: "testUser",
        email: "test@test.com",
        password: "password"
      })

    expect(response2.statusCode).toBe(409)
    expect(response2.body.token).not.toBeDefined()
  })

  it('should return an error when missing parameters', async () => {
    const response = await supertest(app)
      .post("/user")
      .send({
        password: "password1"
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe("Missing parameters")
    expect(response.body.token).not.toBeDefined()

    const response2 = await supertest(app)
      .post("/user")
      .send({
        username: "testUser"
      })

    expect(response2.statusCode).toBe(400)
    expect(response2.body.error).toBe("Missing parameters")
    expect(response2.body.token).not.toBeDefined()

    const response3 = await supertest(app)
      .post("/user")
      .send({
        email: "test@test.com"
      })

    expect(response3.statusCode).toBe(400)
    expect(response3.body.error).toBe("Missing parameters")
    expect(response3.body.token).not.toBeDefined()
  })
})

describe('sign in', () => {
  let server: Server
  beforeAll(async () => {
    server = app.listen(8080)
    await db.query("BEGIN", [])
  })

  afterAll(async() => {
    await db.query("ROLLBACK", [])
    server.close()
    await db.pool.end()
  });

  it('should sign in user if it exists', async () => {
    await supertest(app)
      .post("/user")
      .send({
        username: "testUser",
        email: "test@test.com",
        password: "password"
      })

    const response = await supertest(app)
      .post("/signin")
      .send({
        email: "test@test.com",
        password: "password"
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.token).toBeDefined()
  })

  it('wrong password', async () => {
     const response = await supertest(app)
      .post("/signin")
      .send({
        email: "test@test.com",
        password: "pasword"
      })

    expect(response.statusCode).toBe(401)
    expect(response.body.error).toBe("Incorrect password")
    expect(response.body.token).not.toBeDefined()
  })

  it('wrong email', async () => {
     const response = await supertest(app)
      .post("/signin")
      .send({
        email: "testaa@test.com",
        password: "password"
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.error).toBe("No such user")
    expect(response.body.token).not.toBeDefined()
  })
})
