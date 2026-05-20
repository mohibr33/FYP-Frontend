"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { getTicketById, Ticket } from "@/lib/api/tickets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  Headphones,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
} from "lucide-react";

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/auth/login");
    }
  }, [token, authLoading, router]);

  useEffect(() => {
    if (token && resolvedParams.id) fetchTicket();
  }, [token, resolvedParams.id]);

  async function fetchTicket() {
    setLoading(true);
    setError(null);
    try {
      const data = await getTicketById(resolvedParams.id);
      setTicket(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-purple-50">
        {/* Dark header skeleton */}
        <div className="bg-gradient-to-r from-slate-900 via-black to-black py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-slate-700 rounded mb-6"></div>
              <div className="h-8 w-2/3 bg-slate-700 rounded mb-4"></div>
              <div className="h-6 w-1/3 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto py-8 px-4">
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-purple-50">
        {/* Dark header for error state */}
        <div className="bg-gradient-to-r from-slate-900 via-black to-black py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => router.push("/support")}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tickets
            </button>
            <h1 className="text-3xl font-bold text-white">Ticket Not Found</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto py-8 px-4">
          <Card className="p-6 text-center border-slate-200">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error || "Ticket not found"}</p>
            <Button
              onClick={() => router.push("/support")}
              className="mt-4 bg-black hover:bg-slate-700 text-white"
            >
              Back to Support
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "open":
        return {
          bgColor: "bg-emerald-500/20",
          textColor: "text-emerald-300",
          borderColor: "border-emerald-500/30",
          icon: AlertCircle,
          label: "Open",
        };
      case "resolved":
        return {
          bgColor: "bg-blue-500/20",
          textColor: "text-blue-300",
          borderColor: "border-blue-500/30",
          icon: CheckCircle2,
          label: "Resolved",
        };
      case "closed":
        return {
          bgColor: "bg-slate-500/20",
          textColor: "text-slate-300",
          borderColor: "border-slate-500/30",
          icon: CheckCircle2,
          label: "Closed",
        };
      default:
        return {
          bgColor: "bg-amber-500/20",
          textColor: "text-amber-300",
          borderColor: "border-amber-500/30",
          icon: Clock,
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(ticket.status);
  const StatusIcon = statusConfig.icon;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-rose-400";
      case "medium":
        return "text-amber-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-purple-50">
      {/* Dark Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-black to-black py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push("/support")}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tickets
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-3">
              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-1.5 ${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1.5 rounded-lg text-sm font-medium border ${statusConfig.borderColor}`}
              >
                <StatusIcon className="w-4 h-4" />
                {statusConfig.label}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {ticket.subject}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="text-slate-300 font-mono">
                  {ticket.ticketNumber}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">
                  {ticket.category || "General"}
                </span>
                <span className={`capitalize font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority} priority
                </span>
              </div>
            </div>

            {/* Icon */}
            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Headphones className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        {/* Your Message */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Your Message</h3>
                <p className="text-xs text-slate-500">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
          </div>
        </Card>

        {/* Admin Response */}
        {ticket.adminResponse && (
          <Card className="border-emerald-200 shadow-sm overflow-hidden">
            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800">Support Response</h3>
                  <p className="text-xs text-emerald-600">
                    {ticket.resolvedAt
                      ? new Date(ticket.resolvedAt).toLocaleString()
                      : "Admin response"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-emerald-50/50">
              <p className="text-emerald-900 whitespace-pre-wrap leading-relaxed">
                {ticket.adminResponse}
              </p>
            </div>
          </Card>
        )}

        {/* Ticket Details */}
        <Card className="border-slate-200 shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-500" />
              Ticket Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-500 mb-1">Created</p>
                <p className="text-slate-800 font-medium">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-500 mb-1">Last Updated</p>
                <p className="text-slate-800 font-medium">
                  {new Date(ticket.updatedAt).toLocaleString()}
                </p>
              </div>
              {ticket.resolvedAt && (
                <div className="bg-emerald-50 rounded-lg p-4 sm:col-span-2">
                  <p className="text-emerald-600 mb-1">Resolved</p>
                  <p className="text-emerald-800 font-medium">
                    {new Date(ticket.resolvedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Back Button */}
        <div className="text-center pt-4">
          <Button
            onClick={() => router.push("/support")}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Tickets
          </Button>
        </div>
      </div>
    </div>
  );
}
