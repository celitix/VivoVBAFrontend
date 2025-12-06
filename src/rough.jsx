import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle2, Smartphone, Mail, User, Send, RefreshCw, Sparkles, Phone, MessageCircle } from "lucide-react";
import InputField from "@/components/common/InputField";
import UniversalTextArea from "../components/common/UniversalTextArea";
import UniversalButton from "@/components/common/UniversalButton";
import { InputOtp } from "primereact/inputotp";
import DropdownWithSearch from "../components/common/DropdownWithSearch";
import { saveSurveyForm, sendOtp, verifyOtp, getModelPublic } from "@/apis/manageuser/manageuser";

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
  const [loading, setLoading] = useState(true);
  const [modelList, setModelList] = useState([]);
  const [isPurchase, setIsPurchase] = useState(null);

  const [formData, setFormData] = useState({
    consumer_name: "",
    contact_number: "",
    email: "",
    model: "",
    query: "",
    type: "",
  });

  const sourceOptions = [
    { label: "Facebook", value: "Facebook" },
    { label: "Instagram", value: "Instagram" },
    { label: "YouTube", value: "YouTube" },
  ];

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) setToken(urlToken);
    else toast.error("Invalid link");
  }, [searchParams]);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await getModelPublic();
      if (res?.status) {
        setModelList(res.data.map(m => ({ label: m.model, value: m.model })));
      }
    } catch (err) {
      toast.error("Failed to load models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchModels(); }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(formData.contact_number)) {
      setErrors(prev => ({ ...prev, contact_number: "Enter valid 10-digit number" }));
      return;
    }
    setLoadingOtp(true);
    try {
      const res = await sendOtp({ mobile: formData.contact_number });
      if (res?.status) {
        toast.success("OTP sent!");
        setOtpSent(true);
        setOtpId(res.otpId);
        setTimer(30);
      }
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 5) return toast.error("Enter 5-digit OTP");
    setLoadingVerify(true);
    try {
      const res = await verifyOtp({ mobile: formData.contact_number, otp, otpId });
      if (res?.status) {
        setOtpVerified(true);
        toast.success("Verified successfully!");
      } else {
        toast.error(res?.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Verification failed");
    } finally {
      setLoadingVerify(false);
    }
  };

  const validateAndSubmit = async () => {
    const err = {};
    if (!formData.consumer_name.trim()) err.consumer_name = "Name required";
    if (!/^\d{10}$/.test(formData.contact_number)) err.contact_number = "Invalid mobile";
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) err.email = "Invalid email";
    if (isPurchase === true && !formData.model) err.model = "Select model";
    if (isPurchase === false && !formData.type.trim()) err.type = "Feedback required";
    if (isPurchase === null) err.toggle = "Choose feedback type";
    if (!otpVerified) err.contact_number = "Verify mobile number";

    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setSubmitting(true);
    try {
      const res = await saveSurveyForm({ token, ...formData });
      if (res?.status) {
        toast.success("Thank you! Your response has been recorded.");
        navigate("/thank-you", { replace: true, state: { email: formData.email } });
      }
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-12 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
          <h2 className="text-4xl font-bold text-red-600 mb-4">Invalid Link</h2>
          <p className="text-gray-600 text-lg">This survey link is not valid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
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
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Phone className="w-32 h-32 mx-auto text-blue-600" />
              </motion.div>

              <div>
                <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
                  We Value Your<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                    Feedback
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mt-6">
                  Help us improve your experience with vivo products
                </p>
              </div>

              <div className="flex justify-center gap-8 mt-10">
                <div className="text-center">
                  <Sparkles className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Quick & Easy</p>
                </div>
                <div className="text-center">
                  <MessageCircle className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Your Voice Matters</p>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Secure & Private</p>
                </div>
              </div>

              <img src="/vivologonew.png" alt="vivo" className="h-16 mx-auto mt-12 opacity-90" />
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:max-w-lg"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Customer Feedback</h2>
                <p className="text-gray-600 mt-2">Takes less than 2 minutes</p>
              </div>

              <div className="space-y-6">
                {/* Form fields same as before but cleaner */}
                <InputField
                  label="Full Name"
                  placeholder="Enter your name"
                  value={formData.consumer_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, consumer_name: e.target.value }))}
                  icon={<User className="w-5 h-5 text-gray-500" />}
                  error={errors.consumer_name}
                />

                <div className="space-y-4">
                  <InputField
                    label="Mobile Number"
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={formData.contact_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                    icon={<Smartphone className="w-5 h-5 text-gray-500" />}
                    error={errors.contact_number}
                    disabled={otpVerified}
                  />

                  {!otpVerified && otpSent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200"
                    >
                      <p className="text-center text-emerald-800 font-medium mb-4">Enter OTP</p>
                      <div className="flex justify-center gap-3 mb-5">
                        <InputOtp
                          value={otp}
                          onChange={(e) => setOtp(e.value)}
                          length={5}
                          integerOnly
                          inputStyle={{ width: "3.2rem", height: "3.2rem", fontSize: "1.4rem", borderRadius: "12px" }}
                        />
                      </div>
                      <UniversalButton
                        label={loadingVerify ? "Verifying..." : "Verify OTP"}
                        icon={loadingVerify ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        onClick={handleVerifyOtp}
                        disabled={loadingVerify || otp.length !== 5}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      />
                      {timer > 0 ? (
                        <p className="text-center text-xs text-gray-600 mt-3">Resend in {timer}s</p>
                      ) : (
                        <button onClick={handleSendOtp} className="block mx-auto mt-3 text-emerald-600 font-medium underline text-sm">
                          Resend OTP
                        </button>
                      )}
                    </motion.div>
                  ) : !otpVerified ? (
                    <UniversalButton
                      label={loadingOtp ? "Sending..." : "Send OTP"}
                      onClick={handleSendOtp}
                      disabled={loadingOtp}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  icon={<Mail className="w-5 h-5 text-gray-500" />}
                  error={errors.email}
                />

                <DropdownWithSearch
                  label="Where did you hear about us?"
                  placeholder="Select platform"
                  value={formData.query}
                  onChange={(v) => setFormData(prev => ({ ...prev, query: v }))}
                  options={sourceOptions}
                />

                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-800">Feedback Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => { setIsPurchase(true); setFormData(prev => ({ ...prev, type: "" })); }}
                      className={`p-5 rounded-2xl border-2 font-medium transition-all ${isPurchase === true
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                        : "border-gray-300 bg-gray-50 hover:border-blue-300"
                        }`}
                    >
                      Purchase Inquiry
                    </button>
                    <button
                      onClick={() => { setIsPurchase(false); setFormData(prev => ({ ...prev, model: "" })); }}
                      className={`p-5 rounded-2xl border-2 font-medium transition-all ${isPurchase === false
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
                    onChange={(v) => setFormData(prev => ({ ...prev, model: v }))}
                    options={modelList}
                    loading={loading}
                  />
                )}

                {isPurchase === false && (
                  <UniversalTextArea
                    label="Your Feedback"
                    placeholder="Share your thoughts..."
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
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

              <div className="mt-10 pt-8 border-t border-gray-200 text-center">
                <img src="/vivologonew.png" alt="vivo" className="h-14 mx-auto mb-4" />
                <p className="text-lg font-bold text-gray-800">Yingjia Communication Pvt. Ltd.</p>
                <p className="text-sm text-gray-600">
                  Official Partner • Powered by <span className="font-bold text-blue-600">vivo</span>
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