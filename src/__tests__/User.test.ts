import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";
import createConnection from "../database";

describe("Users", async () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to creat a new user", async () => {
    const response = await request(app).post("/Users").send({
      email: "test@test.com",
      name: "test",
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to creat a new user with exist email", async () => {
    const response = await request(app).post("/Users").send({
      email: "test@test.com",
      name: "test",
    });

    expect(response.status).toBe(400);
  });
});
