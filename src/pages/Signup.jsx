import React, { useState } from "react";
import { Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

export default function SignupPage({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    gender: "Male",
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("signup");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // STEP 1 — SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("verify");
        setMessage({ text: data.message, type: "success" });
      } else {
        setMessage({ text: data.error || data.message || "Signup failed", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 — VERIFY OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message || "Email verified successfully!", type: "success" });
        setTimeout(() => onSwitchToLogin(), 1000); // ✅ FIXED redirection
      } else {
        setMessage({ text: data.error || "Invalid OTP", type: "error" });
      }
    } catch {
      setMessage({ text: "Verification failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Signup / Login with OTP
  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const user = await r.json();

        const res = await fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setFormData({ ...formData, email: user.email });
          setStep("verify");
          setMessage({ text: data.message, type: "success" });
        } else {
          setMessage({ text: data.error || "Google sign-in failed.", type: "error" });
        }
      } catch {
        setMessage({ text: "Google login error. Try again.", type: "error" });
      }
    },
    onError: () => setMessage({ text: "Google login was cancelled.", type: "error" }),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          {step === "signup" ? "Create Account" : "Verify Your Email"}
        </h1>

        {step === "signup" ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* PHONE + GENDER */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Sign in here
              </button>
            </div>
          </form>
        ) : (
          // VERIFY STEP
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="text-center text-gray-600">
              We sent a 6-digit verification code to
              <div className="text-blue-600 font-semibold">{formData.email}</div>
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full text-center text-2xl tracking-widest py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
            <button
              type="button"
              onClick={() => setStep("signup")}
              className="w-full text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to signup
            </button>
          </form>
        )}

        {/* Divider + Google */}
        {step === "signup" && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <button
              onClick={() => googleSignup()}
              className="flex items-center justify-center gap-3 w-full py-2 border border-gray-300 rounded-full shadow-sm bg-white hover:bg-gray-50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.6l6.83-6.83C35.88 2.73 30.29 0 24 0 14.64 0 6.49 5.48 2.57 13.44l7.98 6.19C12.32 13.22 17.67 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.1 24.49c0-1.57-.14-3.07-.4-4.49H24v8.49h12.45c-.54 2.8-2.19 5.17-4.65 6.77l7.07 5.49c4.14-3.82 6.51-9.46 6.51-16.26z"/>
                <path fill="#FBBC05" d="M10.55 28.37A14.48 14.48 0 0 1 9.5 24c0-1.52.26-2.98.72-4.37l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.57 10.56l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.29 0 11.57-2.08 15.43-5.64l-7.07-5.49c-2.03 1.37-4.62 2.13-8.36 2.13-6.33 0-11.68-3.72-14.45-9.13l-7.98 6.19C6.49 42.52 14.64 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              <span className="text-gray-700 font-medium text-sm">Sign up with Google</span>
            </button>
          </>
        )}

        {/* Inline message */}
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
  );
}
