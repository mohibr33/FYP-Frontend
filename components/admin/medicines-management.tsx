"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Spinner } from "@/components/ui/spinner";
import {
  getAllMedicines,
  searchMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  AdminMedicine,
} from "@/lib/api/admin";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function MedicinesManagement() {
  const [medicines, setMedicines] = useState<AdminMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] =
    useState<AdminMedicine | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    productImage: "",
    usedFor: "",
    childCategory: "",
    generics: "",
    description: "",
    requiresPrescriptionYesNo: "No",
    indication: "",
    sideEffects: "",
    dosage: "",
    precautions: "",
    warning1: "",
  });

  useEffect(() => {
    loadMedicines();
  }, [page]);

  async function loadMedicines() {
    setLoading(true);
    try {
      const data = await getAllMedicines(page, 10);
      setMedicines(data.medicines);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load medicines");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      loadMedicines();
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const data = await searchMedicines(searchQuery, page, 10);
      setMedicines(data.medicines);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMedicine() {
    if (!formData.title || !formData.brand) {
      toast.error("Please fill in title and brand");
      return;
    }

    try {
      await createMedicine({
        title: formData.title,
        brand: formData.brand,
        productImage: formData.productImage || undefined,
        usedFor: formData.usedFor || undefined,
        childCategory: formData.childCategory || undefined,
        productDetails: {
          description: formData.description || undefined,
          generics: formData.generics || undefined,
          requiresPrescriptionYesNo: formData.requiresPrescriptionYesNo,
          indication: formData.indication || undefined,
          sideEffects: formData.sideEffects || undefined,
          dosage: formData.dosage || undefined,
          precautions: formData.precautions || undefined,
          warning1: formData.warning1 || undefined,
        },
      });

      toast.success("Medicine created successfully");
      setCreateDialogOpen(false);
      resetForm();
      loadMedicines();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create medicine");
    }
  }

  async function handleUpdateMedicine() {
    if (!selectedMedicine) return;

    if (!formData.title || !formData.brand) {
      toast.error("Please fill in title and brand");
      return;
    }

    try {
      await updateMedicine(selectedMedicine.id, {
        title: formData.title,
        brand: formData.brand,
        productImage: formData.productImage || undefined,
        usedFor: formData.usedFor || undefined,
        childCategory: formData.childCategory || undefined,
        productDetails: {
          description: formData.description || undefined,
          generics: formData.generics || undefined,
          requiresPrescriptionYesNo: formData.requiresPrescriptionYesNo,
          indication: formData.indication || undefined,
          sideEffects: formData.sideEffects || undefined,
          dosage: formData.dosage || undefined,
          precautions: formData.precautions || undefined,
          warning1: formData.warning1 || undefined,
        },
      });

      toast.success("Medicine updated successfully");
      setEditDialogOpen(false);
      setSelectedMedicine(null);
      resetForm();
      loadMedicines();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update medicine");
    }
  }

  async function handleDeleteMedicine() {
    if (!selectedMedicine) return;

    try {
      await deleteMedicine(selectedMedicine.id);
      toast.success("Medicine deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedMedicine(null);
      loadMedicines();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete medicine");
    }
  }

  function openEditDialog(medicine: AdminMedicine) {
    setSelectedMedicine(medicine);
    setFormData({
      title: medicine.title,
      brand: medicine.brand,
      productImage: medicine.productImage || "",
      usedFor: medicine.usedFor || "",
      childCategory: medicine.childCategory || "",
      generics: medicine.productDetails?.generics || "",
      description: medicine.productDetails?.description || "",
      requiresPrescriptionYesNo:
        medicine.productDetails?.requiresPrescriptionYesNo || "No",
      indication: medicine.productDetails?.indication || "",
      sideEffects: medicine.productDetails?.sideEffects || "",
      dosage: medicine.productDetails?.dosage || "",
      precautions: medicine.productDetails?.precautions || "",
      warning1: medicine.productDetails?.warning1 || "",
    });
    setEditDialogOpen(true);
  }

  function resetForm() {
    setFormData({
      title: "",
      brand: "",
      productImage: "",
      usedFor: "",
      childCategory: "",
      generics: "",
      description: "",
      requiresPrescriptionYesNo: "No",
      indication: "",
      sideEffects: "",
      dosage: "",
      precautions: "",
      warning1: "",
    });
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Medicines Management</h2>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search medicines by name, generic name, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            {isSearching && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearching(false);
                  setPage(1);
                  loadMedicines();
                }}
                variant="outline"
              >
                Clear
              </Button>
            )}
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
                      <TableHead>Product ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Generics</TableHead>
                      <TableHead>Rx Required</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicines.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-gray-500"
                        >
                          No medicines found
                        </TableCell>
                      </TableRow>
                    ) : (
                      medicines.map((medicine) => (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-mono text-xs">
                            {medicine.productId}
                          </TableCell>
                          <TableCell className="font-medium max-w-xs truncate">
                            {medicine.title}
                          </TableCell>
                          <TableCell>{medicine.brand}</TableCell>
                          <TableCell>{medicine.childCategory || "-"}</TableCell>
                          <TableCell className="text-sm">
                            {medicine.productDetails?.generics || "-"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                medicine.productDetails
                                  ?.requiresPrescriptionYesNo === "Yes"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {medicine.productDetails
                                ?.requiresPrescriptionYesNo || "No"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(medicine)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedMedicine(medicine);
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
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
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

      {/* Create Medicine Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Medicine Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Panadol Tablets"
                />
              </div>
              <div className="space-y-2">
                <Label>Brand *</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  placeholder="e.g., GlaxoSmithKline"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Generic Name</Label>
                <Input
                  value={formData.generics}
                  onChange={(e) =>
                    setFormData({ ...formData, generics: e.target.value })
                  }
                  placeholder="e.g., Paracetamol"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={formData.childCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, childCategory: e.target.value })
                  }
                  placeholder="e.g., Pain Relief"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product Image URL</Label>
              <Input
                value={formData.productImage}
                onChange={(e) =>
                  setFormData({ ...formData, productImage: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Used For</Label>
              <Input
                value={formData.usedFor}
                onChange={(e) =>
                  setFormData({ ...formData, usedFor: e.target.value })
                }
                placeholder="e.g., Headache, Fever, Pain"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Medicine description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Indication</Label>
                <Textarea
                  value={formData.indication}
                  onChange={(e) =>
                    setFormData({ ...formData, indication: e.target.value })
                  }
                  placeholder="Medical indications"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Dosage</Label>
                <Textarea
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  placeholder="Recommended dosage"
                  rows={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Prescription Required</Label>
              <select
                value={formData.requiresPrescriptionYesNo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiresPrescriptionYesNo: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Side Effects</Label>
              <Textarea
                value={formData.sideEffects}
                onChange={(e) =>
                  setFormData({ ...formData, sideEffects: e.target.value })
                }
                placeholder="List of side effects"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Precautions</Label>
              <Textarea
                value={formData.precautions}
                onChange={(e) =>
                  setFormData({ ...formData, precautions: e.target.value })
                }
                placeholder="Precautions to take"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Warning</Label>
              <Textarea
                value={formData.warning1}
                onChange={(e) =>
                  setFormData({ ...formData, warning1: e.target.value })
                }
                placeholder="Important warnings"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateMedicine}>Add Medicine</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Medicine Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Medicine Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Panadol Tablets"
                />
              </div>
              <div className="space-y-2">
                <Label>Brand *</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  placeholder="e.g., GlaxoSmithKline"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Generic Name</Label>
                <Input
                  value={formData.generics}
                  onChange={(e) =>
                    setFormData({ ...formData, generics: e.target.value })
                  }
                  placeholder="e.g., Paracetamol"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={formData.childCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, childCategory: e.target.value })
                  }
                  placeholder="e.g., Pain Relief"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product Image URL</Label>
              <Input
                value={formData.productImage}
                onChange={(e) =>
                  setFormData({ ...formData, productImage: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Used For</Label>
              <Input
                value={formData.usedFor}
                onChange={(e) =>
                  setFormData({ ...formData, usedFor: e.target.value })
                }
                placeholder="e.g., Headache, Fever, Pain"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Medicine description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Indication</Label>
                <Textarea
                  value={formData.indication}
                  onChange={(e) =>
                    setFormData({ ...formData, indication: e.target.value })
                  }
                  placeholder="Medical indications"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Dosage</Label>
                <Textarea
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  placeholder="Recommended dosage"
                  rows={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Prescription Required</Label>
              <select
                value={formData.requiresPrescriptionYesNo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiresPrescriptionYesNo: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Side Effects</Label>
              <Textarea
                value={formData.sideEffects}
                onChange={(e) =>
                  setFormData({ ...formData, sideEffects: e.target.value })
                }
                placeholder="List of side effects"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Precautions</Label>
              <Textarea
                value={formData.precautions}
                onChange={(e) =>
                  setFormData({ ...formData, precautions: e.target.value })
                }
                placeholder="Precautions to take"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Warning</Label>
              <Textarea
                value={formData.warning1}
                onChange={(e) =>
                  setFormData({ ...formData, warning1: e.target.value })
                }
                placeholder="Important warnings"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedMedicine(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateMedicine}>Update Medicine</Button>
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
            Are you sure you want to delete{" "}
            <strong>&quot;{selectedMedicine?.name}&quot;</strong>? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedMedicine(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMedicine}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
