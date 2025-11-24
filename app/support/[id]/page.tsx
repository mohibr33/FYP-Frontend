"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { getTicketById, Ticket } from "@/lib/api/tickets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";

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

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => router.push("/support")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tickets
      </Button>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <Card className="p-6 text-center text-red-600">{error}</Card>
      ) : ticket ? (
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{ticket.subject}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {ticket.ticketNumber} • {ticket.category || "General"}
              </p>
            </div>
            <Badge variant={ticket.status === "open" ? "default" : "secondary"}>
              {ticket.status}
            </Badge>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Your Message</h3>
            <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.adminResponse && (
            <div className="border-t pt-4 bg-blue-50 dark:bg-blue-950 p-4 rounded">
              <h3 className="font-medium mb-2">Admin Response</h3>
              <p className="text-sm whitespace-pre-wrap">
                {ticket.adminResponse}
              </p>
            </div>
          )}

          <div className="border-t pt-4 text-xs text-muted-foreground space-y-1">
            <p>
              Priority: <span className="capitalize">{ticket.priority}</span>
            </p>
            <p>Created: {new Date(ticket.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(ticket.updatedAt).toLocaleString()}</p>
            {ticket.resolvedAt && (
              <p>Resolved: {new Date(ticket.resolvedAt).toLocaleString()}</p>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-6 text-center">Ticket not found</Card>
      )}
    </div>
  );
}
