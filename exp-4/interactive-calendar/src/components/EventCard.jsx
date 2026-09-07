import { memo, useRef } from "react";

function EventCard({ event, onClick }) {
  // Render counter for performance analysis
  const renderCount = useRef(0);

  renderCount.current += 1;

  console.log(
    `EventCard ${event.id} rendered ${renderCount.current} time(s)`
  );

  const handleDragStart = (e) => {
    e.stopPropagation();

    e.dataTransfer.setData(
      "eventId",
      event.id.toString()
    );

    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="event-card"
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
    >
      <div className="event-title">
        {event.title}
      </div>

      <div className="event-time">
        {event.time}
      </div>

      <div className="event-platform">
        {event.platform}
      </div>

      <div className="event-status">
        {event.status}
      </div>
    </div>
  );
}

export default memo(EventCard);