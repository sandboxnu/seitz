import mongoose, { HydratedDocument } from "mongoose";
import request from "supertest";

import app from "../../src/app";
import { Car } from "../../src/models";
import type { ICar } from "@seitz/shared";

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/seitz-test");
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("/example", () => {
  describe("GET /", () => {
    it("returns [] when there is no data", async () => {
      const response = await request(app).get("/example/").expect(200);
      expect(response.body).toEqual([]);
    });

    describe("with data", () => {
      let car: HydratedDocument<ICar>;

      beforeEach(async () => {
        car = await Car.create({
          make: "Chevy",
          model: "Malibu",
          year: 2018,
          miles: 40000,
        });
      });

      it("returns all cars", async () => {
        const response = await request(app).get("/example/").expect(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]._id.toString()).toEqual(car._id.toString());
        expect(response.body[0].make).toEqual(car.make);
      });
    });
  });

  describe("GET /:id", () => {
    let car: HydratedDocument<ICar>;

    beforeEach(async () => {
      car = await Car.create({
        make: "Chevy",
        model: "Malibu",
        year: 2018,
        miles: 40000,
      });
    });

    it("responds 404 when not found", async () => {
      const bad_id = new mongoose.Types.ObjectId();
      await request(app)
        .get("/example/" + bad_id.toString())
        .expect(404);
    });

    it("responds with data when found", async () => {
      const response = await request(app)
        .get("/example/" + car._id.toString())
        .expect(200);
      expect(response.body._id.toString()).toEqual(car._id.toString());
      expect(response.body.make).toEqual(car.make);
    });
  });

  describe("POST /", () => {
    it("fails when fields are missing", async () => {
      const incompleteCar = {
        make: "Chevy",
        model: "Malibu",
      };

      const response = await request(app)
        .post("/example")
        .send(incompleteCar)
        .expect(400);
      expect(response.body.status).toEqual(400);
      expect(response.body.message).toContain("Car validation failed");
    });

    it("responds with 201 and creates record", async () => {
      const car = {
        make: "Chevy",
        model: "Malibu",
        year: 2018,
        miles: 40000,
      };

      const response = await request(app)
        .post("/example")
        .send(car)
        .expect(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.make).toEqual(car.make);
      expect(response.body.model).toEqual(car.model);
      expect(response.body.year).toEqual(car.year);
      expect(response.body.miles).toEqual(car.miles);
    });
  });
});
