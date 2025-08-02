import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "glass" | "feature";
}

export function Card({ children, variant = "default", className = "", ...props }: CardProps) {
  const baseClasses = "rounded-xl shadow-lg";

  const variantClasses = {
    default: "bg-white p-6",
    glass: "bg-white/80 backdrop-blur-sm p-4 border border-gray-100",
    feature: "bg-white/60 backdrop-blur-sm p-6 hover:shadow-xl transition-shadow duration-300",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
