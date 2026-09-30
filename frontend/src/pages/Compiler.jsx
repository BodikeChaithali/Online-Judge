import { useState } from "react";
import { Link } from "react-router-dom";           
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ProblemEditor from "../components/problemDetails/ProblemEditor";
import ProblemConsole from "../components/problemDetails/ProblemConsole";
import { defaultStarterCode } from "../constants/defaultStarterCode";
import { runCode } from "../services/compilerService";
import "./css/Compiler.css";

export default function Compiler() {
  const { user, setUser, loading: authLoading } = useAuth(); 
  const [language, setLanguage] = useState("Java");
  const [code, setCode] = useState(defaultStarterCode.Java);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(defaultStarterCode[lang]);
  };

  const handleRun = async () => {
    if (!user) return; 
    try {
      setLoading(true);
      setOutput("Running...");
      const data = await runCode(language, code, input);
      setOutput(data.output);
    } catch (err) {
      if (err.type === "AUTH") {
        setUser(null);    
        setOutput("Session expired. Please sign in to run code.");
      } else if (err.type === "TLE") {
        setOutput("⏱ Time Limit Exceeded");
      } else if (err.type === "MLE") {
        setOutput("Memory Limit Exceeded");
      } else if (err.type === "INTERNAL") {
        setOutput("Internal Error");
      } else {
        setOutput(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode(defaultStarterCode[language]);
    setInput("");
    setOutput(null);
  };

  return (
    <>
      <Navbar />
      <div className="compiler-page">
        <div className="compiler-layout">
          <ProblemEditor
            language={language}
            code={code}
            saveStatus=""
            handleLanguageChange={handleLanguageChange}
            handleCodeChange={setCode}
            setShowSubmissionStatus={() => {}}
          />
          <ProblemConsole
            showSubmissionStatus={false}
            submissionStatus={null}
            input={input}
            setInput={setInput}
            output={output}
          />
        </div>
        <div className="compiler-actions">
          {user ? (
              <button className="run-btn" onClick={handleRun} disabled={loading}>
                {loading ? "Running..." : "Run Code"}
              </button>
            ) : authLoading ? (
              <button className="run-btn" disabled>
                Run Code
              </button>
            ) : (
              <Link
                to="/login"
                state={{ from: "/compiler" }}
                className="run-btn run-btn--locked"
              >
                🔒 Sign in to run code
              </Link>
          )}
          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
