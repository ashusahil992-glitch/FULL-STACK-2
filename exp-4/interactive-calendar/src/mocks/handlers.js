import { http, HttpResponse } from "msw";
import eventsData from "../data/events";

// Keep a fresh copy of the original mock data.
let events = [...eventsData];

// Reset mock API data before/after tests.
export function resetMockEvents() {
  events = [...eventsData];
}

export const handlers = [
  // GET all events
  http.get("/api/events", () => {
    return HttpResponse.json(events);
  }),

  // CREATE event
  http.post("/api/events", async ({ request }) => {
    const newEvent = await request.json();

    const event = {
      id: Date.now(),
      ...newEvent,
    };

    events.push(event);

    return HttpResponse.json(event, {
      status: 201,
    });
  }),

  // UPDATE event
  http.put("/api/events/:id", async ({ params, request }) => {
    const id = Number(params.id);
    const updatedData = await request.json();

    const eventIndex = events.findIndex(
      (event) => event.id === id
    );

    if (eventIndex === -1) {
      return HttpResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    events[eventIndex] = {
      ...events[eventIndex],
      ...updatedData,
    };

    return HttpResponse.json(events[eventIndex]);
  }),

  // DELETE event
  http.delete("/api/events/:id", ({ params }) => {
    const id = Number(params.id);

    const eventExists = events.some(
      (event) => event.id === id
    );

    if (!eventExists) {
      return HttpResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    events = events.filter(
      (event) => event.id !== id
    );

    return new HttpResponse(null, {
      status: 204,
    });
  }),
];