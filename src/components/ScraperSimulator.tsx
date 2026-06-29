import React, { useState, useEffect, useRef } from 'react';
import { ScraperConfig, JobVacancy, ScraperStats } from '../types';
import { Play, RotateCcw, AlertTriangle, Database, FileText, CheckCircle2, RefreshCw, Terminal, Download } from 'lucide-react';
import { MOCK_RAW_JOBS } from '../data/mockJobs';

interface ScraperSimulatorProps {
  onScrapingComplete: (jobs: JobVacancy[]) => void;
  rawJobs: JobVacancy[];
}

export default function ScraperSimulator({ onScrapingComplete, rawJobs }: ScraperSimulatorProps) {
  const [config, setConfig] = useState<ScraperConfig>({
    source: 'All',
    keywords: ['sustainability', 'energy efficiency', 'ESG', 'waste reduction', 'smart manufacturing'],
    locations: ['Surabaya', 'Gresik', 'Sidoarjo', 'Tuban', 'Mojokerto', 'Pasuruan'],
    industries: ['Manufacturing', 'Renewable Energy', 'Chemical Industry', 'Smart Manufacturing', 'Logistics'],
    targetSampleSize: 15, // default to 15 for fast high-quality simulation
    delayMs: 600
  });

  const [stats, setStats] = useState<ScraperStats>({
    totalScraped: 0,
    successCount: 0,
    failCount: 0,
    bySource: { JobStreet: 0, Glints: 0, LinkedIn: 0 },
    logs: [],
    isRunning: false,
    progress: 0
  });

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the logger terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [stats.logs]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setStats(prev => ({
      ...prev,
      logs: [...prev.logs, `[${timestamp}] ${message}`]
    }));
  };

  const handleStartScraping = () => {
    setStats({
      totalScraped: 0,
      successCount: 0,
      failCount: 0,
      bySource: { JobStreet: 0, Glints: 0, LinkedIn: 0 },
      logs: [],
      isRunning: true,
      progress: 0
    });

    addLog('System: Menginisialisasi modul Web Scraper...');
    addLog(`System: Menargetkan web source: ${config.source === 'All' ? 'JobStreet, Glints, & LinkedIn' : config.source}`);
    addLog(`System: Target kuota sampel: ${config.targetSampleSize} lowongan kerja.`);
    addLog(`System: Filter wilayah East Java: ${config.locations.join(', ')}`);
    addLog(`System: Filter industri prioritas: ${config.industries.join(', ')}`);
  };

  useEffect(() => {
    if (!stats.isRunning) return;

    let currentStep = 0;
    const maxSteps = config.targetSampleSize;
    
    // Select jobs to scrape
    const sourceFilter = config.source;
    const pool = MOCK_RAW_JOBS.filter(job => {
      if (sourceFilter !== 'All' && job.source !== sourceFilter) return false;
      return true;
    });

    const interval = setInterval(() => {
      if (currentStep >= maxSteps) {
        clearInterval(interval);
        setStats(prev => ({ ...prev, isRunning: false, progress: 100 }));
        addLog('System: Scraping selesai secara sukses!');
        addLog(`System: Total Berhasil: ${stats.successCount + Math.min(pool.length, maxSteps)}, Gagal: 0.`);
        addLog('System: Data disimpan ke Raw Dataset Workspace (raw_jobs.csv).');
        
        // Return scraped jobs to parent (take the sample from mock database)
        const finalSample = pool.slice(0, maxSteps).map(j => ({ ...j, is_cleaned: false }));
        onScrapingComplete(finalSample);
        return;
      }

      const jobItem = pool[currentStep % pool.length];
      const stepProgress = Math.round(((currentStep + 1) / maxSteps) * 100);

      // Random delay simulations
      if (currentStep === 0) {
        addLog(`Crawler: Mengirim GET request ke halaman pencarian ${jobItem.source} dengan query...`);
      }

      const success = true; // simulation is always successful for mock data
      if (success) {
        setStats(prev => {
          const updatedBySource = { ...prev.bySource };
          updatedBySource[jobItem.source] = (updatedBySource[jobItem.source] || 0) + 1;
          
          return {
            ...prev,
            totalScraped: prev.totalScraped + 1,
            successCount: prev.successCount + 1,
            progress: stepProgress,
            bySource: updatedBySource
          };
        });
        
        addLog(`Crawler: [${jobItem.source}] Berhasil mengikis detail "${jobItem.job_title}" di ${jobItem.company} (${jobItem.location})`);
      } else {
        setStats(prev => ({
          ...prev,
          totalScraped: prev.totalScraped + 1,
          failCount: prev.failCount + 1,
          progress: stepProgress
        }));
        addLog(`Crawler: [${jobItem.source}] Gagal menyambung ke detail page. Mengulang koneksi...`);
      }

      currentStep++;
    }, config.delayMs);

    return () => clearInterval(interval);
  }, [stats.isRunning]);

  const handleReset = () => {
    setStats({
      totalScraped: 0,
      successCount: 0,
      failCount: 0,
      bySource: { JobStreet: 0, Glints: 0, LinkedIn: 0 },
      logs: [],
      isRunning: false,
      progress: 0
    });
    onScrapingComplete([]);
  };

  return (
    <div className="space-y-6" id="scraper-simulator-root">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-emerald-600" />
          Fase 1: Scraping Data Lowongan Kerja
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Gunakan modul ini untuk mensimulasikan web scraping secara aman. Crawler akan menjelajahi 
          portal lowongan kerja utama Indonesia (<strong className="text-emerald-700">JobStreet & Glints</strong>) 
          untuk mengumpulkan deskripsi pekerjaan, kualifikasi, tingkat pengalaman, dan rentang gaji.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scraper Configurations */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Konfigurasi Crawler</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 block">Portal Sumber (Source Portal)</label>
            <select
              value={config.source}
              disabled={stats.isRunning}
              onChange={(e) => setConfig({ ...config, source: e.target.value as any })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">Semua Portal (Recommended)</option>
              <option value="JobStreet">JobStreet Indonesia</option>
              <option value="Glints">Glints Indonesia</option>
              <option value="LinkedIn">LinkedIn Jobs (Benchmark)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 block">Target Jumlah Sampel</label>
              <input
                type="number"
                disabled={stats.isRunning}
                value={config.targetSampleSize}
                onChange={(e) => setConfig({ ...config, targetSampleSize: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 block">Delay Crawler (ms)</label>
              <input
                type="number"
                disabled={stats.isRunning}
                step="100"
                value={config.delayMs}
                onChange={(e) => setConfig({ ...config, delayMs: Math.max(100, parseInt(e.target.value) || 100) })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 block">Daftar Kata Kunci (Query Keywords)</label>
            <div className="flex flex-wrap gap-1 bg-slate-50 p-2 border border-slate-200 rounded-lg max-h-24 overflow-y-auto">
              {config.keywords.map((kw, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-medium border border-emerald-200/50">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 block">Prioritas Lokasi (East Java Cluster)</label>
            <div className="flex flex-wrap gap-1 bg-slate-50 p-2 border border-slate-200 rounded-lg">
              {config.locations.map((loc, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-medium border border-blue-200/50">
                  {loc}
                </span>
              ))}
            </div>
          </div>

          {config.source === 'LinkedIn' && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-2 items-start">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 leading-normal">
                LinkedIn dilindungi sistem Cloudflare anti-bot yang ketat. Scraping LinkedIn hanya disarankan untuk benchmark validasi dengan volume kecil.
              </p>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            {!stats.isRunning ? (
              <button
                onClick={handleStartScraping}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Mulai Scraping
              </button>
            ) : (
              <div className="flex-1 py-2.5 bg-slate-100 text-slate-500 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Scraping...
              </div>
            )}
            
            <button
              onClick={handleReset}
              disabled={stats.isRunning}
              className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time terminal log & Scraper Stats */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          {/* Progress & Quick Stats */}
          <div className="grid grid-cols-3 gap-3 bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className="text-center">
              <span className="text-[10px] font-medium text-slate-400 block uppercase">Sampel Terkumpul</span>
              <span className="text-lg font-bold text-slate-800 mt-1 block">{stats.totalScraped}</span>
            </div>
            <div className="text-center border-x border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 block uppercase">JobStreet / Glints / LI</span>
              <span className="text-sm font-bold text-slate-700 mt-1 block">
                {stats.bySource.JobStreet} / {stats.bySource.Glints} / {stats.bySource.LinkedIn}
              </span>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-medium text-slate-400 block uppercase">Progress Status</span>
              <span className="text-lg font-bold text-emerald-600 mt-1 block">{stats.progress}%</span>
            </div>
          </div>

          {/* Terminal Console */}
          <div className="flex-1 bg-slate-900 rounded-2xl p-4 font-mono text-[11px] text-emerald-400 border border-slate-850 flex flex-col shadow-inner min-h-[220px] max-h-[300px]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-[10px] text-slate-400 mb-2">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                CRAWLER TERMINAL CONSOLE
              </span>
              <span className="animate-pulse bg-emerald-500/20 px-1.5 py-0.5 rounded text-[9px] font-semibold text-emerald-300">
                {stats.isRunning ? 'LIVE_CRAWLING_ACTIVE' : 'READY_STANDBY'}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-2">
              {stats.logs.length === 0 ? (
                <div className="text-slate-500 italic py-8 text-center">
                  Klik "Mulai Scraping" untuk memicu crawler otomatis...
                </div>
              ) : (
                stats.logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                    {log}
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Preview */}
      {rawJobs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Hasil Scraping Dataset Mentah (Raw Dataset)
            </h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
              Format: raw_jobs.csv ({rawJobs.length} Baris)
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-150">
                  <th className="p-3">Job ID</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Industry</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Salary Min</th>
                  <th className="p-3">Salary Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {rawJobs.map((job) => (
                  <tr key={job.job_id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-medium text-slate-500">{job.job_id}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        job.source === 'JobStreet' 
                          ? 'bg-blue-50 text-blue-800' 
                          : job.source === 'Glints'
                          ? 'bg-purple-50 text-purple-800'
                          : 'bg-indigo-50 text-indigo-800'
                      }`}>
                        {job.source}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{job.job_title}</td>
                    <td className="p-3">{job.company}</td>
                    <td className="p-3">{job.industry}</td>
                    <td className="p-3">{job.location}</td>
                    <td className="p-3">
                      {job.salary_min ? `Rp ${job.salary_min.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="p-3">
                      {job.salary_max ? `Rp ${job.salary_max.toLocaleString('id-ID')}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
