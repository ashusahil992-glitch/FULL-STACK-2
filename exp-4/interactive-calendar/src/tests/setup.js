import "@testing-library/jest-dom";

import {
  beforeAll,
  afterEach,
  afterAll,
  vi,
} from "vitest";

import {
  cleanup,
} from "@testing-library/react";

import {
  server,
} from "../mocks/server";

import {
  resetMockEvents,
} from "../mocks/handlers";


beforeAll(() => {
  server.listen({
    onUnhandledRequest: "error",
  });
});


afterEach(() => {
  cleanup();

  server.resetHandlers();

  resetMockEvents();

  vi.restoreAllMocks();
});


afterAll(() => {
  server.close();
});