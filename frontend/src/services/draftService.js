const API_URL = import.meta.env.VITE_API_BASE_URL;

export const saveDraft = async (
  email,
  problemId,
  language,
  code,
  lastLanguage,
) => {
  const response = await fetch(`${API_URL}/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
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

export const getDraft = async (email, problemId) => {
  const response = await fetch(`${API_URL}/draft/${email}/${problemId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch draft");
  }

  return data;
};

export const deleteLanguageDraft = async (email, problemId, language) => {
  const response = await fetch(`${API_URL}/draft`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
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
