import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
// const apiUrl = "/api";

// Login
export const login = async (data) => {
  return await axios.post(`${apiUrl}/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
