const API_URL = "/api/events";

// GET - Fetch all events
export async function getEvents() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

// POST - Create a new event
export async function createEvent(event) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error("Failed to create event");
  }

  return response.json();
}

// PUT - Update an existing event
export async function updateEvent(id, event) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error("Failed to update event");
  }

  return response.json();
}

// DELETE - Delete an event
export async function deleteEvent(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete event");
  }

  return true;
}