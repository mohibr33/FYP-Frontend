"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pill, Clock, Plus, Check, X, AlertCircle, Loader2, Trash2, RefreshCw, Bell, Pencil, FileText, Calculator, Activity, Info, AlertTriangle, Download, ClipboardList } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { toast } from "sonner";
import { addMedicine, getMedicines, getReminders, markDoseTaken, deleteMedicine, updateMedicine, getSummaryReport, saveDosageCalculation, getDosageCalculations, type SavedDosageCalculation } from "@/lib/api/userMedicines";
import type { UserMedicine, Reminder, DoseStatus, SummaryReport } from "@/lib/types";

type TabValue = "medicines" | "reminders" | "guidelines" | "report" | "dosage";

interface DosageCalculation {
  method?: string;
  drugName: string;
  finalDose: string;
  unit: string;
  steps: string[];
  inputs?: Record<string, number>;
}

interface GuidelineCard {
  title: string;
  icon: typeof Info;
  accentClassName: string;
  iconClassName: string;
  surfaceClassName: string;
  items: string[];
}

const guidelineCards: GuidelineCard[] = [
  {
    title: "General",
    icon: Info,
    accentClassName: "bg-blue-500",
    iconClassName: "text-blue-500",
    surfaceClassName: "from-blue-50 to-white",
    items: [
      "Take medicines exactly as prescribed",
      "Do not adjust the dose without medical advice",
      "Complete the full course when an antibiotic is prescribed",
    ],
  },
  {
    title: "Storage",
    icon: AlertTriangle,
    accentClassName: "bg-amber-500",
    iconClassName: "text-amber-500",
    surfaceClassName: "from-amber-50 to-white",
    items: [
      "Store medicines in a cool, dry place",
      "Keep medicine strips and bottles away from direct sunlight",
      "Place medicines out of children's reach",
    ],
  },
  {
    title: "Precautions",
    icon: AlertCircle,
    accentClassName: "bg-red-500",
    iconClassName: "text-red-500",
    surfaceClassName: "from-rose-50 to-white",
    items: [
      "Never share prescription medicines",
      "Report unusual reactions or side effects promptly",
      "Keep an updated list of all current medicines",
    ],
  },
  {
    title: "Best Practices",
    icon: Activity,
    accentClassName: "bg-emerald-500",
    iconClassName: "text-emerald-500",
    surfaceClassName: "from-emerald-50 to-white",
    items: [
      "Take doses at the same time each day",
      "Use a pill organizer for multi-dose schedules",
      "Enable reminders to support consistency",
    ],
  },
];

