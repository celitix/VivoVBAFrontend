import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { InputOtp } from "primereact/inputotp";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import {
  CheckCircle2,
  Smartphone,
  Mail,
  User,
  Send,
  RefreshCw,
  Sparkles,
  MessageCircle,
  Lock,
  Clock,
} from "lucide-react";

import {
  saveSurveyForm,
  sendOtp,
  verifyOtp,
  getModelPublic,
} from "@/apis/manageuser/manageuser";

import UniversalTextArea from "@/components/common/UniversalTextArea";
import UniversalButton from "@/components/common/UniversalButton";
import InputField from "@/components/common/InputField";
import DropdownWithSearch from "@/components/common/DropdownWithSearch";
import Lottie from "lottie-react";

// Assuming these Lottie files are correctly configured
import Consulting from "@/assets/animation/Consulting.json";
import Verify from "@/assets/animation/Verify.json"; // Using Verify for the submission success animation

// --- NEW COMPONENT: SUBMISSION OVERLAY ---
const SubmissionOverlay = ({ isSubmitting }) => {
  return (
    <AnimatePresence>
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-64 h-64"
          >
            <Lottie animationData={Verify} loop={false} autoplay />
          </motion.div>
          <h2 className="text-4xl font-extrabold text-blue-600 mt-6 playf animate-pulse">
            Submitting Feedback...
          </h2>
          <p className="text-xl text-gray-600 mt-2 text-center">
            One moment, we're securely processing your response.
          </p>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mt-8"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
// ----------------------------------------

const SurveyForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [otpId, setOtpId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [modelList, setModelList] = useState([]);
  const [isPurchase, setIsPurchase] = useState(true);

  // --- FIX 1: New loading state for initial data fetch and token check ---
  const [initialLoading, setInitialLoading] = useState(true);
  const [invalidToken, setInvalidToken] = useState(false);
  // ------------------------------------------------------------------------

  // Form Data State (No change)
  const [formData, setFormData] = useState({
    consumer_name: "",
    contact_number: "",
    email: "",
    model: "",
    query: "",
    type: "",
  });

  // Data Lists (No change)
  const souceList = [
    { label: "Facebook", value: "facebook" },
    { label: "Instagram", value: "Instagram" },
    { label: "YouTube", value: "youtube" },
  ];

  // --- Initial Setup and Token Check (Modified) ---
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
      setInvalidToken(false); // Valid token found
    } else {
      setInvalidToken(true); // No token or invalid structure
      toast.error("Invalid or missing token. Please use a valid link.");
    }
    // Set initialLoading to false here so the component can render the form OR the error based on `invalidToken`
    // However, since we also fetch models, we'll combine the loading logic below.
  }, [searchParams]);

  // Model Fetching (Modified to include initialLoading)
  const fetchModels = async () => {
    try {
      const res = await getModelPublic();

      if (res?.status === true) {
        setModelList(
          res?.data?.map((item) => ({
            label: item.model,
            value: item.id,
          })) || []
        );
      } else {
        toast.error(res?.message || "Failed to load models");
      }
    } catch (err) {
      console.error("fetchModels", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Unexpected error"
      );
    } finally {
      // --- FIX 1 CONTINUED: Set initialLoading false once models are fetched/failed ---
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch models if a token is present
    if (token) {
      fetchModels();
    } else if (invalidToken) {
      // If token is explicitly invalid, stop loading right away
      setInitialLoading(false);
    }
  }, [token, invalidToken]);

  // Handle Model/Type Toggle (No change)
  useEffect(() => {
    if (isPurchase) {
      setFormData((prev) => ({ ...prev, type: "" }));
    } else {
      setFormData((prev) => ({ ...prev, model: "" }));
    }
  }, [isPurchase]);
  // -----------------------------------------------------

  // ... (Other handlers like handleChange, handleModelChange, handleSendOtp, handleVerifyOtp - NO CHANGE)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleModelChange = (value) => {
    setFormData((prev) => ({ ...prev, model: value }));
    if (errors.model) {
      setErrors((prev) => ({ ...prev, model: "" }));
    }
  };

  const handleSourceChange = (value) => {
    setFormData((prev) => ({ ...prev, query: value }));
    if (errors.model) {
      setErrors((prev) => ({ ...prev, query: "" }));
    }
  };

  const handleSendOtp = async () => {
    if (!formData.contact_number.trim()) {
      setErrors((prev) => ({
        ...prev,
        contact_number: "Contact number is required",
      }));
      return;
    }
    if (!/^\d{10}$/.test(formData.contact_number)) {
      setErrors((prev) => ({
        ...prev,
        contact_number: "Enter a valid 10-digit number",
      }));
      return;
    }

    setLoadingOtp(true);
    try {
      const res = await sendOtp({ mobile: formData.contact_number });
      if (res?.status) {
        toast.success("OTP sent successfully!");
        setOtpSent(true);
        setOtpId(res.otpId); // <-- STORE OTP ID
        setTimer(30); // <-- START TIMER
      } else {
        toast.error(res?.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Failed to send OTP. Try again.");
    } finally {
      setLoadingOtp(false);
    }
  };

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleVerifyOtp = async () => {
    if (otp.length !== 5) {
      toast.error("Enter 5-digit OTP");
      return;
    }

    setLoadingVerify(true);
    try {
      const res = await verifyOtp({
        mobile: formData.contact_number,
        otp,
        otpId, // <-- PASS OTP ID
      });
      if (res?.status) {
        setOtpVerified(true);
        toast.success("Mobile number verified successfully!");
      } else {
        toast.error(res?.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("OTP verification failed");
    } finally {
      setLoadingVerify(false);
    }
  };

  const validateAndSubmit = async () => {
    setErrors({}); // Clear previous errors

    // --- Validation Logic (No Change) ---
    // Step-by-step validation with single toast per error
    if (!formData.consumer_name.trim()) {
      setErrors({ consumer_name: "Name required" });
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.contact_number.trim()) {
      setErrors({ contact_number: "Mobile number required" });
      toast.error("Please enter your mobile number");
      return;
    }

    if (!/^\d{10}$/.test(formData.contact_number.trim())) {
      setErrors({ contact_number: "Invalid mobile number" });
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!otpVerified) {
      setErrors({ contact_number: "Verify mobile number" });
      toast.error("Please verify your mobile number with OTP");
      return;
    }

    if (!formData.email.trim()) {
      setErrors({ email: "Email required" });
      toast.error("Please enter your email address");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      setErrors({ email: "Invalid email" });
      toast.error("Please enter a valid email address");
      return;
    }

    if (!formData.query.trim()) {
      setErrors({ query: "Source required" });
      toast.error("Please select where you heard about us");
      return;
    }

    if (isPurchase === null) {
      toast.error("Please choose feedback type");
      return;
    }

    if (isPurchase === true && (!formData.model || formData.model === "")) {
      setErrors({ model: "Model is required" });
      toast.error("Please select an interested model");
      return;
    }

    if (isPurchase === false && !formData.type.trim()) {
      setErrors({ type: "Feedback required" });
      toast.error("Please enter your feedback");
      return;
    }
    // -----------------------------------------

    // All valid → submit
    // --- FIX 2: Show Submission Overlay ---
    setSubmitting(true);
    try {
      const res = await saveSurveyForm({ token, ...formData });
      if (res?.status) {
        // Simulate the awesome loader for 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000));
        toast.success("Thank you! Your response has been recorded.");
        navigate("/thank-you", {
          replace: true,
          state: { email: formData.email },
        });
      } else {
        toast.error(res?.message || "Submission failed");
      }
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- FIX 1 CONTINUED: Display initial loader while checking token and fetching models ---
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-xl shadow-lg flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"
          />
          <h2 className="text-3xl font-bold text-blue-600">Loading Survey</h2>
          <p className="text-gray-600 mt-2">
            Checking link validity and fetching data...
          </p>
        </div>
      </div>
    );
  }

  // --- FIX 1 CONTINUED: Display Invalid Link Error only if definitively invalid ---
  if (invalidToken || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-red-600">Invalid Link</h2>
          <p className="text-gray-600 mt-3">
            This survey link is not valid or has expired.
          </p>
        </div>
      </div>
    );
  }

  // --- FIX 2: Render the Submission Overlay at the top level of the form ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <SubmissionOverlay isSubmitting={submitting} />

      {/* Existing background animations (omitted for brevity) */}

      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <motion.div
          animate={{ y: [0, -40, 0], rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-5 w-[450px] h-[450px] bg-blue-300/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-5 w-[550px] h-[550px] bg-indigo-300/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [-30, 30, -30] }}
          transition={{ duration: 35, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-[110px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Branding & Animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="text-center space-y-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2,
                }}
                className="mx-auto w-80 h-62"
              >
                <Lottie animationData={Consulting} loop autoplay />
              </motion.div>

              <div>
                <h1 className="text-6xl font-extrabold text-gray-800 leading-tight playf">
                  We Value Your
                  <br />
                  <p className="text-gray-700 font-medium flex items-center justify-center gap-3">
                    <Sparkles className="w-6 h-6 text-sky-600" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500  to-indigo-700 playf">
                      Feedback
                    </span>
                    <Sparkles className="w-6 h-6 text-indigo-600" />
                  </p>
                </h1>
                <p className="text-2xl text-gray-600 mt-6 playf">
                  Help us improve your experience with vivo products
                </p>
              </div>

              <div className="flex justify-center gap-6 mt-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: [0, -5, 0],
                  }}
                  transition={{
                    delay: 0.2,
                    duration: 0.6,
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    },
                  }}
                  className="text-center p-4 rounded-full border border-blue-200 bg-blue-50/50 shadow-md"
                >
                  <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-bold text-blue-700 whitespace-nowrap">
                    Quick & Easy
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: [0, 5, 0],
                  }}
                  transition={{
                    delay: 0.4,
                    duration: 0.6,
                    y: {
                      duration: 4.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    },
                  }}
                  className="text-center p-4 rounded-full border border-indigo-200 bg-indigo-50/50 shadow-md"
                >
                  <MessageCircle className="w-8 h-8 text-indigo-600 mx-auto mb-1" />
                  <p className="text-sm font-bold text-indigo-700 whitespace-nowrap">
                    Your Voice Matters
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: [0, -4, 0],
                  }}
                  transition={{
                    delay: 0.6,
                    duration: 0.6,
                    y: {
                      duration: 3.8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    },
                  }}
                  className="text-center p-4 rounded-full border border-purple-200 bg-purple-50/50 shadow-md"
                >
                  <Lock className="w-8 h-8 text-purple-600 mx-auto mb-1" />
                  <p className="text-sm font-bold text-purple-700 whitespace-nowrap">
                    Secure & Private
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:max-w-lg"
          >
            <div className="flex items-center justify-center relative">
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 w-[99.4%] absolute z-[9999] top-0 rounded-t-full" />
            </div>
            <div className="bg-white/95 backdrop-blur-2xl rounded-t-2xl rounded-b-3xl shadow-2xl border border-white/60 p-4  md:p-10  ">
              <div className="text-center mb-5 ">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-800 playf">
                    Customer Feedback
                  </h2>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 mt-7 text-sm text-gray-600">
                  <div className="flex  items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>100% Anonymous</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-600" />
                    <span>Secure & Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <span>2 Minutes Only</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 flex flex-col  ">
                <InputField
                  label="Full Name"
                  placeholder="Enter your name"
                  value={formData.consumer_name}
                  onChange={handleChange}
                  name="consumer_name" // Added name
                  // error={errors.consumer_name} // Potential addition
                  icon={<User className="w-5 h-5 text-gray-500" />}
                />

                <div className="space-y-4 w-full ">
                  <InputField
                    label="Mobile Number"
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={formData.contact_number}
                    onChange={handleChange}
                    name="contact_number" // Added name
                    // error={errors.contact_number} // Potential addition
                    icon={<Smartphone className="w-5 h-5 text-gray-500" />}
                    disabled={otpVerified}
                  />

                  {!otpVerified && otpSent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200"
                    >
                      <p className="text-center text-emerald-800 font-medium mb-4">
                        Enter OTP
                      </p>
                      <div className="flex justify-center gap-3 mb-5">
                        <InputOtp
                          value={otp}
                          onChange={(e) => setOtp(e.value)}
                          length={5}
                          integerOnly
                          inputStyle={{
                            width: "3.2rem",
                            height: "3.2rem",
                            fontSize: "1.4rem",
                            borderRadius: "12px",
                          }}
                        />
                      </div>
                      <UniversalButton
                        label={loadingVerify ? "Verifying..." : "Verify OTP"}
                        icon={
                          loadingVerify ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5" />
                          )
                        }
                        onClick={handleVerifyOtp}
                        disabled={loadingVerify || otp.length !== 5}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      />
                      {timer > 0 ? (
                        <p className="text-center text-xs text-gray-600 mt-3">
                          Resend in {timer}s
                        </p>
                      ) : (
                        <button
                          onClick={handleSendOtp}
                          disabled={loadingOtp}
                          className="block mx-auto mt-3 text-emerald-600 font-medium underline text-sm disabled:text-gray-500 disabled:no-underline"
                        >
                          {loadingOtp ? "Sending..." : "Resend OTP"}
                        </button>
                      )}
                    </motion.div>
                  ) : !otpVerified ? (
                    <UniversalButton
                      label={loadingOtp ? "Sending..." : "Send OTP"}
                      onClick={handleSendOtp}
                      disabled={loadingOtp || formData.contact_number.length !== 10}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-6 h-6" />
                      Verified Successfully
                    </div>
                  )}
                </div>

                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  name="email" // Added name
                  // error={errors.email} // Potential addition
                  icon={<Mail className="w-5 h-5 text-gray-500" />}
                />

                <DropdownWithSearch
                  label="Where did you hear about us?"
                  placeholder="Select platform"
                  value={formData.query}
                  onChange={handleSourceChange}
                  options={souceList}
                />

                <label className="text-md font-semibold text-gray-800">
                  Feedback Type
                </label>
                <div className="space-y-4 ">
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                    <button
                      onClick={() => {
                        setIsPurchase(true);
                        setFormData((prev) => ({ ...prev, type: "" }));
                      }}
                      className={`p-5 rounded-2xl border-2 font-medium transition-all ${
                        isPurchase === true
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                          : "border-gray-300 bg-gray-50 hover:border-blue-300"
                      }`}
                    >
                      Purchase Inquiry
                    </button>
                    <button
                      onClick={() => {
                        setIsPurchase(false);
                        setFormData((prev) => ({ ...prev, model: "" }));
                      }}
                      className={`p-5 rounded-2xl border-2 font-medium transition-all ${
                        isPurchase === false
                          ? "border-purple-600 bg-purple-50 text-purple-700 shadow-md"
                          : "border-gray-300 bg-gray-50 hover:border-purple-300"
                      }`}
                    >
                      General Feedback
                    </button>
                  </div>
                </div>

                {isPurchase === true && (
                  <DropdownWithSearch
                    label="Interested Model"
                    placeholder="Choose vivo model"
                    value={formData.model}
                    onChange={handleModelChange}
                    options={modelList}
                    loading={initialLoading} // Use initialLoading here
                  />
                )}

                {isPurchase === false && (
                  <UniversalTextArea
                    label="Your Feedback"
                    placeholder="Share your thoughts..."
                    value={formData.type}
                    onChange={handleChange}
                    name="type" // Added name
                    // error={errors.type} // Potential addition
                    rows={4}
                  />
                )}

                <UniversalButton
                  label={submitting ? "Submitting..." : "Submit Feedback"}
                  icon={<Send className="w-5 h-5" />}
                  onClick={validateAndSubmit}
                  disabled={submitting}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-xl"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <img
                  src="/vivologonew.png"
                  alt="vivo"
                  className="h-14 mx-auto mb-4"
                />
                <p className="text-lg font-bold text-gray-800">
                  Yingjia Communication Pvt. Ltd.
                </p>
                <p className="text-sm text-gray-600">
                  Official Partner • Powered by{" "}
                  <span className="font-bold text-blue-600">vivo</span>
                </p>
                <p className="text-xs text-gray-400 mt-5">
                  © {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;