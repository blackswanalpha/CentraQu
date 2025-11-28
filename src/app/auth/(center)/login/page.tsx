"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@/hooks/useForm";
import { validateEmail, validatePassword } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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
    <div className="card animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
            C
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-dark">Audit Management Platform</h1>
        <p className="text-sm text-gray-6">
          Secure system access for audit certification management
        </p>
      </div>

      {apiError && (
        <div className="mb-4 rounded-button border border-error bg-error-light p-3 text-sm text-error">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Field */}
        <div className="form-field">
          <label htmlFor="username" className="input-label">
            Username or Email
          </label>
          <input
            id="username"
            type="text"
            placeholder="username or email"
            value={values.username}
            onChange={(e) => handleChange("username", e.target.value)}
            onBlur={() => handleBlur("username")}
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              touched.username && errors.username ? "border-error" : "border-stroke"
            }`}
            disabled={isSubmitting}
          />
          {touched.username && errors.username && (
            <span className="input-error">{errors.username}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="form-field">
          <label htmlFor="password" className="input-label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              className={`w-full rounded-lg border-2 px-4 py-2.5 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                touched.password && errors.password ? "border-error" : "border-stroke"
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-5 hover:text-gray-6"
              disabled={isSubmitting}
            >
              {showPassword ? "👁" : "👁‍🗨"}
            </button>
          </div>
          {touched.password && errors.password && (
            <span className="input-error">{errors.password}</span>
          )}
        </div>

        {/* 2FA Code Field (shown when required) */}
        {requires2FA && (
          <div className="form-field">
            <label htmlFor="twoFactorCode" className="input-label">
              Two-Factor Authentication Code
            </label>
            <input
              id="twoFactorCode"
              type="text"
              placeholder="Enter 6-digit code"
              maxLength={6}
              value={values.twoFactorCode}
              onChange={(e) => handleChange("twoFactorCode", e.target.value.replace(/\D/g, ''))}
              onBlur={() => handleBlur("twoFactorCode")}
              className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                touched.twoFactorCode && errors.twoFactorCode ? "border-error" : "border-stroke"
              }`}
              disabled={isSubmitting}
              autoFocus
            />
            {touched.twoFactorCode && errors.twoFactorCode && (
              <span className="input-error">{errors.twoFactorCode}</span>
            )}
          </div>
        )}

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={values.rememberMe}
              onChange={(e) => handleChange("rememberMe", e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-stroke"
            />
            <span className="text-sm text-gray-6">Remember me</span>
          </label>
          <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "LOGIN"}
        </button>
      </form>

      {/* Social Login */}
      <div className="mt-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stroke" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-6">Or sign in with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            className="flex items-center justify-center rounded-lg border-2 border-stroke bg-white py-2.5 text-sm font-medium text-dark transition-colors hover:bg-neutral-light hover:border-primary disabled:opacity-50"
          >
            Google
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            className="flex items-center justify-center rounded-lg border-2 border-stroke bg-white py-2.5 text-sm font-medium text-dark transition-colors hover:bg-neutral-light hover:border-primary disabled:opacity-50"
          >
            Microsoft
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            className="flex items-center justify-center rounded-lg border-2 border-stroke bg-white py-2.5 text-sm font-medium text-dark transition-colors hover:bg-neutral-light hover:border-primary disabled:opacity-50"
          >
            Apple
          </button>
        </div>
      </div>

      {/* Support Link */}
      <p className="mt-8 text-center text-xs text-gray-6">
        Need help?{" "}
        <Link href="/support" className="font-medium text-primary hover:text-primary-hover">
          Contact Support
        </Link>
      </p>
    </div>
  );
}

