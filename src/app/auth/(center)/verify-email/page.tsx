"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerification } = useAuth();
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !code) {
      setError("Please enter both email and verification code");
      return;
    }

    if (code.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyEmail({ email, code });

      if (response.success) {
        setSuccess("Email verified successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(response.error || "Verification failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const response = await resendVerification(email);

      if (response.success) {
        setSuccess("Verification code sent! Please check your email.");
      } else {
        setError(response.error || "Failed to resend code. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="card animate-fade-in max-w-md">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-dark">Verify Your Email</h1>
        <p className="text-sm text-gray-6">
          We've sent a 6-digit verification code to your email address
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-button border border-error bg-error-light p-3 text-sm text-error">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-button border border-success bg-success/10 p-3 text-sm text-success">
          {success}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        {/* Email Field */}
        <div className="form-field">
          <label htmlFor="email" className="input-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            disabled={isSubmitting}
          />
        </div>

        {/* Verification Code */}
        <div className="form-field">
          <label htmlFor="code" className="input-label">
            Verification Code
          </label>
          <input
            id="code"
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="w-full rounded-lg border-2 border-stroke px-4 py-2.5 text-center text-2xl tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={isSubmitting || !email || !code}
          className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Verifying..." : "VERIFY EMAIL"}
        </button>
      </form>

      {/* Resend Code */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-6 mb-2">
          Didn't receive the code?
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || !email}
          className="text-sm text-primary hover:underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? "Sending..." : "Resend Code"}
        </button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

