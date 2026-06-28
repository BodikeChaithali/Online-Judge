import { useState, useEffect, useRef, useCallback } from "react";
import { saveDraft, getDraft } from "../services/draftService";
import { defaultStarterCode } from "../constants/defaultStarterCode";

const AUTOSAVE_DELAY_MS = 1000;
const LANGUAGES = ["Java", "C", "CPP", "Python"];

export function useDraft(user, problemId, starterCode) {
  const getStarter = useCallback(
    (lang) => starterCode?.[lang] ?? defaultStarterCode[lang] ?? "",
    [starterCode],
  );

  const [language, setLanguage] = useState("Java");
  const [code, setCode] = useState(() => defaultStarterCode.Java);
  const [saveStatus, setSaveStatus] = useState("");
  const [draftsCache, setDraftsCache] = useState({});

  const autoSaveTimer = useRef(null);
  const isLoadingDraft = useRef(false);

  useEffect(() => {
    if (!problemId) return;

    if (!user) {
      setDraftsCache({});
      setLanguage("Java");
      setCode(getStarter("Java"));
      return;
    }

    const loadDraft = async () => {
      try {
        isLoadingDraft.current = true;
        const data = await getDraft(Number(problemId));
        if (data.draft) {
          const { lastLanguage, drafts } = data.draft;
          const loadedDrafts = {};
          LANGUAGES.forEach((lang) => {
            if (drafts[lang] !== undefined) loadedDrafts[lang] = drafts[lang];
          });
          setDraftsCache(loadedDrafts);
          const resolvedLanguage = lastLanguage || "Java";
          setLanguage(resolvedLanguage);
          setCode(drafts[resolvedLanguage] ?? getStarter(resolvedLanguage));
        } else {
          setDraftsCache({});
          setLanguage("Java");
          setCode(getStarter("Java"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        isLoadingDraft.current = false;
      }
    };
    loadDraft();
  }, [user, problemId, getStarter]);

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
    const cachedCode = draftsCache[newLanguage] ?? getStarter(newLanguage);
    setCode(cachedCode);
    if (user && problemId) {
      saveDraft(Number(problemId), newLanguage, cachedCode, newLanguage).catch(
        (err) => console.error("Failed to save language switch:", err),
      );
    }
  };

  const handleReset = (currentLanguage) => {
    const resetCode = getStarter(currentLanguage);
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
