import { useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Navbar from "../components/Navbar";
import { problems } from "../data/problems";
import { runCode } from "../services/compilerService";
import { useDraft } from "../hooks/useDraft";
import "./css/ProblemDetails.css";

export default function ProblemDetails() {
  const { id } = useParams();
  const problem = problems.find((p) => p.id === Number(id));
  const user = JSON.parse(localStorage.getItem("user"));
  const { language, code, saveStatus, handleCodeChange, handleLanguageChange, handleReset } =
    useDraft(user?.email, id);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!problem) {
    return (
      <>
        <Navbar />
        <div className="not-found">Problem Not Found</div>
      </>
    );
  }

  const handleRun = async () => {
    try {
      setLoading(true);
      setOutput("Running...");
      const data = await runCode(language, code, input);
      setOutput(data.output);
    } catch (err) {
      setOutput(err.message);
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
            <h1>{problem.title}</h1>
            <div className="problem-meta">
              <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>
              {problem.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <p>{problem.statement}</p>
            <h3>Examples</h3>
            {problem.examples.map((example, index) => (
              <div key={index} className="example-box">
                <strong>Example {index + 1}</strong>
                <pre>{`Input: ${example.input}\nOutput: ${example.output}`}</pre>
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
          </div>
          <div className="right-panel">
            <div className="editor-panel">
              <div className="editor-header">
                <select value={language} onChange={handleLanguageChange}>
                  <option value="Java">Java</option>
                  <option value="C">C</option>
                  <option value="CPP">C++</option>
                  <option value="Python">Python</option>
                </select>
                {saveStatus && (
                  <span className={`save-status save-status--${saveStatus.replace("...", "")}`}>
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
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
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
            <div className="action-buttons">
              <button className="run-btn" onClick={handleRun} disabled={loading}>
                {loading ? "Running..." : "Run Code"}
              </button>
              <button className="submit-btn">Submit</button>
              <button className="review-btn">AI Review</button>
              <button className="reset-btn" onClick={() => handleReset(language)}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}