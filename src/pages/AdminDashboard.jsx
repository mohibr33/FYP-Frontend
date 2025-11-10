import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Pill,
  Star,
  HelpCircle,
  Settings,
  LogOut,
  Stethoscope,
} from "lucide-react";

import AdminUsers from "./AdminUsers";
import AdminArticles from "./AdminArticles";
import AdminReviews from "./AdminReviews";
import AdminMedicines from "./AdminMedicines";
import AdminTickets from "./AdminTickets";

const API_BASE = "http://localhost:5000/api";

const AdminDashboard = () => {
  // ✅ Load real admin from localStorage (set during login)
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    users: 0,
    articles: 0,
    reviews: 0,
    tickets: 0,
  });
  const token = localStorage.getItem("hp:token");

  useEffect(() => {
    const raw = localStorage.getItem("hp:user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to parse hp:user", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [users, articles, reviews, tickets] = await Promise.all([
          fetch(`${API_BASE}/admin/users`, { headers }).then((r) => r.json()),
          fetch(`${API_BASE}/articles`, { headers }).then((r) => r.json()),
          fetch(`${API_BASE}/reviews`, { headers }).then((r) => r.json()),
          fetch(`${API_BASE}/support`, { headers }).then((r) => r.json()),
        ]);
        setStats({
          users: Array.isArray(users) ? users.length : 0,
          articles: Array.isArray(articles) ? articles.length : 0,
          reviews: Array.isArray(reviews) ? reviews.length : 0,
          tickets: Array.isArray(tickets)
            ? tickets.filter((t) => t.status !== "resolved").length
            : 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    if (token) fetchStats();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("hp:user");
    localStorage.removeItem("hp:token");
    window.location.reload();
  };

  const sidebarItems = [
    { id: "dashboard", icon: Settings, label: "Dashboard" },
    { id: "users", icon: Users, label: "Users" },
    { id: "articles", icon: FileText, label: "Articles" },
    { id: "reviews", icon: Star, label: "Reviews" },
    { id: "medicine", icon: Pill, label: "Medicine" },
    { id: "tickets", icon: HelpCircle, label: "Tickets" },
  ];

  const StatCard = ({ icon: Icon, title, value, desc, color }) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      indigo: "from-indigo-500 to-indigo-600",
      yellow: "from-yellow-500 to-yellow-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
    };
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
        <div
          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-4`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-3xl font-extrabold text-gray-800 mb-2">{value}</p>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
              <h1 className="text-4xl font-bold mb-1">
                Welcome back, {user?.firstName || "Admin"}! 👋
              </h1>
              <p className="text-blue-100">{user?.email || "Loading..."}</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                icon={Users}
                title="Users"
                value={stats.users}
                desc="Manage user accounts and permissions"
                color="blue"
              />
              <StatCard
                icon={FileText}
                title="Articles"
                value={stats.articles}
                desc="Manage health articles and content"
                color="indigo"
              />
              <StatCard
                icon={Star}
                title="Reviews"
                value={stats.reviews}
                desc="Manage medicine reviews and feedback"
                color="yellow"
              />
              {/* Medicine stat intentionally hidden on dashboard; module remains in sidebar */}
              <StatCard
                icon={HelpCircle}
                title="Tickets"
                value={stats.tickets}
                desc="Manage support tickets"
                color="purple"
              />
            </div>
          </div>
        );
      case "users":
        return <AdminUsers />;
      case "articles":
        return <AdminArticles />;
      case "reviews":
        return <AdminReviews />;
      case "medicine":
        return <AdminMedicines />;
      case "tickets":
        return <AdminTickets />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== FIXED SIDEBAR (doesn't move on scroll) ===== */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-[#0B3B8C] to-[#0A2A6B] text-white shadow-2xl z-20">
        <div className="h-full p-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                Digital Healthcare
              </h1>
              <p className="text-blue-200 text-sm">Assistant</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1 flex-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-blue-100 hover:bg-white/10"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="mt-10 border-t border-white/20 pt-6">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl font-medium transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN (scrolls independently) ===== */}
      <main className="ml-64 h-screen overflow-y-auto p-8">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
