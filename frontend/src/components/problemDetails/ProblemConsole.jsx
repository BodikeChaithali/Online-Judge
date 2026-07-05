import { useState, useEffect } from "react";

export default function ProblemConsole({
  showSubmissionStatus,
  submissionStatus,
  input,
  setInput,
  output,
}) {
  const [activeTab, setActiveTab] = useState("input");

  useEffect(() => {
    if (output !== null) {
      setActiveTab("output");
    }
  }, [output]);

  if (showSubmissionStatus && submissionStatus) {
    return (
      <div className="bottom-panel">
        <div className="console-header">
          <span>Submission Status</span>
        </div>
        <div className="console-body submission-status">
          <p>
            <strong>Status:</strong> {submissionStatus.status}
          </p>
          <p>
            <strong>Verdict:</strong> {submissionStatus.verdict || "-"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bottom-panel">
      <div className="console-header">
        <button
          className={activeTab === "input" ? "active-console-tab" : ""}
          onClick={() => setActiveTab("input")}
        >
          Input
        </button>
        <button
          className={activeTab === "output" ? "active-console-tab" : ""}
          onClick={() => setActiveTab("output")}
        >
          Output
        </button>
      </div>
      <div className="console-body">
        {activeTab === "input" ? (
          <textarea
            className="input-box"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter custom input..."
          />
        ) : output === null ? (
          <pre className="output-none">Run your code to see output.</pre>
        ) : output === "⏱ Time Limit Exceeded" ||
          output === "Memory Limit Exceeded" ||
          output === "Internal Error" ? (
          <pre className="output-none">{output}</pre>
        ) : (
          <pre>{output}</pre>
        )}
      </div>
    </div>
  );
}
