import request from "supertest";
import express from "express";
import routes from "../routes/events.routes";
import redis from "../utils/redisClient";
import RedisMock from "ioredis-mock";

const app = express();
app.use(express.json());
app.use("/events", routes);


const redisMock = new RedisMock();
test("should store and retrieve data from Redis", async () => {
  await redisMock.set("key", "value");
  const value = await redisMock.get("key");
  expect(value).toBe("value");
});

afterAll(async () => {
  await redis.quit();
});


describe("Events API", () => {
  it("should create a new event", async () => {
    const newEvent = {
      title: "New Event",
      date: "2023-10-10T10:00:00.000Z",
      description: "This is a new event",
      category: "Category1",
    };

    const response = await request(app).post("/events").send(newEvent);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(newEvent.title);
    expect(response.body.date).toBe(newEvent.date);
  });

  it("should fail to create a new event without title", async () => {
    const newEvent = {
      date: "2023-10-10T10:00:00.000Z",
      description: "This is a new event",
      category: "Category1",
    };

    const response = await request(app).post("/events").send(newEvent);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should fail to create a new event without date", async () => {
    const newEvent = {
      title: "New Event",
      description: "This is a new event",
      category: "Category1",
    };

    const response = await request(app).post("/events").send(newEvent);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should fail to create a new event without required fields", async () => {
    const newEvent = {
      description: "This is a new event",
      category: "Category1",
    };

    const response = await request(app).post("/events").send(newEvent);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should retrieve all events with pagination", async () => {
    const response = await request(app)
      .get("/events")
      .query({ limit: 10, skip: 0 });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should retrieve a single event by ID", async () => {
    const eventId = "9f315e2d-012f-4144-b7cc-134e5bfc6df3";

    const response = await request(app).get(`/events/${eventId}`);

    if (response.status === 200) {
      expect(response.body).toHaveProperty("id", eventId);
    } else {
      expect(response.status).toBe(404);
    }
  });

  it("should update an event by ID", async () => {
    const eventId = "9f315e2d-012f-4144-b7cc-134e5bfc6df3";
    const updates = {
      title: "Updated Event Title",
    };

    const response = await request(app).put(`/events/${eventId}`).send(updates);

    if (response.status === 200) {
      expect(response.body).toHaveProperty("title", updates.title);
    } else {
      expect(response.status).toBe(404);
    }
  });

  it("should delete an event by ID", async () => {
    const eventId = "9f315e2d-012f-4144-b7cc-134e5bfc6df3";

    const response = await request(app).delete(`/events/${eventId}`);

    if (response.status === 204) {
      expect(response.body).toEqual({});
    } else {
      expect(response.status).toBe(404);
    }
  });
});
