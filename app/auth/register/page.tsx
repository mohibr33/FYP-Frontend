"use client";
import React, { useState } from "react";
import { registerUser } from "@/lib/api/users";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
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

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
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
    <div className="max-w-md mx-auto py-10">
      <Card className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Create Account</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
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
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
            />
            {fieldErrors.lastName && (
              <p className="text-red-600 text-xs mt-1">
                {fieldErrors.lastName.join("; ")}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
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
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <div className="text-sm text-center">
          Already have an account?{" "}
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
