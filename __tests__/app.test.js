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
    .then((response => {
      expect(response.body.habits).toHaveProperty("dailyHabits")
    }))
  });
  test("PATCH : 201 - Should return completed to be true in the specific task", () => {
    return request(app)
    .patch("/api/user/673dc5d257ac55c5c8cc08e4/habits/daily1")
    .expect(201)
    .then((response => {
      expect(response.body.updatedHabit.dailyHabits[0].completed).toBe(true)
    }))
  });
  test("PATCH : 201 - Should return completed to be true in the specific task", () => {
    return request(app)
    .patch("/api/user/673dc5d257ac55c5c8cc08e4/habits/weekly1")
    .expect(201)
    .then((response => {
      expect(response.body.updatedHabit.weeklyHabits[0].completed).toBe(false)
    }))
  });
  test("POST : 201 - ", () => {
    return request(app)
    .post("/api/user/673dc5d257ac55c5c8cc08e4/habits?frequency=weekly")
    .send({
      "name": "sleep",
      "completed": "false",
      "build": true,
      "dailyComment": "",
      "difficulty": "high"
    })
    .expect(201)
    .then((response => {
      expect(response.body.updatedHabit.weeklyHabits).toHaveLength(2)
    }))
  });
});