export default function MedicineAdherencePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabValue>("medicines");
  const [medicines, setMedicines] = useState<UserMedicine[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [summary, setSummary] = useState<SummaryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<UserMedicine | null>(null);
  const [dosageCalcResult, setDosageCalcResult] = useState<DosageCalculation | null>(null);
  const [calcMethod, setCalcMethod] = useState("weight");
  const [calcHistory, setCalcHistory] = useState<SavedDosageCalculation[]>([]);
  const [calcInputs, setCalcInputs] = useState({
    desiredDose: "",
    availableDose: "",
    quantity: "",
    weight: "",
    dosePerKg: "",
    volume: "",
    dropFactor: "",
    timeMinutes: "",
    bsa: "",
    adultDose: "",
    drugName: "",
    patientAge: "",
    patientCondition: "",
  });
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    doctorName: "",
    duration: 30,
    isLifetime: false,
    intakeTimes: ["08:00"],
    notes: "",
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (activeTab === "report") fetchSummary();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "dosage") fetchCalcHistory();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [medicinesData, remindersData] = await Promise.all([getMedicines(true), getReminders()]);
      setMedicines(medicinesData);
      setReminders(remindersData);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await getSummaryReport(15);
      setSummary(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch summary");
    }
  };

  const fetchCalcHistory = async () => {
    try {
      const data = await getDosageCalculations();
      setCalcHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMedicine.name.trim()) {
      toast.error("Medicine name is required");
      return;
    }

    if (newMedicine.intakeTimes.length === 0) {
      toast.error("At least one intake time is required");
      return;
    }

    try {
      setSaving(true);
      await addMedicine(newMedicine);
      toast.success("Medicine added successfully");
      setIsAddDialogOpen(false);
      setNewMedicine({
        name: "",
        doctorName: "",
        duration: 30,
        isLifetime: false,
        intakeTimes: ["08:00"],
        notes: "",
      });
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add medicine");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    try {
      await deleteMedicine(id);
      toast.success("Medicine deleted");
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const handleEditMedicine = (medicine: UserMedicine) => {
    setEditingMedicine(medicine);
    setIsEditDialogOpen(true);
  };

  const handleUpdateMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedicine) return;

    try {
      setSaving(true);
      await updateMedicine(editingMedicine.id, {
        name: editingMedicine.name,
        doctorName: editingMedicine.doctorName || undefined,
        duration: editingMedicine.duration,
        isLifetime: editingMedicine.isLifetime,
        intakeTimes: editingMedicine.intakeTimes,
        notes: editingMedicine.notes || undefined,
      });
      toast.success("Medicine updated");
      setIsEditDialogOpen(false);
      setEditingMedicine(null);
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkTaken = async (doseId: string) => {
    try {
      await markDoseTaken(doseId);
      toast.success("Dose marked as taken");
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to mark dose");
    }
  };

  const downloadReport = () => {
    if (!summary) return;

    const content = `MEDICINE ADHERENCE REPORT\nGenerated: ${new Date().toLocaleDateString()}\n\nOVERVIEW\nTotal: ${summary.totalDoses}\nTaken: ${summary.takenDoses}\nMissed: ${summary.missedDoses}\nRate: ${summary.adherenceRate}%`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    toast.success("Report downloaded");
  };

  const calculateMedicationDosage = async () => {
    const inputs = calcInputs;
    const method = calcMethod;
    let result: DosageCalculation | null = null;
    const steps: string[] = [];

    if (method === "basic") {
      const desired = parseFloat(inputs.desiredDose);
      const available = parseFloat(inputs.availableDose);
      const quantity = parseFloat(inputs.quantity);

      if (!desired || !available || !quantity || !inputs.drugName) {
        toast.error("Please fill all required fields");
        return;
      }

      const doseToGive = (desired / available) * quantity;
      steps.push("BASIC DOSAGE CALCULATION");
      steps.push("Formula: Dose to give = (Desired dose / Available dose) x Quantity");
      steps.push(`Step 1: Desired dose = ${desired} mg`);
      steps.push(`Step 2: Available dose = ${available} mg`);
      steps.push(`Step 3: Quantity = ${quantity}`);
      steps.push(`Calculation: (${desired} / ${available}) x ${quantity} = ${doseToGive.toFixed(2)} mg`);

      result = {
        method: "Basic",
        drugName: inputs.drugName,
        finalDose: doseToGive.toFixed(2),
        unit: "mg",
        steps,
        inputs: { desiredDose: desired, availableDose: available, quantity },
      };
    } else if (method === "weight") {
      const weight = parseFloat(inputs.weight);
      const dosePerKg = parseFloat(inputs.dosePerKg);

      if (!weight || !dosePerKg || !inputs.drugName) {
        toast.error("Please fill all required fields");
        return;
      }

      const dose = weight * dosePerKg;
      steps.push("WEIGHT-BASED DOSAGE CALCULATION");
      steps.push("Formula: Dose = Weight (kg) x Dose per kg");
      steps.push(`Step 1: Weight = ${weight} kg`);
      steps.push(`Step 2: Dose per kg = ${dosePerKg} mg/kg`);
      steps.push(`Calculation: ${weight} x ${dosePerKg} = ${dose.toFixed(2)} mg/day`);

      result = {
        method: "Weight-Based",
        drugName: inputs.drugName,
        finalDose: dose.toFixed(2),
        unit: "mg/day",
        steps,
        inputs: { weight, dosePerKg },
      };
    } else if (method === "iv") {
      const volume = parseFloat(inputs.volume);
      const dropFactor = parseFloat(inputs.dropFactor);
      const timeMinutes = parseFloat(inputs.timeMinutes);

      if (!volume || !dropFactor || !timeMinutes || !inputs.drugName) {
        toast.error("Please fill all required fields");
        return;
      }

      const flowRate = (volume * dropFactor) / timeMinutes;
      steps.push("IV FLOW RATE CALCULATION");
      steps.push("Formula: Flow rate (drops/min) = (Volume x Drop factor) / Time");
      steps.push(`Step 1: Volume = ${volume} mL`);
      steps.push(`Step 2: Drop factor = ${dropFactor} drops/mL`);
      steps.push(`Step 3: Time = ${timeMinutes} minutes`);
      steps.push(`Calculation: (${volume} x ${dropFactor}) / ${timeMinutes} = ${flowRate.toFixed(2)} drops/min`);

      result = {
        method: "IV Flow Rate",
        drugName: inputs.drugName,
        finalDose: flowRate.toFixed(2),
        unit: "drops/min",
        steps,
        inputs: { volume, dropFactor, timeMinutes },
      };
    } else if (method === "bsa") {
      const bsa = parseFloat(inputs.bsa);
      const adultDose = parseFloat(inputs.adultDose);

      if (!bsa || !adultDose || !inputs.drugName) {
        toast.error("Please fill all required fields");
        return;
      }

      const dose = (bsa / 1.73) * adultDose;
      steps.push("BSA-BASED DOSAGE CALCULATION");
      steps.push("Formula: Dose = (Patient BSA / 1.73) x Adult dose");
      steps.push(`Step 1: Patient BSA = ${bsa} m2`);
      steps.push(`Step 2: Adult dose = ${adultDose} mg`);
      steps.push("Step 3: Standard BSA = 1.73 m2");
      steps.push(`Calculation: (${bsa} / 1.73) x ${adultDose} = ${dose.toFixed(2)} mg`);

      result = {
        method: "BSA-Based",
        drugName: inputs.drugName,
        finalDose: dose.toFixed(2),
        unit: "mg",
        steps,
        inputs: { bsa, adultDose },
      };
    }

    if (!result) return;

    setDosageCalcResult(result);

    try {
      await saveDosageCalculation({
        drugName: result.drugName,
        calculationMethod: result.method || method,
        inputs: result.inputs || {},
        result: result.finalDose,
        unit: result.unit,
        steps: result.steps.join("\n"),
      });
      toast.success("Calculation saved to history");
    } catch (error) {
      console.error("Failed to save calculation:", error);
    }

    toast.success("Dosage calculated successfully");
  };

  const addIntakeTime = () => {
    setNewMedicine((prev) => ({ ...prev, intakeTimes: [...prev.intakeTimes, "20:00"] }));
  };

  const removeIntakeTime = (index: number) => {
    setNewMedicine((prev) => ({
      ...prev,
      intakeTimes: prev.intakeTimes.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const updateIntakeTime = (index: number, value: string) => {
    setNewMedicine((prev) => ({
      ...prev,
      intakeTimes: prev.intakeTimes.map((time, currentIndex) => (currentIndex === index ? value : time)),
    }));
  };

  const addEditIntakeTime = () => {
    setEditingMedicine((prev) => prev ? { ...prev, intakeTimes: [...prev.intakeTimes, "20:00"] } : null);
  };

  const removeEditIntakeTime = (index: number) => {
    setEditingMedicine((prev) => prev ? {
      ...prev,
      intakeTimes: prev.intakeTimes.filter((_, currentIndex) => currentIndex !== index),
    } : null);
  };

  const updateEditIntakeTime = (index: number, value: string) => {
    setEditingMedicine((prev) => prev ? {
      ...prev,
      intakeTimes: prev.intakeTimes.map((time, currentIndex) => (currentIndex === index ? value : time)),
    } : null);
  };

  const getStatusColor = (status: DoseStatus) => status === "taken" ? "bg-green-500" : status === "missed" ? "bg-red-500" : "bg-yellow-500";
  const getStatusText = (status: DoseStatus) => status === "taken" ? "Taken" : status === "missed" ? "Missed" : "Pending";
  const pendingReminders = reminders.filter((reminder) => reminder.status === "pending").length;
  const takenReminders = reminders.filter((reminder) => reminder.status === "taken").length;
  const nextReminder = reminders.find((reminder) => reminder.status === "pending");

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-slate-800 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-[28px] border border-slate-700 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 p-8 shadow-xl shadow-slate-900/20">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-700/80 shadow-inner shadow-black/10">
                  <Pill className="h-8 w-8 text-teal-400" />
                </div>
                <div className="space-y-2">
                  <Badge className="border-0 bg-teal-500/15 px-3 py-1 text-teal-300">Adherence Hub</Badge>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Medicine Adherence</h1>
                    <p className="max-w-2xl text-sm leading-6 text-slate-300">Keep your medicine schedule, reminders, dosage tools, and progress insights in one calm workspace.</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-700 bg-slate-700/40 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active Medicines</p><p className="mt-2 text-3xl font-semibold text-white">{medicines.length}</p><p className="mt-1 text-sm text-slate-400">Your current medicine list</p></div>
                <div className="rounded-2xl border border-slate-700 bg-slate-700/40 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pending Today</p><p className="mt-2 text-3xl font-semibold text-white">{pendingReminders}</p><p className="mt-1 text-sm text-slate-400">Reminders waiting to be marked</p></div>
                <div className="rounded-2xl border border-slate-700 bg-slate-700/40 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Adherence Rate</p><p className="mt-2 text-3xl font-semibold text-white">{summary ? `${summary.adherenceRate}%` : "--"}</p><p className="mt-1 text-sm text-slate-400">Based on the latest 15-day report</p></div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-slate-500">Today at a glance</p><h2 className="mt-1 text-xl font-semibold text-slate-900">Stay on track</h2></div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50"><Bell className="h-5 w-5 text-teal-600" /></div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Taken today</span><Badge className="border-0 bg-emerald-100 text-emerald-700">{takenReminders}</Badge></div><p className="mt-2 text-lg font-semibold text-slate-800">Completed reminders</p></div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Next reminder</span><Clock className="h-4 w-4 text-slate-400" /></div><p className="mt-2 text-lg font-semibold text-slate-800">{nextReminder ? nextReminder.scheduledTime : "No pending reminders"}</p><p className="mt-1 text-sm text-slate-500">{nextReminder ? nextReminder.medicineName : "Everything due right now has been handled."}</p></div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" onClick={fetchData} className="border-slate-300 text-slate-700 hover:border-slate-800 hover:bg-slate-800 hover:text-white"><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild><Button className="bg-slate-800 text-white hover:bg-slate-900"><Plus className="mr-2 h-4 w-4" />Add Medicine</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader><DialogTitle>Add Medicine</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddMedicine} className="space-y-4">
                      <div><Label>Name *</Label><Input value={newMedicine.name} onChange={(e) => setNewMedicine((prev) => ({ ...prev, name: e.target.value }))} required /></div>
                      <div><Label>Doctor</Label><Input value={newMedicine.doctorName} onChange={(e) => setNewMedicine((prev) => ({ ...prev, doctorName: e.target.value }))} /></div>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"><Checkbox checked={newMedicine.isLifetime} onCheckedChange={(checked) => setNewMedicine((prev) => ({ ...prev, isLifetime: checked as boolean }))} /><Label>Lifetime medicine</Label></div>
                      {!newMedicine.isLifetime && <div><Label>Duration (days)</Label><Input type="number" value={newMedicine.duration} onChange={(e) => setNewMedicine((prev) => ({ ...prev, duration: +e.target.value || 1 }))} /></div>}
                      <div><Label>Intake times *</Label><div className="mt-2 space-y-2">{newMedicine.intakeTimes.map((time, index) => (<div key={index} className="flex gap-2"><Input type="time" value={time} onChange={(e) => updateIntakeTime(index, e.target.value)} />{newMedicine.intakeTimes.length > 1 && <Button type="button" variant="outline" onClick={() => removeIntakeTime(index)}><X className="h-4 w-4" /></Button>}</div>))}</div><Button type="button" variant="outline" onClick={addIntakeTime} className="mt-2 w-full border-dashed">+ Add Time</Button></div>
                      <div><Label>Notes</Label><Input value={newMedicine.notes} onChange={(e) => setNewMedicine((prev) => ({ ...prev, notes: e.target.value }))} /></div>
                      <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-900" disabled={saving}>{saving ? "Saving..." : "Add Medicine"}</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm md:grid-cols-5">
            <TabsTrigger value="medicines" className="rounded-2xl border border-transparent py-3 data-[state=active]:border-slate-800 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Pill className="mr-2 h-4 w-4" />Medicines</TabsTrigger>
            <TabsTrigger value="reminders" className="rounded-2xl border border-transparent py-3 data-[state=active]:border-slate-800 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Bell className="mr-2 h-4 w-4" />Reminders</TabsTrigger>
            <TabsTrigger value="guidelines" className="rounded-2xl border border-transparent py-3 data-[state=active]:border-slate-800 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><FileText className="mr-2 h-4 w-4" />Guidelines</TabsTrigger>
            <TabsTrigger value="report" className="rounded-2xl border border-transparent py-3 data-[state=active]:border-slate-800 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><ClipboardList className="mr-2 h-4 w-4" />Report</TabsTrigger>
            <TabsTrigger value="dosage" className="rounded-2xl border border-transparent py-3 data-[state=active]:border-slate-800 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Calculator className="mr-2 h-4 w-4" />Dosage</TabsTrigger>
          </TabsList>

          <TabsContent value="medicines" className="mt-6">
            <div className="mb-5 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-medium text-teal-600">Medicine schedule</p><h2 className="mt-1 text-2xl font-semibold text-slate-900">My Medicines</h2><p className="mt-1 text-sm text-slate-500">Review every active medicine, timing window, and treatment duration.</p></div><div className="flex items-center gap-3 text-sm text-slate-500"><div className="rounded-2xl bg-slate-100 px-4 py-3"><span className="font-semibold text-slate-800">{medicines.length}</span> medicines listed</div><div className="rounded-2xl bg-teal-50 px-4 py-3 text-teal-700"><span className="font-semibold">{pendingReminders}</span> doses pending today</div></div></div>

            {medicines.length === 0 ? (
              <Card className="rounded-[28px] border border-slate-200 shadow-sm"><CardContent className="flex flex-col items-center py-14"><div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-slate-100"><Pill className="h-10 w-10 text-slate-300" /></div><h3 className="text-xl font-semibold text-slate-700">No medicines added yet</h3><p className="mt-2 max-w-md text-center text-sm text-slate-500">Start by adding your first medicine so reminders and adherence tracking can work for you.</p><Button onClick={() => setIsAddDialogOpen(true)} className="mt-5 bg-slate-800 hover:bg-slate-900 text-white">Add Medicine</Button></CardContent></Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {medicines.map((medicine) => (
                  <Card key={medicine.id} className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"><div className="h-2 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500" /><CardHeader className="bg-gradient-to-b from-slate-50 to-white pb-3"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 transition-colors group-hover:bg-teal-200"><Pill className="h-5 w-5 text-teal-600" /></div><div><CardTitle className="text-lg text-slate-800">{medicine.name}</CardTitle>{medicine.doctorName && <CardDescription className="text-xs text-slate-500">Prescribed by Dr. {medicine.doctorName}</CardDescription>}</div></div><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => handleEditMedicine(medicine)} className="h-8 w-8 hover:bg-slate-200"><Pencil className="h-4 w-4 text-slate-500" /></Button><Button variant="ghost" size="icon" onClick={() => handleDeleteMedicine(medicine.id)} className="h-8 w-8 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-500" /></Button></div></div></CardHeader><CardContent className="space-y-4 pt-4"><div className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Intake Times</p><div className="flex flex-wrap gap-2">{medicine.intakeTimes.map((time) => (<Badge key={time} className="border-slate-200 bg-white px-2 py-1 text-slate-700 shadow-sm"><Clock className="mr-1 h-3 w-3" />{time}</Badge>))}</div></div><div className="flex items-center justify-between gap-3"><span className={`rounded-full px-3 py-1 text-xs font-medium ${medicine.isLifetime ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{medicine.isLifetime ? "Lifetime" : `${medicine.duration} days`}</span>{medicine.notes && <span className="max-w-[140px] truncate text-xs text-slate-400">{medicine.notes}</span>}</div></CardContent></Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reminders" className="mt-6">
            <div className="mb-5 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-medium text-teal-600">Daily timeline</p><h2 className="mt-1 text-2xl font-semibold text-slate-900">Today's Reminders</h2><p className="mt-1 text-sm text-slate-500">See what is due, what is done, and what still needs attention.</p></div><div className="flex gap-3"><div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700"><span className="font-semibold">{pendingReminders}</span> pending</div><div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"><span className="font-semibold">{takenReminders}</span> completed</div></div></div>

            {reminders.length === 0 ? (
              <Card className="rounded-[28px] border border-slate-200 shadow-sm"><CardContent className="flex flex-col items-center py-12"><Bell className="mb-4 h-14 w-14 text-slate-300" /><h3 className="text-lg font-semibold text-slate-500">No reminders scheduled for today</h3></CardContent></Card>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <Card key={reminder.id} className="rounded-[24px] border border-slate-200 shadow-sm transition-all hover:shadow-md"><CardContent className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"><Bell className="h-5 w-5 text-slate-600" /></div><div><h3 className="font-semibold text-slate-800">{reminder.medicineName}</h3><p className="text-sm text-slate-500">{reminder.scheduledTime}</p></div></div><div className="flex gap-2"><Badge className={getStatusColor(reminder.status)}>{getStatusText(reminder.status)}</Badge>{reminder.status === "pending" && <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleMarkTaken(reminder.id)}><Check className="mr-1 h-4 w-4" />Take</Button>}</div></CardContent></Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="guidelines" className="mt-6">
            <div className="mb-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-medium text-teal-600">Helpful reference</p><h2 className="mt-1 text-2xl font-semibold text-slate-900">Medication Guidelines</h2><p className="mt-1 text-sm text-slate-500">Quick reminders that support safer medicine use and more consistent adherence habits.</p></div>

            <div className="grid gap-4 md:grid-cols-2">
              {guidelineCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.title} className={`rounded-[26px] border border-slate-200 bg-gradient-to-br ${card.surfaceClassName} shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}><div className={`h-1 rounded-t-[26px] ${card.accentClassName}`} /><CardHeader><CardTitle className="flex items-center gap-3 text-slate-800"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm"><Icon className={`h-5 w-5 ${card.iconClassName}`} /></div>{card.title}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-slate-600">{card.items.map((item) => (<div key={item} className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3"><span className={`mt-1 h-2 w-2 rounded-full ${card.accentClassName}`} /><p>{item}</p></div>))}</CardContent></Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="report" className="mt-6">
            <div className="mb-5 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-medium text-teal-600">Progress insight</p><h2 className="mt-1 text-2xl font-semibold text-slate-900">15-Day Report</h2><p className="mt-1 text-sm text-slate-500">A simple view of completed and missed doses over the recent two weeks.</p></div>{summary && <Button onClick={downloadReport} className="bg-slate-800 hover:bg-slate-900 text-white"><Download className="mr-1 h-4 w-4" />Download</Button>}</div>

            {summary && (
              <>
                <div className="mb-6 grid gap-4 md:grid-cols-4">
                  <Card className="rounded-[24px] bg-slate-800 text-white shadow-sm"><CardContent className="pt-5"><p className="text-slate-300">Adherence</p><p className="text-3xl font-bold">{summary.adherenceRate}%</p></CardContent></Card>
                  <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm"><CardContent className="pt-5"><p className="text-slate-500">Total</p><p className="text-2xl font-bold text-slate-800">{summary.totalDoses}</p></CardContent></Card>
                  <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm"><CardContent className="pt-5"><p className="text-emerald-600">Taken</p><p className="text-2xl font-bold text-emerald-600">{summary.takenDoses}</p></CardContent></Card>
                  <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm"><CardContent className="pt-5"><p className="text-red-500">Missed</p><p className="text-2xl font-bold text-red-500">{summary.missedDoses}</p></CardContent></Card>
                </div>

                <Card className="rounded-[28px] border border-slate-200 bg-white shadow-sm"><CardHeader><CardTitle className="text-lg text-slate-800">Adherence Overview</CardTitle><CardDescription>Visual split between taken and missed doses.</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: "Taken", value: summary.takenDoses }, { name: "Missed", value: summary.missedDoses }]} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#10b981" /><Cell fill="#ef4444" /></Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></CardContent></Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="dosage" className="mt-6">
            <div className="mb-6 rounded-[28px] bg-slate-800 p-6 shadow-lg shadow-slate-900/10"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-700"><Calculator className="h-6 w-6 text-teal-400" /></div><div><h2 className="text-xl font-bold text-white">Dosage Calculation</h2><p className="text-sm text-slate-300">Use the same module styling while keeping dosage tools easy to scan and verify.</p></div></div></div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"><div className="h-1 bg-teal-500" /><CardHeader className="bg-slate-50"><CardTitle className="flex items-center gap-2 text-slate-800"><Pill className="h-5 w-5 text-teal-500" />Enter Values</CardTitle></CardHeader><CardContent className="p-6"><div className="grid gap-4 md:grid-cols-2"><div className="md:col-span-2"><Label className="font-medium text-slate-700">Calculation Method</Label><select className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={calcMethod} onChange={(e) => setCalcMethod(e.target.value)}><option value="basic">Basic Dosage</option><option value="weight">Weight-Based (mg/kg)</option><option value="iv">IV Flow Rate</option><option value="bsa">BSA-Based</option></select></div><div className="md:col-span-2"><Label className="font-medium text-slate-700">Drug Name *</Label><Input value={calcInputs.drugName} onChange={(e) => setCalcInputs((prev) => ({ ...prev, drugName: e.target.value }))} placeholder="Enter drug name" className="mt-1" /></div>{calcMethod === "basic" && <><div><Label className="font-medium text-slate-700">Desired Dose (mg)</Label><Input type="number" value={calcInputs.desiredDose} onChange={(e) => setCalcInputs((prev) => ({ ...prev, desiredDose: e.target.value }))} placeholder="e.g., 250" className="mt-1" /></div><div><Label className="font-medium text-slate-700">Available Dose (mg)</Label><Input type="number" value={calcInputs.availableDose} onChange={(e) => setCalcInputs((prev) => ({ ...prev, availableDose: e.target.value }))} placeholder="e.g., 100" className="mt-1" /></div><div className="md:col-span-2"><Label className="font-medium text-slate-700">Quantity</Label><Input type="number" value={calcInputs.quantity} onChange={(e) => setCalcInputs((prev) => ({ ...prev, quantity: e.target.value }))} placeholder="e.g., 1 tablet" className="mt-1" /></div></>}{calcMethod === "weight" && <><div><Label className="font-medium text-slate-700">Weight (kg)</Label><Input type="number" value={calcInputs.weight} onChange={(e) => setCalcInputs((prev) => ({ ...prev, weight: e.target.value }))} placeholder="e.g., 70" className="mt-1" /></div><div><Label className="font-medium text-slate-700">Dose per kg (mg/kg)</Label><Input type="number" value={calcInputs.dosePerKg} onChange={(e) => setCalcInputs((prev) => ({ ...prev, dosePerKg: e.target.value }))} placeholder="e.g., 10" className="mt-1" /></div></>}{calcMethod === "iv" && <><div><Label className="font-medium text-slate-700">Volume (mL)</Label><Input type="number" value={calcInputs.volume} onChange={(e) => setCalcInputs((prev) => ({ ...prev, volume: e.target.value }))} placeholder="e.g., 500" className="mt-1" /></div><div><Label className="font-medium text-slate-700">Drop Factor (drops/mL)</Label><Input type="number" value={calcInputs.dropFactor} onChange={(e) => setCalcInputs((prev) => ({ ...prev, dropFactor: e.target.value }))} placeholder="e.g., 15" className="mt-1" /></div><div><Label className="font-medium text-slate-700">Time (minutes)</Label><Input type="number" value={calcInputs.timeMinutes} onChange={(e) => setCalcInputs((prev) => ({ ...prev, timeMinutes: e.target.value }))} placeholder="e.g., 60" className="mt-1" /></div></>}{calcMethod === "bsa" && <><div><Label className="font-medium text-slate-700">Patient BSA (m2)</Label><Input type="number" value={calcInputs.bsa} onChange={(e) => setCalcInputs((prev) => ({ ...prev, bsa: e.target.value }))} placeholder="e.g., 1.8" className="mt-1" /></div><div><Label className="font-medium text-slate-700">Adult Dose (mg)</Label><Input type="number" value={calcInputs.adultDose} onChange={(e) => setCalcInputs((prev) => ({ ...prev, adultDose: e.target.value }))} placeholder="e.g., 100" className="mt-1" /></div></>}</div><Button onClick={calculateMedicationDosage} className="mt-6 w-full bg-teal-500 py-2.5 font-semibold text-white hover:bg-teal-600"><Calculator className="mr-2 h-4 w-4" />Calculate Dosage</Button></CardContent></Card>
              </div>

              <div><Card className="sticky top-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"><div className="h-1 bg-amber-500" /><CardHeader className="bg-slate-50"><CardTitle className="text-base text-slate-800">Formulas</CardTitle></CardHeader><CardContent className="space-y-3 p-4"><div className="rounded-lg bg-slate-50 p-3"><p className="text-sm font-semibold text-slate-800">Basic</p><p className="text-xs text-slate-500">Dose = (Desired / Available) x Quantity</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="text-sm font-semibold text-slate-800">Weight-Based</p><p className="text-xs text-slate-500">Dose = Weight x Dose/kg</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="text-sm font-semibold text-slate-800">IV Flow Rate</p><p className="text-xs text-slate-500">Rate = (Volume x Drop factor) / Time</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="text-sm font-semibold text-slate-800">BSA</p><p className="text-xs text-slate-500">Dose = (BSA / 1.73) x Adult dose</p></div></CardContent></Card></div>
            </div>

            {dosageCalcResult && <Card className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"><div className="h-1 bg-teal-500" /><CardHeader className="bg-teal-50"><CardTitle className="flex items-center gap-2 text-slate-800"><Calculator className="h-5 w-5 text-teal-500" />Result: {dosageCalcResult.drugName}</CardTitle><CardDescription>{dosageCalcResult.method}</CardDescription></CardHeader><CardContent className="p-6"><div className="mb-4 rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 p-6 text-center"><p className="text-sm font-medium text-teal-600">Final Calculated Dose</p><p className="mt-1 text-3xl font-bold text-teal-700">{dosageCalcResult.finalDose} <span className="text-lg">{dosageCalcResult.unit}</span></p></div><div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">Calculation Steps</h4><pre className="whitespace-pre-wrap font-mono text-sm text-slate-600">{dosageCalcResult.steps.join("\n")}</pre></div><div className="mt-4 rounded-r-lg border-l-4 border-amber-500 bg-amber-50 p-3"><p className="text-sm text-amber-800"><AlertTriangle className="mr-1 inline h-4 w-4" /><strong>Disclaimer:</strong> Verify with official prescribing information.</p></div></CardContent></Card>}

            {calcHistory.length > 0 && <Card className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"><div className="h-1 bg-slate-400" /><CardHeader className="bg-slate-50"><CardTitle className="text-base text-slate-800">Recent Calculations</CardTitle></CardHeader><CardContent className="p-0"><div className="max-h-64 overflow-auto">{calcHistory.map((calculation, index) => (<div key={index} className="border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 last:border-0"><div className="flex items-center justify-between"><span className="font-medium text-slate-800">{calculation.drugName}</span><Badge className="bg-slate-600">{calculation.calculationMethod}</Badge></div><p className="mt-1 text-sm text-slate-600">{calculation.result} {calculation.unit}</p><p className="text-xs text-slate-400">{new Date(calculation.createdAt).toLocaleString()}</p></div>))}</div></CardContent></Card>}
          </TabsContent>
        </Tabs>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader><DialogTitle>Edit Medicine</DialogTitle></DialogHeader>
            {editingMedicine && <form onSubmit={handleUpdateMedicine} className="space-y-4"><div><Label>Name *</Label><Input value={editingMedicine.name} onChange={(e) => setEditingMedicine((prev) => prev ? { ...prev, name: e.target.value } : null)} required /></div><div><Label>Doctor</Label><Input value={editingMedicine.doctorName || ""} onChange={(e) => setEditingMedicine((prev) => prev ? { ...prev, doctorName: e.target.value || null } : null)} /></div><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"><Checkbox checked={editingMedicine.isLifetime} onCheckedChange={(checked) => setEditingMedicine((prev) => prev ? { ...prev, isLifetime: checked as boolean } : null)} /><Label>Lifetime medicine</Label></div>{!editingMedicine.isLifetime && <div><Label>Duration (days)</Label><Input type="number" value={editingMedicine.duration} onChange={(e) => setEditingMedicine((prev) => prev ? { ...prev, duration: +e.target.value || 1 } : null)} /></div>}<div><Label>Intake times</Label><div className="mt-2 space-y-2">{editingMedicine.intakeTimes.map((time, index) => (<div key={index} className="flex gap-2"><Input type="time" value={time} onChange={(e) => updateEditIntakeTime(index, e.target.value)} />{editingMedicine.intakeTimes.length > 1 && <Button type="button" variant="outline" onClick={() => removeEditIntakeTime(index)}><X className="h-4 w-4" /></Button>}</div>))}</div><Button type="button" variant="outline" onClick={addEditIntakeTime} className="mt-2 w-full border-dashed">+ Add Time</Button></div><Button type="submit" className="w-full bg-slate-800 hover:bg-slate-900" disabled={saving}>{saving ? "Updating..." : "Update Medicine"}</Button></form>}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
