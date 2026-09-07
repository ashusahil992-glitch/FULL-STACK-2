import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import {
  describe,
  expect,
  test,
  vi,
} from "vitest";

import {
  http,
  HttpResponse,
} from "msw";

import Calendar from "../components/Calendar";
import { server } from "../mocks/server";


const mockEvent = {
  id: 999,
  title: "Test Calendar Event",
  date: "2026-09-01",
  time: "10:00 AM",
  platform: "Instagram",
  status: "Scheduled",
  description: "Test event for Calendar component",
};


describe("Calendar Component", () => {

  test("renders the calendar successfully", async () => {
    render(<Calendar />);

    expect(
      await screen.findByText("September 2026")
    ).toBeInTheDocument();
  });


  test("displays event cards after loading events", async () => {
    render(<Calendar />);

    expect(
      await screen.findByText("Weekly Update 1")
    ).toBeInTheDocument();
  });


  test("allows selecting a calendar date", async () => {
    render(<Calendar />);

    await screen.findByText("Weekly Update 1");

    const dayOne = screen.getAllByText("1");

    expect(dayOne.length).toBeGreaterThan(0);

    fireEvent.click(dayOne[0]);

    expect(dayOne[0]).toBeInTheDocument();
  });


  test("shows loading state while fetching events", async () => {

    server.use(
      http.get("/api/events", async () => {

        await new Promise((resolve) =>
          setTimeout(resolve, 100)
        );

        return HttpResponse.json([]);
      })
    );

    render(<Calendar />);

    expect(
      screen.getByText("Loading Calendar...")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Fetching events from the mock API."
      )
    ).toBeInTheDocument();

    expect(
      await screen.findByText("September 2026")
    ).toBeInTheDocument();

    const totalEventsLabel =
      screen.getByText("Total Events");

    const totalEventsValue =
      totalEventsLabel
        .closest(".performance-item")
        .querySelector("strong");

    expect(
      totalEventsValue
    ).toHaveTextContent("0");
  });


  test("shows error message when API request fails", async () => {

    server.use(
      http.get("/api/events", () => {

        return HttpResponse.json(
          {
            message: "Server error",
          },
          {
            status: 500,
          }
        );
      })
    );

    render(<Calendar />);

    expect(
      await screen.findByText(
        "Unable to Load Events"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Failed to load events. Please try again."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Retry",
      })
    ).toBeInTheDocument();
  });


  test("retry button attempts to load events again", async () => {

    let requestCount = 0;

    server.use(
      http.get("/api/events", () => {

        requestCount++;

        if (requestCount === 1) {

          return HttpResponse.json(
            {
              message: "Server error",
            },
            {
              status: 500,
            }
          );
        }

        return HttpResponse.json([]);
      })
    );

    render(<Calendar />);

    expect(
      await screen.findByText(
        "Unable to Load Events"
      )
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Retry",
      })
    );

    expect(
      await screen.findByText(
        "September 2026"
      )
    ).toBeInTheDocument();

    const totalEventsLabel =
      screen.getByText("Total Events");

    const totalEventsValue =
      totalEventsLabel
        .closest(".performance-item")
        .querySelector("strong");

    expect(
      totalEventsValue
    ).toHaveTextContent("0");

    expect(requestCount).toBe(2);
  });


  test("opens event details when an event is clicked", async () => {

    render(<Calendar />);

    const event =
      await screen.findByText("Weekly Update 1");

    fireEvent.click(event);

    expect(
      await screen.findByText(
        "Social media promotional content"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Delete Event",
      })
    ).toBeInTheDocument();
  });


  test("deletes an event successfully", async () => {

    server.use(

      http.get("/api/events", () => {
        return HttpResponse.json([
          mockEvent,
        ]);
      }),

      http.delete(
        "/api/events/:id",
        ({ params }) => {

          expect(
            Number(params.id)
          ).toBe(999);

          return new HttpResponse(null, {
            status: 204,
          });
        }
      )
    );

    render(<Calendar />);

    const events =
      await screen.findAllByText(
        "Test Calendar Event"
      );

    fireEvent.click(events[0]);

    expect(
      await screen.findByRole("button", {
        name: "Delete Event",
      })
    ).toBeInTheDocument();

    const confirmSpy =
      vi.spyOn(window, "confirm")
        .mockReturnValue(true);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete Event",
      })
    );

    await waitFor(() => {

      expect(
        screen.queryByText(
          "Test Calendar Event"
        )
      ).not.toBeInTheDocument();

    });

    expect(
      confirmSpy
    ).toHaveBeenCalledWith(
      'Are you sure you want to delete "Test Calendar Event"?'
    );

    confirmSpy.mockRestore();
  });


  test(
    "does not delete an event when delete confirmation is cancelled",
    async () => {

      server.use(

        http.get("/api/events", () => {
          return HttpResponse.json([
            mockEvent,
          ]);
        }),

        http.delete(
          "/api/events/:id",
          () => {

            return new HttpResponse(null, {
              status: 204,
            });
          }
        )
      );

      render(<Calendar />);

      const events =
        await screen.findAllByText(
          "Test Calendar Event"
        );

      fireEvent.click(events[0]);

      expect(
        await screen.findByRole("button", {
          name: "Delete Event",
        })
      ).toBeInTheDocument();

      const confirmSpy =
        vi.spyOn(window, "confirm")
          .mockReturnValue(false);

      fireEvent.click(
        screen.getByRole("button", {
          name: "Delete Event",
        })
      );

      expect(
        screen.getAllByText(
          "Test Calendar Event"
        ).length
      ).toBeGreaterThan(0);

      expect(
        confirmSpy
      ).toHaveBeenCalled();

      confirmSpy.mockRestore();
    }
  );


  test(
    "supports dragging an event to another calendar date",
    async () => {

      let updateRequestReceived = false;

      server.use(

        http.get("/api/events", () => {
          return HttpResponse.json([
            mockEvent,
          ]);
        }),

        http.put(
          "/api/events/:id",
          async ({ params, request }) => {

            const updatedData =
              await request.json();

            expect(
              Number(params.id)
            ).toBe(999);

            expect(
              updatedData.date
            ).toBe("2026-09-02");

            updateRequestReceived = true;

            return HttpResponse.json({
              ...mockEvent,
              ...updatedData,
            });
          }
        )
      );

      render(<Calendar />);

      const events =
        await screen.findAllByText(
          "Test Calendar Event"
        );

      const event =
        events[0];

      const eventCard =
        event.closest(".event-card");

      expect(eventCard).toHaveAttribute(
        "draggable",
        "true"
      );


      const dayTwo =
        screen
          .getAllByText("2")
          .find((element) =>
            element.classList.contains(
              "day-number"
            )
          );

      expect(dayTwo).toBeDefined();


      const targetDay =
        dayTwo.closest(".calendar-day");


      const dataTransfer = {

        data: {},

        setData(key, value) {
          this.data[key] = value;
        },

        getData(key) {
          return this.data[key];
        },

        effectAllowed: "",
      };


      fireEvent.dragStart(
        eventCard,
        {
          dataTransfer,
        }
      );


      expect(
        dataTransfer.data.eventId
      ).toBe("999");


      fireEvent.dragOver(
        targetDay,
        {
          dataTransfer,
        }
      );


      fireEvent.drop(
        targetDay,
        {
          dataTransfer,
        }
      );


      await waitFor(() => {

        expect(
          updateRequestReceived
        ).toBe(true);

      });


      expect(
        screen.getAllByText(
          "Test Calendar Event"
        ).length
      ).toBeGreaterThan(0);

    }
  );


  // -------------------------------
  // SEARCH TESTS
  // -------------------------------

  test("filters events using the search box", async () => {

    render(<Calendar />);

    await screen.findByText("Weekly Update 1");

    const searchInput =
      screen.getByPlaceholderText(
        "Search events..."
      );

    fireEvent.change(
      searchInput,
      {
        target: {
          value: "Weekly Update 1",
        },
      }
    );

    expect(
      screen.getByText("Weekly Update 1")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Product Launch 2")
    ).not.toBeInTheDocument();
  });


  test("handles an empty search result", async () => {

    render(<Calendar />);

    await screen.findByText("Weekly Update 1");

    const searchInput =
      screen.getByPlaceholderText(
        "Search events..."
      );

    fireEvent.change(
      searchInput,
      {
        target: {
          value: "This Event Does Not Exist",
        },
      }
    );

    expect(
      screen.queryByText("Weekly Update 1")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Product Launch 2")
    ).not.toBeInTheDocument();

  });


  // -------------------------------
  // PLATFORM FILTER
  // -------------------------------

  test("filters events by platform", async () => {

    render(<Calendar />);

    await screen.findByText("Weekly Update 1");

    const platformFilter =
      screen.getByLabelText("Platform");

    fireEvent.change(
      platformFilter,
      {
        target: {
          value: "Instagram",
        },
      }
    );

    expect(
      platformFilter
    ).toHaveValue("Instagram");

  });


  // -------------------------------
  // STATUS FILTER
  // -------------------------------

  test("filters events by status", async () => {

    render(<Calendar />);

    await screen.findByText("Weekly Update 1");

    const statusFilter =
      screen.getByLabelText("Status");

    fireEvent.change(
      statusFilter,
      {
        target: {
          value: "Scheduled",
        },
      }
    );

    expect(
      statusFilter
    ).toHaveValue("Scheduled");

  });


  // -------------------------------
  // CLEAR FILTERS
  // -------------------------------

  test("clears search and filters", async () => {

    render(<Calendar />);

    await screen.findByText("Weekly Update 1");

    const searchInput =
      screen.getByPlaceholderText(
        "Search events..."
      );

    const platformFilter =
      screen.getByLabelText("Platform");

    const statusFilter =
      screen.getByLabelText("Status");


    fireEvent.change(
      searchInput,
      {
        target: {
          value: "Weekly",
        },
      }
    );


    fireEvent.change(
      platformFilter,
      {
        target: {
          value: "Instagram",
        },
      }
    );


    fireEvent.change(
      statusFilter,
      {
        target: {
          value: "Scheduled",
        },
      }
    );


    const clearButton =
      screen.getByRole("button", {
        name: "Clear Filters",
      });


    fireEvent.click(clearButton);


    expect(
      searchInput
    ).toHaveValue("");

    expect(
      platformFilter
    ).toHaveValue("All");

    expect(
      statusFilter
    ).toHaveValue("All");

  });


  // -------------------------------
  // SAME DATE DRAG
  // -------------------------------

  test(
    "does not send update request when event is dropped on the same date",
    async () => {

      let putCalled = false;

      server.use(

        http.get("/api/events", () => {
          return HttpResponse.json([
            mockEvent,
          ]);
        }),

        http.put(
          "/api/events/:id",
          () => {

            putCalled = true;

            return HttpResponse.json(
              mockEvent
            );
          }
        )
      );


      render(<Calendar />);


      const events =
        await screen.findAllByText(
          "Test Calendar Event"
        );


      const eventCard =
        events[0].closest(
          ".event-card"
        );


      const dayOne =
        screen
          .getAllByText("1")
          .find((element) =>
            element.classList.contains(
              "day-number"
            )
          );


      const sameDay =
        dayOne.closest(
          ".calendar-day"
        );


      const dataTransfer = {

        data: {},

        setData(key, value) {
          this.data[key] = value;
        },

        getData(key) {
          return this.data[key];
        },

        effectAllowed: "",
      };


      fireEvent.dragStart(
        eventCard,
        {
          dataTransfer,
        }
      );


      fireEvent.drop(
        sameDay,
        {
          dataTransfer,
        }
      );


      await new Promise((resolve) =>
        setTimeout(resolve, 100)
      );


      expect(
        putCalled
      ).toBe(false);

    }
  );

});