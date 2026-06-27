import { useState, useEffect, useRef, useCallback } from "react";
import { saveDraft, getDraft } from "../services/draftService";
import { starterCode } from "../data/problems";

const AUTOSAVE_DELAY_MS = 1000;

export function useDraft(user, problemId) {
  const [language, setLanguage] = useState("Java");
  const [code, setCode] = useState(starterCode["Java"]);
  const [saveStatus, setSaveStatus] = useState("");
  const [draftsCache, setDraftsCache] = useState({});

  const autoSaveTimer = useRef(null);
  const isLoadingDraft = useRef(false);
  useEffect(() => {
    if (!user || !problemId) return;

    const loadDraft = async () => {
      try {
        isLoadingDraft.current = true;
        const data = await getDraft(Number(problemId));
        if (data.draft) {
          const { lastLanguage, drafts } = data.draft;
          const loadedDrafts = {};
          ["Java", "C", "CPP", "Python"].forEach((lang) => {
            if (drafts[lang] !== undefined) loadedDrafts[lang] = drafts[lang];
          });
          setDraftsCache(loadedDrafts);
          const resolvedLanguage = lastLanguage || "Java";
          const resolvedCode =
            drafts[resolvedLanguage] ?? starterCode[resolvedLanguage];
          setLanguage(resolvedLanguage);
          setCode(resolvedCode);
        }
      } catch (err) {
        console.error("Failed to load draft:", err);
      } finally {
        isLoadingDraft.current = false;
      }
    };
    loadDraft();
  }, []);

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  const triggerAutoSave = useCallback(
    (currentLanguage, currentCode) => {
      if (!user || !problemId) return;
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      setSaveStatus("unsaved");
      autoSaveTimer.current = setTimeout(async () => {
        try {
          setSaveStatus("saving...");
          await saveDraft(
            Number(problemId),
            currentLanguage,
            currentCode,
            currentLanguage,
          );
          setSaveStatus("saved");
        } catch (err) {
          console.error("Auto-save failed:", err);
          setSaveStatus("error");
        }
      }, AUTOSAVE_DELAY_MS);
    },
    [user, problemId],
  );
  
  const handleCodeChange = (value) => {
    const newCode = value || "";
    setCode(newCode);
    setDraftsCache((prev) => ({ ...prev, [language]: newCode }));
    if (!isLoadingDraft.current) triggerAutoSave(language, newCode);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setDraftsCache((prev) => ({ ...prev, [language]: code }));
    setLanguage(newLanguage);
    const cachedCode = draftsCache[newLanguage] ?? starterCode[newLanguage];
    setCode(cachedCode);
    if (user && problemId) {
      saveDraft(
        Number(problemId),
        newLanguage,
        cachedCode,
        newLanguage,
      ).catch((err) => console.error("Failed to save language switch:", err));
    }
  };

  const handleReset = (currentLanguage) => {
    const resetCode = starterCode[currentLanguage];
    setCode(resetCode);
    setDraftsCache((prev) => ({ ...prev, [currentLanguage]: resetCode }));
    triggerAutoSave(currentLanguage, resetCode);
  };

  return {
    language,
    code,
    saveStatus,
    handleCodeChange,
    handleLanguageChange,
    handleReset,
  };
}
