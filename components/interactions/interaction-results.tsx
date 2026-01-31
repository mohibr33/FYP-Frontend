"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Pill,
  Heart,
  Shield,
  FileWarning,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SeverityBadge, OverallRiskBanner } from "./severity-badge";
import type {
  InteractionScanResult,
  DrugInteraction,
  AllergyAlert,
  ConditionConflict,
  RegulatoryFlag,
  SafetyFlag,
} from "@/lib/types";

interface InteractionResultsProps {
  results: InteractionScanResult;
  className?: string;
}

export function InteractionResults({ results, className }: InteractionResultsProps) {
  const {
    drugInteractions,
    allergyAlerts,
    conditionConflicts,
    regulatoryFlags,
    safetyFlags,
    summary,
    aiAnalysis,
  } = results;

  const hasAnyResults =
    drugInteractions.length > 0 ||
    allergyAlerts.length > 0 ||
    conditionConflicts.length > 0 ||
    regulatoryFlags.length > 0 ||
    safetyFlags.length > 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overall Risk Banner */}
      <OverallRiskBanner
        risk={summary.overallRisk}
        recommendation={summary.recommendation}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        <StatCard
          label="Total"
          value={summary.totalInteractions}
          color="slate"
        />
        <StatCard
          label="Critical"
          value={summary.criticalCount}
          color="red"
        />
        <StatCard
          label="Major"
          value={summary.majorCount}
          color="orange"
        />
        <StatCard
          label="Moderate"
          value={summary.moderateCount}
          color="yellow"
        />
        <StatCard
          label="Minor"
          value={summary.minorCount}
          color="blue"
        />
      </div>

      {/* No Results Message */}
      {!hasAnyResults && (
        <div className="text-center py-10 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="font-bold text-green-800 text-xl mb-2">
            No Interactions Found
          </h3>
          <p className="text-green-700 text-sm max-w-md mx-auto leading-relaxed">
            Based on our analysis, no significant interactions were detected between the selected medicines. Always consult your healthcare provider for personalized advice.
          </p>
        </div>
      )}

      {/* AI Analysis - Show First if Available */}
      {aiAnalysis && (
        <ResultSection
          title="AI Analysis & Recommendations"
          icon={Sparkles}
          iconColor="text-teal-600"
          bgColor="bg-gradient-to-r from-teal-500 to-cyan-600"
          headerTextColor="text-white"
          defaultExpanded={true}
        >
          <div className="prose prose-sm prose-slate max-w-none">
            <div
              className="text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatAIAnalysis(aiAnalysis) }}
            />
          </div>
        </ResultSection>
      )}

      {/* Drug-Drug Interactions */}
      {drugInteractions.length > 0 && (
        <ResultSection
          title="Drug-Drug Interactions"
          icon={Pill}
          count={drugInteractions.length}
          iconColor="text-orange-600"
          bgColor="bg-gradient-to-r from-orange-50 to-amber-50"
          borderColor="border-orange-200"
        >
          <div className="space-y-3">
            {drugInteractions.map((interaction, index) => (
              <DrugInteractionCard key={index} interaction={interaction} />
            ))}
          </div>
        </ResultSection>
      )}

      {/* Allergy Alerts */}
      {allergyAlerts.length > 0 && (
        <ResultSection
          title="Allergy Alerts"
          icon={AlertTriangle}
          count={allergyAlerts.length}
          iconColor="text-red-600"
          bgColor="bg-gradient-to-r from-red-50 to-rose-50"
          borderColor="border-red-200"
        >
          <div className="space-y-3">
            {allergyAlerts.map((alert, index) => (
              <AllergyAlertCard key={index} alert={alert} />
            ))}
          </div>
        </ResultSection>
      )}

      {/* Condition Conflicts */}
      {conditionConflicts.length > 0 && (
        <ResultSection
          title="Condition Conflicts"
          icon={Heart}
          count={conditionConflicts.length}
          iconColor="text-purple-600"
          bgColor="bg-gradient-to-r from-purple-50 to-violet-50"
          borderColor="border-purple-200"
        >
          <div className="space-y-3">
            {conditionConflicts.map((conflict, index) => (
              <ConditionConflictCard key={index} conflict={conflict} />
            ))}
          </div>
        </ResultSection>
      )}

      {/* Regulatory Flags */}
      {regulatoryFlags.length > 0 && (
        <ResultSection
          title="Regulatory Flags"
          icon={Shield}
          count={regulatoryFlags.length}
          iconColor="text-blue-600"
          bgColor="bg-gradient-to-r from-blue-50 to-indigo-50"
          borderColor="border-blue-200"
        >
          <div className="space-y-3">
            {regulatoryFlags.map((flag, index) => (
              <RegulatoryFlagCard key={index} flag={flag} />
            ))}
          </div>
        </ResultSection>
      )}

      {/* Safety Flags */}
      {safetyFlags.length > 0 && (
        <ResultSection
          title="Safety Warnings"
          icon={FileWarning}
          count={safetyFlags.length}
          iconColor="text-amber-600"
          bgColor="bg-gradient-to-r from-amber-50 to-yellow-50"
          borderColor="border-amber-200"
        >
          <div className="space-y-3">
            {safetyFlags.map((flag, index) => (
              <SafetyFlagCard key={index} flag={flag} />
            ))}
          </div>
        </ResultSection>
      )}
    </div>
  );
}

// Helper Components

interface StatCardProps {
  label: string;
  value: number;
  color: "slate" | "red" | "orange" | "yellow" | "blue";
}

