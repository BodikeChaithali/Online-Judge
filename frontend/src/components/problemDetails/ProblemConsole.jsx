export default function ProblemConsole({
  showSubmissionStatus,
  submissionStatus,
  input,
  setInput,
  output,
}) {
  return showSubmissionStatus && submissionStatus ? (
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
  );
}
