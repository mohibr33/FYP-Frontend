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

  const resetMessage = () => setMessage({ text: "", type: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessage();
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
        setMessage({ text: data.error || data.message, type: "error" });
      }
    } catch {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    resetMessage();
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
        }, 800);
      } else {
        setMessage({ text: data.error || "Invalid OTP", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error, try again", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    resetMessage();
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
        setMessage({ text: data.error, type: "error" });
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

    resetMessage();
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
        setTimeout(() => setStep("login"), 1000);
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch {
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE LOGIN INTEGRATION WITH OTP
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();

        const otpRes = await fetch(`${API_BASE}/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: profile.email,
            name: profile.name,
          }),
        });

        const result = await otpRes.json();
        if (otpRes.ok && result.success) {
          setEmail(profile.email);
          setStep("otp");
          setMessage({ text: result.message, type: "success" });
        } else {
          setMessage({ text: result.error || "Google login failed", type: "error" });
        }
      } catch {
        setMessage({ text: "Google login failed", type: "error" });
      }
    },
    onError: () =>
      setMessage({ text: "Google Authentication failed", type: "error" }),
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
          {/* ✅ Toggle Admin/User only in login step */}
          {step === "login" && (
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
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

          {/* ✅ LOGIN FORM */}
          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Sign In"}
              </button>

              {/* ✅ GOOGLE LOGIN BUTTON + SIGNUP (hidden for admin) */}
              {!isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => googleLogin()}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition text-gray-700 font-semibold"
                  >
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google"
                      className="w-6 h-6"
                    />
                    SignIn with Google
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
                </>
              )}
            </form>
          )}

          {/* ✅ FORGOT PASSWORD */}
          {step === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <p className="text-gray-600 text-center">
                Enter your email to get reset code
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
              <button
                type="button"
                onClick={() => setStep("login")}
                className="w-full text-gray-600 font-medium"
              >
                ← Back to Login
              </button>
            </form>
          )}

          {/* ✅ RESET PASSWORD FORM */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <p className="text-center text-gray-600">
                Enter the OTP sent to {email}
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit OTP"
                className="w-full text-center py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full py-3 px-4 border border-gray-300 rounded-xl"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full py-3 px-4 border border-gray-300 rounded-xl"
                required
              />
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                type="button"
                onClick={() => setStep("login")}
                className="w-full text-gray-600 font-medium"
              >
                ← Back to Login
              </button>
            </form>
          )}

          {/* ✅ OTP VERIFY SCREEN */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="text-center text-gray-600">
                A 6-digit code was sent to
                <div className="text-blue-600 font-semibold">{email}</div>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full text-center text-2xl tracking-widest py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:opacity-90"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
              <button
                type="button"
                onClick={() => setStep("login")}
                className="w-full text-gray-600 font-medium"
              >
                ← Back to Login
              </button>
              
            </form>
          )}

          {message.text && (
            <div
              className={`mt-4 p-4 rounded-xl ${
                message.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
