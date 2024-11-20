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
});

