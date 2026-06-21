const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getAIReview = async (code, language, problemTitle, userEmail) => {
  const response = await fetch(`${API_URL}/ai-review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      language,
      problemTitle,
      userEmail,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to generate review");
  }
  return data;
};
