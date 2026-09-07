import { memo, useState } from "react";

function AddEvent({ defaultDate, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate || "");
  const [time, setTime] = useState("10:00 AM");
  const [platform, setPlatform] = useState("Instagram");
  const [status, setStatus] = useState("Scheduled");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !date) {
      alert("Please enter an event title and date.");
      return;
    }

    const newEvent = {
      title: title.trim(),
      date,
      time,
      platform,
      status,
      description: description.trim(),
    };

    onCreate(newEvent);
  };

  return (
    <div className="event-form-overlay">
      <div className="event-form">
        <div className="event-form-header">
          <h2>Add New Event</h2>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="event-title">Event Title</label>

            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event-date">Date</label>

              <input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-time">Time</label>

              <input
                id="event-time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00 AM"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event-platform">Platform</label>

              <select
                id="event-platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="event-status">Status</label>

              <select
                id="event-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="event-description">Description</label>

            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              rows="4"
            />
          </div>

          <div className="event-form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="create-button">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default memo(AddEvent);