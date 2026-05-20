"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { createTicket, getMyTickets, Ticket } from "@/lib/api/tickets";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Headphones, 
  MessageSquare, 
  Clock, 
  Send,
  HelpCircle,
  TicketIcon,
  Sparkles
} from "lucide-react";

const CATEGORIES = [
  "Technical Issue",
  "Billing",
  "Feature Request",
  "General Inquiry",
  "Bug Report",
];

export default function SupportPage() {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    subject: "",
    description: "",
    category: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/auth/login");
    }
  }, [token, authLoading, router]);

  useEffect(() => {
    if (token) fetchTickets();
  }, [token, page]);

  async function fetchTickets() {
    setLoadingTickets(true);
    try {
      const data = await getMyTickets(page, 10);
      setTickets(data.tickets);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.subject || !form.description) {
      setError("Subject and description are required");
      return;
    }
    if (form.description.length < 10) {
      setError("Description must be at least 10 characters");
      return;
    }
    setSubmitting(true);
    try {
      await createTicket({
        subject: form.subject.trim(),
        description: form.description.trim(),
        category: form.category || undefined,
      });
      setSuccess(
        "Ticket created successfully! We'll respond within 24-48 hours."
      );
      setForm({ subject: "", description: "", category: "" });
      fetchTickets();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark Header */}
      <div className="bg-black py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-700 rounded-full flex items-center justify-center">
              <Headphones className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Support Center</h1>
              <p className="text-slate-300">
                We're here to help! Submit a ticket and our team will get back to you as soon as possible.
              </p>
            </div>
          </div>

          {/* Stats Cards in Header */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Avg. Response</p>
                  <p className="text-lg font-semibold text-white">24-48 hrs</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Satisfaction</p>
                  <p className="text-lg font-semibold text-white">4.9/5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 px-4">
        <div className="container mx-auto max-w-6xl">

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Ticket Form */}
          <div className="space-y-4">
            <Card className="p-5 border-slate-200 rounded-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Create New Ticket</h2>
                  <p className="text-xs text-slate-500">Describe your issue and we'll help you out</p>
                </div>
              </div>
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subject" className="text-sm text-slate-700">Subject</Label>
                  <Input
                    id="subject"
                    className="border-slate-200 mt-1 h-10"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm text-slate-700">Category (optional)</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 mt-1 h-10 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm text-slate-700">Description</Label>
                  <Textarea
                    id="description"
                    className="border-slate-200 mt-1"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Describe your issue in detail (min. 10 characters)..."
                    rows={4}
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-emerald-600 text-sm">{success}</p>}
                <Button type="submit" disabled={submitting} className="w-full bg-black hover:bg-black text-white h-10">
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </form>
            </Card>

            {/* Help Tips Card */}
            <Card className="p-4 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 text-sm mb-1">Tips for faster resolution</h3>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    <li>• Be specific about the issue you're facing</li>
                    <li>• Include any error messages you've seen</li>
                    <li>• Mention steps to reproduce the problem</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Tickets List */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                <TicketIcon className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Your Tickets</h2>
                <p className="text-xs text-slate-500">Track and manage your support requests</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {loadingTickets ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
                </div>
              ) : tickets.length === 0 ? (
                <Card className="p-6 text-center border-slate-200 border-dashed rounded-xl">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="font-medium text-slate-700 text-sm mb-1">No tickets yet</h3>
                  <p className="text-xs text-slate-500">
                    Create your first ticket if you need any help!
                  </p>
                </Card>
              ) : (
                <>
                  {tickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="p-4 hover:shadow-md transition cursor-pointer border-slate-200 hover:border-slate-300 rounded-xl"
                      onClick={() => router.push(`/support/${ticket.id}`)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-slate-800">{ticket.subject}</h3>
                        <Badge
                          className={ticket.status === "open" ? "bg-emerald-100 text-emerald-700 text-xs" : "bg-slate-100 text-slate-600 text-xs"}
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          <TicketIcon className="w-3 h-3" />
                          {ticket.ticketNumber}
                        </span>
                        <span className="text-xs text-slate-500">
                          {ticket.category || "General"}
                        </span>
                        <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </Card>
                  ))}

                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-300 text-slate-700 hover:bg-black hover:text-white hover:border-slate-800"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span className="py-1.5 px-3 text-sm text-slate-600">
                        {page} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-300 text-slate-700 hover:bg-black hover:text-white hover:border-slate-800"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>


          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
