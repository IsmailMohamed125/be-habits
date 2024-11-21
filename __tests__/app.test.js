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
  describe("GET",()=>{
    test("200 - Should return a list of habits from a certain user", () => {
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
    test("404 - Should return an error message if the user is not found",()=>{
      return request(app)
      .get("/api/user/673dc5d257ac55c5c8cc0800/habits")
      .expect(404)
      .then(({body})=>{
        expect(body.message).toBe("User not found")
      })
    })
    test("400 - Should return an error message if the user is not a valid ID type",()=>{
      return request(app)
      .get("/api/user/673dc5d257ac55c5c8cc08**/habits")
      .expect(400)
      .then(({body})=>{
        expect(body.message).toBe("Bad request: incorrect user ID format")
      })
    })
    test("400 - Should return an error message if the user ID does not have 24 chars",()=>{
      return request(app)
      .get("/api/user/673dc5d257ac55c5c8cc0/habits")
      .expect(400)
      .then(({body})=>{
        expect(body.message).toBe("Bad request: incorrect user ID format")
      })
    })
  })
  describe('PATCH', ()=>{
    test("201 - Should return completed to be true in the specific task", () => {
      const updateCompleteStatus = {
        _id: "673f0fb22188a3795a77a44e",
        name: "Drink Water",
        completed: true,
        build: true,
        difficulty: "easy",
        frequency: "daily"
      }
      return request(app)
      .patch("/api/user/673dc5d257ac55c5c8cc08e4/habits/673f0fb22188a3795a77a44e")
      .send(updateCompleteStatus)
      .expect(201)
      .then((response => {
        expect(response.body.updatedHabit.completed).toBe(true)
      }))
    });
    test("201 - Should return completed to be true in the specific task", () => {
      const updateCompleteStatus = {
        _id: "673f0fb22188a3795a77a44e",
        name: "Drink bin juice",
        completed: false,
        build: false,
        difficulty: "easy",
        frequency: "daily"
      }
      return request(app)
      .patch("/api/user/673dc5d257ac55c5c8cc08e4/habits/673f0fb22188a3795a77a44e")
      .send(updateCompleteStatus)
      .expect(201)
      .then((response => {
        expect(response.body.updatedHabit.completed).toBe(false)
        expect(response.body.updatedHabit.build).toBe(false)
        expect(response.body.updatedHabit.name).toBe("Drink bin juice")
      }))
    });
    test("404 - Should return error message if the habit is not found", () => {
      const updateCompleteStatus = {
        _id: "673f0fb22188a3795a77a44e",
        name: "Drink bin juice",
        completed: false,
        build: false,
        difficulty: "easy",
        frequency: "daily"
      }
      return request(app)
      .patch("/api/user/673dc5d257ac55c5c8cc08e4/habits/673f0fb22188a3795a77a444")
      .send(updateCompleteStatus)
      .expect(404)
      .then((({body}) => {
        expect(body.message).toBe('Habit not found')
      }))
    });
    test("400 - Should return error message if the habit update body has missing fields", () => {
      const updateCompleteStatus = {
        _id: "673f0fb22188a3795a77a44e",
        completed: false,
        build: false,
        difficulty: "easy",
        frequency: "daily"
      }
      return request(app)
      .patch("/api/user/673dc5d257ac55c5c8cc08e4/habits/673f0fb22188a3795a77a444")
      .send(updateCompleteStatus)
      .expect(400)
      .then((({body}) => {
        expect(body.message).toBe('Bad request: invalid update document')
      }))
    });
  })
  describe('POST',()=>{
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
  })
  describe('DELETE', ()=>{
    test('DELETE : 204', ()=>{
      return request(app)
      .delete("/api/user/673dc5d257ac55c5c8cc08e4/habits/673f10bcc86765d3bfacc264")
      .expect(204)
      .then((response)=>{
        expect(response.body).toEqual({})
      })
    })
    test('DELETE returns 404 when passed a non-existent habit_id', ()=>{
      return request(app)
      .delete("/api/user/673dc5d257ac55c5c8cc08e4/habits/673f10bcc86765d3bfacc200")
      .expect(404)
      .then((response)=>{
        expect(response.body.message).toBe("Habit not found")
      })
    })
  })

});

