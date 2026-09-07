import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import CalendarDay from "./CalendarDay";
import PerformanceMonitor from "./PerformanceMonitor";
import AddEvent from "./AddEvent";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/eventService";

const EventDetails = lazy(
  () => import("./EventDetails")
);

function Calendar({
  optimizationEnabled = true,
  onStatsChange,
}) {
  // ==================================================
  // STATE
  // ==================================================

  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [selectedDate, setSelectedDate] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [platformFilter, setPlatformFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showAddEvent, setShowAddEvent] =
    useState(false);

  // ==================================================
  // RENDER TRACKING
  // ==================================================

  const renderCount = useRef(0);

  renderCount.current += 1;

  console.log(
    `Calendar rendered ${renderCount.current} time(s)`
  );

  // ==================================================
  // LOAD EVENTS
  // ==================================================

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEvents();

      setEvents(data);
    } catch (err) {
      console.error(
        "Error loading events:",
        err
      );

      setError(
        "Failed to load events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // ==================================================
  // CALENDAR STATISTICS
  // ==================================================

  useEffect(() => {
    if (!onStatsChange) {
      return;
    }

    const scheduledDays = new Set(
      events.map((event) => event.date)
    ).size;

    const totalHours = Math.ceil(
      events.length * 0.5
    );

    onStatsChange({
      totalEvents: events.length,
      scheduledDays,
      totalHours,
    });
  }, [events, onStatsChange]);

  // ==================================================
  // DATE INFORMATION
  // ==================================================

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

  // ==================================================
  // MONTH NAVIGATION
  // ==================================================

  const goToPreviousMonth =
    useCallback(() => {
      setCurrentDate(
        new Date(
          year,
          month - 1,
          1
        )
      );
    }, [year, month]);

  const goToNextMonth =
    useCallback(() => {
      setCurrentDate(
        new Date(
          year,
          month + 1,
          1
        )
      );
    }, [year, month]);

  const goToToday =
    useCallback(() => {
      const todayDate = new Date();

      setCurrentDate(
        new Date(
          todayDate.getFullYear(),
          todayDate.getMonth(),
          1
        )
      );

      setSelectedDate(
        `${todayDate.getFullYear()}-${String(
          todayDate.getMonth() + 1
        ).padStart(2, "0")}-${String(
          todayDate.getDate()
        ).padStart(2, "0")}`
      );
    }, []);

  // ==================================================
  // DATE SELECTION
  // ==================================================

  const handleDateSelect =
    useCallback((date) => {
      setSelectedDate(date);
    }, []);

  // ==================================================
  // EVENT CLICK
  // ==================================================

  const handleEventClick =
    useCallback((event) => {
      setSelectedEvent(event);
    }, []);

  const handleCloseDetails =
    useCallback(() => {
      setSelectedEvent(null);
    }, []);

  // ==================================================
  // ADD EVENT
  // ==================================================

  const handleOpenAddEvent =
    useCallback(() => {
      setShowAddEvent(true);
    }, []);

  const handleCloseAddEvent =
    useCallback(() => {
      setShowAddEvent(false);
    }, []);

  // ==================================================
  // CREATE EVENT
  // ==================================================

  const handleCreateEvent =
    useCallback(async (newEvent) => {
      try {
        const createdEvent =
          await createEvent(newEvent);

        setEvents((prevEvents) => [
          ...prevEvents,
          createdEvent,
        ]);

        setShowAddEvent(false);
      } catch (err) {
        console.error(
          "Error creating event:",
          err
        );

        alert(
          "Failed to create event. Please try again."
        );
      }
    }, []);

  // ==================================================
  // DRAG AND DROP
  // ==================================================

  const handleDropEvent =
    useCallback(
      async (eventId, newDate) => {
        const eventToUpdate =
          events.find(
            (event) =>
              event.id === eventId
          );

        if (!eventToUpdate) {
          return;
        }

        // Do not make an API request
        // if event stays on the same date.

        if (
          eventToUpdate.date === newDate
        ) {
          return;
        }

        const updatedEvent = {
          ...eventToUpdate,
          date: newDate,
        };

        try {
          await updateEvent(
            eventId,
            updatedEvent
          );

          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === eventId
                ? updatedEvent
                : event
            )
          );

          setSelectedEvent(
            (prevEvent) =>
              prevEvent &&
              prevEvent.id === eventId
                ? updatedEvent
                : prevEvent
          );
        } catch (err) {
          console.error(
            "Error updating event:",
            err
          );

          alert(
            "Failed to move event. Please try again."
          );
        }
      },
      [events]
    );

  // ==================================================
  // DELETE EVENT
  // ==================================================

  const handleDeleteEvent =
    useCallback(async (eventId) => {
      try {
        await deleteEvent(eventId);

        setEvents((prevEvents) =>
          prevEvents.filter(
            (event) =>
              event.id !== eventId
          )
        );

        setSelectedEvent(null);
      } catch (err) {
        console.error(
          "Error deleting event:",
          err
        );

        alert(
          "Failed to delete event. Please try again."
        );
      }
    }, []);

  // ==================================================
  // SEARCH AND FILTER
  // ==================================================

  const filteredEvents =
    useMemo(() => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      return events.filter(
        (event) => {
          const matchesSearch =
            search === "" ||
            event.title
              .toLowerCase()
              .includes(search) ||
            event.description
              ?.toLowerCase()
              .includes(search);

          const matchesPlatform =
            platformFilter === "All" ||
            event.platform ===
              platformFilter;

          const matchesStatus =
            statusFilter === "All" ||
            event.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesPlatform &&
            matchesStatus
          );
        }
      );
    }, [
      events,
      searchTerm,
      platformFilter,
      statusFilter,
    ]);

  // ==================================================
  // GROUP EVENTS BY DATE
  // ==================================================

  const eventsByDate =
    useMemo(() => {
      console.log(
        "useMemo: Grouping events by date..."
      );

      const groupedEvents = {};

      filteredEvents.forEach(
        (event) => {
          if (
            !groupedEvents[event.date]
          ) {
            groupedEvents[event.date] =
              [];
          }

          groupedEvents[
            event.date
          ].push(event);
        }
      );

      return groupedEvents;
    }, [filteredEvents]);

  // ==================================================
  // CREATE CALENDAR DAYS
  // ==================================================

  const calendarDays =
    useMemo(() => {
      const days = [];

      // Empty cells before first day

      for (
        let i = 0;
        i < firstDay;
        i++
      ) {
        days.push(null);
      }

      // Actual calendar days

      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {
        const date =
          `${year}-${String(
            month + 1
          ).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

        days.push({
          day,
          date,
          events:
            eventsByDate[date] || [],
          isToday:
            date === todayString,
          isSelected:
            date === selectedDate,
        });
      }

      return days;
    }, [
      firstDay,
      daysInMonth,
      year,
      month,
      eventsByDate,
      todayString,
      selectedDate,
    ]);

  // ==================================================
  // CLEAR FILTERS
  // ==================================================

  const clearFilters =
    useCallback(() => {
      setSearchTerm("");
      setPlatformFilter("All");
      setStatusFilter("All");
    }, []);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="calendar-state">

        <div className="loading-spinner"></div>

        <h2>
          Loading Calendar...
        </h2>

        <p>
          Fetching events from the
          mock API.
        </p>

      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div className="calendar-state error-state">

        <div className="error-icon">
          ⚠️
        </div>

        <h2>
          Unable to Load Events
        </h2>

        <p>
          {error}
        </p>

        <button
          className="retry-button"
          onClick={loadEvents}
        >
          Retry
        </button>

      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="calendar-wrapper">

      {/* Calendar Header */}

      <div className="calendar-header">

        <div>

          <h1>
            Interactive Content Calendar
          </h1>

          <p>
            Manage and optimize your
            scheduled social media content
          </p>

        </div>

        <div className="calendar-actions">

          <button
            onClick={
              handleOpenAddEvent
            }
          >
            + Add Event
          </button>

          <button
            onClick={
              goToPreviousMonth
            }
          >
            ←
          </button>

          <button
            onClick={goToToday}
          >
            Today
          </button>

          <button
            onClick={
              goToNextMonth
            }
          >
            →
          </button>

        </div>

      </div>

      {/* Month */}

      <div className="month-title">

        {currentDate.toLocaleString(
          "default",
          {
            month: "long",
            year: "numeric",
          }
        )}

      </div>

      {/* Search and Filters */}

      <div className="filter-section">

        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
        />

        <select
          aria-label="Platform"
          value={platformFilter}
          onChange={(e) =>
            setPlatformFilter(
              e.target.value
            )
          }
        >
          <option value="All">
            All Platforms
          </option>

          <option value="Instagram">
            Instagram
          </option>

          <option value="Facebook">
            Facebook
          </option>

          <option value="LinkedIn">
            LinkedIn
          </option>

          <option value="Twitter">
            Twitter
          </option>
        </select>

        <select
          aria-label="Status"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option value="All">
            All Statuses
          </option>

          <option value="Scheduled">
            Scheduled
          </option>

          <option value="Draft">
            Draft
          </option>

          <option value="Published">
            Published
          </option>
        </select>

        <button
          onClick={
            clearFilters
          }
        >
          Clear Filters
        </button>

      </div>

      {/* Calendar */}

      <div className="calendar-container">

        <div className="weekdays">

          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>

        </div>

        <div className="calendar-grid">

          {calendarDays.map(
            (calendarDay, index) => {

              if (!calendarDay) {
                return (
                  <div
                    className="calendar-day empty-day"
                    key={`empty-${index}`}
                  />
                );
              }

              return (
                <CalendarDay
                  key={
                    calendarDay.date
                  }
                  day={
                    calendarDay.day
                  }
                  date={
                    calendarDay.date
                  }
                  events={
                    calendarDay.events
                  }
                  isToday={
                    calendarDay.isToday
                  }
                  isSelected={
                    calendarDay.isSelected
                  }
                  onSelect={
                    handleDateSelect
                  }
                  onEventClick={
                    handleEventClick
                  }
                  onDropEvent={
                    handleDropEvent
                  }
                />
              );
            }
          )}

        </div>

      </div>

      {/* Performance Monitor */}

      <PerformanceMonitor
        totalEvents={
          events.length
        }
        visibleEvents={
          filteredEvents.length
        }
        selectedDate={
          selectedDate
        }
        optimizationEnabled={
          optimizationEnabled
        }
      />

      {/* Event Details */}

      {selectedEvent && (
        <Suspense
          fallback={
            <div className="event-details-loading">
              Loading event details...
            </div>
          }
        >
          <EventDetails
            event={
              selectedEvent
            }
            onClose={
              handleCloseDetails
            }
            onDelete={
              handleDeleteEvent
            }
          />
        </Suspense>
      )}

      {/* Add Event */}

      {showAddEvent && (
        <AddEvent
          defaultDate={
            selectedDate ||
            todayString
          }
          onClose={
            handleCloseAddEvent
          }
          onCreate={
            handleCreateEvent
          }
        />
      )}

    </div>
  );
}

export default Calendar;