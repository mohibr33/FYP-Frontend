"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  getAllUsers,
  searchUsers,
  updateUser,
  deleteUser,
  AdminUser,
} from "@/lib/api/admin";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, [page]);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getAllUsers(page, 10);
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      loadUsers();
      return;
    }
    setLoading(true);
    try {
      const data = await searchUsers(searchQuery);
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateUser() {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        role: editingUser.role,
        isVerified: editingUser.isVerified,
      });
      toast.success("User updated successfully");
      setEditDialogOpen(false);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label>Search Users</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={loadUsers}>
            Clear
          </Button>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              user.isVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isVerified ? "Yes" : "No"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user);
                                setEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setUserToDelete(user);
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

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={editingUser.firstName}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={editingUser.lastName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, lastName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVerified"
                  checked={editingUser.isVerified}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      isVerified: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="isVerified">Email Verified</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
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
            Are you sure you want to delete user{" "}
            <strong>
              {userToDelete?.firstName} {userToDelete?.lastName}
            </strong>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
