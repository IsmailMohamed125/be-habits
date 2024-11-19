const app = require("../app");
const mongoose = require("mongoose");

beforeAll((done) => {
  done();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("", () => {
  test("", () => {});
});
