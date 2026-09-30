import { Link, useLocation } from "react-router-dom";

export default function ActionButtons({
  user,                              
  loading,
  handleRun,
  handleSubmit,
  handleAIReview,
  handleReset,
  language,
  setShowSubmissionStatus,
}) {
  const location = useLocation();

  return (
    <div className="action-buttons">
      {user ? (
        <button className="run-btn" onClick={handleRun} disabled={loading}>
          {loading ? "Running..." : "Run Code"}
        </button>
      ) : (
        <Link
          to="/login"
          state={{ from: location.pathname }}
          className="run-btn run-btn--locked"
        >
          🔒 Sign in to run code
        </Link>
      )}
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
