import Editor from "@monaco-editor/react";

export default function ProblemEditor({
  language,
  code,
  saveStatus,
  handleLanguageChange,
  handleCodeChange,
  setShowSubmissionStatus,
}) {
  return (
    <div className="editor-panel">
      <div className="editor-header">
        <select
          value={language}
          onChange={(e) => {
            setShowSubmissionStatus(false);
            handleLanguageChange(e);
          }}
        >
          <option value="Java">Java</option>
          <option value="C">C</option>
          <option value="CPP">C++</option>
          <option value="Python">Python</option>
        </select>
        {saveStatus && (
          <span
            className={`save-status save-status--${saveStatus.replace(
              "...",
              "",
            )}`}
          >
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
        onChange={(value) => {
          setShowSubmissionStatus(false);
          handleCodeChange(value);
        }}
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
  );
}
