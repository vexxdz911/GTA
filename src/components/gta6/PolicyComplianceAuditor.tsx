import { useState } from 'react';
import { PLA_PROHIBITIONS } from '../../data/gta6MonetizationData';
import { 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  FileText, 
  HelpCircle, 
  Scale,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { soundEffects } from '../../utils/audio';

export default function PolicyComplianceAuditor() {
  const [serverName, setServerName] = useState('Vice City Underground RP');
  const [operatorContact, setOperatorContact] = useState('billing@vicecityrp.gg / Discord: .gg/vicecityrp');
  const [copiedDisclaimer, setCopiedDisclaimer] = useState(false);

  // Live Audit State (operators checking off their compliance)
  const [complianceChecks, setComplianceChecks] = useState<Record<string, boolean>>({
    pla_clause_1: true,
    pla_clause_2: true,
    pla_clause_3: true,
    pla_clause_4: true,
    pla_clause_5: true,
    pla_clause_6: true,
    pla_clause_7: true,
    pla_clause_8: true,
  });

  const toggleCheck = (id: string) => {
    soundEffects.playBeep(850, 0.03);
    setComplianceChecks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const compliantCount = Object.values(complianceChecks).filter(Boolean).length;
  const complianceScore = Math.round((compliantCount / PLA_PROHIBITIONS.length) * 100);

  const disclaimerText = `${serverName.toUpperCase()} IS NOT APPROVED, SPONSORED, OR ENDORSED BY ROCKSTAR GAMES.\n\nOperator Contact: ${operatorContact}\nAll trademarks, logos, and game assets belong to their respective copyright holders (Take-Two Interactive / Rockstar Games). Commercial sales are processed exclusively through authorized merchant rails.`;

  const handleCopyDisclaimer = () => {
    navigator.clipboard.writeText(disclaimerText);
    soundEffects.playSuccess();
    setCopiedDisclaimer(true);
    setTimeout(() => setCopiedDisclaimer(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Compliance Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Policy Standard</span>
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Scale className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-black font-mono text-white">Jan 12, 2026 PLA</span>
            <span className="text-xs text-slate-400 block mt-1">
              Rockstar Roleplay Server Policy & Creator Platform License Agreement.
            </span>
          </div>
          <span className="text-[10px] font-mono text-sky-400 mt-2 font-bold">
            8 Codified Commercial Prohibitions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Your Compliance Score</span>
            <span className={`p-1.5 rounded-lg ${complianceScore === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className={`text-3xl font-black font-mono ${complianceScore === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {complianceScore}%
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              {complianceScore === 100 ? 'Server is 100% compliant with Rockstar & Cfx rules.' : 'Warning: Risk of C&D or Tebex store delisting.'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-2 font-bold">
            {compliantCount} of 8 clauses verified
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Sole Payment Rail</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-black font-mono text-purple-400">Tebex Exclusive</span>
            <span className="text-xs text-slate-400 block mt-1">
              Acquired by Overwolf for $29M; 5% platform cut (15% for FiveM), 7-8% total fee.
            </span>
          </div>
          <span className="text-[10px] font-mono text-purple-400 mt-2 font-bold">
            Required for in-game perk linking
          </span>
        </div>
      </div>

      {/* Mandatory Disclaimer Generator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Mandatory Disclaimer Generator (PLA Section 2 Compliance)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rockstar Games requires all custom servers to prominently display a non-endorsement notice and clear operator contact info.
            </p>
          </div>
          <button
            onClick={handleCopyDisclaimer}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition-colors self-start sm:self-auto"
          >
            {copiedDisclaimer ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedDisclaimer ? 'Copied to Clipboard!' : 'Copy Disclaimer Text'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Custom Server Name</label>
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. Vice City Underground RP"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Operator Support Contact</label>
            <input
              type="text"
              value={operatorContact}
              onChange={(e) => setOperatorContact(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. support@myserver.com / Discord URL"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed">
          {disclaimerText}
        </div>
      </div>

      {/* The 8 Codified Prohibited Commercial Exploitations */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              The Eight Codified PLA Prohibited Commercial Exploitations
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and audit your monetization models against the Jan 12, 2026 Platform License Agreement.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Click to verify
          </span>
        </div>

        <div className="space-y-3">
          {PLA_PROHIBITIONS.map((rule) => {
            const isChecked = complianceChecks[rule.id] ?? false;

            return (
              <div 
                key={rule.id}
                className={`p-4 rounded-xl border transition-all ${
                  isChecked 
                    ? 'bg-slate-950/70 border-slate-800' 
                    : 'bg-rose-950/20 border-rose-500/50 shadow-lg ring-1 ring-rose-500/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCheck(rule.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                        isChecked
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-rose-500/20 border-rose-500 text-rose-400'
                      }`}
                    >
                      {isChecked ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">Clause {rule.clauseNumber}:</span>
                        <h4 className="text-xs font-bold text-white font-mono">{rule.title}</h4>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase self-start sm:self-auto ${
                    rule.severity === 'Critical / Instant Blacklist'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {rule.severity}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">
                      Strictly Prohibited:
                    </span>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {rule.prohibition}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                      Compliant Execution:
                    </span>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {rule.compliantAlternative}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
