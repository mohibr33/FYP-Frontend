"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Plus, Loader2, Pill, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchMedicinesForInteraction } from "@/lib/api/interactions";
import type { MedicineSearchResult, MedicineInput } from "@/lib/types";

interface MedicineSearchInputProps {
  onSelect: (medicine: MedicineInput) => void;
  selectedMedicines: MedicineInput[];
  placeholder?: string;
  className?: string;
}

export function MedicineSearchInput({
  onSelect,
  selectedMedicines,
  placeholder = "Search or type medicine name...",
  className,
}: MedicineSearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MedicineSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const trimmedQuery = query.trim();

  // Check if the custom medicine is already selected
  const isCustomAlreadySelected = selectedMedicines.some(
    (sel) => sel.name.toLowerCase() === trimmedQuery.toLowerCase()
  );

  const searchMedicines = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(false);
    try {
      const data = await searchMedicinesForInteraction(searchQuery);
      const filtered = data.filter(
        (med) => !selectedMedicines.some((sel) => sel.id === med.id || sel.name.toLowerCase() === med.name.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
      setHighlightedIndex(-1);
      setHasSearched(true);
    } catch (error) {
      console.error("Error searching medicines:", error);
      setResults([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMedicines]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchMedicines(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchMedicines]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(medicine: MedicineSearchResult) {
    onSelect({
      id: medicine.id,
      name: medicine.name,
      genericName: medicine.genericName,
      slug: medicine.slug,
    });
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setHasSearched(false);
    inputRef.current?.focus();
  }

  function handleAddCustom() {
    if (!trimmedQuery || trimmedQuery.length < 2 || isCustomAlreadySelected) return;
    
    onSelect({
      name: trimmedQuery,
    });
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setHasSearched(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      
      // If there are results and one is highlighted, select it
      if (isOpen && highlightedIndex >= 0 && results[highlightedIndex]) {
        handleSelect(results[highlightedIndex]);
        return;
      }
      
      // If highlighting the custom option (index === results.length) or no results, add custom
      if (trimmedQuery.length >= 2 && !isCustomAlreadySelected) {
        if (highlightedIndex === results.length || results.length === 0) {
          handleAddCustom();
          return;
        }
      }
      
      // If no highlight but query exists, add as custom
      if (highlightedIndex === -1 && trimmedQuery.length >= 2 && !isCustomAlreadySelected && hasSearched) {
        handleAddCustom();
      }
      return;
    }

    if (!isOpen) return;

    // Total options = results + 1 (custom option)
    const totalOptions = results.length + (trimmedQuery.length >= 2 && !isCustomAlreadySelected ? 1 : 0);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < totalOptions - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  }

  const showDropdown = isOpen && (results.length > 0 || (hasSearched && trimmedQuery.length >= 2));
  const canAddCustom = trimmedQuery.length >= 2 && !isCustomAlreadySelected && hasSearched && !isLoading;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length >= 2 && (results.length > 0 || hasSearched)) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-12 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-80 overflow-y-auto"
        >
          <div className="p-2">
            {/* Database Results */}
            {results.length > 0 && (
              <>
                <p className="text-xs text-slate-500 font-medium px-3 py-2 uppercase tracking-wide">
                  From Database
                </p>
                {results.map((medicine, index) => (
                  <button
                    key={medicine.id}
                    onClick={() => handleSelect(medicine)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-all duration-150",
                      index === highlightedIndex 
                        ? "bg-teal-50 border border-teal-200" 
                        : "hover:bg-slate-50 border border-transparent"
                    )}
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200">
                      {medicine.image ? (
                        <img
                          src={medicine.image}
                          alt={medicine.name}
                          className="w-9 h-9 object-contain rounded"
                        />
                      ) : (
                        <Pill className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {medicine.name}
                      </p>
                      {medicine.genericName && (
                        <p className="text-sm text-slate-500 truncate">
                          {medicine.genericName}
                        </p>
                      )}
                      {medicine.brand && (
                        <p className="text-xs text-slate-400 mt-0.5">{medicine.brand}</p>
                      )}
                    </div>
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Plus className="w-4 h-4 text-teal-600" />
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Custom Medicine Option */}
            {canAddCustom && (
              <>
                {results.length > 0 && (
                  <div className="border-t border-slate-200 my-2" />
                )}
                <p className="text-xs text-slate-500 font-medium px-3 py-2 uppercase tracking-wide">
                  {results.length > 0 ? "Or Add Custom" : "Add Custom Medicine"}
                </p>
                <button
                  onClick={handleAddCustom}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-all duration-150",
                    highlightedIndex === results.length
                      ? "bg-cyan-50 border border-cyan-200"
                      : "hover:bg-slate-50 border border-transparent"
                  )}
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-200">
                    <PlusCircle className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800">
                      Add "{trimmedQuery}"
                    </p>
                    <p className="text-sm text-slate-500">
                      Add as custom medicine
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-cyan-600" />
                  </div>
                </button>
              </>
            )}

            {/* No Results Message */}
            {results.length === 0 && !canAddCustom && hasSearched && trimmedQuery.length >= 2 && (
              <div className="p-4 text-center">
                <p className="text-slate-500 text-sm">
                  {isCustomAlreadySelected 
                    ? `"${trimmedQuery}" is already added`
                    : "Type at least 2 characters to search"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
