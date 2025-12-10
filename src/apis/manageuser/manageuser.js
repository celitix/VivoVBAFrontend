import { fetchWithAuth } from "../apiClient.js";
import axios from "axios";

// user registration
export const createUser = async (data) => {
  return await fetchWithAuth(`/createUser`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// user update
export const updateUser = async (data) => {
  return await fetchWithAuth(`/update`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
// update user password
export const updateUserPassword = async (data) => {
  return await fetchWithAuth(`/password`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getUserList = async (data) => {
  return await fetchWithAuth(`/allUsers`, {
    method: "GET",
  });
};

// get unique token link
export const getUserUniqueTokenLink = async (data) => {
  return await fetchWithAuth(`/getUserToken/${data}`, {
    method: "GET",
  });
};

// get user filled forms
export const getUserFilledSurveyForms = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await fetchWithAuth(`/response/${token}${query ? `?${query}` : ""}`, {
    method: "GET",
  });
};

// delete user
export const deleteUser = async (userid) => {
  return await fetchWithAuth(`/delete/${userid}`, {
    method: "POST",
  });
};

export const getLeadDataLoginUser = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await fetchWithAuth(`/me/${query ? `?${query}` : ""}`, {
    method: "GET",
  });
};

// Get Lead Data
export const getLeadData = async (data) => {
  return await fetchWithAuth(`/lead/${data}`, {
    method: "GET",
  });
};

export const createLead = async (data) => {
  return await fetchWithAuth(`/lead`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const trackData = async () => {
  return await fetchWithAuth(`/tracking`, {
    method: "GET",
  });
};

// export const exportSurveyReport = async (token) => {
//   return await fetchWithAuth(`/export/${token}`, {
//     responseType: "blob",
//     method: "GET",
//   });
// };

export const exportSurveyReport = async (token) => {
  return await axios.get(`/api/export/${token}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
};

export const exportSurveyReportUser = async () => {
  return await axios.get(`/api/export`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
};

export const allUserSurveyData = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await fetchWithAuth(`/allUserData/${query ? `?${query}` : ""}`, {
    method: "GET",
  });
};

export const allUsersList = async () => {
  return await fetchWithAuth(`/allUser`, {
    method: "GET",
  });
};

// export const allUserSurveyData = async () => {
//   return await fetchWithAuth(`/allUserData`, {
//     method: "GET",
//   });
// };

//================ Survey form apis started ===============================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// survey form
export const saveSurveyForm = async (data) => {
  try {
    const res = await api.post("/save", data);
    return res.data;
  } catch (err) {
    console.error("Save Survey Error:", err);
    // return { status: false, message: "Server error" };
    const errorMessage =
      err?.response?.data?.message || err?.message || "Network request failed.";

    throw { status: false, message: errorMessage };
  }
};

// Send OTP
// export const sendOtp = async (data) => {
//   try {
//     const res = await api.post("/sendOtp", data);
//     return res.data;
//   } catch (err) {
//     console.error("Send OTP Error:", err);
//     return { status: false, message: "Server error" };
//   }
// };

// Send OTP
export const sendOtp = async (data) => {
  try {
    const res = await api.post("/sendOtp", data);
    return res.data;
  } catch (err) {
    console.error("Send OTP Error:", err);

    const errorMessage =
      err?.response?.data?.message || err?.message || "Network request failed.";

    throw { status: false, message: errorMessage };
  }
};
// Verify OTP
export const verifyOtp = async (data) => {
  try {
    const res = await api.post("/verifyOtp", data);
    return res.data;
  } catch (err) {
    console.error("Verify OTP Error:", err);
    // return { status: false, message: "Server error" };
    const errorMessage =
      err?.response?.data?.message || err?.message || "Network request failed.";

    throw { status: false, message: errorMessage };
  }
};
//================ Models Crud APIs ===============================

// Create Model
export const createModel = async (data) => {
  return await fetchWithAuth(`/model`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update Model
export const updateModel = async (data) => {
  return await fetchWithAuth(`/model`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete
export const deleteModel = async (id) => {
  return await fetchWithAuth(`/model/${id}`, {
    method: "DELETE",
  });
};

// Restore Deleted Model
export const restoreDeletedModel = async (id) => {
  return await fetchWithAuth(`/model/restore/${id}`, {
    method: "POST",
  });
};

// Get Model
export const getModel = async (data) => {
  return await fetchWithAuth(`/model`, {
    method: "GET",
  });
};

// Get Model
export const getModelPublic = async (data) => {
  try {
    const res = await api.get("/model", data);
    return res.data;
  } catch (err) {
    console.error("Error:", err);
    return { status: false, message: "Server error" };
  }
};

// Get Deleted Model
export const getDeletedModel = async (data) => {
  return await fetchWithAuth(`/model/deleted`, {
    method: "GET",
  });
};

// Delete Deleted Model Permanent
export const deleteDeletedModelPermanent = async (data) => {
  return await fetchWithAuth(`/model/deleted/${data}`, {
    method: "DELETE",
  });
};
