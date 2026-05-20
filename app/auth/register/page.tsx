"use client";
import React, { useState, useEffect } from "react";
import { registerUser } from "@/lib/api/users";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/ui/google-icon";
import { API_BASE_URL } from "@/lib/api-config";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleGoogleSignup() {
    // Redirect to Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("First name, last name, email and password are required");
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
      });
      setSuccess("Registered. Please check email for OTP.");
      const emailForOtp = data.email || form.email.trim();
      setTimeout(
        () =>
          router.push(
            `/auth/verify-otp?email=${encodeURIComponent(emailForOtp)}`
          ),
        1000
      );
    } catch (err: any) {
      const resp = err.response?.data;
      setError(resp?.message || "Registration failed");
      if (resp?.errors && Array.isArray(resp.errors)) {
        const grouped: Record<string, string[]> = {};
        resp.errors.forEach((e: any) => {
          if (!grouped[e.field]) grouped[e.field] = [];
          grouped[e.field].push(e.message);
        });
        setFieldErrors(grouped);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-black to-slate-700 rounded-t-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <UserPlus className="h-8 w-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-300 mt-1">Join Digital Health Assistant</p>
        </div>

        {/* Form Card */}
        <Card className="rounded-t-none border-t-0 p-6 space-y-4 border-slate-200">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
                <Input
                  id="firstName"
                  className="border-slate-200"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                />
                {fieldErrors.firstName && (
                  <p className="text-red-600 text-xs mt-1">
                    {fieldErrors.firstName.join("; ")}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
                <Input
                  id="lastName"
                  className="border-slate-200"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                />
                {fieldErrors.lastName && (
                  <p className="text-red-600 text-xs mt-1">
                    {fieldErrors.lastName.join("; ")}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                className="border-slate-200"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                className="border-slate-200"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-slate-700">Phone (optional)</Label>
              <Input
                id="phone"
                className="border-slate-200"
                value={form.phone}
                onChange={(e) =>
                  update("phone", e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="Digits only"
              />
              {fieldErrors.phone && (
                <p className="text-red-600 text-xs mt-1">
                  {fieldErrors.phone.join("; ")}
                </p>
              )}
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-emerald-600 text-sm">{success}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-black hover:bg-slate-700 text-white">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-sm text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/auth/login")}
                className="text-slate-800 font-medium underline hover:text-slate-600"
              >
                Login
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
