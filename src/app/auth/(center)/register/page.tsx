"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@/hooks/useForm";
import { validateEmail, validatePassword } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/auth";

interface RegisterFormValues {
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

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm<RegisterFormValues>({
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
      const newErrors: Partial<Record<keyof RegisterFormValues, string>> = {};

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
          // Redirect to email verification page
          router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
        } else {
          // Handle validation errors
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

  return (
    <div className="card animate-fade-in max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
            C
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-dark">Create Account</h1>
        <p className="text-sm text-gray-6">
          Join AssureHub to manage your audit and consulting projects
        </p>
      </div>

      {apiError && (
        <div className="mb-4 rounded-button border border-error bg-error-light p-3 text-sm text-error">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="form-field">
          <label htmlFor="username" className="input-label">
            Username *
          </label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
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

        {/* Email */}
        <div className="form-field">
          <label htmlFor="email" className="input-label">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              touched.email && errors.email ? "border-error" : "border-stroke"
            }`}
            disabled={isSubmitting}
          />
          {touched.email && errors.email && (
            <span className="input-error">{errors.email}</span>
          )}
        </div>

        {/* First Name and Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-field">
            <label htmlFor="first_name" className="input-label">
              First Name *
            </label>
            <input
              id="first_name"
              type="text"
              placeholder="John"
              value={values.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              onBlur={() => handleBlur("first_name")}
              className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                touched.first_name && errors.first_name ? "border-error" : "border-stroke"
              }`}
              disabled={isSubmitting}
            />
            {touched.first_name && errors.first_name && (
              <span className="input-error">{errors.first_name}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="last_name" className="input-label">
              Last Name *
            </label>
            <input
              id="last_name"
              type="text"
              placeholder="Doe"
              value={values.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              onBlur={() => handleBlur("last_name")}
              className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                touched.last_name && errors.last_name ? "border-error" : "border-stroke"
              }`}
              disabled={isSubmitting}
            />
            {touched.last_name && errors.last_name && (
              <span className="input-error">{errors.last_name}</span>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="form-field">
          <label htmlFor="password" className="input-label">
            Password *
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              className={`w-full rounded-lg border-2 px-4 py-2.5 pr-12 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                touched.password && errors.password ? "border-error" : "border-stroke"
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-6 hover:text-dark"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {touched.password && errors.password && (
            <span className="input-error">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-field">
          <label htmlFor="password_confirm" className="input-label">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              id="password_confirm"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={values.password_confirm}
              onChange={(e) => handleChange("password_confirm", e.target.value)}
              onBlur={() => handleBlur("password_confirm")}
              className={`w-full rounded-lg border-2 px-4 py-2.5 pr-12 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                touched.password_confirm && errors.password_confirm ? "border-error" : "border-stroke"
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-6 hover:text-dark"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {touched.password_confirm && errors.password_confirm && (
            <span className="input-error">{errors.password_confirm}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Account..." : "CREATE ACCOUNT"}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center text-sm text-gray-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:underline font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
}

