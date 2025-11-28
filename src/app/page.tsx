import Link from "next/link";

export default function Home() {
  return (
    <div className="splash-container bg-gradient-to-br from-primary/10 to-blue/10 dark:from-primary/20 dark:to-blue/20 dark:bg-dark-2">
      <div className="splash-content card text-center animate-fade-in">
        <h1 className="mb-4 text-2xl sm:text-3xl font-bold text-primary dark:text-primary-hover">CentraQu</h1>
        <p className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-6 dark:text-gray-4 px-2">
          Business Management Platform for Audit Certification and Consulting
        </p>

        <div className="flex flex-col gap-3 sm:gap-4 px-2">
          <Link
            href="/auth/workspace"
            className="btn-primary text-sm sm:text-base"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="btn-secondary text-sm sm:text-base"
          >
            Create Account
          </Link>
        </div>

        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-5 dark:text-gray-6">
          © 2025 CentraQu. All rights reserved.
        </p>
      </div>
    </div>
  );
}

