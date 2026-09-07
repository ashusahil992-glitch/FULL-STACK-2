import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import AddEvent from "../components/AddEvent";

describe("AddEvent Component", () => {
  test("renders the Add Event form", () => {
    render(
      <AddEvent
        defaultDate="2026-09-15"
        onClose={vi.fn()}
        onCreate={vi.fn()}
      />
    );

    expect(screen.getByText("Add New Event")).toBeInTheDocument();

    expect(screen.getByLabelText("Event Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Platform")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  test("uses the provided default date", () => {
    render(
      <AddEvent
        defaultDate="2026-09-15"
        onClose={vi.fn()}
        onCreate={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Date")).toHaveValue("2026-09-15");
  });

  test("creates an event with entered information", () => {
    const handleCreate = vi.fn();

    render(
      <AddEvent
        defaultDate="2026-09-15"
        onClose={vi.fn()}
        onCreate={handleCreate}
      />
    );

    fireEvent.change(screen.getByLabelText("Event Title"), {
      target: { value: "New Product Campaign" },
    });

    fireEvent.change(screen.getByLabelText("Time"), {
      target: { value: "02:00 PM" },
    });

    fireEvent.change(screen.getByLabelText("Platform"), {
      target: { value: "LinkedIn" },
    });

    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "Draft" },
    });

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Campaign description" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Create Event" })
    );

    expect(handleCreate).toHaveBeenCalledTimes(1);

    expect(handleCreate).toHaveBeenCalledWith({
      title: "New Product Campaign",
      date: "2026-09-15",
      time: "02:00 PM",
      platform: "LinkedIn",
      status: "Draft",
      description: "Campaign description",
    });
  });

  test("does not create an event when title is empty", () => {
    const handleCreate = vi.fn();
    const alertSpy = vi
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    render(
      <AddEvent
        defaultDate="2026-09-15"
        onClose={vi.fn()}
        onCreate={handleCreate}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Create Event" })
    );

    expect(alertSpy).toHaveBeenCalledWith(
      "Please enter an event title and date."
    );

    expect(handleCreate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  test("calls onClose when Cancel is clicked", () => {
    const handleClose = vi.fn();

    render(
      <AddEvent
        defaultDate="2026-09-15"
        onClose={handleClose}
        onCreate={vi.fn()}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Cancel" })
    );

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});