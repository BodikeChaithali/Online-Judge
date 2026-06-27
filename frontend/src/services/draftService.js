const API_URL = import.meta.env.VITE_API_BASE_URL;

export const saveDraft = async (problemId, language, code, lastLanguage) => {
  const response = await fetch(`${API_URL}/draft`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      problemId,
      language,
      code,
      lastLanguage,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to save draft");
  }

  return data;
};

export const getDraft = async (problemId) => {
  const response = await fetch(`${API_URL}/draft/${problemId}`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch draft");
  }

  return data;
};

export const deleteLanguageDraft = async (problemId, language) => {
  const response = await fetch(`${API_URL}/draft`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      problemId,
      language,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete draft");
  }

  return data;
};
