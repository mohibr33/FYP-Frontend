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
import { Loader2 } from "lucide-react";

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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Create Ticket Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Ticket</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Brief description of your issue"
              />
            </div>
            <div>
              <Label htmlFor="category">Category (optional)</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border rounded px-3 py-2"
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe your issue in detail (min. 10 characters)..."
                rows={5}
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Tickets</h2>
          {loadingTickets ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : tickets.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No tickets yet. Create one above if you need help!
            </Card>
          ) : (
            <>
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => router.push(`/support/${ticket.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <Badge
                      variant={
                        ticket.status === "open" ? "default" : "secondary"
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {ticket.ticketNumber} • {ticket.category || "General"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="py-2 px-4">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
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
  );
}
