function Dashboard({ subjects, savedTopics, tasks }) {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  const stats = [
    {
      title: "My Subjects",
      value: subjects.length,
      icon: "📚",
      color: "blue",
    },
    {
      title: "Saved Topics",
      value: savedTopics.length,
      icon: "🔖",
      color: "purple",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks,
      icon: "⏳",
      color: "orange",
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: "✓",
      color: "green",
    },
  ];

  const recentSubjects = subjects.slice(0, 3);

  return (
    <main className="dashboard-page">
      <section className="dashboard-welcome">
        <div className="welcome-copy">
          <span className="welcome-eyebrow">YOUR LEARNING SPACE</span>
          <h1>
            Welcome back, <span>Gopal!</span> 👋
          </h1>
          <p>
            Plan smarter, learn better, and grow with the power of AI.
          </p>
        </div>

        <div className="welcome-art" aria-hidden="true">
          <div className="welcome-art-glow"></div>
          <div className="welcome-book">📖</div>
          <div className="welcome-sparkle sparkle-one">✦</div>
          <div className="welcome-sparkle sparkle-two">✧</div>
          <div className="welcome-bubble">Keep learning!</div>
        </div>
      </section>

      <section className="dashboard-stats">
        {stats.map((stat) => (
          <article
            className={`stat-card stat-${stat.color}`}
            key={stat.title}
          >
            <div className="stat-card-top">
              <div className="stat-icon">{stat.icon}</div>
              <span className="stat-card-dot" aria-hidden="true">
                •
              </span>
            </div>
            <p className="stat-value">{stat.value}</p>
            <h3>{stat.title}</h3>
          </article>
        ))}
      </section>

      <section className="dashboard-content-grid">
        <article className="dashboard-panel subjects-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">KEEP IT UP</span>
              <h2>Recent Subjects</h2>
            </div>
            <span className="panel-heading-icon" aria-hidden="true">
              📘
            </span>
          </div>

          {recentSubjects.length === 0 ? (
            <div className="dashboard-empty">
              <div className="empty-icon">📚</div>
              <h3>No subjects yet</h3>
              <p>Add a subject to start organizing your learning.</p>
            </div>
          ) : (
            <div className="recent-subject-list">
              {recentSubjects.map((subject) => {
                const progress = Math.min(
                  100,
                  Math.max(0, Number(subject.progress) || 0)
                );

                return (
                  <div className="recent-subject" key={subject._id}>
                    <div className="subject-avatar" aria-hidden="true">
                      {subject.name?.trim()?.charAt(0)?.toUpperCase() || "S"}
                    </div>

                    <div className="recent-subject-info">
                      <div className="recent-subject-title">
                        <h3>{subject.name}</h3>
                        <span className="subject-difficulty">
                          {subject.difficulty || "Medium"}
                        </span>
                      </div>

                      <div
                        className="subject-progress-track"
                        role="progressbar"
                        aria-label={`${subject.name} progress`}
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="subject-progress-fill"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <span className="subject-progress-label">
                        {progress}% complete
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>

        <article className="dashboard-panel focus-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-eyebrow">YOUR MOMENTUM</span>
              <h2>Study Overview</h2>
            </div>
            <span className="panel-heading-icon" aria-hidden="true">
              ✨
            </span>
          </div>

          <div className="overview-highlight">
            <div className="overview-highlight-icon">🎯</div>
            <div>
              <h3>One step at a time</h3>
              <p>Small, consistent study sessions help build progress.</p>
            </div>
          </div>

          <div className="overview-row">
            <span>Tasks completed</span>
            <strong>
              {completedTasks} <span>/ {tasks.length}</span>
            </strong>
          </div>

          <div className="overview-progress-track">
            <div
              className="overview-progress-fill"
              style={{
                width:
                  tasks.length === 0
                    ? "0%"
                    : `${(completedTasks / tasks.length) * 100}%`,
              }}
            ></div>
          </div>

          <p className="overview-footnote">
            {pendingTasks === 0
              ? "You're all caught up on your tasks."
              : `You have ${pendingTasks} task${pendingTasks === 1 ? "" : "s"} left to complete.`}
          </p>
        </article>
      </section>
    </main>
  );
}

export default Dashboard;