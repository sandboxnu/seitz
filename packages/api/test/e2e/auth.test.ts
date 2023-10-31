import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import User from "../../src/models/user";

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/seitz-test");
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Tests for password encryption and validation", () => {
  it("should not store raw passwords in the database", (done) => {
    const password = "testcase1";
    const userInfo = {
      email: "testcase1@gmail.com",
      password,
    };
    request(app)
      .post("/auth/signup")
      .send(userInfo)
      .expect(201)
      .then(() => {
        User.findOne({ email: userInfo.email }).then((user) => {
          expect(user).not.toBeNull();
          expect(user?.password).toBeDefined();
          expect(user?.password).not.toEqual(password);
          expect(user?.verifyPassword(password)).resolves.toBeTruthy();
          done();
        });
      });
  });
});
