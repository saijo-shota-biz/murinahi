import { Card } from "@/components/ui";
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
  iconTextColor: string;
}

export function FeatureCard({ icon, title, description, iconBgColor, iconTextColor }: FeatureCardProps) {
  return (
    <Card variant="feature">
      <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center mb-4 mx-auto`}>
        <div className={iconTextColor}>{icon}</div>
      </div>
      <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Card>
  );
}
