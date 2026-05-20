"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    const userString = searchParams.get("user");

    console.log(
      "Callback received - Token:",
      !!token,
      "User string:",
      userString
    );

    if (!token || !userString) {
      setError("Invalid callback data. Please try logging in again.");
      setProcessing(false);
      return;
    }

    try {
      // Decode user data - handle multiple encoding scenarios
      let decodedUserString = userString;

      // Try decoding if it's URL encoded
      try {
        decodedUserString = decodeURIComponent(userString);
      } catch (decodeErr) {
        console.warn("Failed to decode user string, using as-is:", decodeErr);
      }

      console.log("Decoded user string:", decodedUserString);

      // Parse the JSON
      const user = JSON.parse(decodedUserString);

      console.log("Parsed user object:", user);

      // Store token in localStorage
      localStorage.setItem("authToken", token);

      // Store user data (optional, will be refreshed by auth context)
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Google OAuth successful:", user);

      // Small delay to ensure localStorage is set
      setTimeout(() => {
        // Refresh profile to sync auth context, then redirect with full page load
        refreshProfile()
          .then(() => {
            // Check user role and redirect accordingly using window.location for full reload
            if (user.role === "admin") {
              console.log("Admin user detected, redirecting to admin panel");
              window.location.href = "/admin";
            } else {
              console.log("Regular user, redirecting to dashboard");
              window.location.href = "/dashboard";
            }
          })
          .catch((profileErr) => {
            console.error("Failed to refresh profile:", profileErr);
            // Check user role even if profile refresh fails
            if (user.role === "admin") {
              window.location.href = "/admin";
            } else {
              window.location.href = "/dashboard";
            }
          });
      }, 100);
    } catch (err) {
      console.error("Failed to process Google OAuth callback:", err);
      console.error("Raw user string:", userString);
      setError("Failed to process authentication. Please try again.");
      setProcessing(false);
    }
  }, [searchParams, router, refreshProfile]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full space-y-4 border-slate-200">
          <h1 className="text-xl font-semibold text-red-600">
            Authentication Error
          </h1>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full px-4 py-2 bg-black text-white rounded hover:bg-slate-700"
          >
            Back to Login
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full border-slate-200">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="h-8 w-8" />
          <h2 className="text-lg font-medium text-slate-800">
            {processing
              ? "Completing Google Sign-In..."
              : "Redirecting to dashboard..."}
          </h2>
          <p className="text-sm text-slate-500 text-center">
            Please wait while we set up your account.
          </p>
        </div>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full border-slate-200">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="h-8 w-8" />
          <h2 className="text-lg font-medium text-slate-800">
            Loading...
          </h2>
        </div>
      </Card>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
