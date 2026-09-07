import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import EventDetails from "../components/EventDetails";

const mockEvent = {
  id: 10,
  title: "Product Launch 10",
  date: "2026-09-10",
  time: "11:00 AM",
  platform: "Instagram",
  status: "Scheduled",
  description: "Product launch promotional content",
};

describe("EventDetails Component", () => {
  test("renders event details correctly", () => {
    render(
      <EventDetails
        event={mockEvent}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("Product Launch 10")).toBeInTheDocument();
    expect(screen.getByText("2026-09-10")).toBeInTheDocument();
    expect(screen.getByText("11:00 AM")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(
      screen.getByText("Product launch promotional content")
    ).toBeInTheDocument();
  });

  test("calls onClose when Close button is clicked", () => {
    const handleClose = vi.fn();

    render(
      <EventDetails
        event={mockEvent}
        onClose={handleClose}
        onDelete={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when X button is clicked", () => {
    const handleClose = vi.fn();

    render(
      <EventDetails
        event={mockEvent}
        onClose={handleClose}
        onDelete={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "×" }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("shows delete button", () => {
    render(
      <EventDetails
        event={mockEvent}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Delete Event" })
    ).toBeInTheDocument();
  });

  test("shows fallback when description is missing", () => {
    const eventWithoutDescription = {
      ...mockEvent,
      description: "",
    };

    render(
      <EventDetails
        event={eventWithoutDescription}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByText("No description available.")
    ).toBeInTheDocument();
  });

  test("does not render when event is null", () => {
    const { container } = render(
      <EventDetails
        event={null}
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});