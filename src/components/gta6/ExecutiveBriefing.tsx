import { useState } from 'react';
import { 
  INDUSTRY_TIMELINE_EVENTS, 
  TAKETWO_MODDING_STRATEGY 
} from '../../data/gta6MonetizationData';
import { 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  Cpu, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../../utils/audio';

export default function ExecutiveBriefing() {
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(INDUSTRY_TIMELINE_EVENTS[0]);

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner: Market Size & Acquisition Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Take-Two Net Bookings
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">78%</span>
            <span className="text-xs text-slate-400 block mt-1">
              Accounted for by Recurrent Consumer Spending (virtual goods, passes, memberships) in fiscal 2026.
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-500 mt-2 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Source: Take-Two Investor Reports [6]
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-500/30 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              BofA FY2028 Forecast
            </span>
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-sky-400">$2.2 Billion</span>
            <span className="text-xs text-slate-400 block mt-1">
              Bank of America estimate for GTA Online recurrent bookings, modeling $60 annual spend per MAU.
            </span>
          </div>
          <span className="text-[10px] font-mono text-sky-400 mt-2 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Source: Bank of America Securities [6]
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Take-Two Cfx.re Buyout
            </span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-purple-400">~$20M Exit</span>
            <span className="text-xs text-slate-400 block mt-1">
              FiveM / RedM acquired August 2023. CEO Strauss Zelnick: "Instead of trying to beat them, we join them."
            </span>
          </div>
          <span className="text-[10px] font-mono text-purple-400 mt-2 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Source: GTA Boom & Take-Two [4]
          </span>
        </div>
      </div>

      {/* Strategic Posture Shift (Hostile -> Absorption -> Monetization -> Consolidation) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Take-Two's Strategic Modding Stack Monopolization
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              How Take-Two transformed community modding from an intellectual property threat into a regulated corporate cash cow.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
            2015 - 2026 Shift
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {TAKETWO_MODDING_STRATEGY.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">{item.period}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    item.posture === 'Hostile' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                    item.posture === 'Absorption' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                    item.posture === 'Monetization' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {item.posture}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mt-2 leading-snug">{item.action}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Milestones & Roadmap Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Timeline Events (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              GTA 6 Milestone Timeline (Console vs. PC Gap)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Historical 13-19 Mo. Delay
            </span>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {INDUSTRY_TIMELINE_EVENTS.map((event, idx) => {
              const isSelected = selectedTimelineItem.date === event.date;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    soundEffects.playBeep(750, 0.03);
                    setSelectedTimelineItem(event);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                    isSelected 
                      ? 'bg-slate-950 border-sky-500/80 shadow-md ring-1 ring-sky-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-sky-400">{event.date}</span>
                      <span className="text-xs font-bold text-white leading-tight">{event.event}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {event.impact}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 font-bold">
                    {event.source}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Technical Infrastructure Deep-Dive (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                OneSync Infinity & SixM Readiness
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                2,048 PLAYERS
              </span>
            </div>

            <div className="space-y-3 mt-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">GTA V Enhanced Benchmark</span>
                <span className="text-white font-bold block mt-0.5">High-Performance OneSync Sync</span>
                <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                  March 2026 FiveM update supports 2,048 concurrent players on a single node with reduced CPU/RAM usage and fixed bullet impact/body sync bugs.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Rockstar Creator Platform Team</span>
                <span className="text-white font-bold block mt-0.5">Roblox-Like UGC Economy</span>
                <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Rockstar currently hiring Strategy Research Associates, Senior Product Managers, and Community Coordinators with deep knowledge of Roblox, Fortnite, YouTube, and Twitch.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">3D Asset Conversion Tooling</span>
                <span className="text-white font-bold block mt-0.5">Alchemist Conversion Suite</span>
                <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Automates migration of legacy 3D assets to Enhanced and future SixM engine specifications.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Sole authorized platform: FiveM</span>
            <span className="text-sky-400 font-bold">PostgreSQL 1M Load Tested</span>
          </div>
        </div>
      </div>
    </div>
  );
}
