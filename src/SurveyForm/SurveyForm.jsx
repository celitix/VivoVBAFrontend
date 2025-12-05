import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InputField from "@/components/common/InputField";
import UniversalTextArea from "../components/common/UniversalTextArea";
import UniversalButton from "@/components/common/UniversalButton";
import {
    saveSurveyForm,
    sendOtp,
    verifyOtp,
    getModel,
} from "@/apis/manageuser/manageuser";
import { InputOtp } from "primereact/inputotp";
import DropdownWithSearch from "../components/common/DropdownWithSearch";
import { getModelPublic } from "../apis/manageuser/manageuser";
import UniversalRadioButton from "@/components/common/UniversalRadioButton";

const SurveyForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [otpId, setOtpId] = useState(null);
    const [timer, setTimer] = useState(0);
    const [otp, setOtp] = useState("");

    const [formData, setFormData] = useState({
        consumer_name: "",
        contact_number: "",
        email: "",
        model: "",
        query: "",
        type: "",
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [loadingVerify, setLoadingVerify] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [modelList, setModelList] = useState([]);
    const [toggleValue, setToggleValue] = useState(false);

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
                        value: item.model,
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
        const model = (formData.model || "").trim();
        const query = (formData.query || "").trim();
        const type = (formData.type || "").trim();

        if (!name) newErrors.consumer_name = "Name is required";
        if (!contact) newErrors.contact_number = "Mobile number is required";
        else if (!/^\d{10}$/.test(contact))
            newErrors.contact_number = "Invalid mobile number";

        if (!email) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email))
            newErrors.email = "Invalid email";

        if (!model && toggleValue) newErrors.model = "Model is required";
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
        // if (!validateForm() || !token) return;

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 md:py-12 py-6 px-4">
            <div className="max-w-2xl mx-auto">
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
                            {/* Toggle */}
                            <div className="flex items-center gap-4">
                                <UniversalRadioButton
                                    name="purchase"
                                    label="Purchase"
                                    value="yes"
                                    checked={toggleValue === true}
                                    onChange={() => {
                                        setToggleValue(true);
                                        setFormData(prev => ({ ...prev, query: "" }));
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
                                    value={formData.model} // <- raw string
                                    onChange={handleModelChange} // <- use your handler
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
                                // disabled={submitting || !otpVerified}
                                className="w-full h-12 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 shadow-lg"
                            />
                        </div>

                        <p className="text-center text-gray-500 text-sm mt-5">
                            We appreciate your time and honest feedback.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyForm;
