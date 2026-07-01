import React, { useState } from "react";
import { CleaningConfig, JobVacancy } from "../types";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Settings2,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface DataCleaningStudioProps {
  rawJobs: JobVacancy[];
  onCleaningComplete: (jobs: JobVacancy[]) => void;
  cleanedJobs: JobVacancy[];
}

export default function DataCleaningStudio({
  rawJobs,
  onCleaningComplete,
  cleanedJobs,
}: DataCleaningStudioProps) {
  const [config, setConfig] = useState<CleaningConfig>({
    removeDuplicates: true,
    removeEmptyDesc: true,
    lowercaseText: true,
    removePunctuation: true,
    removeStopwords: true,
    standardizeSalary: true,
    standardizeLocation: true,
  });

  const [isCleaning, setIsCleaning] = useState(false);
  const [stats, setStats] = useState({
    duplicatesRemoved: 0,
    emptyRemoved: 0,
    standardizedCount: 0,
    timeTakenMs: 0,
  });

  // Basic Indonesian stopwords list for demonstration
  const INDONESIAN_STOPWORDS = [
    "yang",
    "di",
    "dan",
    "dengan",
    "untuk",
    "dari",
    "dalam",
    "kami",
    "saya",
    "anda",
    "ini",
    "itu",
    "adalah",
    "sebagai",
    "pada",
    "atau",
    "akan",
    "ke",
    "bisa",
    "dapat",
  ];

  const cleanText = (
    text: string,
    lowercase: boolean,
    removePunct: boolean,
    removeStop: boolean,
  ) => {
    if (!text) return "";
    let result = text;

    if (lowercase) {
      result = result.toLowerCase();
    }
    if (removePunct) {
      result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'']/g, " ");
    }
    if (removeStop) {
      const words = result.split(/\s+/);
      const filtered = words.filter(
        (w) => !INDONESIAN_STOPWORDS.includes(w.toLowerCase()),
      );
      result = filtered.join(" ");
    }

    return result.replace(/\s+/g, " ").trim();
  };

  const handleRunCleaning = () => {
    setIsCleaning(true);
    const start = performance.now();

    setTimeout(() => {
      let duplicatesCount = 0;
      let emptyCount = 0;
      let standardized = 0;

      const seenKeys = new Set<string>();
      const processed: JobVacancy[] = [];

      rawJobs.forEach((job) => {
        // 1. Remove Empty Job Descriptions
        if (
          config.removeEmptyDesc &&
          (!job.job_description || job.job_description.trim() === "")
        ) {
          emptyCount++;
          return;
        }

        // 2. Remove Duplicates (based on combination of title, company, and location)
        const uniqueKey = `${job.job_title.trim().toLowerCase()}_${job.company.trim().toLowerCase()}_${job.location.trim().toLowerCase()}`;
        if (config.removeDuplicates) {
          if (
            seenKeys.has(uniqueKey) ||
            seenKeys.has(job.job_id.replace("-DUPE", ""))
          ) {
            duplicatesCount++;
            return;
          }
          seenKeys.add(uniqueKey);
          seenKeys.add(job.job_id);
        }

        // 3. Format/Standardize and Clean Text
        const cleanedJob = { ...job };

        // Standardize Location to Capitalized Cities in East Java
        if (config.standardizeLocation) {
          if (cleanedJob.location.toLowerCase().includes("surabaya"))
            cleanedJob.location = "Surabaya";
          else if (cleanedJob.location.toLowerCase().includes("gresik"))
            cleanedJob.location = "Gresik";
          else if (cleanedJob.location.toLowerCase().includes("sidoarjo"))
            cleanedJob.location = "Sidoarjo";
          else if (cleanedJob.location.toLowerCase().includes("tuban"))
            cleanedJob.location = "Tuban";
          else if (cleanedJob.location.toLowerCase().includes("mojokerto"))
            cleanedJob.location = "Mojokerto";
          else if (cleanedJob.location.toLowerCase().includes("pasuruan"))
            cleanedJob.location = "Pasuruan";
          standardized++;
        }

        // Standardize Salary strings or conversions (already numeric in our mock)
        if (config.standardizeSalary) {
          // ensure no null values are treated improperly
          if (!cleanedJob.salary_min) cleanedJob.salary_min = 4000000; // regional base estimate
          if (!cleanedJob.salary_max) cleanedJob.salary_max = 6000000;
        }

        // Apply string-level normalization to job_description
        cleanedJob.job_description = cleanText(
          job.job_description,
          config.lowercaseText,
          config.removePunctuation,
          config.removeStopwords,
        );

        cleanedJob.is_cleaned = true;
        processed.push(cleanedJob);
      });

      const end = performance.now();

      setStats({
        duplicatesRemoved: duplicatesCount,
        emptyRemoved: emptyCount,
        standardizedCount: standardized,
        timeTakenMs: Math.round(end - start),
      });

      setIsCleaning(false);
      onCleaningComplete(processed);
    }, 700); // realistic short delay
  };

  // Example of live preview text normalization
  const sampleRawText =
    "Kami sedang mencari ESG & Sustainability Analyst untuk memimpin inisiatif ekonomi sirkular kami di Sidoarjo! Harus mengerti ISO 14001, AMDAL, dan dekarbonisasi.";
  const sampleCleanText = cleanText(
    sampleRawText,
    config.lowercaseText,
    config.removePunctuation,
    config.removeStopwords,
  );

  return (
    <div className="space-y-6" id="data-cleaning-root">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Fase 2: Pembersihan Data (Data Cleaning & Standardization)
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Dataset mentah dari scraping (raw data) seringkali berisi duplikasi
          lowongan, nilai kosong (missing values), serta struktur teks yang
          kotor. Gunakan modul ini untuk membersihkan dan menstandarisasi data
          agar siap diumpankan ke model NLP.
        </p>
      </div>

      {rawJobs.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-slate-600 font-semibold text-sm">
            Tidak Ada Dataset Mentah untuk Dibersihkan
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Harap jalankan Fase 1: Scraping Data terlebih dahulu agar crawler
            mengumpulkan lowongan kerja.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cleaning Configurations */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-slate-500" />
              Aturan Pembersihan (Cleaning Rules)
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="removeDupes"
                  checked={config.removeDuplicates}
                  onChange={(e) =>
                    setConfig({ ...config, removeDuplicates: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <label
                    htmlFor="removeDupes"
                    className="font-semibold text-slate-700 block"
                  >
                    Hapus Duplikasi Lowongan
                  </label>
                  <span className="text-slate-400 block mt-0.5">
                    Mendeteksi kesamaan judul, perusahaan, dan wilayah.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="removeEmpty"
                  checked={config.removeEmptyDesc}
                  onChange={(e) =>
                    setConfig({ ...config, removeEmptyDesc: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <label
                    htmlFor="removeEmpty"
                    className="font-semibold text-slate-700 block"
                  >
                    Hapus Deskripsi Kosong
                  </label>
                  <span className="text-slate-400 block mt-0.5">
                    Memangkas lowongan yang tidak memuat deskripsi pekerjaan.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="lowercaseText"
                  checked={config.lowercaseText}
                  onChange={(e) =>
                    setConfig({ ...config, lowercaseText: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <label
                    htmlFor="lowercaseText"
                    className="font-semibold text-slate-700 block"
                  >
                    Konversi ke Huruf Kecil (Lowercasing)
                  </label>
                  <span className="text-slate-400 block mt-0.5">
                    Menyamakan huruf kapital untuk menghindari kerancuan token.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="removePunc"
                  checked={config.removePunctuation}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      removePunctuation: e.target.checked,
                    })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <label
                    htmlFor="removePunc"
                    className="font-semibold text-slate-700 block"
                  >
                    Hapus Tanda Baca (Punctuation)
                  </label>
                  <span className="text-slate-400 block mt-0.5">
                    Menghilangkan simbol tak bermakna untuk tokenisasi NLP yang
                    bersih.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="removeStop"
                  checked={config.removeStopwords}
                  onChange={(e) =>
                    setConfig({ ...config, removeStopwords: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <label
                    htmlFor="removeStop"
                    className="font-semibold text-slate-700 block"
                  >
                    Saring Stopwords (Kata Hubung)
                  </label>
                  <span className="text-slate-400 block mt-0.5">
                    Menghilangkan kata seperti 'yang', 'di', 'dan', 'untuk'.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="standSalary"
                  checked={config.standardizeSalary}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      standardizeSalary: e.target.checked,
                    })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <label
                    htmlFor="standSalary"
                    className="font-semibold text-slate-700 block"
                  >
                    Standarisasi Format Gaji
                  </label>
                  <span className="text-slate-400 block mt-0.5">
                    Konversi nilai gaji acak ke numerik regional dasar.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="standLoc"
                  checked={config.standardizeLocation}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      standardizeLocation: e.target.checked,
                    })
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <label
                    htmlFor="standLoc"
                    className="font-semibold text-slate-700 block"
                  >
                    Standarisasi Kluster Lokasi
                  </label>
                  <span className="text-slate-400 block mt-0.5">
                    Membersihkan nama kota di Jawa Timur (misal: Sidoarjo,
                    Tuban).
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRunCleaning}
              disabled={isCleaning}
              className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              {isCleaning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Memproses Data...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Jalankan Pembersihan
                </>
              )}
            </button>
          </div>

          {/* Results Side-by-Side & Live Normalization Preview */}
          <div className="lg:col-span-2 space-y-5">
            {/* Real-time Text Normalization Interactive Preview */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                Preview Tokenisasi & Normalisasi Teks
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block">
                    TEKS DESKRIPSI ASLI (RAW)
                  </span>
                  <div className="p-3 bg-slate-50 border border-slate-200 text-xs text-slate-600 rounded-xl leading-relaxed min-h-[90px]">
                    {sampleRawText}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 block flex items-center gap-1">
                    TEKS TERNOTASI (NORMALIZED)
                    <Sparkles className="w-3 h-3 animate-pulse" />
                  </span>
                  <div className="p-3 bg-emerald-50/20 border border-emerald-100 text-xs text-emerald-800 rounded-xl leading-relaxed min-h-[90px] font-mono">
                    {sampleCleanText || (
                      <span className="text-slate-400 italic">
                        Centang opsi normalisasi untuk melihat efeknya
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics of Process */}
            {cleanedJobs.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                  <span className="text-[10px] font-medium text-slate-400 block">
                    RAW DATASET
                  </span>
                  <span className="text-xl font-bold text-slate-800 block mt-1">
                    {rawJobs.length} Baris
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                  <span className="text-[10px] font-medium text-slate-400 block">
                    CLEAN DATASET
                  </span>
                  <span className="text-xl font-bold text-emerald-600 block mt-1">
                    {cleanedJobs.length} Baris
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                  <span className="text-[10px] font-medium text-slate-400 block">
                    REDUNDAN PRUNED
                  </span>
                  <span className="text-xl font-bold text-amber-600 block mt-1">
                    -{stats.duplicatesRemoved + stats.emptyRemoved}
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                  <span className="text-[10px] font-medium text-slate-400 block">
                    WAKTU PROSES
                  </span>
                  <span className="text-xl font-bold text-blue-600 block mt-1">
                    {stats.timeTakenMs} ms
                  </span>
                </div>
              </div>
            )}

            {/* Clean Data Table Preview */}
            {cleanedJobs.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Dataset Bersih Siap NLP (clean_jobs.parquet)
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Fase 2 Sukses
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-150 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 text-[10px] uppercase tracking-wider font-semibold border-b border-slate-150">
                        <th className="p-3">Job ID</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">
                          Normalized Description Token Preview
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                      {cleanedJobs.slice(0, 5).map((job) => (
                        <tr key={job.job_id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-medium text-slate-500">
                            {job.job_id}
                          </td>
                          <td className="p-3 font-medium text-slate-800">
                            {job.job_title}
                          </td>
                          <td className="p-3">{job.company}</td>
                          <td className="p-3">{job.location}</td>
                          <td className="p-3 font-mono text-[10px] text-slate-500 line-clamp-1 truncate max-w-xs">
                            {job.job_description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  Menampilkan 5 baris pertama dari total {cleanedJobs.length}{" "}
                  baris dataset bersih.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
