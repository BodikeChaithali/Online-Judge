import { useState } from "react";
import Navbar from "../components/Navbar";
import ProblemEditor from "../components/problemDetails/ProblemEditor";
import ProblemConsole from "../components/problemDetails/ProblemConsole";
import { starterCode } from "../data/problems";
import { runCode } from "../services/compilerService";
import "./css/Compiler.css";

export default function Compiler() {
  const [language, setLanguage] = useState("Java");
  const [code, setCode] = useState(starterCode.Java);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(starterCode[lang]);
  };

  const handleRun = async () => {
    try {
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

  const handleReset = () => {
    setCode(starterCode[language]);
    setInput("");
    setOutput("");
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
          <button className="run-btn" onClick={handleRun} disabled={loading}>
            {loading ? "Running..." : "Run Code"}
          </button>
          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
