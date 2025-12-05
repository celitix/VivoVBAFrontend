// components/loaders/VivoTypingLoader.jsx
import React from "react";
import { motion } from "framer-motion";

const VivoTypingLoader = () => {
    const text = "vivo"; // You can change to your brand name
    const letters = text.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const letterAnim = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    const glowEffect = {
        animate: {
            textShadow: [
                "0 0 20px #00d4ff",
                "0 0 40px #00d4ff",
                "0 0 60px #00d4ff",
                "0 0 40px #00d4ff",
                "0 0 20px #00d4ff",
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center z-50">
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="flex space-x-2"
            >
                {letters.map((letter, index) => (
                    <motion.span
                        key={index}
                        variants={letterAnim}
                        className="text-8xl md:text-9xl font-bold tracking-wider"
                        style={{
                            background: "linear-gradient(90deg, #00d4ff, #0099cc, #0077aa)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textShadow: "0 0 30px rgba(0, 212, 255, 0.8)",
                        }}
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                ))}
            </motion.div>

            {/* Glowing Pulse Underline */}
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "240px", opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute mt-48"
            >
                <motion.div
                    variants={glowEffect}
                    animate="animate"
                    className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"
                    style={{ filter: "blur(8px)" }}
                />
            </motion.div>

            {/* Subtle tagline */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="absolute bottom-32 text-cyan-300 text-lg tracking-widest font-light"
            >
                Loading your experience...
            </motion.p>
        </div>
    );
};

export default VivoTypingLoader;