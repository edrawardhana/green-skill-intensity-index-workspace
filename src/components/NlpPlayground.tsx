import React, { useState } from "react";
import { JobVacancy, Skill } from "../types";
import {
  Cpu,
  Sparkles,
  Plus,
  AlertCircle,
  CheckCircle2,
  Award,
  Zap,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface NlpPlaygroundProps {
  cleanedJobs: JobVacancy[];
  onProcessAllJobs: (processedJobs: JobVacancy[]) => void;
  processedJobs: JobVacancy[];
}

export default function NlpPlayground({
  cleanedJobs,
  onProcessAllJobs,
  processedJobs,
}: NlpPlaygroundProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");

  const [isProcessingSingle, setIsProcessingSingle] = useState(false);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [apiProvider, setApiProvider] = useState<"gemini" | "local">("local");

  // Single job result state
  const [singleResult, setSingleResult] = useState<{
    title: string;
    company: string;
    skills: Skill[];
    intensityScore: number;
    provider: string;
  } | null>(null);

  const [activeNlpMode, setActiveNlpMode] = useState<"preset" | "custom">(
    "preset",
  );

  // Load a preset job into custom inputs
  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedJobId(id);
    const job = cleanedJobs.find((j) => j.job_id === id);
    if (job) {
      setCustomTitle(job.job_title);
      setCustomDesc(job.job_description);
    }
  };

  const calculateIntensityScore = (skills: Skill[]): number => {
    if (skills.length === 0) return 0;

    // Custom Weighted Formula based on the Planning PDF
    // Direct Green = weight 1.5, Transition = weight 1.2, Indirect = weight 1.0, General = weight 0.1 (non-green)
    const greenWeights = skills.reduce((acc, skill) => {
      if (skill.category === "direct") return acc + 1.5;
      if (skill.category === "transition") return acc + 1.2;
      if (skill.category === "indirect") return acc + 1.0;
      return acc;
    }, 0);

    const totalWeight = skills.reduce((acc, skill) => {
      if (skill.category === "direct") return acc + 1.5;
      if (skill.category === "transition") return acc + 1.2;
      if (skill.category === "indirect") return acc + 1.0;
      return acc + 0.8; // general weights
    }, 0);

    const score = (greenWeights / totalWeight) * 100;
    return Math.min(100, Math.round(score));
  };

  const runNlpExtraction = async (
    title: string,
    description: string,
  ): Promise<{ skills: Skill[]; provider: string }> => {
    try {
      const response = await fetch("/api/nlp/extract-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: title,
          job_description: description,
        }),
      });
      const data = await response.json();
      if (data.success) {
        return {
          skills: data.skills,
          provider: data.provider,
        };
      }
      throw new Error("API response failed");
    } catch (err) {
      console.error("NLP Error:", err);
      return {
        skills: [],
        provider: "failed-fallback",
      };
    }
  };

  const handleProcessSingle = async () => {
    const title =
      activeNlpMode === "preset"
        ? cleanedJobs.find((j) => j.job_id === selectedJobId)?.job_title || ""
        : customTitle;
    const desc =
      activeNlpMode === "preset"
        ? cleanedJobs.find((j) => j.job_id === selectedJobId)
            ?.job_description || ""
        : customDesc;

    if (!title.trim() || !desc.trim()) return;

    setIsProcessingSingle(true);
    const result = await runNlpExtraction(title, desc);

    const score = calculateIntensityScore(result.skills);
    setSingleResult({
      title,
      company:
        activeNlpMode === "preset"
          ? cleanedJobs.find((j) => j.job_id === selectedJobId)?.company ||
            "Sektor Kustom"
          : "PT Industri Kustom",
      skills: result.skills,
      intensityScore: score,
      provider: result.provider,
    });
    setIsProcessingSingle(false);
  };

  const handleProcessAllDataset = async () => {
    setIsProcessingAll(true);
    const processedList: JobVacancy[] = [];

    for (let i = 0; i < cleanedJobs.length; i++) {
      const job = cleanedJobs[i];
      // Run extraction for each
      const res = await runNlpExtraction(job.job_title, job.job_description);
      const intensity = calculateIntensityScore(res.skills);

      processedList.push({
        ...job,
        extracted_skills: res.skills,
        green_intensity_score: intensity,
      });
    }

    onProcessAllJobs(processedList);
    setIsProcessingAll(false);
  };

  const getIntensityBadgeColor = (score: number) => {
    if (score >= 75)
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 45) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 15) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  const getIntensityLevel = (score: number) => {
    if (score >= 75) return "Core Green Role (Intensitas Ekstrim)";
    if (score >= 45) return "High Green Transition (Transisi Tinggi)";
    if (score >= 15) return "Moderate Green Transition (Transisi Sedang)";
    return "Conventional Role (Intensitas Rendah/Nihil)";
  };

  return (
    <div className="space-y-6" id="nlp-playground-root">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-emerald-600" />
          Fase 3: Ekstraksi & Pemrosesan NLP (Green Intensity Scoring)
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Kekuatan utama riset ini terletak pada ekstraksi skill berbasis teks (
          <strong className="text-emerald-700">NLP Skill Extraction</strong>)
          menggunakan model kecerdasan buatan. Kami memetakan kompetensi yang
          terdeteksi ke Green Ontology dan menghitung{" "}
          <strong className="text-emerald-700">
            Green Skill Intensity Index
          </strong>{" "}
          untuk setiap lowongan.
        </p>
      </div>

      {cleanedJobs.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-slate-600 font-semibold text-sm">
            Tidak Ada Dataset Bersih untuk Diproses
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Harap jalankan Fase 2: Pembersihan Data terlebih dahulu agar teks
            terstandarisasi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section Left: Single Job NLP Sandbox */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              Single Job NLP Sandbox
            </h3>

            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveNlpMode("preset")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeNlpMode === "preset"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Gunakan Preset Bersih
              </button>
              <button
                onClick={() => {
                  setActiveNlpMode("custom");
                  setSelectedJobId("");
                  setCustomTitle("");
                  setCustomDesc("");
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeNlpMode === "custom"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Ketik Deskripsi Kustom
              </button>
            </div>

            {activeNlpMode === "preset" ? (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 block">
                  Pilih Lowongan dari Dataset Bersih
                </label>
                <select
                  value={selectedJobId}
                  onChange={handleSelectPreset}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih Lowongan Kerja --</option>
                  {cleanedJobs.map((job) => (
                    <option key={job.job_id} value={job.job_id}>
                      [{job.source}] {job.job_title} - {job.company}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 block">
                    Judul Pekerjaan
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Manager Pengolahan Limbah B3"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 block">
                    Deskripsi Pekerjaan / Kualifikasi
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tempel deskripsi tugas atau syarat keahlian di sini..."
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleProcessSingle}
              disabled={
                isProcessingSingle ||
                (activeNlpMode === "preset" && !selectedJobId) ||
                (activeNlpMode === "custom" && !customTitle.trim())
              }
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              {isProcessingSingle ? (
                <>
                  <Cpu className="w-3.5 h-3.5 animate-spin" />
                  NLP Parsing Sedang Berjalan...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  Mulai Ekstraksi NLP
                </>
              )}
            </button>

            <div className="border-t border-slate-100 pt-4 space-y-3.5">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                Pemrosesan Massal (Bulk Dataset Engine)
              </h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Menghitung skor indeks intensitas kompetensi hijau secara massal
                untuk seluruh baris dataset yang telah dibersihkan. Hasil ini
                akan digunakan untuk visualisasi dashboard dan analisis trend di
                Fase 4.
              </p>

              {!isProcessingAll ? (
                <button
                  onClick={handleProcessAllDataset}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                  Proses Seluruh Dataset ({cleanedJobs.length} Lowongan)
                </button>
              ) : (
                <div className="py-2.5 bg-slate-100 text-slate-500 font-medium text-xs rounded-xl flex items-center justify-center gap-2">
                  <Cpu className="w-4 h-4 animate-spin text-emerald-600" />
                  Memproses {cleanedJobs.length} Lowongan Kerja...
                </div>
              )}

              {processedJobs.length > 0 && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-2 items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Sukses memproses {processedJobs.length} lowongan massal!
                    Buka Fase 4: Analisis & Dashboard untuk grafik lengkap.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section Right: Result Viewer */}
          <div className="lg:col-span-7 space-y-4">
            {singleResult ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                      Model Hasil:{" "}
                      {singleResult.provider === "gemini-3.5-flash"
                        ? "Gemini AI NLP"
                        : "Local RegEx Fallback"}
                    </span>
                    <h3 className="font-bold text-slate-800 text-lg mt-1.5 leading-tight">
                      {singleResult.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {singleResult.company}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Green Intensity Index
                    </span>
                    <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
                      {singleResult.intensityScore}%
                    </span>
                  </div>
                </div>

                {/* Score Level Meter */}
                <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600">
                      Klasifikasi Klasis
                    </span>
                    <span className="font-bold text-slate-800">
                      {getIntensityLevel(singleResult.intensityScore)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        singleResult.intensityScore >= 75
                          ? "bg-emerald-500"
                          : singleResult.intensityScore >= 45
                            ? "bg-blue-500"
                            : singleResult.intensityScore >= 15
                              ? "bg-amber-500"
                              : "bg-slate-400"
                      }`}
                      style={{ width: `${singleResult.intensityScore}%` }}
                    />
                  </div>
                </div>

                {/* Extracted Skills List */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                    Kompetensi yang Terdeteksi (Skills Extracted)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[180px] overflow-y-auto pr-1">
                    {singleResult.skills.map((skill, idx) => {
                      const isDirect = skill.category === "direct";
                      const isIndirect = skill.category === "indirect";
                      const isTransition = skill.category === "transition";

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex flex-col justify-between ${
                            isDirect
                              ? "bg-emerald-50/40 border-emerald-100/80 text-emerald-900"
                              : isIndirect
                                ? "bg-blue-50/40 border-blue-100/80 text-blue-900"
                                : isTransition
                                  ? "bg-amber-50/40 border-amber-100/80 text-amber-900"
                                  : "bg-slate-50 border-slate-200/80 text-slate-800"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs truncate max-w-[150px]">
                              {skill.name}
                            </span>
                            <span
                              className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded uppercase ${
                                isDirect
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isIndirect
                                    ? "bg-blue-100 text-blue-800"
                                    : isTransition
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {skill.category}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">
                              Confidence AI
                            </span>
                            <span className="font-semibold">
                              {(skill.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {singleResult.skills.length === 0 && (
                      <p className="text-xs text-slate-400 col-span-full italic text-center py-4">
                        Tidak ada kompetensi khusus yang terdeteksi dalam
                        deskripsi pekerjaan ini.
                      </p>
                    )}
                  </div>
                </div>

                {/* Formula Explanation */}
                <div className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3 flex gap-2 items-start">
                  <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-500 block">
                      Cara Indeks Dihitung:
                    </span>
                    Indeks dihitung dengan membandingkan bobot green skills
                    (Direct = 1.5, Transition = 1.2, Indirect = 1.0) dengan
                    total keseluruhan kompetensi yang tertulis pada lowongan
                    kerja.
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col justify-center items-center text-center h-full min-h-[300px]">
                <Cpu className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
                <h4 className="font-semibold text-slate-700 text-sm">
                  Menunggu Ekstraksi Sandbox
                </h4>
                <p className="text-slate-400 text-xs max-w-sm mt-1">
                  Pilih lowongan preset bersih di sebelah kiri atau ketik
                  deskripsi pekerjaan kustom Anda sendiri untuk memulai analisis
                  NLP.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
