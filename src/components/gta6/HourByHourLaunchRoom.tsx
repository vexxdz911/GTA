import { useState } from 'react';
import { HOUR_BY_HOUR_PLAYBOOK } from '../../data/gta6MonetizationData';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  ShieldAlert, 
  ChevronRight,
  Flame,
  Radio,
  Zap,
  Target
} from 'lucide-react';
import { soundEffects } from '../../utils/audio';

export default function HourByHourLaunchRoom() {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(HOUR_BY_HOUR_PLAYBOOK[0].id);
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  const activePhase = HOUR_BY_HOUR_PLAYBOOK.find(p => p.id === selectedPhaseId) || HOUR_BY_HOUR_PLAYBOOK[0];

  const toggleAction = (phaseId: string, actionIdx: number) => {
    soundEffects.playBeep(920, 0.03);
    const key = `${phaseId}_${actionIdx}`;
    setCheckedActions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Timeline Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {HOUR_BY_HOUR_PLAYBOOK.map((step) => {
          const isSelected = step.id === selectedPhaseId;

          return (
            <button
              key={step.id}
              onClick={() => {
                soundEffects.playBeep(820, 0.03);
                setSelectedPhaseId(step.id);
              }}
              className={`px-3.5 py-2 rounded-xl border text-left whitespace-nowrap transition-all flex items-center gap-2.5 shrink-0 ${
                isSelected
                  ? 'bg-slate-900 border-sky-500 shadow-md ring-1 ring-sky-500/30 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'}`} />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{step.badge}</span>
                <span className="text-xs font-mono font-bold text-white">{step.timeframe}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Command Deck */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl flex flex-col gap-6">
        {/* Phase Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 uppercase">
                {activePhase.badge}
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">
                {activePhase.timeframe}
              </span>
            </div>
            <h2 className="text-lg font-black text-white font-mono mt-1">
              {activePhase.phase}
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {activePhase.summary}
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto font-mono text-xs">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Target Revenue Window</span>
            <span className="text-emerald-300 font-bold text-xs mt-0.5 block">{activePhase.revenueOpportunities}</span>
          </div>
        </div>

        {/* Live Operational Action Checklist */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-sky-400" />
              Operational Execution Checklist
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Check off tasks as completed
            </span>
          </div>

          <div className="space-y-2.5">
            {activePhase.actions.map((action, idx) => {
              const key = `${activePhase.id}_${idx}`;
              const isChecked = checkedActions[key] ?? false;

              return (
                <button
                  key={idx}
                  onClick={() => toggleAction(activePhase.id, idx)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'bg-slate-950/40 border-emerald-500/40 opacity-70'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-900 border-slate-700 text-transparent'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <div className="flex-1 font-mono text-xs">
                    <span className={`leading-relaxed ${isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {action}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Risks to Mitigate */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            Critical Risks to Mitigate During this Phase
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 font-mono text-xs">
            {activePhase.risksToMitigate.map((risk, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-rose-500/20 text-slate-300">
                <span className="text-rose-400 font-bold mr-1">•</span>
                {risk}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
