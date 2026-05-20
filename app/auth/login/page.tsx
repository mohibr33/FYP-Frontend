"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/ui/google-icon";
import { API_BASE_URL } from "@/lib/api-config";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleGoogleLogin() {
    // Redirect to Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password) {
      setError("Email and password required");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      // Use window.location for full page reload to ensure navbar updates
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-black to-slate-700 rounded-t-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <LogIn className="h-8 w-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-300 mt-1">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <Card className="rounded-t-none border-t-0 p-6 space-y-4 border-slate-200">
          <form onSubmit={onSubmit} className="space-y-4">
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
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-black hover:bg-slate-700 text-white">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-300 text-slate-700 hover:bg-black hover:text-white hover:border-slate-800 transition-all duration-200"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>

          <div className="text-sm text-center space-y-2">
            <p className="text-slate-600">
              New here?{" "}
              <button
                onClick={() => router.push("/auth/register")}
                className="text-slate-800 font-medium underline hover:text-slate-600"
              >
                Create account
              </button>
            </p>
            <p>
              <button
                onClick={() => router.push("/auth/forgot-password")}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                Forgot password?
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
