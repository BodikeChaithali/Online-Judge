const API_URL = import.meta.env.VITE_API_BASE_URL;

export const submitCode = async (data) => {
  const response = await fetch(`${API_URL}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getProblemSubmissions = async (problemId, email) => {
  const response = await fetch(
    `${API_URL}/submissions/problem/${problemId}?email=${email}`,
  );
  return response.json();
};

export const getSubmission = async (id) => {
  const response = await fetch(`${API_URL}/submissions/${id}`);
  return response.json();
};
