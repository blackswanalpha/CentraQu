"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@/hooks/useForm";
import { validateEmail, validatePassword } from "@/lib/utils";
import { authService } from "@/services/auth.service";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function ConsultingLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const newErrors: Partial<Record<keyof LoginFormValues, string>> = {};

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

      return newErrors;
    },
    onSubmit: async (values) => {
      try {
        setApiError("");

        const response = await authService.login({
          username: values.email,
          password: values.password,
        });

        if (response.success) {
          if (response.requires_2fa) {
            router.push("/consulting/2fa");
          } else {
            router.push("/consulting/dashboard");
          }
        } else {
          setApiError(response.error || response.message || "Login failed. Please check your credentials.");
        }
      } catch (error: any) {
        console.error("Login error:", error);
        setApiError(error.message || "An unexpected error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">CentraQu</h1>
          <p className="mt-2 text-sm text-gray-6">
            Business Management Platform
          </p>
        </div>

        <div className="card animate-fade-in">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                C
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-dark">Consulting Platform</h1>
            <p className="text-sm text-gray-6">
              Secure system access for consulting project management
            </p>
          </div>

          {apiError && (
            <div className="mb-4 rounded-button border border-error bg-error-light p-3 text-sm text-error">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="form-field">
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${touched.email && errors.email ? "border-error" : "border-stroke"
                  }`}
                disabled={isSubmitting}
              />
              {touched.email && errors.email && (
                <span className="input-error">{errors.email}</span>
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
                  className={`w-full rounded-lg border-2 px-4 py-2.5 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${touched.password && errors.password ? "border-error" : "border-stroke"
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
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex items-center justify-center rounded-lg border-2 border-stroke bg-white py-2.5 text-sm font-medium text-dark transition-colors hover:bg-neutral-light hover:border-blue-600 disabled:opacity-50"
              >
                Google
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                className="flex items-center justify-center rounded-lg border-2 border-stroke bg-white py-2.5 text-sm font-medium text-dark transition-colors hover:bg-neutral-light hover:border-blue-600 disabled:opacity-50"
              >
                Microsoft
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                className="flex items-center justify-center rounded-lg border-2 border-stroke bg-white py-2.5 text-sm font-medium text-dark transition-colors hover:bg-neutral-light hover:border-blue-600 disabled:opacity-50"
              >
                Apple
              </button>
            </div>
          </div>

          {/* Support Link */}
          <p className="mt-8 text-center text-xs text-gray-6">
            Need help?{" "}
            <Link href="/support" className="font-medium text-blue-600 hover:text-blue-700">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

