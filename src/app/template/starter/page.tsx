"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, ScanLine, Search, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
    hover: {
        y: -8,
        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
        transition: {
            duration: 0.2,
            ease: "easeInOut" as const,
        },
    },
};

const IllustrationPlaceholder = ({ icon: Icon, color }: { icon: any, color: "blue" | "purple" | "indigo" | "sky" }) => {
    const colorStyles = {
        blue: {
            bg: "from-blue-50",
            text: "text-blue-400",
        },
        purple: {
            bg: "from-purple-50",
            text: "text-purple-400",
        },
        indigo: {
            bg: "from-indigo-50",
            text: "text-indigo-400",
        },
        sky: {
            bg: "from-sky-50",
            text: "text-sky-400",
        },
    };

    const style = colorStyles[color];

    return (
        <div className={`w-full h-32 bg-gradient-to-b ${style.bg} to-white flex items-center justify-center rounded-t-xl overflow-hidden relative`}>
            <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/60`} />
            <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Icon className={`w-16 h-16 ${style.text} opacity-80`} strokeWidth={1.5} />
            </motion.div>
        </div>
    );
};

export default function TemplateStarterPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display relative overflow-hidden">
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-10">
                <Link href="/auth/workspace" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors block">
                    <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </Link>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 h-screen flex flex-col justify-center items-center max-w-7xl">
                <motion.div
                    className="w-full"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.h1
                        className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-12 text-center"
                        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
                    >
                        Select how you'd like to create your template
                    </motion.h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {/* Card 1: Start from scratch */}
                        <motion.div
                            className="bg-white dark:bg-dark-2 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer h-full flex flex-col"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <IllustrationPlaceholder icon={FileText} color="blue" />
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Start from scratch</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Build your own template to suit your business' needs.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 2: Describe a topic */}
                        <motion.div
                            className="bg-white dark:bg-dark-2 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer h-full flex flex-col"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <IllustrationPlaceholder icon={Sparkles} color="purple" />
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Describe a topic</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Enter a few details and AI will generate a template for you.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 3: Convert an image or PDF */}
                        <motion.div
                            className="bg-white dark:bg-dark-2 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer h-full flex flex-col"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <IllustrationPlaceholder icon={ScanLine} color="indigo" />
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Convert an image or PDF</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    We'll convert the text within your media files into a template.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 4: Find a template */}
                        <motion.div
                            className="bg-white dark:bg-dark-2 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer h-full flex flex-col"
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <IllustrationPlaceholder icon={Search} color="sky" />
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Find a template</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Browse ready made templates from the SafetyCulture Library.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Floating Chat Button */}
            <div className="absolute bottom-6 right-6">
                <button className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg transition-colors text-white">
                    <MessageCircle className="w-7 h-7" />
                    <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-indigo-600"></div>
                </button>
            </div>
        </div>
    );
}
