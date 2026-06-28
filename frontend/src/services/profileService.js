const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getProfileStats = async () => {
  const response = await fetch(`${API_URL}/api/profile/stats`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load profile statistics");
  }

  return result;
};
