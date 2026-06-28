const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getProblems = async () => {
  const response = await fetch(`${API_URL}/api/problems`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load problems");
  }

  return result;
};

export const getProblemById = async (id) => {
  const response = await fetch(`${API_URL}/api/problems/${id}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load problem");
  }

  return result;
};

export const getProblemStatuses = async () => {
  const response = await fetch(`${API_URL}/api/problems/status`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load problem statuses");
  }

  return result;
};
