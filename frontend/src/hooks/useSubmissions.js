import { useState, useEffect } from "react";
import {
  submitCode,
  getSubmission,
  getProblemSubmissions,
} from "../services/submissionService";

export function useSubmissions(
  user,
  problem,
  language,
  code,
  onLoginRequired,
  setActiveTab,
) {
  const [submissionId, setSubmissionId] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showSubmissionStatus, setShowSubmissionStatus] = useState(false);

  const loadSubmissions = async () => {
    if (!user || !problem) return;
    try {
      const data = await getProblemSubmissions(problem.id);
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [user, problem]);

  useEffect(() => {
    if (!submissionId) return;
    const startedAt = Date.now();
    const interval = setInterval(async () => {
      try {
        if (Date.now() - startedAt > 120000) {
          clearInterval(interval);
          setSubmissionStatus({
            status: "Failed",
            verdict: "Judging is taking too long. Refresh the page to see the result.",
          });
          return;
        }
        const data = await getSubmission(submissionId);
        if (data.status !== "Running") {
          clearInterval(interval);
          setSubmissionStatus(data);
          await loadSubmissions();
          setActiveTab?.("submissions");
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [submissionId, setActiveTab]);

  useEffect(() => {
    if (!submissionStatus) return;
    setShowSubmissionStatus(true);
    const timer = setTimeout(() => {
      setShowSubmissionStatus(false);
    }, 60000);
    return () => clearTimeout(timer);
  }, [submissionStatus]);

  const handleSubmit = async () => {
    if (!user) {
      onLoginRequired?.();
      return;
    }
    if (!problem) return;
    try {
      const submission = await submitCode({
        problemId: problem.id,
        problemTitle: problem.title,
        language,
        code,
      });
      setSubmissionId(submission._id);
      setSubmissionStatus(submission);
    } catch (err) {
      console.error(err);
      setSubmissionStatus({
        status: "Failed",
        verdict: err.message || "Submission failed",
      });
    }
  };

  return {
    submissions,
    selectedSubmission,
    setSelectedSubmission,
    submissionStatus,
    showSubmissionStatus,
    setShowSubmissionStatus,
    handleSubmit,
  };
}
