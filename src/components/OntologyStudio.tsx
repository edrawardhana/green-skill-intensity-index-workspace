import React, { useState } from 'react';
import { OntologyTerm } from '../types';
import { Plus, Search, BookOpen, Layers, ShieldCheck, HelpCircle } from 'lucide-react';

interface OntologyStudioProps {
  ontology: OntologyTerm[];
  onAddTerm: (term: OntologyTerm) => void;
}

export default function OntologyStudio({ ontology, onAddTerm }: OntologyStudioProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'direct' | 'indirect' | 'transition'>('all');
  
  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newCategory, setNewCategory] = useState<'direct' | 'indirect' | 'transition'>('direct');
  const [newDesc, setNewDesc] = useState('');
  const [newSynonyms, setNewSynonyms] = useState('');

  const filteredOntology = ontology.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.synonyms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.trim()) return;
    
    const synonymsArray = newSynonyms
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    onAddTerm({
      term: newTerm.trim(),
      category: newCategory,
      description: newDesc.trim() || 'Custom user added term.',
      synonyms: synonymsArray
    });

    // Reset Form
    setNewTerm('');
    setNewDesc('');
    setNewSynonyms('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6" id="ontology-studio-root">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          Fase 0: Persiapan Green Keyword Ontology
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Sebelum melakukan ekstraksi skill, kita harus membangun ontologi kata kunci hijau (Green Keyword Ontology). 
          Ontologi ini dikelompokkan menjadi tiga kelompok utama sesuai dokumen penelitian untuk menghitung 
          <strong className="text-emerald-700"> Green Skill Intensity Index</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-semibold text-emerald-900 text-sm">Direct Green Terms</h3>
            </div>
            <p className="text-emerald-800 text-xs leading-relaxed">
              Konsep dan teknologi ramah lingkungan secara langsung, seperti dekarbonisasi, solar PV, ESG reporting, dan ekonomi sirkular.
            </p>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h3 className="font-semibold text-blue-900 text-sm">Indirect Green Terms</h3>
            </div>
            <p className="text-blue-800 text-xs leading-relaxed">
              Praktik perlindungan atau efisiensi pendukung, seperti AMDAL, kepatuhan ISO 14001, pengurangan sampah, dan hemat energi.
            </p>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="font-semibold text-amber-900 text-sm">Transition Skills</h3>
            </div>
            <p className="text-amber-800 text-xs leading-relaxed">
              Metode industri 4.0 dan integrasi sistem cerdas yang memicu transisi ramah lingkungan, seperti IoT energy monitoring dan analisis telemetri polusi.
            </p>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({ontology.length})
          </button>
          <button
            onClick={() => setActiveFilter('direct')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeFilter === 'direct'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Direct Green
          </button>
          <button
            onClick={() => setActiveFilter('indirect')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeFilter === 'indirect'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Indirect Green
          </button>
          <button
            onClick={() => setActiveFilter('transition')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeFilter === 'transition'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Transition Skills
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kata kunci / sinonim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50/50"
            />
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Term Baru
          </button>
        </div>
      </div>

      {/* Add New Term Dialog/Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <h4 className="font-semibold text-slate-800 text-sm">Tambah Kata Kunci Hijau Baru</h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 block">Nama Kata Kunci (Term Utama)</label>
              <input
                type="text"
                required
                placeholder="Misal: Carbon Footprint"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 block">Kategori</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="direct">Direct Green</option>
                <option value="indirect">Indirect Green</option>
                <option value="transition">Transition Skill</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 block">Deskripsi / Penjelasan Singkat</label>
            <input
              type="text"
              placeholder="Jelaskan peran kata kunci ini dalam aksi keberlanjutan..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600 block">Sinonim / Padanan Kata (Pisahkan dengan koma)</label>
            <input
              type="text"
              placeholder="jejak karbon, ghg emissions, emisi co2"
              value={newSynonyms}
              onChange={(e) => setNewSynonyms(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 text-white font-medium text-xs rounded-lg hover:bg-slate-900 transition-colors"
            >
              Simpan ke Ontologi
            </button>
          </div>
        </form>
      )}

      {/* Grid of Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOntology.length > 0 ? (
          filteredOntology.map((item, idx) => {
            const isDirect = item.category === 'direct';
            const isIndirect = item.category === 'indirect';
            
            return (
              <div 
                key={idx} 
                className={`bg-white rounded-xl border p-5 transition-all hover:shadow-md flex flex-col justify-between ${
                  isDirect 
                    ? 'border-emerald-100 hover:border-emerald-200 bg-gradient-to-br from-white to-emerald-50/10' 
                    : isIndirect
                    ? 'border-blue-100 hover:border-blue-200 bg-gradient-to-br from-white to-blue-50/10'
                    : 'border-amber-100 hover:border-amber-200 bg-gradient-to-br from-white to-amber-50/10'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                      {item.term}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                      isDirect 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isIndirect
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.category === 'transition' ? 'Transition' : item.category + ' Green'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-medium text-slate-400 block mb-1.5 uppercase tracking-wider">Sinonim / Padanan Terkait</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.synonyms.map((syn, synIdx) => (
                      <span 
                        key={synIdx} 
                        className="px-2 py-0.5 text-[11px] font-medium bg-slate-50 text-slate-500 rounded-md border border-slate-200/50"
                      >
                        {syn}
                      </span>
                    ))}
                    {item.synonyms.length === 0 && (
                      <span className="text-[11px] text-slate-400 italic">Tidak ada sinonim tambahan</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500 font-medium text-sm">Tidak menemukan kata kunci yang cocok</p>
            <p className="text-slate-400 text-xs mt-1">Coba sesuaikan pencarian atau filter kategori Anda</p>
          </div>
        )}
      </div>
    </div>
  );
}
