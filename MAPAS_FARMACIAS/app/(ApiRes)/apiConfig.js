// apiConfig.js

const API_BASE_URL = "http://192.168.100.14:8080";

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Error en la solicitud");
    }
    return data;
  } catch (error) {
    console.error("Error en la solicitud API:", error.message);
    throw error;
  }
};
