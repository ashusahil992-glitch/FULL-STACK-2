import { memo } from "react";

function EventDetails({
  event,
  onClose,
  onDelete,
}) {
  if (!event) {
    return null;
  }

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (confirmDelete) {
      onDelete(event.id);
    }
  };

  return (
    <div className="event-details-overlay">
      <div className="event-details">

        <div className="event-details-header">
          <h2>{event.title}</h2>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="event-details-content">

          <div className="detail-row">
            <strong>Date:</strong>
            <span>{event.date}</span>
          </div>

          <div className="detail-row">
            <strong>Time:</strong>
            <span>{event.time}</span>
          </div>

          <div className="detail-row">
            <strong>Platform:</strong>
            <span>{event.platform}</span>
          </div>

          <div className="detail-row">
            <strong>Status:</strong>
            <span>{event.status}</span>
          </div>

          <div className="detail-description">
            <strong>Description:</strong>
            <p>
              {event.description ||
                "No description available."}
            </p>
          </div>

        </div>

        <div className="event-details-actions">
          <button
            className="delete-button"
            onClick={handleDelete}
          >
            Delete Event
          </button>

          <button
            className="secondary-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default memo(EventDetails);