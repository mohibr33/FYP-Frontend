"use client";

import { cn } from "@/lib/utils";
import type { InteractionSeverity, SafetyRiskLevel } from "@/lib/types";
import { AlertTriangle, AlertCircle, Info, XOctagon, CheckCircle2, ShieldAlert } from "lucide-react";

interface SeverityBadgeProps {
  severity: InteractionSeverity | SafetyRiskLevel;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const severityConfig: Record<
  InteractionSeverity | SafetyRiskLevel,
  { label: string; colors: string; icon: React.ElementType }
> = {
  // InteractionSeverity
  contraindicated: {
    label: "Contraindicated",
    colors: "bg-red-100 text-red-800 border-red-300",
    icon: XOctagon,
  },
  major: {
    label: "Major",
    colors: "bg-orange-100 text-orange-800 border-orange-300",
    icon: AlertTriangle,
  },
  moderate: {
    label: "Moderate",
    colors: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: AlertCircle,
  },
  minor: {
    label: "Minor",
    colors: "bg-blue-100 text-blue-800 border-blue-300",
    icon: Info,
  },
  // SafetyRiskLevel
  critical: {
    label: "Critical",
    colors: "bg-red-100 text-red-800 border-red-300",
    icon: XOctagon,
  },
  high: {
    label: "High Risk",
    colors: "bg-orange-100 text-orange-800 border-orange-300",
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium",
    colors: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: AlertCircle,
  },
  low: {
    label: "Low Risk",
    colors: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle2,
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

const iconSizes = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function SeverityBadge({
  severity,
  size = "md",
  showIcon = true,
  className,
}: SeverityBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-sm",
        config.colors,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}

interface OverallRiskBannerProps {
  risk: SafetyRiskLevel;
  recommendation: string;
  className?: string;
}

const riskBannerConfig: Record<
  SafetyRiskLevel,
  { 
    bgColor: string; 
    borderColor: string; 
    textColor: string; 
    icon: React.ElementType;
    iconBg: string;
    title: string;
  }
> = {
  critical: {
    bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
    borderColor: "border-red-300",
    textColor: "text-red-800",
    icon: XOctagon,
    iconBg: "bg-red-100",
    title: "Critical Risk Detected",
  },
  high: {
    bgColor: "bg-gradient-to-r from-orange-50 to-amber-50",
    borderColor: "border-orange-300",
    textColor: "text-orange-800",
    icon: AlertTriangle,
    iconBg: "bg-orange-100",
    title: "High Risk Detected",
  },
  medium: {
    bgColor: "bg-gradient-to-r from-yellow-50 to-amber-50",
    borderColor: "border-yellow-300",
    textColor: "text-yellow-800",
    icon: AlertCircle,
    iconBg: "bg-yellow-100",
    title: "Moderate Concerns Found",
  },
  low: {
    bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
    borderColor: "border-green-300",
    textColor: "text-green-800",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    title: "Low Risk - Generally Safe",
  },
};

export function OverallRiskBanner({
  risk,
  recommendation,
  className,
}: OverallRiskBannerProps) {
  const config = riskBannerConfig[risk];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-5 rounded-2xl border-2 shadow-sm",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
        config.iconBg
      )}>
        <Icon className={cn("w-6 h-6", config.textColor)} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className={cn("font-bold text-lg", config.textColor)}>
            {config.title}
          </h3>
          <SeverityBadge severity={risk} size="sm" showIcon={false} />
        </div>
        <p className={cn("text-sm leading-relaxed", config.textColor)}>{recommendation}</p>
      </div>
    </div>
  );
}
