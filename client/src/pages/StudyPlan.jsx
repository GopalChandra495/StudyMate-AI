import { useState } from "react";
import axios from "axios";
import "./StudyPlan.css";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function StudyPlan({ savedTopics, apiUrl, getAuthConfig }) {
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [dailyHours, setDailyHours] = useState("3");
  const [durationDays, setDurationDays] = useState("7");
  const [startDate, setStartDate] = useState(getTodayDate());
  const [plan, setPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopicToggle = (topicId) => {
    setSelectedTopicIds((currentIds) =>
      currentIds.includes(topicId)
        ? currentIds.filter((id) => id !== topicId)
        : [...currentIds, topicId]
    );
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setMessage("");
    setPlan(null);

    if (selectedTopicIds.length === 0) {
      setMessage("Please select at least one saved topic.");
      return;
    }

    const selectedTopics = savedTopics
      .filter((topic) => selectedTopicIds.includes(topic._id))
      .map((topic) => topic.title);

    if (selectedTopics.length === 0) {
      setMessage("Selected topics were not found. Please refresh the page.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${apiUrl}/api/ai/study-plan`,
        {
          topics: selectedTopics,
          dailyHours: Number(dailyHours),
          durationDays: Number(durationDays),
          startDate,
        },
        getAuthConfig()
      );

      setPlan(response.data.plan);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not generate the study plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="study-plan-page">
      <header className="study-plan-header">
        <div className="study-plan-header-icon" aria-hidden="true">
          🗓️
        </div>
        <div>
          <h2>AI Study Plan</h2>
          <p>
            Create a practical day-by-day schedule using your saved topics
            and available study time.
          </p>
        </div>
      </header>

      {savedTopics.length === 0 ? (
        <section className="study-plan-empty">
          <h3>No saved topics yet</h3>
          <p>
            First, visit AI Topics and save some topics. Then come back here
            to generate your study plan.
          </p>
        </section>
      ) : (
        <section className="study-plan-form-card">
          <form onSubmit={handleGeneratePlan}>
            <div className="study-plan-field">
              <label>Choose topics for your plan</label>
              <p className="study-plan-hint">
                Select one or more topics from your saved topics.
              </p>

              <div className="study-plan-topic-list">
                {savedTopics.map((topic) => (
                  <label className="study-plan-topic-option" key={topic._id}>
                    <input
                      type="checkbox"
                      checked={selectedTopicIds.includes(topic._id)}
                      onChange={() => handleTopicToggle(topic._id)}
                    />
                    <span>{topic.title}</span>
                  </label>
                ))}
              </div>

              <div className="study-plan-selected-count">
                {selectedTopicIds.length} topic(s) selected
              </div>
            </div>

            <div className="study-plan-fields-grid">
              <div className="study-plan-field">
                <label htmlFor="dailyHours">Available study hours per day</label>
                <input
                  id="dailyHours"
                  type="number"
                  min="1"
                  max="16"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                  required
                />
              </div>

              <div className="study-plan-field">
                <label htmlFor="durationDays">Plan duration</label>
                <select
                  id="durationDays"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  required
                >
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="21">21 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>

              <div className="study-plan-field study-plan-date-field">
                <label htmlFor="startDate">Start date</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {message && (
              <div className="study-plan-error" role="alert">
                {message}
              </div>
            )}

            <button
              className="study-plan-submit"
              type="submit"
              disabled={loading || selectedTopicIds.length === 0}
            >
              {loading ? "Creating your plan..." : "Generate Study Plan"}
            </button>
          </form>
        </section>
      )}

      {loading && (
        <div className="study-plan-loading" role="status">
          AI is organizing your topics into a study schedule...
        </div>
      )}

      {plan && (
        <section className="study-plan-results">
          <div className="study-plan-results-heading">
            <div>
              <span className="study-plan-eyebrow">YOUR PERSONAL SCHEDULE</span>
              <h3>{plan.title || "Your Study Plan"}</h3>
              <p>
                {plan.durationDays || durationDays} days ·{" "}
                {plan.dailyHours || dailyHours} hours per day
              </p>
            </div>
            <span className="study-plan-result-badge">AI generated</span>
          </div>

          {Array.isArray(plan.days) &&
            plan.days.map((day, index) => (
              <article
                className="study-plan-day-card"
                key={`${day.day || index + 1}-${day.date || index}`}
              >
                <div className="study-plan-day-heading">
                  <div className="study-plan-day-number">
                    Day {day.day || index + 1}
                  </div>
                  {day.date && (
                    <time className="study-plan-day-date">{day.date}</time>
                  )}
                </div>

                <h4>{day.focus || "Study sessions"}</h4>

                {Array.isArray(day.sessions) && day.sessions.length > 0 ? (
                  <div className="study-plan-sessions">
                    {day.sessions.map((session, sessionIndex) => (
                      <div
                        className="study-plan-session"
                        key={`${session.topic || "session"}-${sessionIndex}`}
                      >
                        <div className="study-plan-session-top">
                          <strong>{session.topic || "Study session"}</strong>
                          {Number.isFinite(Number(session.durationMinutes)) && (
                            <span>
                              {session.durationMinutes} min
                            </span>
                          )}
                        </div>
                        <p>{session.activity}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="study-plan-hint">
                    No session details were returned for this day.
                  </p>
                )}

                {day.goal && (
                  <div className="study-plan-goal">
                    <strong>Daily goal:</strong> {day.goal}
                  </div>
                )}
              </article>
            ))}

          <p className="study-plan-note">
            Use this as a flexible study guide. Adjust the sessions if you
            need more time for a topic.
          </p>
        </section>
      )}
    </main>
  );
}

export default StudyPlan;