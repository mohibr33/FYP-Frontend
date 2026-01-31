"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Shield,
  Calendar,
  ArrowLeft,
  Heart,
  Headphones,
  ChevronRight,
  Phone,
  Edit,
  Loader2,
  Pill,
} from "lucide-react";
import { updateProfile } from "@/lib/api/users";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, loading, refreshProfile } = useAuth();
  
  // Phone edit state
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/auth/login");
    }
  }, [token, loading, router]);

  useEffect(() => {
    if (token && !user) refreshProfile();
  }, [token, user, refreshProfile]);

  useEffect(() => {
    if (user?.phone) {
      setPhoneNumber(user.phone);
    }
  }, [user?.phone]);

  if (!token) return null;

  const getDisplayName = () => {
    return (
      user?.name ||
      `${(user as any)?.firstName || ""} ${(user as any)?.lastName || ""}`.trim() ||
      "User"
    );
  };

  const handleSavePhone = async () => {
    // Validate phone number
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      toast.error("Phone number must be between 10 and 15 digits");
      return;
    }

    setSavingPhone(true);
    try {
      await updateProfile({ phone: cleanPhone });
      await refreshProfile();
      toast.success("Phone number updated successfully");
      setPhoneDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update phone number");
    } finally {
      setSavingPhone(false);
    }
  };

  const formatPhoneDisplay = (phone?: string) => {
    if (!phone) return "Not set";
    // Format as 0300-1234567
    if (phone.length === 11 && phone.startsWith("0")) {
      return `${phone.slice(0, 4)}-${phone.slice(4)}`;
    }
    // Format as +92-300-1234567
    if (phone.length === 12 && phone.startsWith("92")) {
      return `+${phone.slice(0, 2)}-${phone.slice(2, 5)}-${phone.slice(5)}`;
    }
    return phone;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50">
      {/* Header */}
      <div className="bg-slate-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">My Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading && !user ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-slate-500">Loading profile...</p>
          </div>
        ) : user ? (
          <div className="space-y-4">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 text-white">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* User Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold">{getDisplayName()}</h2>
                  <p className="text-slate-300 mt-1">{user?.email || "No email"}</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                    <Badge className="bg-white/20 text-white border-0">
                      {user?.role || "User"}
                    </Badge>
                    {user?.phone && (
                      <Badge className="bg-teal-500/30 text-teal-200 border-0">
                        <Phone className="w-3 h-3 mr-1" />
                        SMS Enabled
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500">
                <h3 className="font-semibold text-white">Account Details</h3>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="text-sm font-medium text-slate-800 truncate">{getDisplayName()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">Email Address</p>
                    <p className="text-sm font-medium text-slate-800 truncate">{user.email || "N/A"}</p>
                  </div>
                </div>

                {/* Phone Number - Editable */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">Phone Number</p>
                    <p className={`text-sm font-medium truncate ${user.phone ? "text-slate-800" : "text-slate-400 italic"}`}>
                      {formatPhoneDisplay(user.phone)}
                    </p>
                  </div>
                  <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                        <Edit className="w-4 h-4 mr-1" />
                        {user.phone ? "Edit" : "Add"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle>
                          {user.phone ? "Update Phone Number" : "Add Phone Number"}
                        </DialogTitle>
                        <DialogDescription>
                          Your phone number is used for SMS medication reminders. 
                          Enter your number without country code (e.g., 03001234567).
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="03001234567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                          className="mt-2"
                          maxLength={15}
                        />
                        <p className="text-xs text-slate-500 mt-2">
                          Format: 03XXXXXXXXX (Pakistan mobile number)
                        </p>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setPhoneDialogOpen(false)}
                          disabled={savingPhone}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSavePhone}
                          disabled={savingPhone}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          {savingPhone && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">Account Role</p>
                    <p className="text-sm font-medium text-slate-800 capitalize">{user.role || "User"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">Member Since</p>
                    <p className="text-sm font-medium text-slate-800">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500">
                <h3 className="font-semibold text-white">Quick Actions</h3>
              </div>
              <div className="divide-y divide-slate-100">
                <button
                  onClick={() => router.push("/meal-planner/profile")}
                  className="flex items-center gap-4 px-5 py-4 w-full hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800">Health Profile</p>
                    <p className="text-xs text-slate-500">Manage your health data</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>

                <button
                  onClick={() => router.push("/support")}
                  className="flex items-center gap-4 px-5 py-4 w-full hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800">Support</p>
                    <p className="text-xs text-slate-500">Get help & submit tickets</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* SMS Info Card */}
            {!user.phone && (
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-teal-900">Enable SMS Reminders</h4>
                    <p className="text-sm text-teal-700 mt-1">
                      Add your phone number to receive SMS reminders for your medication schedules. 
                      Never miss a dose again!
                    </p>
                    <Button
                      size="sm"
                      className="mt-3 bg-teal-600 hover:bg-teal-700"
                      onClick={() => setPhoneDialogOpen(true)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Add Phone Number
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-slate-500">Unable to load profile.</p>
          </div>
        )}
      </div>
    </main>
  );
}
