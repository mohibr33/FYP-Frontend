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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { getAllTickets, resolveTicket, deleteTicket, getTicketStats, AdminTicket, TicketStats } from "@/lib/api/admin";
import { ChevronLeft, ChevronRight, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function TicketsManagement() {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
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
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Tickets</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Open</p>
            <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Resolved</p>
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Label>Filter by Status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
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
            <div className="flex justify-center py-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket #</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-500">
                          No tickets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-mono text-sm">
                            {ticket.ticketNumber}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {ticket.subject}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium">{ticket.user?.name}</p>
                              <p className="text-gray-500">{ticket.user?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{ticket.category}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs ${getStatusColor(
                                ticket.status
                              )}`}
                            >
                              {ticket.status.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setResolutionNote(ticket.adminResponse || "");
                                  setResolveDialogOpen(true);
                                }}
                                disabled={ticket.status === "resolved"}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
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
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
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
                <p className="text-sm text-gray-600">Subject:</p>
                <p className="font-medium">{selectedTicket.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Message:</p>
                <p className="text-sm">{selectedTicket.message}</p>
              </div>
              <div className="space-y-2">
                <Label>Resolution Note (min. 10 characters)</Label>
                <Textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  rows={4}
                  placeholder="Enter your resolution note (minimum 10 characters)..."
                  className={resolutionNote.trim().length > 0 && resolutionNote.trim().length < 10 ? "border-red-500" : ""}
                />
                {resolutionNote.trim().length > 0 && resolutionNote.trim().length < 10 && (
                  <p className="text-sm text-red-600">Please enter at least 10 characters</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
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
            <strong>{selectedTicket?.ticketNumber}</strong>? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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
