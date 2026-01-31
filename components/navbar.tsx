"use client";

import Link from "next/link";
import { 
  Pill, 
  LogOut, 
  Menu, 
  X, 
  Home,
  BookOpen,
  MessageSquare,
  ChefHat,
  Headphones,
  Info,
  Shield,
  User,
  LayoutDashboard,
  ChevronDown,
  FlaskConical,
  FileText
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "./auth/auth-context";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    logout();
    router.push("/");
    setIsOpen(false);
    setShowUserMenu(false);
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navLinkClass = (path: string) => `
    relative px-3 py-2 text-sm font-medium transition-all duration-200
    ${isActive(path) 
      ? 'text-teal-600' 
      : 'text-slate-600 hover:text-slate-900'
    }
  `;

  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-md shadow-slate-500/20 group-hover:shadow-lg group-hover:shadow-slate-500/30 transition-all duration-300 relative overflow-hidden">
              {/* Heart with medical cross */}
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 26C16 26 6 20 6 13C6 10.5 8 8 11 8C13 8 15 9.5 16 11C17 9.5 19 8 21 8C24 8 26 10.5 26 13C26 20 16 26 16 26Z" fill="#14b8a6"/>
                <rect x="14" y="11" width="4" height="10" rx="1" fill="white"/>
                <rect x="11" y="14" width="10" height="4" rx="1" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Digital Health
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/" className={navLinkClass('/')}>
              Home
              {isActive('/') && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />}
            </Link>
            <Link href="/articles" className={navLinkClass('/articles')}>
              Articles
              {isActive('/articles') && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />}
            </Link>
            <Link href="/medicines" className={navLinkClass('/medicines')}>
              Medicines
              {isActive('/medicines') && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />}
            </Link>
            {user && (
              <>
                <Link href="/medical-chat" className={navLinkClass('/medical-chat')}>
                  AI Chat
                  {isActive('/medical-chat') && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />}
                </Link>
                <Link href="/meal-planner" className={navLinkClass('/meal-planner')}>
                  Meal Planner
                  {isActive('/meal-planner') && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />}
                </Link>
                <Link href="/interaction-checker" className={navLinkClass('/interaction-checker')}>
                  Interactions
                  {isActive('/interaction-checker') && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />}
                </Link>
                <Link href="/lab-analyzer" className={navLinkClass('/lab-analyzer')}>
                  Lab Analyzer
                  {isActive('/lab-analyzer') && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />}
                </Link>
                <Link href="/support" className={navLinkClass('/support')}>
                  Support
                  {isActive('/support') && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />}
                </Link>
              </>
            )}
            <Link href="/about" className={navLinkClass('/about')}>
              About
              {isActive('/about') && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />}
            </Link>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md shadow-teal-500/20">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-24 truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-300 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-4 h-4 text-slate-600" />
                          </div>
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-600" />
                          </div>
                          <span className="font-medium">My Profile</span>
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                          >
                            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                              <Shield className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">Admin Panel</span>
                          </Link>
                        )}
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-slate-100 p-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <LogOut className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-slate-600 hover:text-teal-600 px-4 py-2.5 rounded-xl border border-transparent hover:border-teal-200 hover:bg-teal-50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 rounded-xl px-5 py-2.5 shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/') ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setIsOpen(false)}
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link
              href="/articles"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/articles') ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setIsOpen(false)}
            >
              <BookOpen className="w-5 h-5" />
              Articles
            </Link>
            <Link
              href="/medicines"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/medicines') ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setIsOpen(false)}
            >
              <Pill className="w-5 h-5" />
              Medicines
            </Link>
            {user && (
              <>
                <Link
                  href="/medical-chat"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/medical-chat') ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <MessageSquare className="w-5 h-5" />
                  AI Chat
                </Link>
                <Link
                  href="/meal-planner"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/meal-planner') ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <ChefHat className="w-5 h-5" />
                  Meal Planner
                </Link>
                <Link
                  href="/interaction-checker"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/interaction-checker') ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <FlaskConical className="w-5 h-5" />
                  Interactions
                </Link>
                <Link
                  href="/lab-analyzer"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/lab-analyzer') ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <FileText className="w-5 h-5" />
                  Lab Analyzer
                </Link>
                <Link
                  href="/support"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/support') ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Headphones className="w-5 h-5" />
                  Support
                </Link>
              </>
            )}
            <Link
              href="/about"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/about') ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
              onClick={() => setIsOpen(false)}
            >
              <Info className="w-5 h-5" />
              About Us
            </Link>
          </div>

          {/* Mobile User Section */}
          <div className="px-4 py-4 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </div>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl text-sm font-medium transition-colors shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
