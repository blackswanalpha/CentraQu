import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {children}
    </div>
  );
}

