import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Navbar from "../components/Navbar";
import { problems } from "../data/problems";
import { runCode } from "../services/compilerService";
import { useDraft } from "../hooks/useDraft";
import { submitCode, getSubmission, getProblemSubmissions,} from "../services/submissionService";
import "./css/ProblemDetails.css";

export default function ProblemDetails() {
  const { id } = useParams();
  const problem = problems.find((p) => p.id === Number(id));
  const user = JSON.parse(localStorage.getItem("user"));
  const {
    language,
    code,
    saveStatus,
    handleCodeChange,
    handleLanguageChange,
    handleReset,
  } = useDraft(user?.email, id);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showSubmissionStatus, setShowSubmissionStatus] = useState(false);
  if (!problem) {
    return (
      <>
        <Navbar />
        <div className="not-found">Problem Not Found</div>
      </>
    );
  }
  const loadSubmissions = async () => {
    try {
      const data = await getProblemSubmissions(problem.id, user.email);
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);
  
  useEffect(() => {
    if (!submissionId) return;
    const interval = setInterval(async () => {
      try {
        const data = await getSubmission(submissionId);
        setSubmissionStatus(data);
        if (data.status !== "Running") {
          clearInterval(interval);
          loadSubmissions();
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [submissionId]);

  useEffect(() => {
    if (!submissionStatus) return;
    setShowSubmissionStatus(true);
    const timer = setTimeout(() => {
      setShowSubmissionStatus(false);
    }, 60000);
    return () => clearTimeout(timer);
  }, [submissionStatus]);

  const handleRun = async () => {
    try {
      setShowSubmissionStatus(false);
      setLoading(true);
      setOutput("Running...");
      const data = await runCode(language, code, input);
      setOutput(data.output);
    } catch (err) {
      if (err.type === "TLE") {
        setOutput("⏱ Time Limit Exceeded");
      } else {
        setOutput(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const submission = await submitCode({
        userEmail: user.email,
        problemId: problem.id,
        problemTitle: problem.title,
        language,
        code,
      });
      setSubmissionId(submission._id);
      setSubmissionStatus(submission);
      loadSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="problem-page">
        <div className="problem-layout">
          <div className="problem-statement">
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
            </div>
            {activeTab === "description" ? (
              <>
                <h1>{problem.title}</h1>
                <div className="problem-meta">
                  <span
                    className={`difficulty ${problem.difficulty.toLowerCase()}`}
                  >
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
                    <pre>
                      {`Input: ${example.input}\nOutput: ${example.output}`}
                    </pre>
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
            ) : (
              <div className="submissions-tab">
                {submissions.length === 0 ? (
                  <p>No submissions yet</p>
                ) : (
                  submissions.map((sub) => (
                    <div key={sub._id} className="submission-card">
                      <div className="submission-top">
                        <span
                          className={`status-badge ${sub.status.toLowerCase().replaceAll(" ", "-")}`}
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
            )}
          </div>
          <div className="right-panel">
            <div className="editor-panel">
              <div className="editor-header">
                <select
                  value={language}
                  onChange={(e) => {
                    setShowSubmissionStatus(false);
                    handleLanguageChange(e);
                  }}
                >
                  <option value="Java">Java</option>
                  <option value="C">C</option>
                  <option value="CPP">C++</option>
                  <option value="Python">Python</option>
                </select>
                {saveStatus && (
                  <span
                    className={`save-status save-status--${saveStatus.replace(
                      "...",
                      "",
                    )}`}
                  >
                    {saveStatus === "saving..." && "💾 Saving..."}
                    {saveStatus === "saved" && "✓ Saved"}
                    {saveStatus === "error" && "⚠ Save failed"}
                    {saveStatus === "unsaved" && "● Unsaved"}
                  </span>
                )}
              </div>
              <Editor
                height="100%"
                language={language === "CPP" ? "cpp" : language.toLowerCase()}
                theme="vs-dark"
                value={code}
                onChange={(value) => {
                  setShowSubmissionStatus(false);
                  handleCodeChange(value);
                }}
                options={{
                  minimap: {
                    enabled: false,
                  },
                  fontSize: 15,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
            {showSubmissionStatus && submissionStatus ? (
              <div className="submission-status">
                <h3>Submission Status</h3>
                <p>
                  <strong>Status:</strong> {submissionStatus.status}
                </p>
                <p>
                  <strong>Verdict:</strong> {submissionStatus.verdict || "-"}
                </p>
              </div>
            ) : (
              <div className="bottom-panel">
                <div className="input-panel">
                  <h3>Input</h3>
                  <textarea
                    className="input-box"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter custom input..."
                  />
                </div>
                <div className="output-panel">
                  <h3>Output</h3>
                  <pre>{output || "Run your code to see output."}</pre>
                </div>
              </div>
            )}
            <div className="action-buttons">
              <button
                className="run-btn"
                onClick={handleRun}
                disabled={loading}
              >
                {loading ? "Running..." : "Run Code"}
              </button>
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
              <button className="review-btn">AI Review</button>
              <button
                className="reset-btn"
                onClick={() => {
                  setShowSubmissionStatus(false);
                  handleReset(language);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      {selectedSubmission && (
        <div
          className="submission-modal-overlay"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="submission-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Submitted Code</h3>
              <button
                className="close-modal-btn"
                onClick={() => setSelectedSubmission(null)}
              >
                ✕
              </button>
            </div>
            <pre className="submission-code">{selectedSubmission.code}</pre>
          </div>
        </div>
      )}
    </>
  );
}