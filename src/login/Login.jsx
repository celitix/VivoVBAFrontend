import React, { useEffect, useRef, useState, useContext } from "react";
import { FaUserAlt, FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import { login } from "@/apis/login/login";
import InputField from "@/components/common/InputField";
import UniversalButton from "@/components/common/UniversalButton";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [inputDetails, setInputDetails] = useState({
    password: "",
    mobile: "",
  });

  const navigate = useNavigate();

  // Handle login
  async function handleLogin() {
    if (!inputDetails.mobile?.trim() || !inputDetails.password?.trim()) {
      return toast.error("Please enter Mobile No. and Password.");
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

      if (backendMessage) {
        console.error(`${backendMessage}`);
        toast.error(`${backendMessage}`)
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const PasswordToggleIcon = showPassword ? EyeOff : Eye;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-2">
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 backdrop-blur-md"></div>

      {/* Login Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl shadow-2xl border-2  border-[#4A5FA7] rounded-3xl md:p-10 p-6 w-full max-w-md sm:max-w-lg"
      >
        {/* <div className="flex flex-col items-center mb-8">
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
        </div> */}
        <div className="border-gray-200 text-center mb-6">
          <img
            src="/vivologonew.png"
            alt="vivo"
            className="md:h-14 h-12 mx-auto mb-4"
          />
          <p className="md:text-lg text-md font-bold text-gray-800">
            "Yingjia Communication Pvt. Ltd."
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
              disabled={loading}
            />
            <div className="relative" >
              <InputField
                icon={<FaLock className="text-gray-400" />}
                label="Password"
                placeholder="Enter your Password"
                type={showPassword ? "text" : "password"}
                value={inputDetails.password}
                onChange={(e) =>
                  setInputDetails({
                    ...inputDetails,
                    password: e.target.value,
                  })
                }
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors  absolute right-2 top-7.5 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <PasswordToggleIcon className="w-5 h-5" />
              </button>
            </div>

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
        <div className="mt-5 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Official Partner • Powered by{" "}
            <span className="font-bold text-blue-600">vivo</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
