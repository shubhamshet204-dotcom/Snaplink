export default function Loader({ size = "md", label }: { size?: "sm" | "md" | "lg"; label?: string }) {
  const sizeClasses = {
    sm: "w-6 h-6 border-3",
    md: "w-10 h-10 border-4",
    lg: "w-14 h-14 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Brutalist box spinner */}
      <div
        className={`${sizeClasses[size]} border-[#0C0C0C] bg-[#FF5A00] neo-spinner`}
      />
      {label && (
        <p className="text-xs font-bold text-[#0C0C0C] uppercase tracking-wider font-mono">
          {label}
        </p>
      )}
    </div>
  );
}
