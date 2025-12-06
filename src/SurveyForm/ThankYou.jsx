import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import Lottie from 'lottie-react';
import { useLocation } from 'react-router-dom';
import thankyou from '@/assets/animation/thankyou.json';

const ThankYou = () => {
    const { state } = useLocation();
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-200 flex items-center justify-center px-4 py-6 h-full">

            {/* Main Container - Perfect Centering */}
            <div className="relative z-10 w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-full"
                >
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/80 overflow-hidden">
                        {/* Vivo-style Gradient Top Bar */}
                        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500" />

                        <div className="px-6 pt-10 pb-12 md:px-10 text-center space-y-8">
                            {/* Success Animation */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
                                className="mx-auto w-48 h-48 md:w-56 md:h-56"
                            >
                                <Lottie animationData={thankyou} loop autoplay />
                            </motion.div>

                            {/* Title & Message */}
                            <div className="space-y-4">
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight"
                                >
                                    Thank You!
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md mx-auto"
                                >
                                    Your valuable feedback has been successfully submitted. We sincerely appreciate your time and insights.
                                </motion.p>
                            </div>

                            {/* Email Confirmation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-inner"
                            >
                                <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                                    <Mail className="w-5 h-5" />
                                    <span className="text-sm font-semibold">Submitted From</span>
                                </div>
                                <p className="text-lg md:text-xl font-bold text-blue-900 tracking-wide break-all">
                                    {/* {userEmail} */}
                                    {state?.email}
                                </p>
                            </motion.div>

                            {/* Closing Message */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="space-y-6"
                            >
                                <p className="text-gray-700 font-medium flex items-center justify-center gap-3">
                                    <Sparkles className="w-5 h-5 text-blue-600" />
                                    Our team will review your response shortly.
                                    <Sparkles className="w-5 h-5 text-blue-600" />
                                </p>

                                <div className="pt-6 border-t border-gray-200">
                                    <p className="text-sm text-gray-500 mb-4">Wishing you a wonderful day!</p>

                                    {/* Company Logo & Branding */}
                                    <div className="flex flex-col items-center gap-4">
                                        <img
                                            src="/vivologonew.png"
                                            alt="vivo Logo"
                                            className="h-14 md:h-12 object-contain opacity-90"
                                        />
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-gray-800">
                                                Yingjia Communication Pvt. Ltd.
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Official Partner • Powered by{' '}
                                                <span className="font-semibold text-blue-600">vivo</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400 mt-10 opacity-70">
                        © {new Date().getFullYear()} Yingjia Communication Pvt. Ltd. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ThankYou;