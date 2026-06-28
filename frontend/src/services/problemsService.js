const API_URL = import.meta.env.VITE_API_BASE_URL;

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
