import { useState, FormEvent } from 'react';
import { ServerStats } from '../types';
import { SERVER_RULES } from '../data/mockData';
import { 
  Server, 
  Copy, 
  ExternalLink, 
  Check, 
  ShieldCheck, 
  BookOpen, 
  Car, 
  DollarSign, 
  Cpu, 
  HardDrive, 
  Gauge, 
  Award,
  Zap
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface ServerOverviewProps {
  stats: ServerStats;
}

const VEHICLE_CATALOG = [
  {
    name: 'Karin Sultan RS (Drift Spec)',
    category: 'Sports / Tuner',
    price: 185000,
    topSpeed: '138 MPH',
    handling: '9.4/10',
    description: 'Twin-turbo all-wheel drive legend. Dominates the Del Perro highway underground meets.'
  },
  {
    name: 'Bravado Buffalo STX',
    category: 'Muscle / Patrol',
    price: 145000,
    topSpeed: '142 MPH',
    handling: '8.8/10',
    description: 'V8 supercharged modern muscle. Standard high-speed interceptor package for LSPD.'
  },
  {
    name: 'Pegassi Zentorno V12',
    category: 'Super Exotic',
    price: 720000,
    topSpeed: '158 MPH',
    handling: '9.8/10',
    description: 'Lamborghini styling with extreme downforce. Rare import available at Luxury Autos.'
  },
  {
    name: 'Albany Buccaneer Custom',
    category: 'Lowrider / Classic',
    price: 95000,
    topSpeed: '118 MPH',
    handling: '7.9/10',
    description: 'Classic Benny’s hydraulic conversion with custom velvet trim and chrome wire spokes.'
  }
];

export default function ServerOverview({ stats }: ServerOverviewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedIp, setCopiedIp] = useState(false);
  
  // Whitelist quiz state
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [whitelistStatus, setWhitelistStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  const copyToClipboard = (text: string, type: 'link' | 'ip') => {
    soundEffects.playBeep(900, 0.05);
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      setCopiedIp(true);
      setTimeout(() => setCopiedIp(false), 2500);
    }
  };

  const handleQuizSubmit = (e: FormEvent) => {
    e.preventDefault();
    soundEffects.playDispatchAlert();
    if (q1 === 'b' && q2 === 'a') {
      setWhitelistStatus('approved');
    } else {
      setWhitelistStatus('rejected');
    }
  };

  return (
    <div id="server-overview-root" className="flex flex-col gap-6">
      {/* DIRECT CONNECT & HARDWARE TELEMETRY BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Join Server Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <Server className="w-64 h-64 text-emerald-400" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                FIVEM PRODUCTION CLUSTER • ONLINE
              </span>
              <span className="font-mono text-xs text-slate-400">BUILD {stats.gameBuild}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
              {stats.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Strict Serious Roleplay server featuring custom emergency departments, player-owned businesses, dynamic economy, and custom import vehicle dealerships.
            </p>

            {/* Connection Actions */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button
                id="btn-copy-cfx-url"
                onClick={() => copyToClipboard(stats.cfxUrl, 'link')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'CFX URL Copied!' : 'Copy Direct Connect URL'}
              </button>

              <button
                id="btn-copy-ip"
                onClick={() => copyToClipboard(`connect ${stats.ip}:${stats.port}`, 'ip')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
              >
                {copiedIp ? <Check className="w-4 h-4 text-emerald-400" /> : <ExternalLink className="w-4 h-4" />}
                {copiedIp ? 'F8 Console Command Copied!' : `F8: connect ${stats.ip}`}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">SLOTS OCCUPANCY</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                {stats.playersOnline} / {stats.maxPlayers} ({(stats.playersOnline / stats.maxPlayers * 100).toFixed(0)}%)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">NETWORK LATENCY</span>
              <span className="text-sky-400 font-mono font-bold text-sm">{stats.ping} ms (Low Jitter)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">TICKRATE</span>
              <span className="text-amber-400 font-mono font-bold text-sm">{stats.tickrate.toFixed(1)} Hz (Optimal)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">ONESYNC ARCH</span>
              <span className="text-purple-400 font-mono font-bold text-sm">OneSync Infinity</span>
            </div>
          </div>
        </div>

        {/* Server Hardware Health Meters */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Node Health Telemetry</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                HEALTHY
              </span>
            </div>

            {/* CPU Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" /> Dedicated CPU
                </span>
                <span className="font-mono text-white font-bold">{stats.cpuPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.cpuPercent}%` }}
                />
              </div>
            </div>

            {/* RAM Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-purple-400" /> Memory (RAM)
                </span>
                <span className="font-mono text-white font-bold">
                  {(stats.ramUsageMb / 1024).toFixed(1)} GB / {(stats.maxRamMb / 1024).toFixed(0)} GB
                </span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.ramUsageMb / stats.maxRamMb) * 100}%` }}
                />
              </div>
            </div>

            {/* Bandwidth throughput */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Bandwidth Throughput:</span>
              <span className="font-mono text-emerald-400 font-bold">48.2 MB/s In / Out</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>DDoS Protection: Cloudflare + Voxility</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* RULES & CITIZENSHIP APPLICATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Server Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Community & Roleplay Rules</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Violating these core standards leads to administrative warnings, vehicle seizure, or permanent server bans.
          </p>

          <div className="space-y-3">
            {SERVER_RULES.map((rule, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800/80 p-3 rounded-lg">
                <h4 className="text-xs font-bold text-amber-400 mb-1">{rule.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Whitelist Application Quiz */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-white">Citizenship Whitelist Evaluation</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Test your roleplay comprehension to claim citizen status and unlock priority queueing.
            </p>

            <form onSubmit={handleQuizSubmit} className="flex flex-col gap-4 text-xs">
              {/* Question 1 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <p className="font-semibold text-white mb-2">
                  1. You are robbed at gunpoint in an alleyway. What does "Fear RP / Value of Life" require you to do?
                </p>
                <div className="space-y-1.5 text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="q1" 
                      value="a" 
                      onChange={(e) => setQ1(e.target.value)} 
                    />
                    <span>Pull out a weapon instantly and engage in a quick-draw shootout.</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="q1" 
                      value="b" 
                      onChange={(e) => setQ1(e.target.value)} 
                    />
                    <span className="text-slate-200">Raise your hands, value your life, and comply with the robber’s demands.</span>
                  </label>
                </div>
              </div>

              {/* Question 2 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <p className="font-semibold text-white mb-2">
                  2. What does NLR (New Life Rule) mean if you are killed in a gang shootout and respawn?
                </p>
                <div className="space-y-1.5 text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="q2" 
                      value="a" 
                      onChange={(e) => setQ2(e.target.value)} 
                    />
                    <span className="text-slate-200">You forget all events leading to your death and cannot return to that scene.</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="q2" 
                      value="b" 
                      onChange={(e) => setQ2(e.target.value)} 
                    />
                    <span>Immediately grab another rifle, drive back, and seek revenge on the killers.</span>
                  </label>
                </div>
              </div>

              {whitelistStatus === 'approved' && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-lg text-emerald-400 font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Application Approved! You have been granted Whitelisted Citizen Status.
                </div>
              )}

              {whitelistStatus === 'rejected' && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/40 rounded-lg text-rose-400 font-semibold">
                  Failed evaluation. Please review the rules and retry to ensure quality RP standards.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg transition-colors text-xs"
              >
                Submit Whitelist Application
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ECONOMY & VEHICLE SHOWROOM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-base text-white">Featured In-Game Dealership Imports</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Premium Deluxe Motorsport Catalog</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {VEHICLE_CATALOG.map((veh) => (
            <div
              key={veh.name}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-sky-500/40 transition-all"
            >
              <div>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-950/40 border border-sky-800/30 px-2 py-0.5 rounded uppercase">
                  {veh.category}
                </span>
                <h4 className="font-bold text-sm text-white mt-2 mb-1">{veh.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{veh.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1 font-mono text-[11px]">
                  <span>Top Speed: <strong className="text-white">{veh.topSpeed}</strong></span>
                  <span>Handling: <strong className="text-emerald-400">{veh.handling}</strong></span>
                </div>
                <div className="flex items-center justify-between text-emerald-400 font-bold font-mono">
                  <span>Price:</span>
                  <span>${veh.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
