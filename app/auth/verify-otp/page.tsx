"use client";
import React, { useState, useEffect } from "react";
import { verifyOtp } from "@/lib/api/users";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function VerifyOtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const presetEmail = params.get("email") || "";
  const [email, setEmail] = useState(presetEmail);
  const [otp, setOtp] = useState("");
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
    if (!email || !otp) {
      setError("Email and OTP required");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp });
      if (res.success) {
        setSuccess("Email verified. You can now login.");
        setTimeout(() => router.push("/auth/login"), 1200);
      } else {
        setError(res.message || "Verification failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <Card className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Verify Email</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>
        <div className="text-sm text-center">
          Back to{" "}
          <button
            onClick={() => router.push("/auth/login")}
            className="text-blue-600 underline"
          >
            Login
          </button>
        </div>
      </Card>
    </div>
  );
}
