// services/eventsService.ts

import axiosInstance from "./axiosInstance";

// Define the type for the event object
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

// Fetch all events
export const fetchEvents = async ({ limit, skip }: { limit: number; skip: number }): Promise<Event[]> => {
  try {
    const response = await axiosInstance.get(
      `/events?limit=${limit}&skip=${skip}`
    ); // Use your API endpoint here
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch events");
  }
};

// Fetch event by ID
export const fetchEventById = async (id: string): Promise<Event> => {
  try {
    const response = await axiosInstance.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch event");
  }
};

// Create a new event
export const createEvent = async (
  eventData: Omit<Event, "id">
): Promise<Event> => {
  try {
    const response = await axiosInstance.post("/events", eventData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create event");
  }
};

// Update an existing event
export const updateEvent = async (
  id: string,
  eventData: Partial<Event>
): Promise<Event> => {
  try {
    const response = await axiosInstance.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update event");
  }
};

// Delete an event
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/events/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete event");
  }
};
