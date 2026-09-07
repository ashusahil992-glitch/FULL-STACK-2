import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import EventCard from "../components/EventCard";

const mockEvent = {
  id: 1,
  title: "Product Launch 1",
  date: "2026-09-01",
  time: "10:00 AM",
  platform: "Instagram",
  status: "Scheduled",
  description: "Social media promotional content",
};

describe("EventCard Component", () => {
  test("renders event information", () => {
    render(<EventCard event={mockEvent} onClick={vi.fn()} />);

    expect(screen.getByText("Product Launch 1")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
  });

  test("calls onClick when the event is clicked", () => {
    const handleClick = vi.fn();

    render(
      <EventCard
        event={mockEvent}
        onClick={handleClick}
      />
    );

    fireEvent.click(screen.getByText("Product Launch 1"));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockEvent);
  });

  test("event card supports drag and drop", () => {
    render(<EventCard event={mockEvent} onClick={vi.fn()} />);

    const eventTitle = screen.getByText("Product Launch 1");
    const eventCard = eventTitle.closest(".event-card");

    expect(eventCard).toHaveAttribute("draggable", "true");
  });
});