import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-blue/5 to-green/5 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">CentraQu</h1>
          <p className="mt-2 text-sm text-gray-6">
            Business Management Platform
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}

