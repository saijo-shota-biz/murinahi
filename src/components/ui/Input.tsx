import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "large";
  error?: string;
}

export function Input({ variant = "default", error, className = "", ...props }: InputProps) {
  const baseClasses =
    "text-gray-800 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-200";

  const variantClasses = {
    default: "px-4 py-3 text-base",
    large: "px-4 py-3 text-base sm:text-lg",
  };

  const errorClasses = error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "";

  const classes = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${className}`;

  return (
    <div className="w-full">
      <input className={classes} {...props} />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
