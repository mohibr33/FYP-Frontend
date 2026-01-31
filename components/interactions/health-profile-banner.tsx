"use client";

import Link from "next/link";
import { User, AlertCircle, CheckCircle2, Heart, Pill, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HealthProfileSnapshot } from "@/lib/types";

interface HealthProfileBannerProps {
  profile: HealthProfileSnapshot | null;
  isLoading?: boolean;
  className?: string;
}

export function HealthProfileBanner({
  profile,
  isLoading,
  className,
}: HealthProfileBannerProps) {
  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-2xl border border-slate-200 p-5 animate-pulse", className)}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-xl" />
          <div className="flex-1">
            <div className="h-5 w-48 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-32 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className={cn(
          "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5",
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 mb-1">
              No Health Profile Found
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              Create a health profile to get personalized interaction alerts based on your allergies and medical conditions.
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              Create Health Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasAllergies = profile.allergies.length > 0;
  const hasConditions = profile.medicalConditions.length > 0;
  const hasSpecialConditions = profile.specialConditions.length > 0;

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-white">Health Profile Connected</span>
        </div>
        <Link
          href="/profile"
          className="text-xs text-white/80 hover:text-white underline underline-offset-2"
        >
          Edit Profile
        </Link>
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-4">
        <p className="text-sm text-slate-600">
          Your interaction check will consider your personal health information for accurate alerts.
        </p>

        {/* Allergies Section */}
        {hasAllergies && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-800 text-sm">
                Allergies ({profile.allergies.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-800 text-sm font-medium rounded-lg border border-red-200"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Medical Conditions Section */}
        {hasConditions && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-800 text-sm">
                Medical Conditions ({profile.medicalConditions.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.medicalConditions.map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-800 text-sm font-medium rounded-lg border border-purple-200"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Special Conditions */}
        {(hasSpecialConditions || profile.isPregnant || profile.isBreastfeeding) && (
          <div className="flex flex-wrap gap-2">
            {profile.isPregnant && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 text-pink-800 text-sm font-medium rounded-lg border border-pink-200">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                Pregnant
              </span>
            )}
            {profile.isBreastfeeding && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 text-violet-800 text-sm font-medium rounded-lg border border-violet-200">
                <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                Breastfeeding
              </span>
            )}
            {hasSpecialConditions && profile.specialConditions
              .filter(c => !c.toLowerCase().includes('pregnant') && !c.toLowerCase().includes('breastfeed') && !c.toLowerCase().includes('lactating'))
              .map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg border border-blue-200"
                >
                  <Pill className="w-3 h-3" />
                  {condition}
                </span>
              ))}
          </div>
        )}

        {/* No health info message */}
        {!hasAllergies && !hasConditions && !hasSpecialConditions && !profile.isPregnant && !profile.isBreastfeeding && (
          <div className="text-center py-2">
            <p className="text-sm text-slate-500">
              No allergies or conditions recorded.{" "}
              <Link href="/profile" className="text-teal-600 hover:text-teal-700 underline">
                Add health information
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
