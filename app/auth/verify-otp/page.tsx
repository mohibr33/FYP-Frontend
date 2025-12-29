"use client";
import React, { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { verifyOtp, resendOtp } from "@/lib/api/users";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2, Clock, RefreshCw } from "lucide-react";

const OTP_EXPIRY_MINUTES = 10;

function VerifyOtpContent() {
  const router = useRouter();
  const params = useSearchParams();
  const presetEmail = params.get("email") || "";
  const [email, setEmail] = useState(presetEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_MINUTES * 60);
  const [isExpired, setIsExpired] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (presetEmail) setEmail(presetEmail);
  }, [presetEmail]);

  // Focus first OTP input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    
    // Handle paste
    if (value.length > 1) {
      const pastedValues = value.slice(0, 6).split("");
      pastedValues.forEach((v, i) => {
        if (index + i < 6) {
          newOtp[index + i] = v;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedValues.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setResending(true);
    setError(null);

    try {
      const res = await resendOtp({ email });
      if (res.success) {
        // Reset timer
        setTimeLeft(OTP_EXPIRY_MINUTES * 60);
        setIsExpired(false);
        // Clear OTP inputs
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setSuccess("New OTP sent! Check your email.");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(res.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const otpString = otp.join("");
    
    if (!email) {
      setError("Email is required");
      return;
    }
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    if (isExpired) {
      setError("OTP has expired. Please request a new one.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp: otpString });
      if (res.success) {
        setSuccess("Email verified successfully!");
        setTimeout(() => router.push("/auth/login"), 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
          <p className="text-slate-300 mt-1">Enter the 6-digit code we sent you</p>
        </div>

        {/* Form Card */}
        <Card className="rounded-t-none border-t-0 p-6 space-y-5 border-slate-200">
          {/* Email Display */}
          {presetEmail ? (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                <Mail className="h-5 w-5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500">Verification code sent to</p>
                <p className="text-sm font-medium text-slate-800 truncate">{presetEmail}</p>
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="email" className="text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="border-slate-200 mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          {/* Timer Display */}
          <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
            isExpired 
              ? "bg-red-50 text-red-700" 
              : timeLeft <= 60 
                ? "bg-amber-50 text-amber-700"
                : "bg-teal-50 text-teal-700"
          }`}>
            <Clock className="h-4 w-4" />
            {isExpired ? (
              <span className="text-sm font-medium">OTP has expired</span>
            ) : (
              <span className="text-sm font-medium">
                Code expires in {formatTime(timeLeft)}
              </span>
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* OTP Input */}
            <div>
              <Label className="text-slate-700 mb-3 block">Verification Code</Label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-xl font-semibold border-slate-200 focus:border-teal-500 focus:ring-teal-500 ${
                      isExpired ? "opacity-50" : ""
                    }`}
                    disabled={loading || !!success || isExpired}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading || !!success || isExpired} 
              className="w-full bg-slate-800 hover:bg-slate-700 text-white h-11"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Verifying...
                </span>
              ) : success ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified!
                </span>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>

          {/* Resend OTP */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500 mb-2">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={resending || !!success}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              {resending ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Resend Code
                </span>
              )}
            </Button>
          </div>

          {/* Back to Login */}
          <div className="pt-2">
            <button
              onClick={() => router.push("/auth/login")}
              className="flex items-center justify-center gap-2 w-full text-sm text-slate-600 hover:text-slate-800 transition-colors"
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
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
          <p className="text-slate-300 mt-1">Enter the 6-digit code we sent you</p>
        </div>
        <Card className="rounded-t-none border-t-0 p-6 border-slate-200">
          <div className="flex flex-col items-center space-y-4 py-8">
            <Spinner className="h-8 w-8 text-slate-600" />
            <p className="text-slate-500">Loading...</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
