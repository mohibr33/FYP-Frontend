"use client";
import React, { useState } from "react";
import { requestPasswordReset } from "@/lib/api/users";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email) {
      setError("Email required");
      return;
    }
    setLoading(true);
    try {
      const res = await requestPasswordReset({ email });
      setSuccess(res.message + " Check your email for OTP.");
      setTimeout(
        () =>
          router.push(
            `/auth/reset-password?email=${encodeURIComponent(email)}`
          ),
        1200
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Request failed");
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
            <KeyRound className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-slate-300 mt-1">We&apos;ll send you a reset code</p>
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
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-emerald-600 text-sm">{success}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-slate-800 hover:bg-slate-700 text-white">
              {loading ? "Sending..." : "Send Reset Code"}
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
