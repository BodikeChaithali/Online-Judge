const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getAIReview = async (code, language, problemTitle) => {
  const response = await fetch(`${API_URL}/api/ai-review`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      language,
      problemTitle,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to generate review");
  }
  return data;
};