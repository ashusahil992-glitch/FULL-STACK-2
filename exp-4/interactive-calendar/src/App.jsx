import { useCallback, useState } from "react";
import Calendar from "./components/Calendar";
import "./App.css";

function App() {
  const [optimizationEnabled, setOptimizationEnabled] =
    useState(true);

  const [calendarStats, setCalendarStats] = useState({
    totalEvents: 0,
    scheduledDays: 0,
    totalHours: 0,
  });

  const handleStatsChange = useCallback((stats) => {
    setCalendarStats(stats);
  }, []);

  const handleResetSchedule = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="app-shell">

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <p className="project-label">
            INTERACTIVE CONTENT MANAGEMENT
          </p>

          <h1>Content Calendar</h1>

          <p className="project-description">
            Plan, organize and optimize scheduled
            social media content.
          </p>
        </div>

        <div className="optimization-status">
          <span
            className={
              optimizationEnabled
                ? "status-indicator active"
                : "status-indicator inactive"
            }
          />

          <div>
            <span className="status-label">
              Optimization
            </span>

            <strong>
              {optimizationEnabled
                ? "Enabled"
                : "Disabled"}
            </strong>
          </div>
        </div>
      </header>

      {/* Control Panel */}
      <section className="control-panel">

        <div className="optimization-switch">
          <span className="control-title">
            Render Mode
          </span>

          <div className="mode-buttons">
            <button
              type="button"
              className={
                optimizationEnabled
                  ? "mode-button selected"
                  : "mode-button"
              }
              onClick={() =>
                setOptimizationEnabled(true)
              }
            >
              Optimized
            </button>

            <button
              type="button"
              className={
                !optimizationEnabled
                  ? "mode-button selected"
                  : "mode-button"
              }
              onClick={() =>
                setOptimizationEnabled(false)
              }
            >
              Standard
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="stat-group">

          <div className="stat-card">
            <span className="stat-label">
              Total Tasks
            </span>

            <strong>
              {calendarStats.totalEvents}
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Scheduled Days
            </span>

            <strong>
              {calendarStats.scheduledDays}
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Estimated Time
            </span>

            <strong>
              {calendarStats.totalHours}h
            </strong>
          </div>

        </div>

        <button
          type="button"
          className="reset-button"
          onClick={handleResetSchedule}
        >
          Reset Schedule
        </button>

      </section>

      {/* Calendar */}
      <main className="calendar-area">
        <Calendar
          optimizationEnabled={
            optimizationEnabled
          }
          onStatsChange={
            handleStatsChange
          }
        />
      </main>

    </div>
  );
}

export default App;