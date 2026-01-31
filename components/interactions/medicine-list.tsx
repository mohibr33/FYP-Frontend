"use client";

import { X, Pill, Plus, Database, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MedicineInput } from "@/lib/types";

interface MedicineListProps {
  medicines: MedicineInput[];
  onRemove: (index: number) => void;
  className?: string;
}

export function MedicineList({ medicines, onRemove, className }: MedicineListProps) {
  if (medicines.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Plus className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-slate-600 font-medium mb-1">No medicines added</p>
        <p className="text-slate-400 text-sm">
          Add at least 2 medicines to check interactions
        </p>
      </div>
    );
  }

  const databaseMedicines = medicines.filter(m => m.id);
  const customMedicines = medicines.filter(m => !m.id);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-slate-700 text-sm">
          Selected Medicines
        </h3>
        {medicines.length >= 2 ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
            Ready to scan
          </span>
        ) : (
          <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Add {2 - medicines.length} more
          </span>
        )}
      </div>

      <div className="space-y-2">
        {medicines.map((medicine, index) => {
          const isCustom = !medicine.id;
          
          return (
            <div
              key={`${medicine.id || medicine.name}-${index}`}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3 group transition-all duration-200 border",
                isCustom 
                  ? "bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200 hover:from-cyan-100 hover:to-teal-100"
                  : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-150"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center border shadow-sm",
                  isCustom 
                    ? "bg-gradient-to-br from-cyan-100 to-teal-100 border-cyan-200"
                    : "bg-white border-slate-200"
                )}>
                  {isCustom ? (
                    <Edit3 className="w-5 h-5 text-cyan-600" />
                  ) : (
                    <Pill className="w-5 h-5 text-teal-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">{medicine.name}</p>
                    {isCustom ? (
                      <span className="text-[10px] font-medium text-cyan-700 bg-cyan-100 px-1.5 py-0.5 rounded border border-cyan-200">
                        CUSTOM
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                        <Database className="w-2.5 h-2.5 inline mr-0.5" />
                        DB
                      </span>
                    )}
                  </div>
                  {medicine.genericName && (
                    <p className="text-sm text-slate-500">{medicine.genericName}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="w-8 h-8 flex items-center justify-center rounded-lg opacity-60 group-hover:opacity-100 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {medicines.length > 0 && (
        <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
          {databaseMedicines.length > 0 && (
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              {databaseMedicines.length} from database
            </span>
          )}
          {customMedicines.length > 0 && (
            <span className="flex items-center gap-1">
              <Edit3 className="w-3 h-3" />
              {customMedicines.length} custom
            </span>
          )}
        </div>
      )}
    </div>
  );
}
