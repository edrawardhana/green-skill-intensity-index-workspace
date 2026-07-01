import React, { useState } from "react";
import { JobVacancy, OntologyTerm } from "./types";
import { INITIAL_ONTOLOGY } from "./data/mockJobs";
import {
  BookOpen,
  Database,
  ShieldCheck,
  Cpu,
  TrendingUp,
  FileText,
  ChevronRight,
  CheckCircle2,
  Award,
  Zap,
  Sparkles,
} from "lucide-react";

// Import sub-components
import OntologyStudio from "./components/OntologyStudio";
import ScraperSimulator from "./components/ScraperSimulator";
import DataCleaningStudio from "./components/DataCleaningStudio";
import NlpPlayground from "./components/NlpPlayground";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ResearchPaperExporter from "./components/ResearchPaperExporter";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "fase0" | "fase1" | "fase2" | "fase3" | "fase4" | "fase6"
  >("fase0");

  // Shared States
  const [ontology, setOntology] = useState<OntologyTerm[]>(INITIAL_ONTOLOGY);
  const [rawJobs, setRawJobs] = useState<JobVacancy[]>([]);
  const [cleanedJobs, setCleanedJobs] = useState<JobVacancy[]>([]);
  const [processedJobs, setProcessedJobs] = useState<JobVacancy[]>([]);

  // Function to add custom ontology terms
  const handleAddOntologyTerm = (newTerm: OntologyTerm) => {
    setOntology((prev) => [...prev, newTerm]);
  };

  // Progression steps state
  const isOntologyReady = ontology.length > 0;
  const isDataScraped = rawJobs.length > 0;
  const isDataCleaned = cleanedJobs.length > 0;
  const isNlpProcessed = processedJobs.length > 0;

  // Helper for tab status labels
  const getTabStatusLabel = () => {
    switch (activeTab) {
      case "fase0":
        return "Fase 0: Ontologi Aktif";
      case "fase1":
        return "Fase 1: Scraping Aktif";
      case "fase2":
        return "Fase 2: Pembersihan Aktif";
      case "fase3":
        return "Fase 3: NLP Ekstraksi Aktif";
      case "fase4":
        return "Fase 4: Dashboard Aktif";
      case "fase6":
        return "Fase 6: Paper Generator Aktif";
      default:
        return "Workspace Aktif";
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50/50 font-sans antialiased text-slate-800 flex flex-col"
      id="app-root"
    >
      {/* Sleek Theme Header */}
      <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-12 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-cyan-500 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.55)]" />
            <div className="absolute inset-[2px] rounded-[14px] bg-slate-950/95 flex items-center justify-center">
              <span className="text-base font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-white to-cyan-300">
                G
              </span>
            </div>
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-cyan-400 shadow-lg ring-2 ring-white" />
          </div>
          <div>
            <div className="font-extrabold text-base md:text-lg tracking-tight text-slate-900">
              Green Skill Intensity Index
            </div>
            <div className="text-[11px] text-slate-500 font-medium md:block hidden">
              Workspace Riset Terpadu 2026
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-500/20 text-emerald-700 animate-pulse">
            {getTabStatusLabel()}
          </div>
        </div>
      </header>

      {/* Main Grid Container matching Sleek Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-white border-r border-slate-200 p-6 flex flex-col gap-6 justify-between lg:h-[calc(100vh-72px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Sidebar Stats block */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Target Data
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {isDataScraped ? rawJobs.length : "3.500"}
                </span>
                <span className="text-xs text-emerald-600 font-semibold">
                  {isDataScraped ? "Telah Diunduh" : "Target Lowongan"}
                </span>
              </div>

              <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Keywords Ontology
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {ontology.length}
                </span>
                <span className="text-xs text-emerald-600 font-semibold">
                  Skills Teridentifikasi
                </span>
              </div>

              <div className="flex flex-col gap-1 pb-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Cakupan Wilayah
                </span>
                <span className="text-xl font-extrabold text-slate-900">
                  Jawa Timur
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Surabaya, Gresik, Sidoarjo, dsb.
                </span>
              </div>
            </div>
          </div>

          {/* Dark tech stack panel from Sleek HTML */}
          <div className="bg-slate-900 text-white rounded-xl p-4 border-none shadow-md mt-6 lg:mt-auto space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Tech Stack Utama
            </div>
            <div className="text-xs text-slate-300 leading-relaxed space-y-1">
              <p>• React 18 & Vite SPA</p>
              <p>• Gemini AI NLP Engine</p>
              <p>• Tailwind utility classes</p>
              <p>• Research paper compiler</p>
            </div>
            <div className="border-t border-slate-800 pt-2 mt-2">
              <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">
                Peneliti
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">
                wardhanaedra@gmail.com
              </span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="p-6 md:p-8 space-y-6 overflow-y-auto lg:h-[calc(100vh-72px)] bg-slate-50/50">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h2
              className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Rencana Pengembangan & Simulasi Laboratorium
            </h2>
            <div className="text-xs text-slate-500 font-medium">
              Minggu ke-3 dari 8 • Terintegrasi AI
            </div>
          </div>

          {/* Interactive Phase Grid (Tabs replaced with beautiful Phase Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Phase Card 0 */}
            <button
              onClick={() => setActiveTab("fase0")}
              className={`text-left bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-3 transition-all hover:scale-[1.01] ${
                activeTab === "fase0"
                  ? "border-2 border-emerald-500 ring-2 ring-emerald-500/10"
                  : "border-slate-200"
              } ${isOntologyReady ? "bg-emerald-50/10" : ""}`}
            >
              <div className="flex justify-between items-start w-full">
                <span
                  className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${
                    isOntologyReady
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  0
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {isOntologyReady ? "Selesai" : "Siap"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">
                  Fase 0: Green Ontology
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Setup ontology green skills, keyword, dan pilar kompetensi
                  hijau.
                </p>
              </div>
              <div className="flex gap-1.5 mt-auto pt-2">
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  Ontology
                </span>
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  Standard
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: isOntologyReady
                      ? "100%"
                      : activeTab === "fase0"
                        ? "50%"
                        : "0%",
                  }}
                />
              </div>
            </button>

            {/* Phase Card 1 */}
            <button
              onClick={() => setActiveTab("fase1")}
              className={`text-left bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-3 transition-all hover:scale-[1.01] ${
                activeTab === "fase1"
                  ? "border-2 border-emerald-500 ring-2 ring-emerald-500/10"
                  : "border-slate-200"
              } ${isDataScraped ? "bg-emerald-50/10" : ""}`}
            >
              <div className="flex justify-between items-start w-full">
                <span
                  className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${
                    isDataScraped
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  1
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {isDataScraped
                    ? "Selesai"
                    : activeTab === "fase1"
                      ? "Sedang Jalan"
                      : "Belum Mulai"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">
                  Fase 1: Scraper Simulator
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Simulasi web scraping otomatis dari LinkedIn, JobStreet, &
                  Glints.
                </p>
              </div>
              <div className="flex gap-1.5 mt-auto pt-2">
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  Selenium
                </span>
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  Glints
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: isDataScraped
                      ? "100%"
                      : activeTab === "fase1"
                        ? "50%"
                        : "0%",
                  }}
                />
              </div>
            </button>

            {/* Phase Card 2 */}
            <button
              onClick={() => setActiveTab("fase2")}
              className={`text-left bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-3 transition-all hover:scale-[1.01] ${
                activeTab === "fase2"
                  ? "border-2 border-emerald-500 ring-2 ring-emerald-500/10"
                  : "border-slate-200"
              } ${isDataCleaned ? "bg-emerald-50/10" : ""}`}
            >
              <div className="flex justify-between items-start w-full">
                <span
                  className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${
                    isDataCleaned
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  2
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {isDataCleaned
                    ? "Selesai"
                    : activeTab === "fase2"
                      ? "Sedang Jalan"
                      : "Belum Mulai"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">
                  Fase 2: Pembersihan Data
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Pembersihan data duplikasi, normalisasi teks, dan format
                  CSV/Parquet.
                </p>
              </div>
              <div className="flex gap-1.5 mt-auto pt-2">
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  Pandas
                </span>
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  Cleaning
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: isDataCleaned
                      ? "100%"
                      : activeTab === "fase2"
                        ? "50%"
                        : "0%",
                  }}
                />
              </div>
            </button>

            {/* Phase Card 3 */}
            <button
              onClick={() => setActiveTab("fase3")}
              className={`text-left bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-3 transition-all hover:scale-[1.01] ${
                activeTab === "fase3"
                  ? "border-2 border-emerald-500 ring-2 ring-emerald-500/10"
                  : "border-slate-200"
              } ${isNlpProcessed ? "bg-emerald-50/10" : ""}`}
            >
              <div className="flex justify-between items-start w-full">
                <span
                  className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${
                    isNlpProcessed
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  3
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {isNlpProcessed
                    ? "Selesai"
                    : activeTab === "fase3"
                      ? "Sedang Jalan"
                      : "Belum Mulai"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">
                  Fase 3: NLP Ekstraksi
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Mapping skill ke ontology menggunakan NLP Gemini model.
                </p>
              </div>
              <div className="flex gap-1.5 mt-auto pt-2">
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  NER AI
                </span>
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  Index-Score
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: isNlpProcessed
                      ? "100%"
                      : activeTab === "fase3"
                        ? "50%"
                        : "0%",
                  }}
                />
              </div>
            </button>

            {/* Phase Card 4 */}
            <button
              onClick={() => setActiveTab("fase4")}
              className={`text-left bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-3 transition-all hover:scale-[1.01] ${
                activeTab === "fase4"
                  ? "border-2 border-emerald-500 ring-2 ring-emerald-500/10"
                  : "border-slate-200"
              } ${isNlpProcessed ? "bg-emerald-50/10" : ""}`}
            >
              <div className="flex justify-between items-start w-full">
                <span
                  className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${
                    isNlpProcessed
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  4
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {isNlpProcessed
                    ? "Selesai"
                    : activeTab === "fase4"
                      ? "Sedang Jalan"
                      : "Belum Mulai"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">
                  Fase 4: Analisis & Dashboard
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Analisis korelasi gaji, industri, dan intensitas green skill.
                </p>
              </div>
              <div className="flex gap-1.5 mt-auto pt-2">
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  Stats
                </span>
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  Visualization
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: isNlpProcessed
                      ? "100%"
                      : activeTab === "fase4"
                        ? "50%"
                        : "0%",
                  }}
                />
              </div>
            </button>

            {/* Phase Card 6 */}
            <button
              onClick={() => setActiveTab("fase6")}
              className={`text-left bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-3 transition-all hover:scale-[1.01] ${
                activeTab === "fase6"
                  ? "border-2 border-emerald-500 ring-2 ring-emerald-500/10"
                  : "border-slate-200"
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span
                  className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${
                    isNlpProcessed
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  6
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {activeTab === "fase6" ? "Sedang Jalan" : "Siap Draft"}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">
                  Fase 6: Paper Generator
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Penyusunan draft paper ilmiah dan eksportir format Markdown.
                </p>
              </div>
              <div className="flex gap-1.5 mt-auto pt-2">
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  LaTeX
                </span>
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  Export
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: activeTab === "fase6" ? "100%" : "0%" }}
                />
              </div>
            </button>
          </div>

          {/* Active Workspace Area */}
          <div className="bg-slate-100/50 rounded-2xl p-0.5">
            <div className="transition-all duration-300">
              {activeTab === "fase0" && (
                <OntologyStudio
                  ontology={ontology}
                  onAddTerm={handleAddOntologyTerm}
                />
              )}

              {activeTab === "fase1" && (
                <ScraperSimulator
                  rawJobs={rawJobs}
                  onScrapingComplete={setRawJobs}
                />
              )}

              {activeTab === "fase2" && (
                <DataCleaningStudio
                  rawJobs={rawJobs}
                  cleanedJobs={cleanedJobs}
                  onCleaningComplete={setCleanedJobs}
                />
              )}

              {activeTab === "fase3" && (
                <NlpPlayground
                  cleanedJobs={cleanedJobs}
                  processedJobs={processedJobs}
                  onProcessAllJobs={setProcessedJobs}
                />
              )}

              {activeTab === "fase4" && (
                <AnalyticsDashboard processedJobs={processedJobs} />
              )}

              {activeTab === "fase6" && (
                <ResearchPaperExporter
                  processedJobs={processedJobs}
                  rawJobs={rawJobs}
                  ontology={ontology}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Sleek Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 shrink-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} Green Skill Intensity Index
            Workspace. Created by Wardhana Edra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
