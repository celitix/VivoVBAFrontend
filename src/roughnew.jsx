import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { InputOtp } from "primereact/inputotp";
import { motion } from "framer-motion";
import { CheckCircle2, Smartphone, Mail, User, Send, RefreshCw, Sparkles, Phone, MessageCircle } from "lucide-react";

import {
    saveSurveyForm,
    sendOtp,
    verifyOtp,
    getModel,
    getModelPublic
} from "@/apis/manageuser/manageuser";

import UniversalTextArea from "@/components/common/UniversalTextArea";
import UniversalButton from "@/components/common/UniversalButton";
import InputField from "@/components/common/InputField";
import DropdownWithSearch from "@/components/common/DropdownWithSearch";
import UniversalRadioButton from "@/components/common/UniversalRadioButton";

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
    const [toggleValue, setToggleValue] = useState(false);
    const [isPurchase, setIsPurchase] = useState(null);

    const [formData, setFormData] = useState({
        consumer_name: "",
        contact_number: "",
        email: "",
        model: "",
        query: "",
        type: "",
    });

    const souceList = [
        { label: "Facebook", value: "facebook" },
        { label: "instagram", value: "Instagram" },
        { label: "YouTube", value: "youtube" },
    ];

    useEffect(() => {
        const urlToken = searchParams.get("token");
        if (urlToken) {
            setToken(urlToken);
        } else {
            toast.error("Invalid or missing token. Please use a valid link.");
        }
    }, [searchParams]);

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

    const fetchModels = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

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

    const validateForm = () => {
        const newErrors = {};

        const name = (formData.consumer_name || "").trim();
        const contact = (formData.contact_number || "").trim();
        const email = (formData.email || "").trim();
        // const model = (formData.model || "").trim();
        const query = (formData.query || "").trim();
        const type = (formData.type || "").trim();

        if (!name) newErrors.consumer_name = "Name is required";
        if (!contact) newErrors.contact_number = "Mobile number is required";
        else if (!/^\d{10}$/.test(contact))
            newErrors.contact_number = "Invalid mobile number";

        if (!email) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email))
            newErrors.email = "Invalid email";

        // if (!model && toggleValue) newErrors.model = "Model is required";
        if (!query && toggleValue) newErrors.query = "Query is required";
        if (!type && !toggleValue) newErrors.type = "Type is required";

        if (!otpVerified) {
            toast.error("Please verify your mobile number first");
            newErrors.contact_number = "Mobile number must be verified";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Proper form submit — prevents page reload
    const onSubmit = async (e) => {
        if (!validateForm() || !token) return;

        setSubmitting(true);
        try {
            const payload = { token, ...formData };
            const res = await saveSurveyForm(payload);

            if (res?.status) {
                toast.success("Thank you! Your response has been recorded.");
                // Redirect to Thank You page
                navigate("/thank-you", {
                    replace: true,
                    state: {
                        email: formData.email,
                    },
                });
            } else {
                toast.error(res?.message || "Submission failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!token) {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
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
            {/* <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white md:p-8 p-4 text-center">
                        <h1 className="md:text-4xl text-2xl font-bold">
                            Customer Feedback Form
                        </h1>
                        <p className="mt-3 text-indigo-100">Your opinion matters to us</p>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="space-y-4">
                            <InputField
                                label="Full Name"
                                name="consumer_name"
                                placeholder="John Doe"
                                value={formData.consumer_name}
                                onChange={handleChange}
                                error={!!errors.consumer_name}
                                errorText={errors.consumer_name}
                            />

                            <div className="space-y-2">
                                <InputField
                                    label="Mobile Number"
                                    name="contact_number"
                                    type="tel"
                                    placeholder="98XXXXXXXX"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    error={!!errors.contact_number}
                                    errorText={errors.contact_number}
                                    disabled={otpVerified}
                                />

                                {!otpVerified && otpSent ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between mt-2 w-full">
                                            <InputOtp
                                                value={otp}
                                                onChange={(e) => setOtp(e.value)}
                                                length={5}
                                                integerOnly
                                                inputClassName="w-20 h-12 text-xl text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600"
                                            />
                                            <UniversalButton
                                                label={loadingVerify ? "Verifying..." : "Verify OTP"}
                                                onClick={handleVerifyOtp}
                                                disabled={loadingVerify || otp.length !== 5}
                                                className="px-6"
                                            />
                                        </div>
                                        {timer > 0 ? (
                                            <p className="text-gray-500 text-sm">
                                                Resend OTP in {timer}s
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                className="text-indigo-600 font-semibold underline"
                                                onClick={handleSendOtp}
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                ) : !otpVerified ? (
                                    <UniversalButton
                                        label={loadingOtp ? "Sending..." : "Send OTP"}
                                        onClick={handleSendOtp}
                                        disabled={loadingOtp}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                                    />
                                ) : (
                                    <p className="text-emerald-600 font-semibold flex items-center gap-2">
                                        Verified Successfully
                                    </p>
                                )}
                            </div>

                            <InputField
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                errorText={errors.email}
                            />
                            <DropdownWithSearch
                                label="Source Platform"
                                name="source"
                                placeholder="Select Source"
                                value={formData.query}
                                onChange={handleSourceChange}
                                options={souceList}
                                loading={loading}
                                error={!!errors.query}
                                errorText={errors.query}
                            />
                            <div className="flex items-center gap-4">
                                <UniversalRadioButton
                                    name="purchase"
                                    label="Purchase"
                                    value="yes"
                                    checked={toggleValue === true}
                                    onChange={() => {
                                        setToggleValue(true);
                                        setFormData(prev => ({ ...prev, type: "" }));
                                    }}
                                />

                                <UniversalRadioButton
                                    name="generalQuery"
                                    label="General Query"
                                    value="no"
                                    checked={toggleValue === false}
                                    onChange={() => {
                                        setToggleValue(false);
                                        setFormData(prev => ({ ...prev, model: "" }));
                                    }}
                                />
                            </div>

                            {toggleValue ? (
                                <DropdownWithSearch
                                    label="Product Model"
                                    name="model"
                                    placeholder="e.g. Vivo V30, Vivo "
                                    value={formData.model}
                                    onChange={handleModelChange}
                                    options={modelList}
                                    loading={loading}
                                    error={!!errors.model}
                                    errorText={errors.model}
                                />
                            ) : (
                                <UniversalTextArea
                                    label="Type of Feedback"
                                    name="type"
                                    placeholder="e.g. Complaint, Suggestion, Appreciation"
                                    value={formData.type}
                                    onChange={handleChange}
                                    error={!!errors.type}
                                    errorText={errors.type}
                                />
                            )}

                            <UniversalButton
                                label={submitting ? "Submitting..." : "Submit Feedback"}
                                onClick={onSubmit}
                                disabled={submitting || !otpVerified}
                                className="w-full h-12 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 shadow-lg"
                            />
                        </div>

                        <p className="text-center text-gray-500 text-sm mt-5">
                            We appreciate your time and honest feedback.
                        </p>
                        <div className="bg-gray-50 border-t border-gray-200 px-8 py-10 text-center">
                            <img src="/vivologonew.png" alt="vivo" className="h-14 mx-auto mb-4 opacity-90" />
                            <p className="text-xl font-bold text-gray-800">Yingjia Communication Pvt. Ltd.</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Official Partner • Powered by <span className="font-bold text-blue-600">vivo</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-6">
                                © {new Date().getFullYear()} Yingjia Communication Pvt. Ltd. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div> */}

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

                            {/* <img src="/vivologonew.png" alt="vivo" className="h-16 mx-auto mt-12 opacity-90" /> */}
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
                                    options={souceList}
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
                                    // onClick={validateAndSubmit}
                                    onClick={onSubmit}

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