function StatCard({ label, value, color }: StatCardProps) {
  const colorClasses = {
    slate: "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 border-slate-300",
    red: value > 0 
      ? "bg-gradient-to-br from-red-100 to-red-200 text-red-800 border-red-300" 
      : "bg-slate-100 text-slate-400 border-slate-200",
    orange: value > 0 
      ? "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-800 border-orange-300" 
      : "bg-slate-100 text-slate-400 border-slate-200",
    yellow: value > 0 
      ? "bg-gradient-to-br from-yellow-100 to-amber-200 text-yellow-800 border-yellow-300" 
      : "bg-slate-100 text-slate-400 border-slate-200",
    blue: value > 0 
      ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 border-blue-300" 
      : "bg-slate-100 text-slate-400 border-slate-200",
  };

  return (
    <div className={cn("rounded-xl p-3 text-center border shadow-sm", colorClasses[color])}>
      <p className="text-xl md:text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-0.5 opacity-80">{label}</p>
    </div>
  );
}

interface ResultSectionProps {
  title: string;
  icon: React.ElementType;
  count?: number;
  iconColor: string;
  bgColor: string;
  borderColor?: string;
  headerTextColor?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

function ResultSection({
  title,
  icon: Icon,
  count,
  iconColor,
  bgColor,
  borderColor = "border-slate-200",
  headerTextColor = "text-slate-800",
  defaultExpanded = true,
  children,
}: ResultSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isGradientHeader = bgColor.includes("from-teal") || bgColor.includes("from-slate-8");

  return (
    <div className={cn("border rounded-2xl overflow-hidden shadow-sm", borderColor)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between p-4 transition-colors",
          bgColor
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            isGradientHeader ? "bg-white/20" : "bg-white shadow-sm"
          )}>
            <Icon className={cn("w-5 h-5", isGradientHeader ? "text-white" : iconColor)} />
          </div>
          <span className={cn("font-semibold", headerTextColor)}>{title}</span>
          {count !== undefined && (
            <span className={cn(
              "text-xs px-2.5 py-0.5 rounded-full font-medium",
              isGradientHeader 
                ? "bg-white/20 text-white" 
                : "bg-white text-slate-600 shadow-sm"
            )}>
              {count}
            </span>
          )}
        </div>
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          isGradientHeader ? "bg-white/10" : "bg-white/50"
        )}>
          {isExpanded ? (
            <ChevronUp className={cn("w-5 h-5", isGradientHeader ? "text-white" : "text-slate-500")} />
          ) : (
            <ChevronDown className={cn("w-5 h-5", isGradientHeader ? "text-white" : "text-slate-500")} />
          )}
        </div>
      </button>
      {isExpanded && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}

function DrugInteractionCard({ interaction }: { interaction: DrugInteraction }) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-200">{interaction.drug1}</span>
          <span className="text-slate-400 font-bold">+</span>
          <span className="font-semibold text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-200">{interaction.drug2}</span>
        </div>
        <SeverityBadge severity={interaction.severity} size="sm" />
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{interaction.description}</p>
      {interaction.mechanism && (
        <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-slate-200">
          <strong className="text-slate-700">Mechanism:</strong> {interaction.mechanism}
        </p>
      )}
      {interaction.management && (
        <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <p className="text-sm text-teal-800">
            <strong>Management:</strong> {interaction.management}
          </p>
        </div>
      )}
    </div>
  );
}

function AllergyAlertCard({ alert }: { alert: AllergyAlert }) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 border border-red-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="font-semibold text-red-800">{alert.medicine}</span>
        </div>
        <SeverityBadge severity={alert.severity} size="sm" />
      </div>
      <p className="text-sm text-red-700 leading-relaxed">{alert.message}</p>
      <div className="mt-3 pt-3 border-t border-red-200">
        <span className="inline-flex items-center gap-1.5 text-xs text-red-800 bg-red-100 px-2.5 py-1 rounded-full font-medium">
          Allergen: {alert.allergen}
        </span>
      </div>
    </div>
  );
}

function ConditionConflictCard({ conflict }: { conflict: ConditionConflict }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-purple-600" />
          <span className="font-semibold text-purple-800">{conflict.medicine}</span>
        </div>
        <SeverityBadge severity={conflict.severity} size="sm" />
      </div>
      <p className="text-sm text-purple-700 leading-relaxed">{conflict.message}</p>
      <div className="mt-3 pt-3 border-t border-purple-200 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs text-purple-800 bg-purple-100 px-2.5 py-1 rounded-full font-medium">
          Condition: {conflict.condition}
        </span>
      </div>
      {conflict.recommendation && (
        <div className="mt-3 p-3 bg-purple-100 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Recommendation:</strong> {conflict.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}

function RegulatoryFlagCard({ flag }: { flag: RegulatoryFlag }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-blue-800">{flag.medicine}</span>
        </div>
        <SeverityBadge severity={flag.severity} size="sm" />
      </div>
      <p className="text-sm text-blue-700 leading-relaxed">{flag.details}</p>
      <div className="mt-3 pt-3 border-t border-blue-200">
        <span className="inline-flex items-center gap-1.5 text-xs text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full font-medium capitalize">
          {flag.category}
        </span>
      </div>
    </div>
  );
}

function SafetyFlagCard({ flag }: { flag: SafetyFlag }) {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <FileWarning className="w-4 h-4 text-amber-600" />
          <span className="font-semibold text-amber-800">{flag.medicine}</span>
        </div>
        <SeverityBadge severity={flag.severity} size="sm" />
      </div>
      <p className="text-sm text-amber-700 leading-relaxed">{flag.message}</p>
      {flag.details && (
        <p className="text-xs text-amber-600 mt-3 pt-3 border-t border-amber-200">{flag.details}</p>
      )}
    </div>
  );
}

function formatAIAnalysis(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-slate-800'>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/•/g, "<span class='text-teal-600'>•</span>")
    .replace(/\n\n/g, "</p><p class='mt-3'>")
    .replace(/\n/g, "<br />");
}
