import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AITutor from "./pages/AITutor";
import StudyPlan from "./pages/StudyPlan";

const API_URL = "http://localhost:5000";

// LOGIN PAGE
function LoginPage({
  email,
  password,
  message,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <div className="auth-page">
      <main className="auth-card">
        <h2>Login</h2>

        <form onSubmit={onSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <p>
          New user? <Link to="/register">Create an account</Link>
        </p>

        {message && <p className="auth-message">{message}</p>}
      </main>
    </div>
  );
}

// REGISTER PAGE
function RegisterPage({
  name,
  email,
  password,
  message,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <div className="auth-page">
      <main className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={onSubmit}>
          <div className="auth-field">
            <label htmlFor="registerName">Name</label>
            <input
              id="registerName"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="registerEmail">Email</label>
            <input
              id="registerEmail"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="registerPassword">Password</label>
            <input
              id="registerPassword"
              type="password"
              placeholder="Create password (minimum 6 characters)"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit">Register</button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </main>
    </div>
  );
}
// ==================== SUBJECTS PAGE ====================

function SubjectsPage({
  subjects,
  subjectName,
  difficulty,
  editingId,
  editName,
  editDifficulty,
  editProgress,
  message,
  onSubjectNameChange,
  onDifficultyChange,
  onAddSubject,
  onEditNameChange,
  onEditDifficultyChange,
  onEditProgressChange,
  onEditClick,
  onUpdateSubject,
  onCancelEdit,
  onDeleteSubject,
}) {
  return (
    <main className="subjects-page">
      <div className="subjects-page-header">
        <div>
          <span className="page-eyebrow">YOUR LEARNING SPACE</span>
          <h1>My Subjects</h1>
          <p>Organize your learning and track your progress.</p>
        </div>
        <div className="subjects-header-art" aria-hidden="true">
          📚
        </div>
      </div>

      <section className="subjects-add-panel">
        <div className="subjects-section-heading">
          <div>
            <span className="panel-eyebrow">GET STARTED</span>
            <h2>Add a New Subject</h2>
          </div>
          <span className="subjects-panel-icon" aria-hidden="true">
            ✨
          </span>
        </div>

        <form className="subjects-add-form" onSubmit={onAddSubject}>
          <div className="subjects-field">
            <label htmlFor="newSubjectName">Subject name</label>
            <input
              id="newSubjectName"
              type="text"
              placeholder="e.g. Data Structures"
              value={subjectName}
              onChange={(e) => onSubjectNameChange(e.target.value)}
              required
            />
          </div>

          <div className="subjects-field subjects-difficulty-field">
            <label htmlFor="newSubjectDifficulty">Difficulty</label>
            <select
              id="newSubjectDifficulty"
              value={difficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <button className="subjects-add-button" type="submit">
            <span aria-hidden="true">＋</span> Add Subject
          </button>
        </form>

        {message && (
          <p className="subjects-message" role="status">
            {message}
          </p>
        )}
      </section>

      <section className="subjects-list-section">
        <div className="subjects-section-heading">
          <div>
            <span className="panel-eyebrow">YOUR COLLECTION</span>
            <h2>Subjects List</h2>
          </div>
          <span className="subjects-count">
            {subjects.length} {subjects.length === 1 ? "subject" : "subjects"}
          </span>
        </div>

        {subjects.length === 0 ? (
          <div className="subjects-empty-state">
            <div className="subjects-empty-icon" aria-hidden="true">
              📘
            </div>
            <h3>No subjects added yet</h3>
            <p>Add your first subject above to start tracking your learning.</p>
          </div>
        ) : (
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <article className="subject-card" key={subject._id}>
                {editingId === subject._id ? (
                  <div className="subject-edit-form">
                    <div className="subject-card-heading">
                      <div className="subject-card-icon" aria-hidden="true">
                        ✏️
                      </div>
                      <h3>Edit Subject</h3>
                    </div>

                    <div className="subjects-field">
                      <label htmlFor={`edit-name-${subject._id}`}>
                        Subject name
                      </label>
                      <input
                        id={`edit-name-${subject._id}`}
                        type="text"
                        value={editName}
                        onChange={(e) => onEditNameChange(e.target.value)}
                        required
                      />
                    </div>

                    <div className="subjects-field">
                      <label htmlFor={`edit-difficulty-${subject._id}`}>
                        Difficulty
                      </label>
                      <select
                        id={`edit-difficulty-${subject._id}`}
                        value={editDifficulty}
                        onChange={(e) =>
                          onEditDifficultyChange(e.target.value)
                        }
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div className="subjects-field">
                      <label htmlFor={`edit-progress-${subject._id}`}>
                        Progress (%)
                      </label>
                      <input
                        id={`edit-progress-${subject._id}`}
                        type="number"
                        min="0"
                        max="100"
                        value={editProgress}
                        onChange={(e) =>
                          onEditProgressChange(e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="subject-card-actions">
                      <button
                        className="subject-save-button"
                        type="button"
                        onClick={() => onUpdateSubject(subject._id)}
                      >
                        Save Changes
                      </button>
                      <button
                        className="subject-cancel-button"
                        type="button"
                        onClick={onCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="subject-card-heading">
                      <div className="subject-card-icon" aria-hidden="true">
                        📘
                      </div>
                      <span
                        className={`subject-difficulty-badge difficulty-${String(
                          subject.difficulty || "medium"
                        ).toLowerCase()}`}
                      >
                        {subject.difficulty}
                      </span>
                    </div>

                    <h3 className="subject-card-title">{subject.name}</h3>

                    <div className="subject-progress-heading">
                      <span>Learning progress</span>
                      <strong>{subject.progress || 0}%</strong>
                    </div>

                    <div
                      className="subject-progress-track"
                      role="progressbar"
                      aria-label={`${subject.name} progress`}
                      aria-valuenow={Number(subject.progress) || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="subject-progress-fill"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, Number(subject.progress) || 0)
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="subject-card-actions">
                      <button
                        className="subject-edit-button"
                        type="button"
                        onClick={() => onEditClick(subject)}
                      >
                        Edit
                      </button>
                      <button
                        className="subject-delete-button"
                        type="button"
                        onClick={() => onDeleteSubject(subject._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
// ==================== AI TOPICS PAGE ====================

function TopicsPage({
  subjects,
  selectedSubjectId,
  generatedTopics,
  selectedTopics,
  savedTopics,
  message,
  onSubjectChange,
  onGenerateTopics,
  onTopicSelection,
  onAddSelectedTopics,
  onDeleteTopic,
  onToggleTopic,
  isGeneratingTopics = false,
}) {
  return (
    <main className="topics-page">
      <section className="subjects-page-header">
        <div>
          <span className="page-eyebrow">LEARN WITH AI</span>
          <h1>AI Topic Generator</h1>
          <p>Choose a subject and let AI help organize what to study.</p>
        </div>

        <div className="subjects-header-art">✦</div>
      </section>

      <section className="subjects-add-panel">
        <div className="subjects-section-heading">
          <h2>Generate new topics</h2>
          <span className="subjects-panel-icon">✨</span>
        </div>

        <div className="topics-generate-form">
          <div className="subjects-field">
            <label htmlFor="subjectSelect">Select subject</label>
            <select
              id="subjectSelect"
              value={selectedSubjectId}
              onChange={(e) => onSubjectChange(e.target.value)}
            >
              <option value="">Choose a subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className={`generate-topics-button ${
              isGeneratingTopics ? "is-generating" : ""
            }`}
            onClick={onGenerateTopics}
            disabled={!selectedSubjectId || isGeneratingTopics}
          >
            {isGeneratingTopics ? "Generating topics..." : "Generate Topics with AI"}
          </button>
        </div>

        {message && <p className="subjects-message">{message}</p>}
      </section>

      {generatedTopics.length > 0 && (
        <section className="subjects-add-panel">
          <div className="subjects-section-heading">
            <h2>AI generated topics</h2>
            <span className="subjects-count">
              {generatedTopics.length} topics
            </span>
          </div>

          <div className="topics-generated-list">
            {generatedTopics.map((topic, index) => {
              const isSelected = selectedTopics.some(
                (item) => item.title === topic.title
              );

              return (
                <label
                  className="topic-generated-card"
                  key={`${topic.title}-${index}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onTopicSelection(topic)}
                  />

                  <span className="topic-generated-details">
                    <strong>{topic.title}</strong>
                    <small>{topic.difficulty || "Difficulty not set"}</small>
                  </span>
                </label>
              );
            })}
          </div>

          <div className="topics-save-row">
            <span>Selected: {selectedTopics.length}</span>
            <button
              type="button"
              onClick={onAddSelectedTopics}
              disabled={selectedTopics.length === 0}
            >
              Add selected topics
            </button>
          </div>
        </section>
      )}

      <section className="topics-saved-section">
        <div className="subjects-section-heading">
          <h2>My saved topics</h2>
          <span className="subjects-count">{savedTopics.length} saved</span>
        </div>

        {savedTopics.length === 0 ? (
          <div className="subjects-empty-state">
            <div className="subjects-empty-icon">📘</div>
            <h3>No saved topics yet</h3>
            <p>Generate topics above and add the ones you want to study.</p>
          </div>
        ) : (
          <div className="topics-saved-list">
            {savedTopics.map((topic) => (
              <article className="topic-saved-card" key={topic._id}>
                <div className="topic-saved-info">
                  <h3>{topic.title}</h3>
                  <p>
                    Subject: {topic.subjectId?.name || "Unknown"}
                  </p>
                  <span className="subject-difficulty-badge">
                    {topic.difficulty || "Not set"}
                  </span>
                  <span
                    className={`topic-status ${
                      topic.completed ? "topic-status-completed" : ""
                    }`}
                  >
                    {topic.completed ? "Completed" : "Not completed"}
                  </span>
                </div>

                <div className="subject-card-actions">
                  <button
                    type="button"
                    className="subject-edit-button"
                    onClick={() => onToggleTopic(topic)}
                  >
                    {topic.completed ? "Mark pending" : "Mark completed"}
                  </button>

                  <button
                    type="button"
                    className="subject-delete-button"
                    onClick={() => onDeleteTopic(topic._id)}
                  >
                    Delete topic
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
// ==================== STUDY PLANNER PAGE ====================

function PlannerPage({
  savedTopics,
  tasks,
  taskTitle,
  taskDescription,
  taskPriority,
  taskDueDate,
  taskTopicId,
  taskMessage,
  onTaskTitleChange,
  onTaskDescriptionChange,
  onTaskPriorityChange,
  onTaskDueDateChange,
  onTaskTopicChange,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  isTaskOverdue,
}) {
  return (
    <main>
      <h2>Study Planner</h2>

      <form onSubmit={onAddTask}>
        <div>
          <label htmlFor="taskTitle">Task title</label>
          <br />
          <input
            id="taskTitle"
            type="text"
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => onTaskTitleChange(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label htmlFor="taskDescription">Description</label>
          <br />
          <textarea
            id="taskDescription"
            placeholder="Task description"
            value={taskDescription}
            onChange={(e) =>
              onTaskDescriptionChange(e.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label htmlFor="taskPriority">Priority: </label>
          <select
            id="taskPriority"
            value={taskPriority}
            onChange={(e) =>
              onTaskPriorityChange(e.target.value)
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <br />

        <div>
          <label htmlFor="taskDueDate">Due Date: </label>
          <input
            id="taskDueDate"
            type="date"
            value={taskDueDate}
            onChange={(e) => onTaskDueDateChange(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label htmlFor="taskTopic">Select Topic: </label>
          <select
            id="taskTopic"
            value={taskTopicId}
            onChange={(e) => onTaskTopicChange(e.target.value)}
          >
            <option value="">Select a topic</option>

            {savedTopics.map((topic) => (
              <option key={topic._id} value={topic._id}>
                {topic.title}
              </option>
            ))}
          </select>
        </div>

        <br />

        <button type="submit">Add Study Task</button>
      </form>

      {taskMessage && <p>{taskMessage}</p>}

      <hr />

      <h2>My Study Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <section
            key={task._id}
            style={{
              border: "1px solid #d1d5db",
              borderLeft: task.completed
                ? "5px solid #16a34a"
                : isTaskOverdue(task)
                ? "5px solid #dc2626"
                : "5px solid #f59e0b",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "14px",
              backgroundColor: task.completed
                ? "#f0fdf4"
                : isTaskOverdue(task)
                ? "#fef2f2"
                : "#fffbeb",
              opacity: task.completed ? 0.8 : 1,
            }}
          >
            <h3
              style={{
                marginTop: 0,
                textDecoration: task.completed
                  ? "line-through"
                  : "none",
              }}
            >
              {task.title}
            </h3>

            <p>
              <strong>Description:</strong>{" "}
              {task.description || "No description"}
            </p>

            <p>
              <strong>Priority:</strong> {task.priority}
            </p>

            <p>
              <strong>Due Date:</strong>{" "}
              {task.dueDate
                ? task.dueDate.split("T")[0]
                : "No date"}
            </p>

            <p>
              <strong>Topic:</strong>{" "}
              {task.topicId?.title || "Unknown"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {task.completed
                ? "Completed ✅"
                : "Pending ⏳"}
            </p>

            {!task.completed && isTaskOverdue(task) && (
              <p style={{ color: "#b91c1c", fontWeight: "bold" }}>
                Overdue ⚠️
              </p>
            )}

            <button
              type="button"
              onClick={() => onToggleTask(task)}
            >
              {task.completed
                ? "Mark Pending"
                : "Mark Complete"}
            </button>{" "}

            <button
              type="button"
              onClick={() => onDeleteTask(task._id)}
            >
              Delete
            </button>
          </section>
        ))
      )}
    </main>
  );
}

// ==================== MAIN APP ====================

function App() {
  const navigate = useNavigate();

  // ==================== AUTH STATES ====================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  // ==================== SUBJECT STATES ====================

  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("Medium");
  const [editProgress, setEditProgress] = useState(0);

  // ==================== AI TOPIC STATES ====================

  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [generatedTopics, setGeneratedTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [savedTopics, setSavedTopics] = useState([]);

  // ==================== TASK STATES ====================

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskTopicId, setTaskTopicId] = useState("");
    const [taskMessage, setTaskMessage] = useState("");

  // ==================== AUTH HEADER ====================

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ==================== FETCH DATA ====================

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/subjects`,
        getAuthConfig()
      );

      setSubjects(response.data.subjects || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not fetch subjects"
      );
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/topics`,
        getAuthConfig()
      );

      setSavedTopics(response.data.topics || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not fetch topics"
      );
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/tasks`,
        getAuthConfig()
      );

      setTasks(response.data.tasks || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not fetch tasks"
      );
    }
  };

  const fetchAllData = () => {
    fetchSubjects();
    fetchTopics();
    fetchTasks();
  };

  // ==================== LOGIN / REGISTER / LOGOUT ====================

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);
      setMessage("Login successful!");

      fetchAllData();
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name.trim() || !email.trim() || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setMessage("Account created successfully. Please login.");
      setName("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setSubjects([]);
    setSavedTopics([]);
    setTasks([]);
    setGeneratedTopics([]);
    setSelectedTopics([]);
    setMessage("");
    setTaskMessage("");
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      fetchAllData();
    }
  }, []);

  // ==================== SUBJECT CRUD ====================

  const handleAddSubject = async (e) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      setMessage("Subject name is required");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/subjects`,
        {
          name: subjectName.trim(),
          difficulty,
        },
        getAuthConfig()
      );

      setSubjectName("");
      setDifficulty("Medium");
      setMessage("Subject added successfully");
      fetchSubjects();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not add subject"
      );
    }
  };

  const handleEditClick = (subject) => {
    setEditingId(subject._id);
    setEditName(subject.name);
    setEditDifficulty(subject.difficulty);
    setEditProgress(subject.progress);
  };

  const handleUpdateSubject = async (id) => {
    if (!editName.trim()) {
      setMessage("Subject name is required");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/subjects/${id}`,
        {
          name: editName.trim(),
          difficulty: editDifficulty,
          progress: Number(editProgress),
        },
        getAuthConfig()
      );

      setEditingId(null);
      setMessage("Subject updated successfully");
      fetchSubjects();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not update subject"
      );
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/subjects/${id}`,
        getAuthConfig()
      );

      setMessage("Subject deleted successfully");
      fetchAllData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not delete subject"
      );
    }
  };

  // ==================== AI TOPIC GENERATOR ====================

  const handleSubjectChange = (value) => {
    setSelectedSubjectId(value);
    setGeneratedTopics([]);
    setSelectedTopics([]);
    setMessage("");
  };

  const handleGenerateTopics = async () => {
    if (!selectedSubjectId) {
      setMessage("Please select a subject first");
      return;
    }

    const selectedSubject = subjects.find(
      (subject) => subject._id === selectedSubjectId
    );

    if (!selectedSubject) {
      setMessage("Selected subject was not found");
      return;
    }

    setIsGeneratingTopics(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/ai/topics`,
        {
          subject: selectedSubject.name,
        },
        getAuthConfig()
      );

      setGeneratedTopics(response.data.topics || []);
      setSelectedTopics([]);
      setMessage("AI topics generated successfully");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not generate AI topics"
      );
    } finally {
      setIsGeneratingTopics(false);
    }
  };

  const handleTopicSelection = (topic) => {
    const alreadySelected = selectedTopics.some(
      (item) => item.title === topic.title
    );

    if (alreadySelected) {
      setSelectedTopics(
        selectedTopics.filter(
          (item) => item.title !== topic.title
        )
      );
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleAddSelectedTopics = async () => {
    if (selectedTopics.length === 0) {
      setMessage("Please select at least one topic");
      return;
    }

    try {
      await Promise.all(
        selectedTopics.map((topic) =>
          axios.post(
            `${API_URL}/api/topics`,
            {
              title: topic.title,
              difficulty: topic.difficulty,
              subjectId: selectedSubjectId,
            },
            getAuthConfig()
          )
        )
      );

      setMessage("Selected topics added successfully");
      setSelectedTopics([]);
      setGeneratedTopics([]);
      fetchTopics();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not save selected topics"
      );
    }
  };
    // ==================== DELETE TOPIC ====================

  const handleDeleteTopic = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/topics/${id}`,
        getAuthConfig()
      );

      setMessage("Topic deleted successfully");
      fetchTopics();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not delete topic"
      );
    }
  };

  // ==================== TOGGLE TOPIC STATUS ====================

  const handleToggleTopic = async (topic) => {
    try {
      await axios.put(
        `${API_URL}/api/topics/${topic._id}`,
        {
          title: topic.title,
          difficulty: topic.difficulty,
          completed: !topic.completed,
        },
        getAuthConfig()
      );

      setMessage(
        topic.completed
          ? "Topic marked as pending"
          : "Topic marked as completed"
      );

      fetchTopics();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not update topic status"
      );
    }
  };

  // ==================== TASK CRUD ====================

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim() || !taskDueDate || !taskTopicId) {
      setTaskMessage(
        "Please enter a task title, due date, and select a topic."
      );
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/tasks`,
        {
          title: taskTitle.trim(),
          description: taskDescription,
          priority: taskPriority,
          dueDate: taskDueDate,
          topicId: taskTopicId,
        },
        getAuthConfig()
      );

      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("Medium");
      setTaskDueDate("");
      setTaskTopicId("");
      setTaskMessage("Task added successfully!");
      fetchTasks();
    } catch (error) {
      setTaskMessage(
        error.response?.data?.message || "Could not add task"
      );
    }
  };

  const handleToggleTask = async (task) => {
    try {
      await axios.put(
        `${API_URL}/api/tasks/${task._id}`,
        {
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          completed: !task.completed,
        },
        getAuthConfig()
      );

      setTaskMessage(
        task.completed
          ? "Task marked as pending"
          : "Task completed successfully"
      );

      fetchTasks();
    } catch (error) {
      setTaskMessage(
        error.response?.data?.message ||
          "Could not update task"
      );
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/tasks/${id}`,
        getAuthConfig()
      );

      setTaskMessage("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      setTaskMessage(
        error.response?.data?.message ||
          "Could not delete task"
      );
    }
  };

  // ==================== OVERDUE CHECK ====================

  const isTaskOverdue = (task) => {
    if (task.completed || !task.dueDate) {
      return false;
    }

    const today = new Date();

    const todayDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

    const taskDate = task.dueDate.split("T")[0];

    return taskDate < todayDate;
  };

  // ==================== APP LAYOUT ====================

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              email={email}
              password={password}
              message={message}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleLogin}
            />
          }
        />

        <Route
          path="/register"
          element={
            <RegisterPage
              name={name}
              email={email}
              password={password}
              message={message}
              onNameChange={setName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleRegister}
            />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">✦</div>
          <div className="brand-name">
            <strong>StudyMate</strong>
            <span>AI</span>
          </div>
        </div>

        <p className="sidebar-section-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <span className="sidebar-link-icon">⌂</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/subjects"
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <span className="sidebar-link-icon">▤</span>
            <span>My Subjects</span>
          </NavLink>

          <NavLink
            to="/topics"
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <span className="sidebar-link-icon">✧</span>
            <span>AI Topic Generator</span>
          </NavLink>

          <NavLink
            to="/tutor"
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <span className="sidebar-link-icon">✦</span>
            <span>AI Tutor</span>
          </NavLink>

          <NavLink
            to="/study-plan"
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <span className="sidebar-link-icon">▣</span>
            <span>AI Study Plan</span>
          </NavLink>

          <NavLink
            to="/planner"
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <span className="sidebar-link-icon">▦</span>
            <span>Study Planner</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-quote">
            <span className="quote-sparkle">✦</span>
            <p>Small steps every day lead to big results.</p>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <span className="sidebar-link-icon">↪</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-page-label">Your learning space</div>

          <div className="topbar-user">
            <div className="topbar-avatar">G</div>
            <div className="topbar-user-info">
              <strong>Gopal Chandra</strong>
              <span>Student</span>
            </div>
          </div>
        </header>

        <div className="app-page-content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  subjects={subjects}
                  savedTopics={savedTopics}
                  tasks={tasks}
                />
              }
            />

            <Route
              path="/subjects"
              element={
                <SubjectsPage
                  subjects={subjects}
                  subjectName={subjectName}
                  difficulty={difficulty}
                  editingId={editingId}
                  editName={editName}
                  editDifficulty={editDifficulty}
                  editProgress={editProgress}
                  message={message}
                  onSubjectNameChange={setSubjectName}
                  onDifficultyChange={setDifficulty}
                  onAddSubject={handleAddSubject}
                  onEditNameChange={setEditName}
                  onEditDifficultyChange={setEditDifficulty}
                  onEditProgressChange={setEditProgress}
                  onEditClick={handleEditClick}
                  onUpdateSubject={handleUpdateSubject}
                  onCancelEdit={() => setEditingId(null)}
                  onDeleteSubject={handleDeleteSubject}
                />
              }
            />

            <Route
              path="/topics"
              element={
                <TopicsPage
                  subjects={subjects}
                  selectedSubjectId={selectedSubjectId}
                  generatedTopics={generatedTopics}
                  selectedTopics={selectedTopics}
                  savedTopics={savedTopics}
                  message={message}
                  onSubjectChange={handleSubjectChange}
                  onGenerateTopics={handleGenerateTopics}
                  isGeneratingTopics={isGeneratingTopics}
                  onTopicSelection={handleTopicSelection}
                  onAddSelectedTopics={handleAddSelectedTopics}
                  onDeleteTopic={handleDeleteTopic}
                  onToggleTopic={handleToggleTopic}
                />
              }
            />

            <Route
              path="/tutor"
              element={
                <AITutor
                  savedTopics={savedTopics}
                  apiUrl={API_URL}
                  getAuthConfig={getAuthConfig}
                />
              }
            />

            <Route
              path="/study-plan"
              element={
                <StudyPlan
                  savedTopics={savedTopics}
                  apiUrl={API_URL}
                  getAuthConfig={getAuthConfig}
                />
              }
            />

            <Route
              path="/planner"
              element={
                <PlannerPage
                  savedTopics={savedTopics}
                  tasks={tasks}
                  taskTitle={taskTitle}
                  taskDescription={taskDescription}
                  taskPriority={taskPriority}
                  taskDueDate={taskDueDate}
                  taskTopicId={taskTopicId}
                  taskMessage={taskMessage}
                  onTaskTitleChange={(value) => {
                    setTaskTitle(value);
                    setTaskMessage("");
                  }}
                  onTaskDescriptionChange={setTaskDescription}
                  onTaskPriorityChange={setTaskPriority}
                  onTaskDueDateChange={(value) => {
                    setTaskDueDate(value);
                    setTaskMessage("");
                  }}
                  onTaskTopicChange={(value) => {
                    setTaskTopicId(value);
                    setTaskMessage("");
                  }}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  isTaskOverdue={isTaskOverdue}
                />
              }
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
