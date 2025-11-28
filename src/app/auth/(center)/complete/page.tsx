"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SetupCompletePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="animate-fade-in">
      <div className="card text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-success-light">
          <span className="text-5xl text-success">✓</span>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-dark">Setup Complete!</h1>
        <p className="mb-8 text-gray-6">
          Your audit management platform is ready. Here's what we've set up:
        </p>

        <div className="mb-8 space-y-3 text-left">
          <p className="flex items-center gap-2 text-sm text-dark">
            <span className="text-success">✓</span>
            <span>Company profile configured</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-dark">
            <span className="text-success">✓</span>
            <span>Zoho Books integration connected</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-dark">
            <span className="text-success">✓</span>
            <span>Team members invited (5 users)</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-dark">
            <span className="text-success">✓</span>
            <span>Document folders created</span>
          </p>
        </div>

        <div className="mb-8 space-y-2">
          <p className="text-sm text-gray-6">
            Redirecting in 3 seconds...
          </p>
          <div className="h-1 w-full overflow-hidden rounded-full bg-stroke">
            <div className="h-full w-full animate-pulse bg-primary" />
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary-hover"
          >
            GO TO DASHBOARD
          </Link>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex-1 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white"
          >
            TAKE A TOUR
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-6">
          Next steps:
        </p>
        <ul className="mt-2 space-y-1 text-xs text-gray-6">
          <li>• Upload your first client contract</li>
          <li>• Schedule an audit</li>
          <li>• Explore the dashboard</li>
        </ul>
      </div>
    </div>
  );
}

