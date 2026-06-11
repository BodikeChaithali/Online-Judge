import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Navbar from "../components/Navbar";
import { problems } from "../data/problems";
import "./css/ProblemDetails.css";

export default function ProblemDetails() {
  const { id } = useParams();
  const problem = problems.find((p) => p.id === Number(id));

  if (!problem) {
    return (
      <>
        <Navbar />
        <div className="not-found">Problem Not Found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="problem-page">
        <div className="problem-layout">
          <div className="problem-statement">
            <h1>{problem.title}</h1>
            <div className="problem-meta">
              <span
                className={`difficulty ${problem.difficulty.toLowerCase()}`}
              >
                {problem.difficulty}
              </span>
              {problem.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <p>{problem.statement}</p>
            <h3>Examples</h3>
            {problem.examples.map((example, index) => (
              <div key={index} className="example-box">
                <strong>Example {index + 1}</strong>
                <pre>
                  {`Input: ${example.input}  
Output: ${example.output}`}
                </pre>
              </div>
            ))}
            <h3>Constraints</h3>
            <ul>
              {problem.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
          {/* RIGHT SIDE */}
          <div className="right-panel">
            <div className="editor-panel">
              <div className="editor-header">Java</div>
              <Editor
                height="100%"
                defaultLanguage="java"
                theme="vs-dark"
                defaultValue={problem.starterCode.Java}
                options={{
                  minimap: {
                    enabled: false,
                  },
                  fontSize: 15,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
            <div className="bottom-panel">
              <div className="output-panel">
                <h3>Output</h3>
                <p>Run your code to see output.</p>
              </div>
            </div>
            <div className="action-buttons">
              <button className="run-btn">Run Code</button>
              <button className="submit-btn">Submit</button>
              <button className="review-btn">AI Review</button>
              <button className="reset-btn">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
