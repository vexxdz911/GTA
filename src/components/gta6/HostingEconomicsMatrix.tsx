import { useState } from 'react';
import { HOSTING_PROVIDERS } from '../../data/gta6MonetizationData';
import { 
  Server, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Zap, 
  DollarSign, 
  Activity, 
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { soundEffects } from '../../utils/audio';

export default function HostingEconomicsMatrix() {
  const [targetCCU, setTargetCCU] = useState<number>(512);

  // Dynamic infrastructure estimation
  const getHostingTier = (ccu: number) => {
    if (ccu <= 128) {
      return {
        recommended: 'GravelHost / Zap-Hosting Tier 1',
        costEst: '$25 - $50 / month',
        ram: '8 GB - 16 GB DDR4/DDR5',
        cores: '4 vCPU (Ryzen 9 5900X)',
        storage: '60 GB NVMe',
        dbSpec: 'Managed MySQL Instance'
      };
    } else if (ccu <= 512) {
      return {
        recommended: 'RocketNode Extreme / xREALM Partner Tier',
        costEst: '$80 - $140 / month',
        ram: '24 GB - 32 GB DDR5',
        cores: '8 vCPU (Ryzen 9 7950X @ 5.0GHz+)',
        storage: '150 GB NVMe Gen4',
        dbSpec: 'Dedicated Redis + PostgreSQL'
      };
    } else if (ccu <= 1024) {
      return {
        recommended: 'Dual-Node xREALM / RocketNode Dedicated',
        costEst: '$180 - $280 / month',
        ram: '48 GB - 64 GB DDR5 ECC',
        cores: '12-16 Dedicated Cores (Ryzen 9 9900X)',
        storage: '500 GB NVMe RAID 1',
        dbSpec: 'Separate Database Server + Kafka Event Bus'
      };
    } else {
      return {
        recommended: 'Enterprise Bare-Metal (Path.net Protected)',
        costEst: '$350 - $600 / month',
        ram: '64 GB - 128 GB DDR5 6000MHz',
        cores: 'AMD Ryzen 9 9950X (16 Cores / 32 Threads @ 5.7GHz)',
        storage: 'Dual 1TB NVMe Enterprise RAID 1',
        dbSpec: 'PostgreSQL 1M-Player Load-Tested Cluster + Kafka'
      };
    }
  };

  const tier = getHostingTier(targetCCU);

  return (
    <div className="flex flex-col gap-6">
      {/* Interactive CCU Infrastructure Calculator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Day-1 Concurrency & Server Hardware Sizer
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Estimate required CPU clock speeds, RAM footprints, and hosting budgets based on player concurrency.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            OneSync Infinity: 2,048 Player Cap
          </span>
        </div>

        {/* CCU Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-slate-400">Target Peak Concurrent Players (CCU)</span>
            <span className="text-sm font-black text-white px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
              {targetCCU} Players
            </span>
          </div>
          <input
            type="range"
            min="64"
            max="2048"
            step="64"
            value={targetCCU}
            onChange={(e) => {
              soundEffects.playBeep(900, 0.02);
              setTargetCCU(Number(e.target.value));
            }}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>64 (Starter Community)</span>
            <span>512 (Mid-Tier Hub)</span>
            <span>1,024 (Major RP Server)</span>
            <span>2,048 (NoPixel-Scale Peak)</span>
          </div>
        </div>

        {/* Dynamic Hardware Recommendation Box */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/90 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Recommended Tier</span>
            <span className="text-white font-bold text-xs mt-0.5 block">{tier.recommended}</span>
            <span className="text-emerald-400 font-bold text-xs mt-1 block">{tier.costEst}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Compute & Cores</span>
            <span className="text-sky-300 font-bold text-xs mt-0.5 block">{tier.cores}</span>
            <span className="text-slate-400 text-[11px] mt-1 block">5.0GHz+ Single-Core Priority</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Memory & Disk</span>
            <span className="text-amber-300 font-bold text-xs mt-0.5 block">{tier.ram}</span>
            <span className="text-slate-400 text-[11px] mt-1 block">{tier.storage}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Database & Event Bus</span>
            <span className="text-purple-300 font-bold text-xs mt-0.5 block">{tier.dbSpec}</span>
            <span className="text-slate-400 text-[11px] mt-1 block">Tebex Webhook Optimized</span>
          </div>
        </div>
      </div>

      {/* Provider Economics Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              Verified Hosting Providers & Economics Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative specs, slot capacities, official Cfx partnerships, and DDoS mitigation thresholds.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Geekflare 2026 Benchmarks [14]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HOSTING_PROVIDERS.map((provider) => (
            <div 
              key={provider.id}
              className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{provider.name}</span>
                  </div>
                  {provider.isOfficialPartner ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                      Official Partner
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
                      Independent
                    </span>
                  )}
                </div>

                <div className="mt-2.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Starting Price</span>
                  <span className="text-sm font-black font-mono text-emerald-400">{provider.startingPrice}</span>
                </div>

                <div className="mt-2 text-xs font-mono space-y-1.5">
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">{provider.specs}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">{provider.ddosMitigation}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {provider.notes}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-400">Slots:</span>
                <span className="text-white font-bold">{provider.recommendedSlots}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
