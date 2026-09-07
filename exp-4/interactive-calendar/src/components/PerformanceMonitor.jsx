import {
  memo,
  useRef,
} from "react";

function PerformanceMonitor({
  totalEvents,
  visibleEvents,
  selectedDate,
  optimizationEnabled = true,
}) {
  // --------------------------------------------------
  // Render tracking
  // --------------------------------------------------

  const renderCount =
    useRef(0);

  renderCount.current += 1;

  console.log(
    `PerformanceMonitor rendered ${renderCount.current} time(s)`
  );

  return (
    <aside className="performance-dashboard">

      {/* =========================================
          RENDER MONITOR
          ========================================= */}

      <section className="performance-panel">

        <div className="panel-heading">

          <div>

            <span className="panel-label">
              PERFORMANCE
            </span>

            <h3>
              Render Monitor
            </h3>

          </div>

          <span className="panel-icon">
            ↗
          </span>

        </div>

        <div className="monitor-stats">

          <div className="monitor-stat performance-item">

            <span>
              Total Events
            </span>

            <strong>
              {totalEvents}
            </strong>

          </div>

          <div className="monitor-stat performance-item">

            <span>
              Visible Events
            </span>

            <strong>
              {visibleEvents}
            </strong>

          </div>

          <div className="monitor-stat performance-item">

            <span>
              Selected Date
            </span>

            <strong>
              {selectedDate ||
                "None"}
            </strong>

          </div>

          <div className="monitor-stat performance-item">

            <span>
              Monitor Renders
            </span>

            <strong>
              {renderCount.current}
            </strong>

          </div>

        </div>

      </section>

      {/* =========================================
          CURRENT MODE
          ========================================= */}

      <section className="performance-panel">

        <div className="panel-heading">

          <div>

            <span className="panel-label">
              RENDERING STRATEGY
            </span>

            <h3>
              Current Mode
            </h3>

          </div>

          <span
            className={
              optimizationEnabled
                ? "mode-status optimized"
                : "mode-status standard"
            }
          >
            {optimizationEnabled
              ? "Optimized"
              : "Standard"}
          </span>

        </div>

        <div className="technique-list">

          <div className="technique-item">

            <span>01</span>

            <div>

              <strong>
                React.memo
              </strong>

              <small>
                Prevents unnecessary
                child renders
              </small>

            </div>

          </div>

          <div className="technique-item">

            <span>02</span>

            <div>

              <strong>
                useMemo
              </strong>

              <small>
                Caches calculated
                values
              </small>

            </div>

          </div>

          <div className="technique-item">

            <span>03</span>

            <div>

              <strong>
                useCallback
              </strong>

              <small>
                Keeps callback
                references stable
              </small>

            </div>

          </div>

          <div className="technique-item">

            <span>04</span>

            <div>

              <strong>
                Stable Keys
              </strong>

              <small>
                Uses unique event
                identifiers
              </small>

            </div>

          </div>

          <div className="technique-item">

            <span>05</span>

            <div>

              <strong>
                Lazy Loading
              </strong>

              <small>
                Loads secondary
                interface when needed
              </small>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================
          INTERACTION GUIDE
          ========================================= */}

      <section className="performance-panel interaction-panel">

        <div className="panel-heading">

          <div>

            <span className="panel-label">
              USER CONTROLS
            </span>

            <h3>
              Interaction Guide
            </h3>

          </div>

        </div>

        <div className="interaction-list">

          <div className="interaction-item">

            <span className="interaction-key">
              CLICK
            </span>

            <p>
              Select a date or
              open an event.
            </p>

          </div>

          <div className="interaction-item">

            <span className="interaction-key">
              DRAG
            </span>

            <p>
              Move an event to
              another date.
            </p>

          </div>

          <div className="interaction-item">

            <span className="interaction-key">
              SEARCH
            </span>

            <p>
              Find events by
              title or description.
            </p>

          </div>

          <div className="interaction-item">

            <span className="interaction-key">
              FILTER
            </span>

            <p>
              Filter content by
              platform and status.
            </p>

          </div>

        </div>

      </section>

    </aside>
  );
}

export default memo(
  PerformanceMonitor
);