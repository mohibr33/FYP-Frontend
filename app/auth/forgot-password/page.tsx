"use client";
import React, { useState } from "react";
import { requestPasswordReset } from "@/lib/api/users";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

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
    <div className="max-w-md mx-auto py-10">
      <Card className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Forgot Password</h1>
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
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send Reset OTP"}
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
