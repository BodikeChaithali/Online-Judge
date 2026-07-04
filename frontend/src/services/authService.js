const API_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);

  return data;
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/api/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${API_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
  });

  return response.json();
};

export const updateUser = async (userData) => {
  const response = await fetch(`${API_URL}/api/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data;
};

export const deleteUser = async (password) => {
  const response = await fetch(`${API_URL}/api/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);

  return data;
};
