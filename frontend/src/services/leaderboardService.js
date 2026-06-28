const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getLeaderboard = async () => {
  const response = await fetch(`${API_URL}/leaderboard`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load leaderboard");
  }

  return result;
};
