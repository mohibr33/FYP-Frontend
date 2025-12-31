"use client";
import React, { useState, useEffect, Suspense } from "react";
import { resetPassword } from "@/lib/api/users";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const presetEmail = params.get("email") || "";
  const [email, setEmail] = useState(presetEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (presetEmail) setEmail(presetEmail);
  }, [presetEmail]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email || !otp || !newPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword({ email, otp, newPassword });
      setSuccess(res.message + " Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-300 mt-1">Enter the OTP sent to your email</p>
        </div>

        {/* Form Card */}
        <Card className="rounded-t-none border-t-0 p-6 space-y-4 border-slate-200">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                className="border-slate-200"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="otp" className="text-slate-700">OTP Code</Label>
              <Input
                id="otp"
                className="border-slate-200"
                placeholder="Enter the 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="newPassword" className="text-slate-700">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                className="border-slate-200"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-emerald-600 text-sm">{success}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-slate-800 hover:bg-slate-700 text-white">
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => router.push("/auth/login")}
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-300 mt-1">Enter the OTP sent to your email</p>
        </div>

        {/* Form Card */}
        <Card className="rounded-t-none border-t-0 p-6 border-slate-200">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
            <p className="text-slate-500">Loading...</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
