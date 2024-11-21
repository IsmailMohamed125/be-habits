const app = require("../app");
const db = require("../db/connection.js");
const mongoose = require("mongoose");
const userData = require("../db/data/test data/users")
const users = require("../models/user.js")
const { Habit} = require("../models/habits.js")
const request = require("supertest");
const habitsTestdata = require("../db/data/test data/habits-testdata.js");

const seedDb = async()=>{
  await users.deleteMany({}) 
  await users.insertMany(userData) 
  await Habit.deleteMany({}) 
  await Habit.insertMany(habitsTestdata) 
  }

beforeEach(() => {
  return seedDb().then(()=>{
    })
    .catch((error)=>{
    console.log(error);
    })
});

afterAll(() => {
  mongoose.connection.close();
});

describe("Testing endpoints for MVP", () => {
  test("GET: 200 - Should return a list of habits from a certain user", () => {
    return request(app)
    .get("/api/user/673dc5d257ac55c5c8cc08e4/habits")
    .expect(200)
    .then((({body:{allHabits}}) => {
      expect(allHabits).toHaveLength(2)
      allHabits.forEach(habit=>{
        expect(habit).toHaveProperty("_id")
        expect(habit).toHaveProperty("name")
        expect(habit).toHaveProperty("completed")
        expect(habit).toHaveProperty("build")
        expect(habit).toHaveProperty("difficulty")
        expect(habit).toHaveProperty("frequency")
      })
    }))
  });
  test("PATCH : 201 - Should return completed to be true in the specific task", () => {
    return request(app)
    .patch("/api/user/673dc5d257ac55c5c8cc08e4/habits/673f0fb22188a3795a77a44e")
    .expect(201)
    .then((response => {
      expect(response.body.updatedHabit.completed).toBe(true)
    }))
  });
  test("PATCH : 201 - Should return completed to be true in the specific task", () => {
    return request(app)
    .patch("/api/user/673dc5d257ac55c5c8cc08e4/habits/673f10bcc86765d3bfacc264")
    .expect(201)
    .then((response => {
      expect(response.body.updatedHabit.completed).toBe(false)
    }))
  });
  test("POST : 201 - ", () => {
    const newHabit = {
      "name": "sleep",
      "completed": false,
      "build": true,
      "difficulty": "high",
      "frequency": "weekly"
    }
    return request(app)
    .post("/api/user/673dc5d257ac55c5c8cc08e4/habits")
    .send(newHabit)
    .expect(201)
    .then(({body: {createdHabit}}) => {
      expect(createdHabit).toMatchObject(newHabit)
    })
  });
  test('DELETE : 204', ()=>{
    return request(app)
    .delete("/api/user/673dc5d257ac55c5c8cc08e4/habits/673f10bcc86765d3bfacc264")
    .expect(204)
    .then((response)=>{
      expect(response.body).toEqual({})
    })
  })

});

