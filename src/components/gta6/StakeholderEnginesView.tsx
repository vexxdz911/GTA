import { useState } from 'react';
import { STAKEHOLDER_ENGINES } from '../../data/gta6MonetizationData';
import { 
  Server, 
  Users, 
  Video, 
  Code2, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Shield,
  Star,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../../utils/audio';

export default function StakeholderEnginesView() {
  const [selectedStakeholderId, setSelectedStakeholderId] = useState<string>(STAKEHOLDER_ENGINES[0].id);

  const activeStakeholder = STAKEHOLDER_ENGINES.find(s => s.id === selectedStakeholderId) || STAKEHOLDER_ENGINES[0];

  const getIcon = (stakeholderName: string) => {
    switch (stakeholderName) {
      case 'Server Operators': return <Server className="w-4 h-4 text-emerald-400" />;
      case 'RP Communities': return <Users className="w-4 h-4 text-sky-400" />;
      case 'Content Creators': return <Video className="w-4 h-4 text-rose-400" />;
      case 'Developer Networks': return <Code2 className="w-4 h-4 text-purple-400" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Stakeholder Selector Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {STAKEHOLDER_ENGINES.map((engine) => {
          const isSelected = engine.id === selectedStakeholderId;

          return (
            <button
              key={engine.id}
              onClick={() => {
                soundEffects.playBeep(800, 0.04);
                setSelectedStakeholderId(engine.id);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-sky-500 shadow-lg ring-1 ring-sky-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {getIcon(engine.stakeholder)}
                  <span className="text-xs font-mono font-bold text-white uppercase">{engine.stakeholder}</span>
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                )}
              </div>
              <span className="text-[11px] text-slate-400 mt-2 font-mono line-clamp-1">
                {engine.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Stakeholder Deep-Dive Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl flex flex-col gap-6">
        {/* Header and Core Thesis */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                {getIcon(activeStakeholder.stakeholder)}
              </span>
              <div>
                <h2 className="text-lg font-black text-white font-mono uppercase tracking-wide">
                  {activeStakeholder.stakeholder} Revenue Engine
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {activeStakeholder.subtitle}
                </p>
              </div>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-slate-400">Model: </span>
            <span className="text-emerald-400 font-bold">{activeStakeholder.coreModel}</span>
          </div>
        </div>

        {/* High-Level Strategic Highlights / Metrics */}
        <div>
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Key Strategic Benchmarks & Market Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeStakeholder.keyMetrics.map((metric, idx) => (
              <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 font-mono leading-relaxed">{metric}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Streams Grid */}
        <div>
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Compliant Monetization Streams
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeStakeholder.primaryStreams.map((stream, idx) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                    <h4 className="text-xs font-bold text-white font-mono">{stream.title}</h4>
                  </div>
                  <div className="mt-2 text-xs font-black font-mono text-emerald-400">
                    {stream.revenueRange}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {stream.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="truncate">{stream.complianceNote}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day-1 Operational Playbook */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              Day-1 Tactical Playbook for {activeStakeholder.stakeholder}
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Action Plan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
            {activeStakeholder.day1Playbook.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="w-5 h-5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-300 leading-snug text-xs">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
