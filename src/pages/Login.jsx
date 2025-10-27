import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

const API_BASE = "http://localhost:5000/api/auth";

export const LoginPage = ({ onSwitchToSignup, onLoginSuccess }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("login");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetMsg = () => setMessage({ text: "", type: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMsg();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isAdmin }),
      });
      const data = await res.json();

      if (res.ok && data.message?.toLowerCase().includes("otp")) {
        setStep("otp");
        setMessage({ text: data.message, type: "success" });
      } else {
        setMessage({ text: data.error || "Login failed", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    resetMsg();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/verify-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("hp:token", data.token);
        localStorage.setItem("hp:user", JSON.stringify(data.user || {}));
        window.dispatchEvent(new Event("storage"));

        setMessage({ text: "Login successful", type: "success" });
        setTimeout(() => {
          const role = data.user?.role === "admin" ? "admin" : "user";
          onLoginSuccess(data.token, role);
        }, 600);
      } else {
        setMessage({ text: data.error || "Invalid OTP", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    resetMsg();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep("reset");
        setMessage({ text: data.message, type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to send OTP", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return setMessage({ text: "Passwords do not match", type: "error" });

    resetMsg();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message, type: "success" });
        setTimeout(() => setStep("login"), 800);
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login (OTP required)
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await r.json();

        const otpRes = await fetch(`${API_BASE}/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: profile.email, name: profile.name }),
        });

        const result = await otpRes.json();
        if (otpRes.ok && result.success) {
          setEmail(profile.email);
          setStep("otp");
          setMessage({ text: result.message, type: "success" });
        } else {
          setMessage({ text: "Google login failed", type: "error" });
        }
      } catch {
        setMessage({ text: "Google login error", type: "error" });
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-100">
            {step === "forgot" || step === "reset"
              ? "Reset your password"
              : "Sign in to your healthcare portal"}
          </p>
        </div>

        <div className="p-8">
          {step === "login" && (
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setIsAdmin(false)}
                className={`flex-1 py-3 rounded-lg font-semibold ${
                  !isAdmin ? "bg-blue-600 text-white shadow-md" : "text-gray-600"
                }`}
              >
                User Login
              </button>
              <button
                onClick={() => setIsAdmin(true)}
                className={`flex-1 py-3 rounded-lg font-semibold ${
                  isAdmin ? "bg-blue-600 text-white shadow-md" : "text-gray-600"
                }`}
              >
                Admin Login
              </button>
            </div>
          )}

          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
              </div>

              {!isAdmin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setStep("forgot")}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => googleLogin()}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  className="w-6 h-6"
                  alt="Google"
                />
                Continue with Google
              </button>

              {/* ✅ Switch to Signup */}
              <div className="mt-4 text-center text-sm text-gray-600">
                New here{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-blue-600 font-semibold hover:text-blue-800"
                >
                  Create an account
                </button>
              </div>
            </form>
          )}

          {/* Forgot, Reset, OTP Screens... */}
          {step !== "login" && message.text && (
            <div
              className={`mt-4 p-4 rounded-xl ${
                message.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-5 mt-3">
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter OTP"
                maxLength={6}
                required
                className="w-full text-center py-3 border rounded-xl text-xl tracking-widest"
              />
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
                Verify & Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
