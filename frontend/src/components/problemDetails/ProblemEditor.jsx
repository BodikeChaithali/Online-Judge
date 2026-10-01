import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { COPY_PASTE_RESTRICTIONS } from "../../constants/copyPasteRestrictions";
import { blockClipboard } from "../../utils/blockClipboard";

export default function ProblemEditor({
  language,
  code,
  saveStatus,
  handleLanguageChange,
  handleCodeChange,
  setShowSubmissionStatus,
  restrictClipboard = COPY_PASTE_RESTRICTIONS.editor,
}) {
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef(null);
  const removeBlocking = useRef(null);

  const showNotice = (text) => {
    setNotice(text);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2500);
  };

  const handleMount = (editor) => {
    if (!restrictClipboard) return;
    removeBlocking.current = blockClipboard(editor.getDomNode(), {
      events: ["copy", "cut", "paste", "drop"],
      onBlocked: () => showNotice("Copy / paste is disabled in the editor"),
    });
  };

  useEffect(() => {
    return () => {
      removeBlocking.current?.();
      clearTimeout(noticeTimer.current);
    };
  }, []);

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <select
          value={language}
          onChange={(e) => {
            setShowSubmissionStatus?.(false);
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
        {notice && <span className="editor-notice">⚠ {notice}</span>}
      </div>
      <Editor
        height="100%"
        language={language === "CPP" ? "cpp" : language.toLowerCase()}
        theme="vs-dark"
        value={code}
        onMount={handleMount}
        onChange={(value) => {
          setShowSubmissionStatus?.(false);
          handleCodeChange(value);
        }}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 15,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          contextmenu: !restrictClipboard,
          dragAndDrop: !restrictClipboard,
          dropIntoEditor: { enabled: !restrictClipboard },
        }}
      />
    </div>
  );
}
