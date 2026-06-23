export default function ProblemTabs({
  activeTab,
  setActiveTab,
  problem,
  user,
  submissions,
  setSelectedSubmission,
  aiReview,
  reviewLoading,
  reviewMessage,
}) {
  return (
    <>
      <div className="tabs">
        <button
          className={activeTab === "description" ? "active-tab" : ""}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button
          className={activeTab === "submissions" ? "active-tab" : ""}
          onClick={() => setActiveTab("submissions")}
        >
          Submissions
        </button>
        <button
          className={activeTab === "ai-review" ? "active-tab" : ""}
          onClick={() => setActiveTab("ai-review")}
        >
          AI Review
        </button>
      </div>
      {activeTab === "description" ? (
        <>
          <h1>{problem.title}</h1>
          <div className="problem-meta">
            <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
            {problem.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <p>{problem.statement}</p>
          <h3>Examples</h3>
          {problem.examples.map((example, index) => (
            <div key={index} className="example-box">
              <strong>Example {index + 1}</strong>
              <pre>{`Input: ${example.input}\nOutput: ${example.output}`}</pre>
            </div>
          ))}
          <h3>Constraints</h3>
          <ul>
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
          <h3>Input Format</h3>
          <pre>{problem.inputFormat}</pre>
          <h3>Output Format</h3>
          <p>{problem.outputFormat}</p>
        </>
      ) : activeTab === "submissions" ? (
        <div className="submissions-tab">
          {!user ? (
            <div className="empty-review">
              <h3>Login Required</h3>
              <p>Login to view your submissions.</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="empty-review">
              <h3>No Submissions Yet</h3>
              <p>Submit a solution to see your history.</p>
            </div>
          ) : (
            submissions.map((sub) => (
              <div key={sub._id} className="submission-card">
                <div className="submission-top">
                  <span
                    className={`status-badge ${sub.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {sub.status}
                  </span>
                  <span className="language-badge">{sub.language}</span>
                </div>
                <div className="submission-bottom">
                  <span>{new Date(sub.createdAt).toLocaleString()}</span>
                  <button
                    className="view-code-btn"
                    onClick={() => setSelectedSubmission(sub)}
                  >
                    View Code
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="ai-review-tab">
          {reviewLoading ? (
            <div className="empty-review">
              <h3>Generating AI Review...</h3>
              <p>Analyzing correctness, complexity and code quality.</p>
            </div>
          ) : reviewMessage ? (
            <h3>{reviewMessage}</h3>
          ) : aiReview ? (
            <>
              <h2>Score: {aiReview.score}/100</h2>
              <h3>Correctness</h3>
              <p>{aiReview.correctness}</p>
              <h3>Time Complexity</h3>
              <p>{aiReview.timeComplexity}</p>
              <h3>Space Complexity</h3>
              <p>{aiReview.spaceComplexity}</p>
              <h3>Potential Bugs</h3>
              <p>{aiReview.bugs}</p>
              <h3>Optimization Suggestions</h3>
              <p>{aiReview.optimization}</p>
              <h3>Code Quality</h3>
              <p>{aiReview.codeQuality}</p>
              <h3>Final Verdict</h3>
              <p>{aiReview.finalVerdict}</p>
            </>
          ) : (
            <div className="empty-review">
              <h3>{user ? "No AI Review Yet" : "Login Required"}</h3>
              <p>
                {user
                  ? "Click AI Review button to analyze your solution."
                  : "Login to generate AI Reviews."}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
