export default function ActionButtons({
  loading,
  handleRun,
  handleSubmit,
  handleAIReview,
  handleReset,
  language,
  setShowSubmissionStatus,
}) {
  return (
    <div className="action-buttons">
      <button className="run-btn" onClick={handleRun} disabled={loading}>
        {loading ? "Running..." : "Run Code"}
      </button>
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
      <button className="review-btn" onClick={handleAIReview}>
        AI Review
      </button>
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
  );
}
