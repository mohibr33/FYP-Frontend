"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Spinner } from "@/components/ui/spinner";
import UsersManagement from "@/components/admin/users-management";
import ArticlesManagement from "@/components/admin/articles-management";
import TicketsManagement from "@/components/admin/tickets-management";
import MedicinesManagement from "@/components/admin/medicines-management";
import ReviewsManagement from "@/components/admin/reviews-management";
import {
  Users,
  FileText,
  Headphones,
  Pill,
  Star,
  Shield,
} from "lucide-react";

type AdminSection = "users" | "articles" | "tickets" | "medicines" | "reviews";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>("users");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setLoading(false);
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="bg-slate-800 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-slate-700 rounded mb-4"></div>
              <div className="h-6 w-64 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "users" as AdminSection, label: "Users", icon: Users, color: "text-indigo-400" },
    { id: "articles" as AdminSection, label: "Articles", icon: FileText, color: "text-blue-400" },
    { id: "tickets" as AdminSection, label: "Tickets", icon: Headphones, color: "text-purple-400" },
    { id: "medicines" as AdminSection, label: "Medicines", icon: Pill, color: "text-teal-400" },
    { id: "reviews" as AdminSection, label: "Reviews", icon: Star, color: "text-amber-400" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UsersManagement />;
      case "articles":
        return <ArticlesManagement />;
      case "tickets":
        return <TicketsManagement />;
      case "medicines":
        return <MedicinesManagement />;
      case "reviews":
        return <ReviewsManagement />;
      default:
        return <UsersManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Dark Header with Navigation */}
      <div className="bg-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">
                Manage users, content, support tickets, and more
              </p>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="grid grid-cols-5 gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`rounded-xl p-4 text-center transition-all ${
                    isActive
                      ? "bg-white text-slate-800 shadow-lg"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${isActive ? item.color : item.color}`} />
                  <p className="font-medium text-sm">{item.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {renderContent()}
      </div>
    </div>
  );
}
