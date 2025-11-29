import Link from "next/link";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="flex flex-col items-center justify-center text-center w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="size-10 text-primary">
              <Shield className="h-10 w-10" />
            </div>
            <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">AssureHub</h2>
          </div>
          
          <div className="w-full flex flex-col items-center p-6 sm:p-8 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-24 bg-slate-100 dark:bg-slate-800 p-2 mb-4 flex items-center justify-center">
              <Shield className="h-16 w-16 text-primary" />
            </div>
            
            <div className="flex flex-col mb-6">
              <p className="text-slate-900 dark:text-white text-[28px] font-bold leading-tight tracking-[-0.015em]">Audit Management Platform</p>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Comprehensive audit certification and consulting solutions</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/auth/workspace"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="truncate">Access Platform</span>
              </Link>
              <Link
                href="/auth/signup"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-hover transition-colors"
              >
                <span className="truncate">Create Account</span>
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
                © 2025 AssureHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

