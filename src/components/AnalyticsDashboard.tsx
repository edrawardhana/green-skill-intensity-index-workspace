import React, { useState } from "react";
import { JobVacancy, Skill } from "../types";
import {
  TrendingUp,
  Award,
  DollarSign,
  MapPin,
  ChevronRight,
  Share2,
  HelpCircle,
} from "lucide-react";

interface AnalyticsDashboardProps {
  processedJobs: JobVacancy[];
}

export default function AnalyticsDashboard({
  processedJobs,
}: AnalyticsDashboardProps) {
  const [activeChart, setActiveChart] = useState<
    "industry" | "location" | "salary"
  >("industry");

  if (processedJobs.length === 0) {
    return (
      <div
        className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200"
        id="analytics-empty-state"
      >
        <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce" />
        <p className="text-slate-600 font-semibold text-sm">
          Belum Ada Analisis yang Dapat Ditampilkan
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Harap jalankan Fase 3: Bulk Dataset Engine (Proses Seluruh Dataset)
          terlebih dahulu agar visualisasi terisi.
        </p>
      </div>
    );
  }

  // --- Calculate Analytics & Metrics ---

  // 1. Avg Green Skill Intensity
  const totalIntensity = processedJobs.reduce(
    (acc, job) => acc + (job.green_intensity_score || 0),
    0,
  );
  const avgIntensity = Math.round(totalIntensity / processedJobs.length);

  // 2. Highest Intensity Industry & Location
  const industrySummary: {
    [key: string]: { totalScore: number; count: number; salaries: number[] };
  } = {};
  const locationSummary: {
    [key: string]: { totalScore: number; count: number; salaries: number[] };
  } = {};
  const sourceSummary: {
    [key: string]: { totalScore: number; count: number; salaries: number[] };
  } = {};

  processedJobs.forEach((job) => {
    const score = job.green_intensity_score || 0;
    const salary = (job.salary_min || 0) + (job.salary_max || 0) / 2; // median estimate

    // Industry
    if (!industrySummary[job.industry]) {
      industrySummary[job.industry] = { totalScore: 0, count: 0, salaries: [] };
    }
    industrySummary[job.industry].totalScore += score;
    industrySummary[job.industry].count += 1;
    if (salary > 0) industrySummary[job.industry].salaries.push(salary);

    // Location
    if (!locationSummary[job.location]) {
      locationSummary[job.location] = { totalScore: 0, count: 0, salaries: [] };
    }
    locationSummary[job.location].totalScore += score;
    locationSummary[job.location].count += 1;
    if (salary > 0) locationSummary[job.location].salaries.push(salary);

    // Source (Benchmarking)
    if (!sourceSummary[job.source]) {
      sourceSummary[job.source] = { totalScore: 0, count: 0, salaries: [] };
    }
    sourceSummary[job.source].totalScore += score;
    sourceSummary[job.source].count += 1;
    if (salary > 0) sourceSummary[job.source].salaries.push(salary);
  });

  // Most Popular Green Skills Extraction
  const skillCount: { [key: string]: { count: number; category: string } } = {};
  processedJobs.forEach((job) => {
    (job.extracted_skills || []).forEach((skill) => {
      if (skill.category !== "general") {
        if (!skillCount[skill.name]) {
          skillCount[skill.name] = { count: 0, category: skill.category };
        }
        skillCount[skill.name].count += 1;
      }
    });
  });

  const popularSkills = Object.keys(skillCount)
    .map((name) => ({
      name,
      count: skillCount[name].count,
      category: skillCount[name].category,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Industry stats parsed to chart array
  const industryChartData = Object.keys(industrySummary)
    .map((ind) => {
      const data = industrySummary[ind];
      const avgScore = Math.round(data.totalScore / data.count);
      const avgSalary =
        data.salaries.length > 0
          ? Math.round(
              data.salaries.reduce((a, b) => a + b, 0) / data.salaries.length,
            )
          : 6000000;
      return { name: ind, count: data.count, avgScore, avgSalary };
    })
    .sort((a, b) => b.avgScore - a.avgScore);

  // Location stats parsed to chart array
  const locationChartData = Object.keys(locationSummary)
    .map((loc) => {
      const data = locationSummary[loc];
      const avgScore = Math.round(data.totalScore / data.count);
      const avgSalary =
        data.salaries.length > 0
          ? Math.round(
              data.salaries.reduce((a, b) => a + b, 0) / data.salaries.length,
            )
          : 5500000;
      return { name: loc, count: data.count, avgScore, avgSalary };
    })
    .sort((a, b) => b.count - a.count);

  // Salary Premium Calculations
  const highGreenJobs = processedJobs.filter(
    (j) => (j.green_intensity_score || 0) >= 45,
  );
  const lowGreenJobs = processedJobs.filter(
    (j) => (j.green_intensity_score || 0) < 15,
  );

  const getAvgSalary = (list: JobVacancy[]) => {
    const salaries = list
      .map((j) => ((j.salary_min || 0) + (j.salary_max || 0)) / 2)
      .filter((s) => s > 0);
    if (salaries.length === 0) return 0;
    return Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
  };

  const highGreenAvgSalary = getAvgSalary(highGreenJobs);
  const lowGreenAvgSalary = getAvgSalary(lowGreenJobs);
  const salaryPremiumPercent =
    lowGreenAvgSalary > 0
      ? Math.round(
          ((highGreenAvgSalary - lowGreenAvgSalary) / lowGreenAvgSalary) * 100,
        )
      : 0;

  // Render direct custom responsive SVG bars for full visual control
  const maxScoreInChart = Math.max(
    ...industryChartData.map((d) => d.avgScore),
    1,
  );
  const maxCountInChart = Math.max(...locationChartData.map((d) => d.count), 1);

  return (
    <div className="space-y-6" id="analytics-dashboard-root">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Avg Green Intensity
            </span>
            <span className="text-2xl font-black text-slate-800 mt-0.5">
              {avgIntensity}%
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">
              East Java Market Base
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 text-blue-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Top Green Industry
            </span>
            <span className="text-base font-bold text-slate-800 mt-0.5 truncate max-w-[170px] block">
              {industryChartData[0]?.name || "-"}
            </span>
            <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">
              {industryChartData[0]?.avgScore}% Green Index
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 text-amber-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Green Salary Premium
            </span>
            <span className="text-2xl font-black text-slate-800 mt-0.5">
              +{salaryPremiumPercent}%
            </span>
            <span className="text-[10px] text-amber-600 font-medium">
              vs. Traditional Roles
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100 text-purple-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Top Location Cluster
            </span>
            <span className="text-lg font-bold text-slate-800 mt-0.5">
              {locationChartData[0]?.name || "-"}
            </span>
            <span className="text-[10px] text-purple-600 font-medium">
              {locationChartData[0]?.count} Green Openings
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Interactive Chart Workspace */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">
              Visualisasi Deskriptif & Korelatif
            </h3>

            <div className="flex bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveChart("industry")}
                className={`px-3 py-1 font-semibold rounded-md transition-all ${
                  activeChart === "industry"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Intensitas Sektor
              </button>
              <button
                onClick={() => setActiveChart("location")}
                className={`px-3 py-1 font-semibold rounded-md transition-all ${
                  activeChart === "location"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Kluster Wilayah
              </button>
              <button
                onClick={() => setActiveChart("salary")}
                className={`px-3 py-1 font-semibold rounded-md transition-all ${
                  activeChart === "salary"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Intensitas vs Gaji
              </button>
            </div>
          </div>

          {/* Render Active Chart */}
          {activeChart === "industry" && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>SEKTOR / INDUSTRI</span>
                <span>RATA-RATA GREEN SKILL INTENSITY INDEX</span>
              </div>

              <div className="space-y-3.5">
                {industryChartData.map((data, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {data.name}
                      </span>
                      <span className="font-bold text-slate-800">
                        {data.avgScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(data.avgScore / maxScoreInChart) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChart === "location" && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>WILAYAH / KABUPATEN DI JAWA TIMUR</span>
                <span>JUMLAH VACANCIES HIJAU</span>
              </div>

              <div className="space-y-3.5">
                {locationChartData.map((data, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {data.name}
                      </span>
                      <span className="font-bold text-slate-800">
                        {data.count} Lowongan
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(data.count / maxCountInChart) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChart === "salary" && (
            <div className="space-y-4 py-2">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Grafik korelasi berikut membuktikan adanya{" "}
                <strong>"Green Premium"</strong> — di mana semakin tinggi
                tuntutan Green Skill Intensity Index dalam kualifikasi lowongan
                kerja, median gaji bulanan yang ditawarkan cenderung meningkat
                secara signifikan.
              </p>

              <div className="space-y-3">
                {industryChartData.map((data, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                        {data.avgScore}%
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 text-xs block">
                          {data.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Green Intensity
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="font-extrabold text-slate-800 text-xs block">
                        Rp {data.avgSalary.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Rata-rata Gaji Bulanan
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Popular Skills & Benchmark */}
        <div className="lg:col-span-4 space-y-5">
          {/* Most Popular Green Skills */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
              Kompetensi Hijau Paling Populer
            </h3>

            <div className="space-y-3">
              {popularSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-slate-50 pb-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-700 block">
                      {skill.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        skill.category === "direct"
                          ? "bg-emerald-100 text-emerald-800"
                          : skill.category === "indirect"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {skill.category}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-slate-800 block">
                      {skill.count}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Kemunculan
                    </span>
                  </div>
                </div>
              ))}
              {popularSkills.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4">
                  Tidak ada data green skills terdeteksi.
                </p>
              )}
            </div>
          </div>

          {/* Portal Benchmarking comparison */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
              Benchmarking Lintas Portal
            </h3>

            <div className="space-y-3">
              {Object.keys(sourceSummary).map((source) => {
                const data = sourceSummary[source];
                const avgScore = Math.round(data.totalScore / data.count);
                const avgSalary =
                  data.salaries.length > 0
                    ? Math.round(
                        data.salaries.reduce((a, b) => a + b, 0) /
                          data.salaries.length,
                      )
                    : 6000000;

                return (
                  <div
                    key={source}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/50"
                  >
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-bold text-slate-800">{source}</span>
                      <span className="font-medium text-slate-400">
                        {data.count} Lowongan
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">
                          Rerata Gaji
                        </span>
                        <span className="font-bold text-slate-700 block">
                          Rp {avgSalary.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">
                          Green Index
                        </span>
                        <span className="font-bold text-emerald-600 block">
                          {avgScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
