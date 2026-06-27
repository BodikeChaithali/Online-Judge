import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { problems } from "../data/problems";
import { runCode } from "../services/compilerService";
import { useDraft } from "../hooks/useDraft";
import ProblemTabs from "../components/problemDetails/ProblemTabs";
import ProblemEditor from "../components/problemDetails/ProblemEditor";
import ProblemConsole from "../components/problemDetails/ProblemConsole";
import ActionButtons from "../components/problemDetails/ActionButtons";
import SubmissionModal from "../components/problemDetails/SubmissionModal";
import { useSubmissions } from "../hooks/useSubmissions";
import { useAIReview } from "../hooks/useAIReview";
import { useAuth } from "../context/AuthContext";
import "./css/ProblemDetails.css";

export default function ProblemDetails() {
  const { id } = useParams();
  const problem = problems.find((p) => p.id === Number(id));
  const { user, loading: authLoading } = useAuth();
  const {
    language,
    code,
    saveStatus,
    handleCodeChange,
    handleLanguageChange,
    handleReset,
  } = useDraft(user, id);
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="not-found">Loading...</div>
      </>
    );
  }

  if (!problem) {
    return (
      <>
        <Navbar />
        <div className="not-found">Problem Not Found</div>
      </>
    );
  }

  const {
    submissions,
    selectedSubmission,
    setSelectedSubmission,
    submissionStatus,
    showSubmissionStatus,
    setShowSubmissionStatus,
    handleSubmit,
  } = useSubmissions(
    user,
    problem,
    language,
    code,
    () => {
      navigate("/login");
    },
    setActiveTab,
  );

  const { aiReview, reviewLoading, reviewMessage, handleAIReview } =
    useAIReview(user, language, code, problem?.title, setActiveTab);

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

  return (
    <>
      <Navbar />
      <div className="problem-page">
        <div className="problem-layout">
          <div className="problem-statement">
            <ProblemTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              problem={problem}
              user={user}
              submissions={submissions}
              setSelectedSubmission={setSelectedSubmission}
              aiReview={aiReview}
              reviewLoading={reviewLoading}
              reviewMessage={reviewMessage}
            />
          </div>
          <div className="right-panel">
            <ProblemEditor
              language={language}
              code={code}
              saveStatus={saveStatus}
              handleLanguageChange={handleLanguageChange}
              handleCodeChange={handleCodeChange}
              setShowSubmissionStatus={setShowSubmissionStatus}
            />
            <ProblemConsole
              showSubmissionStatus={showSubmissionStatus}
              submissionStatus={submissionStatus}
              input={input}
              setInput={setInput}
              output={output}
            />
            <ActionButtons
              loading={loading}
              handleRun={handleRun}
              handleSubmit={handleSubmit}
              handleAIReview={handleAIReview}
              handleReset={handleReset}
              language={language}
              setShowSubmissionStatus={setShowSubmissionStatus}
            />
          </div>
        </div>
      </div>
      <SubmissionModal
        selectedSubmission={selectedSubmission}
        setSelectedSubmission={setSelectedSubmission}
      />
    </>
  );
}
