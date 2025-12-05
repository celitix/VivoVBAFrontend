import React, { useEffect, useRef, useState, useContext } from "react";
import InputField from "@/components/common/InputField";
import UniversalButton from "@/components/common/UniversalButton";
import { login } from "@/apis/login/login";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaUserAlt, FaPhoneAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const [inputDetails, setInputDetails] = useState({
    password: "",
    mobile: "",
  });
  
  const navigate = useNavigate();

  // Handle login
  async function handleLogin() {
    if (!inputDetails.mobile?.trim() || !inputDetails.password?.trim()) {
      return toast.error("Please enter username and Mobile No.");
    }

    setLoading(true);

    let payload = {
      mobile: inputDetails.mobile,
      password: inputDetails.password,
    };

    try {
      const res = await login(payload);
      if (res.data.status) {
        const { token, role } = res.data;
        if (token) sessionStorage.setItem("token", token);
        if (role) sessionStorage.setItem("userRole", role);
        toast.success(res.data.message || "user Logged Successfully!");

        navigate("/");
      } else {
        toast.error(res.data.message || "Login failed!");
      }
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        (err?.response?.status === 401
          ? "Unauthorized: Invalid credentials"
          : null);

      const statusCode = err?.response?.status;

      console.log("Login Error:", err?.response);
      console.log("Login Error:", err);

      if (backendMessage) {
        // toast.error(`${backendMessage} (Error ${statusCode})`);
        toast.error(`${backendMessage}`);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   const token = sessionStorage.getItem("token");
  //   if (token) navigate("/");
  // }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center">
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/40 to-blue-100/40 backdrop-blur-md"></div>

      {/* Login Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl shadow-2xl border-2 border-dashed border-blue-200 rounded-3xl p-10 w-full max-w-md sm:max-w-lg"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-gray-800 tracking-tight"
          >
            Welcome Back 👋
          </motion.h2>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Log in to access your dashboard
          </p>
        </div>

        <>
          <motion.form
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <InputField
              icon={<FaPhoneAlt className="text-gray-400" />}
              label="Mobile No"
              placeholder="Enter your Mobile No"
              value={inputDetails.mobile}
              onChange={(e) =>
                setInputDetails({
                  ...inputDetails,
                  mobile: e.target.value,
                })
              }
            />

            <InputField
              icon={<FaLock className="text-gray-400" />}
              label="Password"
              placeholder="Enter your Password"
              type="text"
              value={inputDetails.password}
              onChange={(e) =>
                setInputDetails({
                  ...inputDetails,
                  password: e.target.value,
                })
              }
            />

            <UniversalButton
              // label="Send OTP"
              label="Login"
              onClick={handleLogin}
              isLoading={loading}
              disabled={loading}
              variant="primary"
              className="w-full"
            />
          </motion.form>
        </>
      </motion.div>
    </div>
  );
};

export default Login;
