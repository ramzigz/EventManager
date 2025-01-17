import redis from "../utils/redisClient";
import { v4 as uuidv4 } from "uuid";

/**
 * Create a new event and store it in Redis. The event ID is generated using `uuid`.
 * @param event - Event data to store (excluding the `id` field)
 */
export const createNewEvent = async (event: any) => {
  const allEventsKey = "events:all";

  const newId = uuidv4();
  const cacheKey = `event:${newId}`;
  const newEvent = { id: newId, ...event };

  // Store the event data in Redis
  await redis.set(cacheKey, JSON.stringify(newEvent));

  // Update the list of all events
  const existingEvents = await redis.get(allEventsKey);
  const events = existingEvents ? JSON.parse(existingEvents) : [];

  // Add the new event to the list
  events.push(newEvent);
  await redis.set(allEventsKey, JSON.stringify(events));

  return newEvent;
};

/**
 * Fetch all events from Redis with optional pagination and field selection.
 * @param limit - Number of events to fetch
 * @param skip - Number of events to skip (for pagination)
 * @param select - Optional comma-separated list of fields to fetch (e.g., "title,price")
 */
export const fetchAllEvents = async (
  limit: number = 10,
  skip: number = 0,
  select: string = ""
) => {
  const allEventsKey = "events:all";

  // Retrieve the list of all events from Redis
  const cachedData = await redis.get(allEventsKey);
  if (!cachedData) {
    return [];
  }

  let events = JSON.parse(cachedData);

  // Apply field selection if provided
  if (select) {
    const fields = select.split(",");
    events = events.map((event: any) =>
      Object.fromEntries(
        Object.entries(event).filter(([key]) => fields.includes(key))
      )
    );
  }

  // Paginate the results
  const paginatedEvents = events.slice(skip, skip + limit);

  return paginatedEvents;
};

/**
 * Fetch a single event by ID from Redis.
 * @param id - The ID of the event to fetch
 */
export const fetchEventById = async (id: string) => {
  const cacheKey = `event:${id}`;

  // Check Redis cache first
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  throw new Error("Event not found");
};

/**
 * Update an existing event by ID in Redis.
 * @param id - The ID of the event to update
 * @param updates - The fields to update in the event
 */
export const updateEventById = async (id: string, updates: any) => {
  const cacheKey = `event:${id}`;
  const allEventsKey = "events:all";

  // Fetch the existing event
  const cachedData = await redis.get(cacheKey);
  if (!cachedData) {
    throw new Error("Event not found");
  }

  const event = JSON.parse(cachedData);

  // Apply updates
  const updatedEvent = { ...event, ...updates };

  // Save the updated event in Redis
  await redis.set(cacheKey, JSON.stringify(updatedEvent));

  // Update the list of all events
  const existingEvents = await redis.get(allEventsKey);
  if (existingEvents) {
    const events = JSON.parse(existingEvents);
    const eventIndex = events.findIndex((e: any) => e.id === id);

    if (eventIndex !== -1) {
      events[eventIndex] = updatedEvent;
      await redis.set(allEventsKey, JSON.stringify(events));
    }
  }
  return updatedEvent;
};

/**
 * Delete an event by ID from Redis.
 * @param id - The ID of the event to delete
 */
export const deleteEventById = async (id: string) => {
  const cacheKey = `event:${id}`;
  const allEventsKey = "events:all";

  // Delete the event from Redis
  await redis.del(cacheKey);

  // Update the list of all events
  const existingEvents = await redis.get(allEventsKey);
  if (existingEvents) {
    const events = JSON.parse(existingEvents).filter((e: any) => e.id !== id);
    await redis.set(allEventsKey, JSON.stringify(events));
  }
};
