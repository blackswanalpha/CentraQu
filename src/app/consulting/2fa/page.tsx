"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatTime } from "@/lib/utils";

export default function ConsultingTwoFactorPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-advance to next field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newCode.every((digit) => digit !== "")) {
      handleSubmit(newCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (codeToSubmit?: string[]) => {
    const fullCode = (codeToSubmit || code).join("");
    if (fullCode.length !== 6) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, redirect to consulting dashboard
      router.push("/consulting/dashboard");
    } catch (error) {
      setApiError("Invalid code. Please try again.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExpired = timeLeft === 0;
  const isWarning = timeLeft < 30;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">CentraQu</h1>
          <p className="mt-2 text-sm text-gray-6">
            Consulting Platform
          </p>
        </div>

        <div className="card animate-fade-in">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-dark">Two-Factor Authentication</h1>
            <p className="text-sm text-gray-6">
              Enter the 6-digit code sent to your mobile device ending in ****789
            </p>
          </div>

          {apiError && (
            <div className="mb-4 rounded-lg border border-error bg-error-light p-3 text-sm text-error">
              {apiError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Code Input */}
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isSubmitting || isExpired}
                  className="h-14 w-14 rounded-lg border-2 border-stroke text-center text-xl font-bold text-dark transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-neutral-light disabled:opacity-50"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center">
              <p className={`text-sm font-medium ${isWarning ? "text-error" : "text-gray-6"}`}>
                Code expires in: {formatTime(timeLeft)}
              </p>
              {isExpired && (
                <p className="mt-2 text-sm text-error">Code has expired. Please request a new one.</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isExpired || code.some((digit) => !digit)}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying..." : "VERIFY"}
            </button>
          </form>

          {/* Alternative Actions */}
          <div className="mt-8 space-y-3 border-t border-stroke pt-6">
            <button
              type="button"
              disabled={isSubmitting}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 font-medium"
            >
              Didn't receive code? Resend Code
            </button>

            <div className="flex gap-2 text-center text-sm">
              <button
                type="button"
                disabled={isSubmitting}
                className="flex-1 text-blue-600 hover:text-blue-700 disabled:opacity-50 font-medium"
              >
                Use Backup Code
              </button>
              <span className="text-gray-6">|</span>
              <button
                type="button"
                disabled={isSubmitting}
                className="flex-1 text-blue-600 hover:text-blue-700 disabled:opacity-50 font-medium"
              >
                Try Another Way
              </button>
            </div>
          </div>

          {/* Back Link */}
          <p className="mt-6 text-center text-sm text-gray-6">
            <Link href="/consulting/login" className="text-blue-600 hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

