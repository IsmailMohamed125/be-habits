const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

beforeEach(async () => {
  await mongoose.connect(process.env.DBCONNECTIONSTRING);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("GET /api/users", () => {
  it("should return all products", async () => {
    const res = await request(app).get("/api/users");
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
  it("Should return an array of objects", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
        res.body.forEach((user) => {
          expect(user).toMatchObject({
            _id: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
            dailyHabits: expect.any(Array),
            weeklyHabits: expect.any(Array),
            __v: expect.any(Number)
          });
        });
      });
  });

  describe("GET /api/users/:user_id/habits", () => {
    it("should return all products", async () => {
      const res = await request(app).get("/api/users/:user_id/habits");
      console.log(res.body.dailyHabits);
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

