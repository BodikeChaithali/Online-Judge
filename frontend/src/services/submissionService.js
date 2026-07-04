const API_URL = import.meta.env.VITE_API_BASE_URL;

export const submitCode = async (data) => {
  const response = await fetch(`${API_URL}/api/submissions`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};

export const getProblemSubmissions = async (problemId) => {
  const response = await fetch(`${API_URL}/api/submissions/problem/${problemId}`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};

export const getSubmission = async (id) => {
  const response = await fetch(`${API_URL}/api/submissions/${id}`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};
