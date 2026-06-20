const API_URL = import.meta.env.VITE_API_BASE_URL;

export const runCode = async (language, code, input = "") => {
  const languageMap = {
    Java: "java",
    C: "c",
    CPP: "cpp",
    Python: "py",
  };

  const response = await fetch(`${API_URL}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: languageMap[language],
      code,
      input,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || "Execution failed");
    error.type = data.type;
    throw error;
  }

  return data;
};