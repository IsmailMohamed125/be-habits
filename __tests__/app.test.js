const app = require("../app");
const request = require("supertest");
const { disconnectDB } = require("../db/connection");
const data = require("../db/data/test-data/index");
const { seed, dropUsers } = require("../db/seed/seed");
const endpoints = require("../endpoints.json");

afterEach(async () => {
  try {
    await seed(data);
  } catch (error) {
    console.log(error);
  }
});

console.log(process.env.NODE_ENV);
const userToken = process.env.TEST_USER_TOKEN;
if (!userToken) {
  throw new Error("Provide a TEST_USER_TOKEN env variable for testing");
}

afterAll(async () => {
  await disconnectDB();
});

describe("MVP ENDPOINTS", () => {
  describe("All Bad Endpoints", () => {
    test("GET:404 - Responds with a status of 404 and a message of 'Route not Found'", async () => {
      const {
        body: { message },
      } = await request(app).get("/api/BAD-ENDPOINT").expect(404);
      expect(message).toBe("Route not Found");
    });
    test("POST:404 - Responds with a status of 404 and a message of 'Route not Found'", async () => {
      const {
        body: { message },
      } = await request(app).post("/api/BAD-ENDPOINT").send({}).expect(404);
      expect(message).toBe("Route not Found");
    });
    test("PATCH:404 - Responds with a status of 404 and a message of 'Route not Found'", async () => {
      const {
        body: { message },
      } = await request(app).patch("/api/BAD-ENDPOINT").send({}).expect(404);
      expect(message).toBe("Route not Found");
    });
    test("DELETE:404 - Responds with a status of 404 and a message of 'Route not Found'", async () => {
      const {
        body: { message },
      } = await request(app).delete("/api/BAD-ENDPOINT").expect(404);
      expect(message).toBe("Route not Found");
    });
  });
  describe("API Endpoint", () => {
    describe("GET:/api/v1", () => {
      test("GET:200 - Responds with an object detailing all of the available API endpoints", () => {
        return request(app)
          .get("/api/v1")
          .expect(200)
          .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints);
          });
      });
    });
  });
  describe("Users endpoints", () => {
    describe("GET:/api/v1/user", () => {
      test("GET:200 - Responds with an array containing correctly formated user objects", async () => {
        const {
          body: {
            data: { user },
          },
        } = await request(app)
          .get("/api/v1/user")
          .auth(userToken, { type: "bearer" })
          .expect(200);

        expect(user).toMatchObject({
          _id: expect.any(String),
          clerkID: expect.any(String),
          email: expect.any(String),
          __v: expect.any(Number),
          habits: expect.any(Array),
          id: expect.any(String),
        });
      });
    });
    describe("POST:/api/v1/user", () => {
      beforeAll(async () => {
        try {
          await dropUsers();
        } catch (error) {
          console.log(error);
        }
      });
      test("POST:201 - Responds with a correctly formated user object", async () => {
        const {
          body: {
            data: { user },
          },
        } = await request(app)
          .post("/api/v1/user")
          .auth(userToken, { type: "bearer" })
          .expect(201);
        expect(user).toMatchObject({
          _id: expect.any(String),
          clerkID: expect.any(String),
          email: expect.any(String),
          __v: expect.any(Number),
          id: expect.any(String),
        });
      });
      test("POST:400 - Responds with an error when attempting to make a POST request with non-unique fields", async () => {
        const {
          body: { message },
        } = await request(app)
          .post("/api/v1/user")
          .auth(userToken, { type: "bearer" })
          .expect(400);
        expect(message).toBe(
          'Duplicate field value: "test@test.com". Use another value'
        );
      });
    });
  });
  describe("Habits endpoints", () => {
    describe("GET:/api/v1/habit", () => {
      test("GET:200 - Responds with an array containing correctly formated habit objects", async () => {
        const {
          body: {
            data: { habits },
          },
        } = await request(app)
          .get("/api/v1/habit")
          .auth(userToken, { type: "bearer" })
          .expect(200);
        expect(habits.length).not.toBe(0);
        habits.forEach((habit) => {
          expect(habit).toMatchObject({
            _id: expect.any(String),
            user: expect.any(String),
            name: expect.any(String),
            completed: expect.any(Boolean),
            build: expect.any(Boolean),
            difficulty: expect.any(String),
            frequency: expect.any(String),
            __v: expect.any(Number),
            id: expect.any(String),
          });
        });
      });
      test("GET:400 - Responds with an error when attempting to GET a resource with a invalid sort fields", async () => {
        const {
          body: { message },
        } = await request(app)
          .get("/api/v1/habit?build=99")
          .auth(userToken, { type: "bearer" })
          .expect(400);
        expect(message).toBe("Invalid build: 99");
      });
    });
    describe("POST:/api/v1/habit", () => {
      test("POST:201 - Responds with a correctly formated habit object", async () => {
        const {
          body: {
            data: { habit },
          },
        } = await request(app)
          .post("/api/v1/habit")
          .send({
            name: "test",
            completed: true,
            build: false,
            difficulty: "medium",
            frequency: "weekly",
          })
          .auth(userToken, { type: "bearer" })
          .expect(201);
        expect(habit).toMatchObject({
          _id: expect.any(String),
          user: expect.any(String),
          name: "test",
          completed: true,
          build: false,
          difficulty: "medium",
          frequency: "weekly",
          __v: expect.any(Number),
          id: expect.any(String),
        });
      });
      test("POST:400 - Responds with an error when attempting to make a POST request with invalid field values", async () => {
        const {
          body: { message },
        } = await request(app)
          .post("/api/v1/habit")
          .send({
            name: "test",
            completed: true,
            build: false,
            difficulty: "invalid",
            frequency: "invalid",
          })
          .auth(userToken, { type: "bearer" })
          .expect(400);
        expect(message).toBe(
          "Invalid input data. Difficulty is either: easy, medium or hard. Frequency is either: daily or weekly"
        );
      });
    });
    describe("PATCH:/api/v1/habit/:habit_id", () => {
      test("PATCH:200 - Responds with a correctly updated habit object", async () => {
        const {
          body: {
            data: { habit },
          },
        } = await request(app)
          .patch("/api/v1/habit/67444f155812435d9461f3fe")
          .send({ completed: true })
          .auth(userToken, { type: "bearer" })
          .expect(200);
        expect(habit).toMatchObject({
          _id: "67444f155812435d9461f3fe",
          user: "user_2pIG5dA2bwWP4GIBFpPVLZSfgSO",
          name: "Meal Prep",
          completed: true,
          build: true,
          difficulty: "hard",
          frequency: "weekly",
          __v: 0,
          id: "67444f155812435d9461f3fe",
        });
      });
      test("PATCH:400 - Responds with an error when attempting to PATCH a resource with a body that has some invalid fields", async () => {
        const {
          body: { message },
        } = await request(app)
          .patch("/api/v1/habit/67444f155812435d9461f3fe")
          .send({ user: "993030" })
          .auth(userToken, { type: "bearer" })
          .expect(400);
        expect(message).toBe("Invalid field");
      });
      test("PATCH:400 - Responds with an error when attempting to make a POST request with valid fields but the value of a field is invalid", async () => {
        const {
          body: { message },
        } = await request(app)
          .patch("/api/v1/habit/67444f155812435d9461f3fe")
          .send({ completed: 99 })
          .auth(userToken, { type: "bearer" })
          .expect(400);
        expect(message).toBe("Invalid completed: 99");
      });
      test("PATCH:400 - Responds with an error when attempting to PATCH a resource by an invalid ID", async () => {
        const {
          body: { message },
        } = await request(app)
          .patch("/api/v1/habit/notAnId")
          .send({ completed: true })
          .auth(userToken, { type: "bearer" })
          .expect(400);
        expect(message).toBe("Invalid _id: notAnId");
      });
    });
    describe("DELETE:/api/v1/habit/:habit_id", () => {
      test("DELETE:204 - Responds with no content", async () => {
        const { body } = await request(app)
          .delete("/api/v1/habit/67444f155812435d9461f3fe")
          .auth(userToken, { type: "bearer" })
          .expect(204);
        expect(body).toEqual({});
      });
      test("DELETE: 404 - Attempting to DELETE a resource that does not exist", async () => {
        const {
          body: { message },
        } = await request(app)
          .delete("/api/v1/habit/67431e3753c969fded85d70c")
          .auth(userToken, { type: "bearer" })
          .expect(404);
        expect(message).toBe("No habit found with that ID");
      });
      test("DELETE: 400 - Attempting to DELETE a resource referenced by an invalid ID", async () => {
        const {
          body: { message },
        } = await request(app)
          .delete("/api/v1/habit/notAnId")
          .auth(userToken, { type: "bearer" })
          .expect(400);
        expect(message).toBe("Invalid _id: notAnId");
      });
    });
  });
});
