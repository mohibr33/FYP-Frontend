"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  getAllTickets,
  resolveTicket,
  deleteTicket,
  getTicketStats,
  AdminTicket,
  TicketStats,
} from "@/lib/api/admin";
import { ChevronLeft, ChevronRight, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function TicketsManagement() {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(
    null
  );
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");

  useEffect(() => {
    loadTickets();
    loadStats();
  }, [page, statusFilter]);

  async function loadTickets() {
    setLoading(true);
    try {
      const filterStatus = statusFilter === "all" ? undefined : statusFilter;
      const data = await getAllTickets(page, 10, filterStatus);
      setTickets(data.tickets);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const data = await getTicketStats();
      setStats(data);
    } catch (error: any) {
      console.error("Failed to load stats:", error);
    }
  }

  async function handleResolveTicket() {
    if (!selectedTicket) return;

    if (resolutionNote.trim().length < 10) {
      toast.error("Resolution note must be at least 10 characters long");
      return;
    }

    try {
      await resolveTicket(selectedTicket.id, {
        resolutionNote: resolutionNote.trim(),
      });
      toast.success("Ticket resolved successfully");
      setResolveDialogOpen(false);
      setResolutionNote("");
      setSelectedTicket(null);
      loadTickets();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resolve ticket");
    }
  }

  async function handleDeleteTicket() {
    if (!selectedTicket) return;
    try {
      await deleteTicket(selectedTicket.id);
      toast.success("Ticket deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedTicket(null);
      loadTickets();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete ticket");
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-slate-100 text-slate-700";
      case "in_progress":
        return "bg-amber-50 text-amber-700";
      case "resolved":
        return "bg-emerald-50 text-emerald-700";
      case "closed":
        return "bg-slate-100 text-slate-500";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-600";
      case "medium":
        return "bg-amber-50 text-amber-600";
      case "low":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm bg-white p-5">
            <p className="text-sm text-slate-500">Total Tickets</p>
            <p className="text-2xl font-semibold text-slate-800 mt-1">{stats.total}</p>
          </Card>
          <Card className="border-0 shadow-sm bg-white p-5">
            <p className="text-sm text-slate-500">Open</p>
            <p className="text-2xl font-semibold text-slate-800 mt-1">{stats.open}</p>
          </Card>
          <Card className="border-0 shadow-sm bg-white p-5">
            <p className="text-sm text-slate-500">Resolved</p>
            <p className="text-2xl font-semibold text-emerald-600 mt-1">
              {stats.resolved}
            </p>
          </Card>
        </div>
      )}

      <Card className="border-0 shadow-sm bg-white">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Label className="text-slate-600 text-sm">Filter by Status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 border-slate-200 focus:border-slate-400 focus:ring-slate-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="text-slate-600 font-medium">Ticket #</TableHead>
                      <TableHead className="text-slate-600 font-medium">Subject</TableHead>
                      <TableHead className="text-slate-600 font-medium">User</TableHead>
                      <TableHead className="text-slate-600 font-medium">Category</TableHead>
                      <TableHead className="text-slate-600 font-medium">Status</TableHead>
                      <TableHead className="text-slate-600 font-medium">Priority</TableHead>
                      <TableHead className="text-slate-600 font-medium">Created</TableHead>
                      <TableHead className="text-slate-600 font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-slate-400 py-12"
                      >
                        No tickets found
                      </TableCell>
                    </TableRow>
                    ) : (
                      tickets.map((ticket) => (
                        <TableRow key={ticket.id} className="border-slate-100 hover:bg-slate-50/50">
                          <TableCell className="font-mono text-sm text-slate-600">
                            {ticket.ticketNumber}
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-slate-800">
                            {ticket.subject}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium text-slate-700">{ticket.user?.name}</p>
                              <p className="text-slate-400 text-xs">
                                {ticket.user?.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                              {ticket.category}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                ticket.status
                              )}`}
                            >
                              {ticket.status.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setResolutionNote(ticket.adminResponse || "");
                                  setResolveDialogOpen(true);
                                }}
                                disabled={ticket.status === "resolved"}
                                className="h-8 w-8 p-0 hover:bg-purple-50 disabled:opacity-40"
                              >
                                <MessageSquare className="h-4 w-4 text-purple-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setDeleteDialogOpen(true);
                                }}
                                className="h-8 w-8 p-0 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
              <div className="flex justify-between items-center pt-2">
                  <p className="text-sm text-slate-500">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Resolve Ticket Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resolve Ticket</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Subject:</p>
                <p className="font-medium">{selectedTicket.subject}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Message:</p>
                <p className="text-sm">{selectedTicket.message}</p>
              </div>
              <div className="space-y-2">
                <Label>Resolution Note (min. 10 characters)</Label>
                <Textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  rows={4}
                  placeholder="Enter your resolution note (minimum 10 characters)..."
                  className={
                    resolutionNote.trim().length > 0 &&
                    resolutionNote.trim().length < 10
                      ? "border-red-500"
                      : ""
                  }
                />
                {resolutionNote.trim().length > 0 &&
                  resolutionNote.trim().length < 10 && (
                    <p className="text-sm text-red-600">
                      Please enter at least 10 characters
                    </p>
                  )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResolveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResolveTicket}
              disabled={resolutionNote.trim().length < 10}
            >
              Resolve Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete ticket{" "}
            <strong>{selectedTicket?.ticketNumber}</strong>? This action cannot
            be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTicket}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
