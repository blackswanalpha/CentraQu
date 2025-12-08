"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "@/hooks/useForm";
import { validateEmail, validatePassword } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Eye, EyeOff, CheckCircle2, XCircle, Building2, User, Mail, Lock, Phone, Briefcase } from "lucide-react";
import type { UserRole } from "@/types/auth";

interface SignupFormValues {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    department: string;
    phone: string;
}

// Password strength indicator
const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 3) return { score, label: "Fair", color: "bg-yellow-500" };
    if (score <= 4) return { score, label: "Good", color: "bg-blue-500" };
    return { score, label: "Strong", color: "bg-green-500" };
};

export default function SignupPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiError, setApiError] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm<SignupFormValues>({
        initialValues: {
            username: "",
            email: "",
            password: "",
            password_confirm: "",
            first_name: "",
            last_name: "",
            role: "EMPLOYEE",
            department: "",
            phone: "",
        },
        validate: (values) => {
            const newErrors: Partial<Record<keyof SignupFormValues, string>> = {};

            if (!values.username) {
                newErrors.username = "Username is required";
            } else if (values.username.length < 3) {
                newErrors.username = "Username must be at least 3 characters";
            }

            if (!values.email) {
                newErrors.email = "Email is required";
            } else if (!validateEmail(values.email)) {
                newErrors.email = "Please enter a valid email address";
            }

            if (!values.password) {
                newErrors.password = "Password is required";
            } else if (!validatePassword(values.password)) {
                newErrors.password = "Password must be at least 8 characters";
            }

            if (!values.password_confirm) {
                newErrors.password_confirm = "Please confirm your password";
            } else if (values.password !== values.password_confirm) {
                newErrors.password_confirm = "Passwords do not match";
            }

            if (!values.first_name) {
                newErrors.first_name = "First name is required";
            }

            if (!values.last_name) {
                newErrors.last_name = "Last name is required";
            }

            return newErrors;
        },
        onSubmit: async (values) => {
            try {
                setApiError("");

                const response = await register(values);

                if (response.success) {
                    router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
                } else {
                    if (response.errors) {
                        const errorMessages = Object.values(response.errors).flat().join(", ");
                        setApiError(errorMessages);
                    } else {
                        setApiError(response.error || "Registration failed. Please try again.");
                    }
                }
            } catch (error) {
                setApiError("An unexpected error occurred. Please try again.");
            }
        },
    });

    const passwordStrength = getPasswordStrength(values.password);
    const isStep1Valid = values.first_name && values.last_name && values.username;
    const isStep2Valid = values.email && values.password && values.password_confirm && !errors.password && !errors.password_confirm;

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            {/* Left Panel - Brand & Visual */}
            <div className="relative hidden lg:flex flex-col items-center justify-center gap-8 p-12 bg-gradient-to-br from-[#0A2540] via-[#0e3557] to-[#0A2540] text-white overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
                </div>

                <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <Shield className="h-10 w-10 text-white drop-shadow-lg" />
                    </motion.div>
                    <p className="text-2xl font-bold tracking-wide drop-shadow-lg">CentraQu</p>
                </div>

                <motion.div
                    className="relative w-full max-w-md z-10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 backdrop-blur-sm border border-blue-400/30 p-12 flex flex-col items-center justify-center gap-6 shadow-2xl">
                        <Shield className="h-24 w-24 text-blue-200 drop-shadow-lg" />
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-white">Join CentraQu</h3>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                Comprehensive audit and consulting management platform
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="text-center max-w-md z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <h2 className="text-4xl font-black tracking-tight mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        Start Your Journey Today
                    </h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Streamline your operations, enhance collaboration, and achieve excellence with our comprehensive platform.
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    className="flex items-center gap-4 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center gap-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${currentStep >= step
                                        ? "bg-white text-[#0A2540] shadow-lg scale-110"
                                        : "bg-white/20 text-white/50"
                                    }`}
                            >
                                {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                            </div>
                            {step < 3 && (
                                <div
                                    className={`w-16 h-1 rounded-full transition-all duration-300 ${currentStep > step ? "bg-white" : "bg-white/20"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right Panel - Signup Form */}
            <div className="flex flex-col justify-center items-center w-full bg-background-light dark:bg-background-dark p-6 sm:p-8 md:p-12 relative overflow-y-auto">
                {/* Mobile Logo */}
                <div className="lg:hidden absolute top-4 left-4 flex items-center gap-2">
                    <Shield className="h-8 w-8 text-primary" />
                    <p className="text-xl font-bold text-slate-900 dark:text-gray-100">CentraQu</p>
                </div>

                {/* Switch Organization Button */}
                <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
                    <Link
                        href="/auth/workspace"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <Building2 className="w-4 h-4" />
                        Organizations
                    </Link>
                </div>

                <motion.div
                    className="w-full max-w-xl space-y-6 mt-16 lg:mt-0"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
                        <h1 className="text-slate-900 dark:text-gray-100 text-4xl font-black leading-tight tracking-tight">
                            Create Your Account
                        </h1>
                        <p className="text-slate-600 dark:text-gray-400 text-base">
                            Step {currentStep} of 3 - {currentStep === 1 ? "Personal Details" : currentStep === 2 ? "Account Security" : "Professional Info"}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-blue-600"
                            initial={{ width: "33.33%" }}
                            animate={{ width: `${(currentStep / 3) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    {apiError && (
                        <motion.div
                            className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4 flex items-start gap-3"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Step 1: Personal Details */}
                        {currentStep === 1 && (
                            <motion.div
                                className="space-y-5"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {/* First Name */}
                                    <label className="flex flex-col flex-1">
                                        <div className="flex items-center gap-2 pb-2">
                                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <p className="text-slate-900 dark:text-gray-200 text-sm font-medium">First Name *</p>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="John"
                                            value={values.first_name}
                                            onChange={(e) => handleChange("first_name", e.target.value)}
                                            onBlur={() => handleBlur("first_name")}
                                            className={`form-input flex w-full rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${touched.first_name && errors.first_name
                                                    ? "border-red-500 dark:border-red-400"
                                                    : "border-gray-300 dark:border-gray-600"
                                                } bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder-gray-500 px-4 text-base transition-all`}
                                            disabled={isSubmitting}
                                        />
                                        {touched.first_name && errors.first_name && (
                                            <span className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                <XCircle className="w-3 h-3" />
                                                {errors.first_name}
                                            </span>
                                        )}
                                    </label>

                                    {/* Last Name */}
                                    <label className="flex flex-col flex-1">
                                        <div className="flex items-center gap-2 pb-2">
                                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            <p className="text-slate-900 dark:text-gray-200 text-sm font-medium">Last Name *</p>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Doe"
                                            value={values.last_name}
                                            onChange={(e) => handleChange("last_name", e.target.value)}
                                            onBlur={() => handleBlur("last_name")}
                                            className={`form-input flex w-full rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${touched.last_name && errors.last_name
                                                    ? "border-red-500 dark:border-red-400"
                                                    : "border-gray-300 dark:border-gray-600"
                                                } bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder-gray-500 px-4 text-base transition-all`}
                                            disabled={isSubmitting}
                                        />
                                        {touched.last_name && errors.last_name && (
                                            <span className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                <XCircle className="w-3 h-3" />
                                                {errors.last_name}
                                            </span>
                                        )}
                                    </label>
                                </div>

                                {/* Username */}
                                <label className="flex flex-col">
                                    <div className="flex items-center gap-2 pb-2">
                                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <p className="text-slate-900 dark:text-gray-200 text-sm font-medium">Username *</p>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Choose a unique username"
                                        value={values.username}
                                        onChange={(e) => handleChange("username", e.target.value)}
                                        onBlur={() => handleBlur("username")}
                                        className={`form-input flex w-full rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${touched.username && errors.username
                                                ? "border-red-500 dark:border-red-400"
                                                : "border-gray-300 dark:border-gray-600"
                                            } bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder-gray-500 px-4 text-base transition-all`}
                                        disabled={isSubmitting}
                                    />
                                    {touched.username && errors.username && (
                                        <span className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                            <XCircle className="w-3 h-3" />
                                            {errors.username}
                                        </span>
                                    )}
                                </label>

                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    disabled={!isStep1Valid}
                                    className="w-full flex items-center justify-center text-base font-bold text-white rounded-lg h-14 px-8 bg-[#0A2540] hover:bg-[#0A2540]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    Continue to Security
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Account Security */}
                        {currentStep === 2 && (
                            <motion.div
                                className="space-y-5"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                {/* Email */}
                                <label className="flex flex-col">
                                    <div className="flex items-center gap-2 pb-2">
                                        <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <p className="text-slate-900 dark:text-gray-200 text-sm font-medium">Email Address *</p>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={values.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        onBlur={() => handleBlur("email")}
                                        className={`form-input flex w-full rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${touched.email && errors.email
                                                ? "border-red-500 dark:border-red-400"
                                                : "border-gray-300 dark:border-gray-600"
                                            } bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder-gray-500 px-4 text-base transition-all`}
                                        disabled={isSubmitting}
                                    />
                                    {touched.email && errors.email && (
                                        <span className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                            <XCircle className="w-3 h-3" />
                                            {errors.email}
                                        </span>
                                    )}
                                </label>

                                {/* Password */}
                                <label className="flex flex-col">
                                    <div className="flex items-center gap-2 pb-2">
                                        <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <p className="text-slate-900 dark:text-gray-200 text-sm font-medium">Password *</p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="At least 8 characters"
                                            value={values.password}
                                            onChange={(e) => handleChange("password", e.target.value)}
                                            onBlur={() => handleBlur("password")}
                                            className={`form-input flex w-full rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${touched.password && errors.password
                                                    ? "border-red-500 dark:border-red-400"
                                                    : "border-gray-300 dark:border-gray-600"
                                                } bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder-gray-500 px-4 pr-12 text-base transition-all`}
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {values.password && (
                                        <div className="mt-2 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600 dark:text-gray-400">Password strength:</span>
                                                <span className={`text-xs font-semibold ${passwordStrength.label === "Weak" ? "text-red-600" :
                                                        passwordStrength.label === "Fair" ? "text-yellow-600" :
                                                            passwordStrength.label === "Good" ? "text-blue-600" : "text-green-600"
                                                    }`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength.score ? passwordStrength.color : "bg-gray-200 dark:bg-gray-700"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {touched.password && errors.password && (
                                        <span className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                            <XCircle className="w-3 h-3" />
                                            {errors.password}
                                        </span>
                                    )}
                                </label>

                                {/* Confirm Password */}
                                <label className="flex flex-col">
                                    <div className="flex items-center gap-2 pb-2">
                                        <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <p className="text-slate-900 dark:text-gray-200 text-sm font-medium">Confirm Password *</p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter your password"
                                            value={values.password_confirm}
                                            onChange={(e) => handleChange("password_confirm", e.target.value)}
                                            onBlur={() => handleBlur("password_confirm")}
                                            className={`form-input flex w-full rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${touched.password_confirm && errors.password_confirm
                                                    ? "border-red-500 dark:border-red-400"
                                                    : "border-gray-300 dark:border-gray-600"
                                                } bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder-gray-500 px-4 pr-12 text-base transition-all`}
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {touched.password_confirm && errors.password_confirm && (
                                        <span className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                            <XCircle className="w-3 h-3" />
                                            {errors.password_confirm}
                                        </span>
                                    )}
                                    {values.password_confirm && values.password === values.password_confirm && (
                                        <span className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Passwords match
                                        </span>
                                    )}
                                </label>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        className="flex-1 flex items-center justify-center text-base font-bold text-gray-700 dark:text-gray-300 rounded-lg h-14 px-8 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(3)}
                                        disabled={!isStep2Valid}
                                        className="flex-1 flex items-center justify-center text-base font-bold text-white rounded-lg h-14 px-8 bg-[#0A2540] hover:bg-[#0A2540]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Professional Info */}
                        {currentStep === 3 && (
                            <motion.div
                                className="space-y-5"
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                {/* Phone */}
                                <label className="flex flex-col">
                                    <div className="flex items-center gap-2 pb-2">
                                        <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <p className="text-slate-900 dark:text-gray-200 text-sm font-medium">Phone Number (Optional)</p>
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        value={values.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        className="form-input flex w-full rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder-gray-500 px-4 text-base transition-all"
                                        disabled={isSubmitting}
                                    />
                                </label>

                                {/* Department */}
                                <label className="flex flex-col">
                                    <div className="flex items-center gap-2 pb-2">
                                        <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <p className="text-slate-900 dark:text-gray-200 text-sm font-medium">Department (Optional)</p>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g., Quality Assurance, Audit"
                                        value={values.department}
                                        onChange={(e) => handleChange("department", e.target.value)}
                                        className="form-input flex w-full rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder-gray-500 px-4 text-base transition-all"
                                        disabled={isSubmitting}
                                    />
                                </label>

                                {/* Role */}
                                <label className="flex flex-col">
                                    <div className="flex items-center gap-2 pb-2">
                                        <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <p className="text-slate-900 dark:text-gray-200 text-sm font-medium">Role</p>
                                    </div>
                                    <select
                                        value={values.role}
                                        onChange={(e) => handleChange("role", e.target.value as UserRole)}
                                        className="form-input flex w-full rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary h-12 px-4 text-base transition-all cursor-pointer"
                                        disabled={isSubmitting}
                                    >
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="ADMIN">Administrator</option>
                                    </select>
                                </label>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        className="flex-1 flex items-center justify-center text-base font-bold text-gray-700 dark:text-gray-300 rounded-lg h-14 px-8 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 flex items-center justify-center text-base font-bold text-white rounded-lg h-14 px-8 bg-gradient-to-r from-[#0A2540] to-blue-600 hover:from-[#0A2540]/90 hover:to-blue-600/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Creating Account...
                                            </div>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </form>

                    {/* Login Link */}
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-primary hover:underline font-semibold transition-colors">
                            Sign in here
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
