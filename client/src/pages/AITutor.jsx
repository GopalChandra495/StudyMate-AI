import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./AITutor.css";

function AITutor({ savedTopics, apiUrl, getAuthConfig }) {
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    setMessage("");
    setAnswer("");

    if (!selectedTopicId) {
      setMessage("Please select a saved topic first.");
      return;
    }

    if (!question.trim()) {
      setMessage("Please enter your question.");
      return;
    }

    const selectedTopic = savedTopics.find(
      (topic) => topic._id === selectedTopicId
    );

    if (!selectedTopic) {
      setMessage("Selected topic was not found. Please refresh the page.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${apiUrl}/api/ai/tutor`,
        {
          topic: selectedTopic.title,
          question: question.trim(),
        },
        getAuthConfig()
      );

      setAnswer(response.data.answer || "No answer received.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not get an answer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="ai-tutor-page">
      <section className="tutor-intro-card">
        <div className="tutor-intro-icon" aria-hidden="true">
          ✨
        </div>

        <div className="tutor-intro-content">
          <span className="tutor-eyebrow">LEARN WITH AI</span>
          <h2>AI Tutor</h2>
          <p>
            Ask questions about your saved topics and get clear,
            step-by-step explanations.
          </p>
        </div>
      </section>

      {savedTopics.length === 0 ? (
        <section className="tutor-empty-state">
          <div className="tutor-empty-icon" aria-hidden="true">
            📚
          </div>
          <h3>No saved topics yet</h3>
          <p>
            Go to AI Topics, generate some topics, and save one to start
            learning with your AI Tutor.
          </p>
        </section>
      ) : (
        <section className="tutor-form-card">
          <div className="tutor-section-heading">
            <div>
              <span className="tutor-eyebrow">ASK YOUR QUESTION</span>
              <h3>What would you like to learn?</h3>
              <p>Choose a topic and ask your tutor to explain it.</p>
            </div>
            <div className="tutor-section-icon" aria-hidden="true">
              ✨
            </div>
          </div>

          <form onSubmit={handleAskQuestion} aria-busy={loading}>
            <div className="tutor-field">
              <label htmlFor="tutorTopic">Choose a saved topic</label>
              <select
                id="tutorTopic"
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                disabled={loading}
                required
              >
                <option value="">Select a topic</option>
                {savedTopics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="tutor-field">
              <label htmlFor="tutorQuestion">Your question</label>
              <textarea
                id="tutorQuestion"
                rows={5}
                placeholder="For example: Explain this topic in simple words..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={2000}
                disabled={loading}
                required
              />
              <div className="tutor-character-count">
                {question.length}/2000 characters
              </div>
            </div>

            {message && (
              <div className="tutor-message" role="alert">
                {message}
              </div>
            )}

            <div className="tutor-form-actions">
              <button
                className="tutor-submit-button"
                type="submit"
                disabled={loading || !selectedTopicId}
              >
                {loading ? (
                  <>
                    <span className="tutor-spinner" aria-hidden="true" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">✦</span>
                    Ask AI Tutor
                  </>
                )}
              </button>
              <span className="tutor-form-hint">
                Your tutor will explain the selected topic.
              </span>
            </div>
          </form>
        </section>
      )}

      {loading && (
        <div className="tutor-loading" role="status">
          <span className="tutor-spinner" aria-hidden="true" />
          <span>Your tutor is preparing an explanation...</span>
        </div>
      )}

      {answer && (
        <section className="tutor-answer">
          <div className="tutor-answer-header">
            <div>
              <span className="tutor-eyebrow">YOUR EXPLANATION</span>
              <h3>AI Tutor's Answer</h3>
            </div>
            <span className="tutor-answer-badge">AI generated</span>
          </div>

          <div className="markdown-answer">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>

          <div className="tutor-answer-note">
            Check important study facts with your textbook or trusted learning
            materials.
          </div>
        </section>
      )}
    </main>
  );
}

export default AITutor;