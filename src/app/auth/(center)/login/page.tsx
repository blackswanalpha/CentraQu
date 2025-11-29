"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@/hooks/useForm";
import { validateEmail, validatePassword } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Eye, EyeOff, Shield } from "lucide-react";

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
  twoFactorCode?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue } = useForm<LoginFormValues>({
    initialValues: {
      username: "",
      password: "",
      rememberMe: false,
      twoFactorCode: "",
    },
    validate: (values) => {
      const newErrors: Partial<Record<keyof LoginFormValues, string>> = {};

      if (!values.username) {
        newErrors.username = "Username or email is required";
      }

      if (!values.password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(values.password)) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (requires2FA && !values.twoFactorCode) {
        newErrors.twoFactorCode = "2FA code is required";
      }

      return newErrors;
    },
    onSubmit: async (values) => {
      try {
        setApiError("");
        setRequires2FA(false);
        setRequiresVerification(false);

        const response = await login({
          username: values.username,
          password: values.password,
          two_factor_code: values.twoFactorCode,
        });

        if (response.success) {
          // Redirect to dashboard on successful login
          router.push("/dashboard");
        } else if (response.requires_2fa) {
          setRequires2FA(true);
          setApiError("Please enter your 2FA code");
        } else if (response.requires_verification) {
          setRequiresVerification(true);
          // Redirect to verification page
          router.push(`/auth/verify-email?email=${encodeURIComponent(values.username)}`);
        } else {
          setApiError(response.error || "Login failed. Please try again.");
        }
      } catch (error) {
        setApiError("An unexpected error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left Panel - Brand & Visual */}
      <div className="relative hidden lg:flex flex-col items-center justify-center gap-6 p-12 bg-[#0A2540] text-white">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <Shield className="h-10 w-10 text-white" />
          <p className="text-xl font-bold tracking-wide">AssureHub</p>
        </div>
        
        <div className="w-full max-w-sm gap-1 overflow-hidden flex">
          <div className="w-full bg-center bg-no-repeat bg-cover aspect-square rounded-lg flex-1 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-400/20 flex items-center justify-center">
            <div className="text-center">
              <Shield className="h-20 w-20 mx-auto mb-4 text-blue-200" />
              <p className="text-blue-200 text-sm">Comprehensive Audit Management</p>
            </div>
          </div>
        </div>
        
        <div className="text-center max-w-sm">
          <h2 className="text-3xl font-bold tracking-tight">Unified Insights, Trusted Audits.</h2>
          <p className="mt-2 text-base text-gray-300">Securely access your comprehensive audit and consulting dashboard.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col justify-center items-center w-full bg-background-light dark:bg-background-dark p-6 sm:p-8 md:p-12">
        {/* Switch Organization Button */}
        <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
          <Link
            href="/auth/workspace"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Building2 className="w-4 h-4" />
            Switch Organization
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <p className="text-slate-900 dark:text-gray-100 text-4xl font-black leading-tight tracking-[-0.033em]">Sign in to your Account</p>
          </div>
          
          {apiError && (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
              {apiError}
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* Email Field */}
            <label className="flex flex-col flex-1">
              <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">Email Address</p>
              <input
                id="username"
                type="email"
                placeholder="Enter your email address"
                value={values.username}
                onChange={(e) => handleChange("username", e.target.value)}
                onBlur={() => handleBlur("username")}
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                  touched.username && errors.username 
                    ? "border-red-500 dark:border-red-400" 
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-800 focus:border-primary h-14 placeholder:text-gray-500 dark:placeholder-gray-500 p-[15px] text-base font-normal leading-normal`}
                disabled={isSubmitting}
              />
              {touched.username && errors.username && (
                <span className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.username}</span>
              )}
            </label>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="flex flex-col flex-1">
                <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">Password</p>
                <div className="flex w-full flex-1 items-stretch">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                      touched.password && errors.password 
                        ? "border-red-500 dark:border-red-400" 
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-800 focus:border-primary h-14 placeholder:text-gray-500 dark:placeholder-gray-500 p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 dark:text-gray-400 flex border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 items-center justify-center px-4 rounded-r-lg border-l-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <span className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password}</span>
                )}
              </label>
              <p className="text-right text-[#0A2540] dark:text-primary/90 text-sm font-medium leading-normal underline cursor-pointer hover:text-primary dark:hover:text-primary">
                <Link href="/auth/reset-password">Forgot Password?</Link>
              </p>
            </div>

            {/* 2FA Code Field (shown when required) */}
            {requires2FA && (
              <label className="flex flex-col flex-1">
                <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">Two-Factor Authentication Code</p>
                <input
                  id="twoFactorCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  value={values.twoFactorCode}
                  onChange={(e) => handleChange("twoFactorCode", e.target.value.replace(/\D/g, ''))}
                  onBlur={() => handleBlur("twoFactorCode")}
                  className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                    touched.twoFactorCode && errors.twoFactorCode 
                      ? "border-red-500 dark:border-red-400" 
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-800 focus:border-primary h-14 placeholder:text-gray-500 dark:placeholder-gray-500 p-[15px] text-base font-normal leading-normal`}
                  disabled={isSubmitting}
                  autoFocus
                />
                {touched.twoFactorCode && errors.twoFactorCode && (
                  <span className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.twoFactorCode}</span>
                )}
              </label>
            )}

            {/* Login Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center justify-center text-base font-bold text-white rounded-lg h-14 px-8 py-4 bg-[#0A2540] hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <hr className="w-full border-t border-gray-300 dark:border-gray-600"/>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">or</p>
            <hr className="w-full border-t border-gray-300 dark:border-gray-600"/>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col gap-4">
            <button 
              type="button"
              className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-base font-bold text-slate-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_324_383)">
                  <path d="M21.9999 12.2273C21.9999 11.4545 21.9363 10.7273 21.7863 10H12.2272V14.2045H17.7635C17.5226 15.6023 16.7363 16.8182 15.5454 17.625V20.3182H18.3908C20.5908 18.3341 21.9999 15.5398 21.9999 12.2273Z" fill="#4285F4"/>
                  <path d="M12.2272 22C15.0908 22 17.5226 21.0568 19.3908 19.3182L16.5454 17.625C15.659 18.2273 14.4181 18.6364 12.2272 18.6364C9.93172 18.6364 7.97717 17.1023 7.18627 15.0455H4.22717V17.8182C5.97717 20.2727 8.86354 22 12.2272 22Z" fill="#34A853"/>
                  <path d="M7.18635 15.0455C6.9818 14.4432 6.86362 13.7955 6.86362 13.1364C6.86362 12.4773 6.9818 11.8295 7.18635 11.2273V8.45455H4.22726C3.48635 9.98864 3 11.5227 3 13.1364C3 14.75 3.48635 16.2841 4.22726 17.8182L7.18635 15.0455Z" fill="#FBBC05"/>
                  <path d="M12.2272 7.63636C13.7272 7.63636 15.1704 8.16477 16.2772 9.19318L19.4681 6C17.5135 4.21023 15.0908 3.27273 12.2272 3.27273C8.86354 3.27273 5.97717 5.72727 4.22717 8.45455L7.18627 11.2273C7.97717 9.17045 9.93172 7.63636 12.2272 7.63636Z" fill="#EA4335"/>
                </g>
                <defs>
                  <clipPath id="clip0_324_383">
                    <rect fill="white" height="19" transform="translate(3 2.72727)" width="19"/>
                  </clipPath>
                </defs>
              </svg>
              <span>Continue with Google</span>
            </button>
            
            <button 
              type="button"
              className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-base font-bold text-slate-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.4 21.9H3V12.6H11.4V21.9ZM11.4 11.4H3V2.1H11.4V11.4ZM21.9 21.9H12.6V12.6H21.9V21.9ZM21.9 11.4H12.6V2.1H21.9V11.4Z" fill="#00A4EF"/>
                <path d="M10.6 21.1H3.8V13.4H10.6V21.1Z" fill="#F25022"/>
                <path d="M10.6 10.6H3.8V2.9H10.6V10.6Z" fill="#7FBA00"/>
                <path d="M21.1 21.1H13.4V13.4H21.1V21.1Z" fill="#FFB900"/>
                <path d="M21.1 10.6H13.4V2.9H21.1V10.6Z" fill="#00A4EF"/>
              </svg>
              <span>Continue with Microsoft</span>
            </button>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-500 text-xs font-normal leading-normal">For security purposes, all login attempts are logged and monitored. By signing in, you agree to our Terms of Service.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

