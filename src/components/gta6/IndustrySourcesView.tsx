import { useState } from 'react';
import { INDUSTRY_SOURCES } from '../../data/gta6MonetizationData';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { soundEffects } from '../../utils/audio';

export default function IndustrySourcesView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSources = INDUSTRY_SOURCES.filter(source => 
    source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.keyFinding.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header and Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            Verified Research Bibliography & Executive Citations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            23 primary sources covering Take-Two financials, legal agreements, Tebex fee structures, and NoPixel case studies.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sources or publishers..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredSources.map((source) => (
          <div 
            key={source.id}
            className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-mono font-black text-xs">
                    [{source.id}]
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {source.publisher}
                  </span>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEffects.playBeep(900, 0.02)}
                  className="text-sky-400 hover:text-sky-300 p-1 rounded hover:bg-slate-800 transition-colors"
                  title="View original source"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <h4 className="text-xs font-bold text-white font-mono mt-2.5 leading-snug">
                {source.title}
              </h4>

              <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed">
                {source.keyFinding}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-900/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="truncate max-w-[240px] text-slate-400">{source.url}</span>
              <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
