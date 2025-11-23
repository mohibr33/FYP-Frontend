"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, AlertCircle } from "lucide-react";
import {
  getAllMedicines,
  searchMedicines,
  getMedicineBrands,
} from "@/lib/api/medicines";
import type { Medicine } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MedicinesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchBrands();
    fetchMedicines();
  }, [page]);

  const fetchBrands = async () => {
    try {
      const response = await getMedicineBrands();
      setBrands(response.brands);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
    }
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMedicines(page, limit);
      setMedicines(response.medicines);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch medicines. Please try again later."
      );
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setPage(1);
      fetchMedicines();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPage(1);
      const response = await searchMedicines(searchTerm, 1, limit);
      setMedicines(response.medicines);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Search failed. Please try again."
      );
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Medicine Database
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive information about medications, dosages, side effects,
            and interactions
          </p>
        </div>

        <div className="mb-8 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search medicines, brands, or generics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-12 border-blue-200 focus:border-blue-600"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {total} medicine{total !== 1 ? "s" : ""} found
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {medicines.map((medicine) => (
                <Link key={medicine.id} href={`/medicines/${medicine.slug}`}>
                  <Card className="h-full hover:shadow-lg transition cursor-pointer border-blue-100 overflow-hidden">
                    {/* Product Image */}
                    <div className="w-full h-32 bg-gray-100 relative overflow-hidden">
                      <Image
                        src={medicine.productImage || "/placeholder.svg"}
                        alt={medicine.title}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                      />
                    </div>

                    <CardHeader className="p-3">
                      <CardTitle className="text-sm text-foreground line-clamp-2 leading-tight">
                        {medicine.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {medicine.brand}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 space-y-2">
                      {medicine.productDetails.generics && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Generic
                          </p>
                          <p className="text-xs font-medium text-foreground line-clamp-1">
                            {medicine.productDetails.generics}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs line-clamp-1">
                          {medicine.usedFor}
                        </span>
                      </div>
                      {medicine.productDetails.requiresPrescriptionYesNo ===
                        "Yes" && (
                        <span className="block bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs text-center">
                          Rx Required
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>{" "}
            {medicines.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No medicines found matching your search.
                </p>
              </div>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                  className=" cursor-pointer"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  variant="outline"
                  className=" cursor-pointer"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
