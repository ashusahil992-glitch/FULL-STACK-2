import { describe, expect, test } from "vitest";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/eventService";

describe("Event API Service", () => {
  test("GET /api/events returns events", async () => {
    const events = await getEvents();

    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);

    expect(events[0]).toHaveProperty("id");
    expect(events[0]).toHaveProperty("title");
    expect(events[0]).toHaveProperty("date");
  });

  test("POST /api/events creates a new event", async () => {
    const newEvent = {
      title: "API Test Event",
      date: "2026-09-20",
      time: "03:00 PM",
      platform: "Instagram",
      status: "Scheduled",
      description: "Created during API testing",
    };

    const createdEvent = await createEvent(newEvent);

    expect(createdEvent).toHaveProperty("id");
    expect(createdEvent.title).toBe("API Test Event");
    expect(createdEvent.date).toBe("2026-09-20");
    expect(createdEvent.platform).toBe("Instagram");
  });

  test("PUT /api/events/:id updates an event", async () => {
    const events = await getEvents();
    const eventToUpdate = events[0];

    const updatedEvent = await updateEvent(eventToUpdate.id, {
      title: "Updated API Event",
    });

    expect(updatedEvent.id).toBe(eventToUpdate.id);
    expect(updatedEvent.title).toBe("Updated API Event");
  });

  test("DELETE /api/events/:id deletes an event", async () => {
    const newEvent = await createEvent({
      title: "Event To Delete",
      date: "2026-09-21",
      time: "04:00 PM",
      platform: "Facebook",
      status: "Draft",
      description: "Temporary event",
    });

    const result = await deleteEvent(newEvent.id);

    expect(result).toBe(true);
  });
});