import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL = "/api";

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    console.error("No token found, redirecting to login.");
    window.location.href = "/login";
    return;
  }

  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
  };

  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  // const instance = axios.create({ timeout: 100000 });
  const instance = axios.create({
    timeout: 1000000,
    // validateStatus: (status) => status < 500,
    validateStatus: () => true,
  });

  instance.interceptors.response.use(
    (response) => {
      if (response.status === 401) {
        sessionStorage.removeItem("token");
        window.location.href = "/login";
      }
      return response;
    },
    (error) => {
      // This block now triggers only for 500 or network errors
      console.error("Axios Network/Server Error:", error);
      // return Promise.resolve({
      //   data: {
      //     status: false,
      //     message: "Something went wrong. Please try again.",
      //   },
      // });
      return {
        status: 0,
        data: {
          status: false,
          message: "Unable to connect. Please try again.",
        },
      };
    }
  );
  try {
    const response = await instance({
      method: options.method || "GET",
      url: `${API_BASE_URL}${endpoint}`,
      data: options.body,
      withCredentials: true,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });

    // if (response.statusText !== "OK") {
    //   console.error(`API Error: ${response.status} ${response.statusText}`);
    //   return;
    // }

    // if (response.status !== 200) {
    //   // console.error(`API Error: ${response.status}`);
    //   return;
    // }

    return response.data;
  } catch (error) {
    // if (error?.status === 401) {
    //   // console.error("Session expired. Redirecting to login...");
    //   sessionStorage.removeItem("token");
    //   window.location.href = "/login";
    //   return null;
    // }
    // if (error?.status === 400) {
    //   // console.log(error);
    //   return error;
    // }
    // return error?.response?.data;
    // // console.error("Network Error:", error);

    console.error("Network Error:", error);
    return {
      status: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
