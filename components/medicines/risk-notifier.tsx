"use client";

import { AlertTriangle, ShieldCheck, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { RiskEvaluation, RiskFactor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RiskNotifierProps {
  risk: RiskEvaluation;
  variant?: "card" | "banner" | "compact";
  showDetails?: boolean;
  className?: string;
}

// Get risk level config
const getRiskConfig = (level: RiskEvaluation["level"]) => {
  switch (level) {
    case "high_risk":
      return {
        icon: AlertTriangle,
        label: "High Risk",
        bgColor: "bg-gradient-to-r from-rose-500 to-rose-600",
        bgColorLight: "bg-rose-50",
        borderColor: "border-rose-400",
        textColor: "text-rose-700",
        iconColor: "text-white",
        badgeBg: "bg-rose-500",
      };
    case "caution":
      return {
        icon: AlertCircle,
        label: "Caution",
        bgColor: "bg-gradient-to-r from-amber-500 to-orange-500",
        bgColorLight: "bg-amber-50",
        borderColor: "border-amber-400",
        textColor: "text-amber-700",
        iconColor: "text-white",
        badgeBg: "bg-amber-500",
      };
    case "safe":
    default:
      return {
        icon: ShieldCheck,
        label: "Safe",
        bgColor: "bg-gradient-to-r from-emerald-500 to-emerald-600",
        bgColorLight: "bg-emerald-50",
        borderColor: "border-emerald-400",
        textColor: "text-emerald-700",
        iconColor: "text-white",
        badgeBg: "bg-emerald-500",
      };
  }
};

// Get factor type label
const getFactorTypeLabel = (type: RiskFactor["type"]) => {
  switch (type) {
    case "allergy":
      return "Allergy";
    case "condition":
      return "Medical Condition";
    case "medication":
      return "Drug Interaction";
    case "pregnancy":
      return "Pregnancy/Lactation";
    case "side_effect":
      return "Side Effect";
    default:
      return "Warning";
  }
};

// Compact badge for medicine cards
export function RiskBadge({ risk, className }: { risk: RiskEvaluation; className?: string }) {
  const config = getRiskConfig(risk.level);
  const Icon = config.icon;

  if (!risk.hasProfile) {
    return (
      <div className={cn(
        "inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium",
        className
      )}>
        <Info className="w-3 h-3" />
        <span>No profile</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white",
      config.badgeBg,
      className
    )}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  );
}

// Card variant - for medicine cards in list
export function RiskNotifierCard({ risk, className }: RiskNotifierProps) {
  const config = getRiskConfig(risk.level);
  const Icon = config.icon;

  if (!risk.hasProfile) {
    return (
      <div className={cn(
        "px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-2",
        className
      )}>
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <p className="text-xs text-slate-600">
          Create a health profile for personalized risk assessment
        </p>
      </div>
    );
  }

  if (risk.level === "safe" && risk.factors.length === 0) {
    return (
      <div className={cn(
        "px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2",
        className
      )}>
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <p className="text-xs text-emerald-700 font-medium">{risk.message}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      config.bgColor,
      "text-white px-3 py-2 rounded-lg flex items-center gap-2",
      className
    )}>
      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide">{config.label}</p>
        <p className="text-xs opacity-90 truncate">{risk.message}</p>
      </div>
    </div>
  );
}

// Banner variant - for medicine detail page
export function RiskNotifierBanner({ risk, showDetails = true, className }: RiskNotifierProps) {
  const [expanded, setExpanded] = useState(false);
  const config = getRiskConfig(risk.level);
  const Icon = config.icon;

  if (!risk.hasProfile) {
    return (
      <div className={cn(
        "p-4 bg-slate-100 border border-slate-200 rounded-xl",
        className
      )}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Health Profile Required</h3>
            <p className="text-sm text-slate-600 mt-1">
              Create a health profile to get personalized risk assessment based on your allergies, medical conditions, and medications.
            </p>
            <a 
              href="/meal-planner/profile" 
              className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-slate-700 hover:text-slate-900 underline"
            >
              Create Health Profile
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl overflow-hidden border-2",
      config.borderColor,
      className
    )}>
      {/* Header */}
      <div className={cn(config.bgColor, "px-4 py-3")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80">
                Risk Assessment
              </p>
              <h3 className="font-semibold text-white text-lg">{config.label}</h3>
            </div>
          </div>
          {showDetails && risk.factors.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {expanded ? "Hide" : "Details"}
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
        <p className="mt-2 text-white/90 text-sm">{risk.message}</p>
      </div>

      {/* Expanded details */}
      {showDetails && expanded && risk.factors.length > 0 && (
        <div className={cn(config.bgColorLight, "px-4 py-3")}>
          <h4 className={cn("text-sm font-semibold mb-2", config.textColor)}>
            Risk Factors ({risk.factors.length})
          </h4>
          <div className="space-y-2">
            {risk.factors.map((factor, index) => (
              <div 
                key={index}
                className="flex items-start gap-2 p-2 bg-white/80 rounded-lg"
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white",
                  factor.severity === "high_risk" ? "bg-rose-500" : "bg-amber-500"
                )}>
                  {factor.severity === "high_risk" ? "!" : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      {getFactorTypeLabel(factor.type)}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className={cn(
                      "text-xs font-semibold capitalize",
                      factor.severity === "high_risk" ? "text-rose-600" : "text-amber-600"
                    )}>
                      {factor.match}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mt-0.5">{factor.message}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500 italic">
            This assessment is based on your health profile. Always consult a healthcare professional before taking any medication.
          </p>
        </div>
      )}
    </div>
  );
}

// Default export - auto-selects variant based on props
export default function RiskNotifier({ 
  risk, 
  variant = "card", 
  showDetails = true,
  className 
}: RiskNotifierProps) {
  if (variant === "banner") {
    return <RiskNotifierBanner risk={risk} showDetails={showDetails} className={className} />;
  }
  
  if (variant === "compact") {
    return <RiskBadge risk={risk} className={className} />;
  }

  return <RiskNotifierCard risk={risk} className={className} />;
}
