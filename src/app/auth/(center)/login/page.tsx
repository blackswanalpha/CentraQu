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
      <div
        className="relative hidden lg:flex flex-col items-center justify-center gap-6 p-12 text-white"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://krestonhelmitalib.com.sg/wp-content/uploads/bb-plugin/cache/New-Global-Internal-Audit-Standards-1200x675-landscape-074515d3f1b1c5d83f980dc39f8406c5-.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <Shield className="h-10 w-10 text-white" />
          <p className="text-xl font-bold tracking-wide text-white">CentraQu</p>
        </div>

        <div className="text-center max-w-sm z-10">
          <h2 className="text-3xl font-bold tracking-tight text-white">Unified Insights, Trusted Audits.</h2>
          <p className="mt-2 text-base text-gray-100">Securely access your comprehensive audit and consulting dashboard.</p>
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
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left" style={{ marginTop: '35%' }}>
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
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${touched.username && errors.username
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
                    className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${touched.password && errors.password
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
                  className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${touched.twoFactorCode && errors.twoFactorCode
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
        </div>
      </div>
    </div>
  );
}

