import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] neo-grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md z-10">
        {children}
      </div>
    </div>
  );
}
