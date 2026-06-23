export default function SubmissionModal({
  selectedSubmission,
  setSelectedSubmission,
}) {
  if (!selectedSubmission) return null;
  return (
    <div
      className="submission-modal-overlay"
      onClick={() => setSelectedSubmission(null)}
    >
      <div className="submission-modal" onClick={(e) => e.stopPropagation()}>
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
  );
}
