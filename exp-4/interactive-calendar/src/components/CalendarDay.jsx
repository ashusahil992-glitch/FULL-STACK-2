import { memo, useRef } from "react";
import EventCard from "./EventCard";

function CalendarDay({
  day,
  date,
  events,
  isToday,
  isSelected,
  onSelect,
  onEventClick,
  onDropEvent,
}) {
  // Render counter
  const renderCount = useRef(0);

  renderCount.current += 1;

  console.log(
    `CalendarDay ${date} rendered ${renderCount.current} time(s)`
  );

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const eventId =
      e.dataTransfer.getData("eventId");

    if (eventId) {
      onDropEvent(
        Number(eventId),
        date
      );
    }
  };

  return (
    <div
      className={`calendar-day 
        ${isToday ? "today" : ""} 
        ${isSelected ? "selected" : ""}
      `}
      onClick={() => onSelect(date)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="day-number">
        {day}
      </div>

      <div className="events-container">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(CalendarDay);