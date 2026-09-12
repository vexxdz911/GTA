import { useState, useMemo } from 'react';
import { 
  GTA6MonetizationStrategy, 
  GTA6StoreItem, 
  GTA6RevenueProjectionParams 
} from '../types';
import { 
  GTA6_MONETIZATION_STRATEGIES, 
  GTA6_STORE_ITEMS, 
  COMPLIANCE_GUIDELINES, 
  LAUNCH_ROADMAP_STEPS, 
  DEFAULT_PROJECTION_PARAMS 
} from '../data/gta6MonetizationData';
import ExecutiveBriefing from './gta6/ExecutiveBriefing';
import StakeholderEnginesView from './gta6/StakeholderEnginesView';
import HourByHourLaunchRoom from './gta6/HourByHourLaunchRoom';
import PolicyComplianceAuditor from './gta6/PolicyComplianceAuditor';
import HostingEconomicsMatrix from './gta6/HostingEconomicsMatrix';
import IndustrySourcesView from './gta6/IndustrySourcesView';
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Trophy, 
  Sparkles, 
  Building2, 
  Video, 
  Tv, 
  Code2, 
  Award, 
  ShieldCheck, 
  Calendar, 
  ShoppingCart, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  ArrowRight, 
  Sliders, 
  Layers, 
  Compass, 
  Calculator, 
  Store, 
  ExternalLink,
  Crown,
  BookOpen,
  Server,
  Clock,
  Users
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

type TabType = 'briefing' | 'stakeholders' | 'strategies' | 'hourbyhour' | 'calculator' | 'compliance' | 'infrastructure' | 'storefront' | 'sources';

export default function GTA6MonetizationHub() {
  const [activeTab, setActiveTab] = useState<TabType>('briefing');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedStrategy, setSelectedStrategy] = useState<GTA6MonetizationStrategy>(GTA6_MONETIZATION_STRATEGIES[0]);

  // Financial Modeling Parameters State
  const [params, setParams] = useState<GTA6RevenueProjectionParams>(DEFAULT_PROJECTION_PARAMS);

  // Storefront Simulator State
  const [storeItems, setStoreItems] = useState<GTA6StoreItem[]>(GTA6_STORE_ITEMS);
  const [storeCategory, setStoreCategory] = useState<string>('All');
  const [simulatedRevenue, setSimulatedRevenue] = useState<number>(48920);
  const [recentStorePurchases, setRecentStorePurchases] = useState<{ id: string; user: string; item: string; amount: number; time: string }[]>([
    { id: 'tx_101', user: 'ViceCityWhale_88', item: 'Vice City Day-1 Pioneer Founder Bundle', amount: 79.99, time: '2m ago' },
    { id: 'tx_102', user: 'GhostRider_FL', item: 'Leonida Express FastPass (30 Days)', amount: 24.99, time: '5m ago' },
    { id: 'tx_103', user: 'MiamiDripKing', item: 'Hyper-Exotic Neon Underglow & Sound FX Bundle', amount: 12.99, time: '9m ago' },
    { id: 'tx_104', user: 'CartelSyndicateBoss', item: 'Commercial Enterprise Concession: Malibu Club MLO', amount: 349.99, time: '14m ago' },
  ]);
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  // Strategy icons dictionary
  const strategyIcons: Record<string, typeof Zap> = {
    Zap,
    Trophy,
    Sparkles,
    Building2,
    Video,
    Tv,
    Code2,
    Award
  };

  // Filtered strategies
  const filteredStrategies = useMemo(() => {
    if (categoryFilter === 'All') return GTA6_MONETIZATION_STRATEGIES;
    return GTA6_MONETIZATION_STRATEGIES.filter(s => s.category.includes(categoryFilter) || categoryFilter.includes(s.category));
  }, [categoryFilter]);

  // Filtered store items
  const filteredStoreItems = useMemo(() => {
    if (storeCategory === 'All') return storeItems;
    return storeItems.filter(i => i.category === storeCategory);
  }, [storeItems, storeCategory]);

  // Financial Calculations
  const calculations = useMemo(() => {
    const prioBuyers = Math.round(params.launchPlayerbase * (params.priorityQueueConversionPercent / 100));
    const prioRev = prioBuyers * params.priorityQueuePriceUSD;

    const battlePassBuyers = Math.round(params.launchPlayerbase * (params.battlePassConversionPercent / 100));
    const battlePassRev = battlePassBuyers * params.battlePassPriceUSD;

    const cosmeticsBuyers = Math.round(params.launchPlayerbase * (params.cosmeticsConversionPercent / 100));
    const cosmeticsRev = cosmeticsBuyers * params.cosmeticsAvgSpendUSD;

    const franchiseRev = params.franchiseLicenseHolders * params.franchiseLicensePriceUSD;
    const sponsorRev = params.sponsorDealsCount * params.sponsorAvgDealUSD;

    const totalGrossDay1 = Math.round(prioRev * 0.7 + battlePassRev * 0.5 + cosmeticsRev * 0.4 + franchiseRev);
    const totalGrossMonth1 = Math.round(prioRev + battlePassRev + cosmeticsRev + franchiseRev + sponsorRev);

    const totalTransactions = prioBuyers + battlePassBuyers + cosmeticsBuyers + params.franchiseLicenseHolders + params.sponsorDealsCount;
    // Tebex: 5% platform commission (15% for FiveM server perks) + gateway fees = ~7.5% total
    const tebexFees = Math.round(totalGrossMonth1 * 0.075);
    // Direct Stripe: 2.9% + $0.30 per tx
    const stripeFees = Math.round((totalGrossMonth1 * 0.029) + (totalTransactions * 0.30));
    const tebexDivergence = tebexFees - stripeFees;

    const platformFees = tebexFees;
    const totalCosts = platformFees + params.monthlyServerInfraCostUSD;
    const netProfitMonth1 = Math.round(totalGrossMonth1 - totalCosts);

    const estimatedMRR = Math.round(prioRev * 0.75 + (cosmeticsRev * 0.6) + sponsorRev);

    return {
      prioBuyers,
      prioRev,
      battlePassBuyers,
      battlePassRev,
      cosmeticsBuyers,
      cosmeticsRev,
      franchiseRev,
      sponsorRev,
      totalGrossDay1,
      totalGrossMonth1,
      platformFees,
      tebexFees,
      stripeFees,
      tebexDivergence,
      totalTransactions,
      totalCosts,
      netProfitMonth1,
      estimatedMRR
    };
  }, [params]);

  // Handle storefront buy simulation
  const handleSimulatePurchase = (item: GTA6StoreItem) => {
    soundEffects.playBeep(920, 0.08);
    setSimulatedRevenue(prev => prev + item.priceUSD);
    
    // Update sales count
    setStoreItems(prev => prev.map(i => i.id === item.id ? { ...i, salesCount: i.salesCount + 1 } : i));

    // Random user name
    const randomUsers = ['ViperPilot', 'SunsetRacer', 'EvergladesKing', 'NeonViceCop', 'ScarfaceMiami', 'KeyWestFlyer'];
    const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)] + '_' + Math.floor(Math.random() * 900 + 100);

    const newTx = {
      id: `tx_${Date.now().toString().slice(-4)}`,
      user: randomUser,
      item: item.title,
      amount: item.priceUSD,
      time: 'Just now'
    };

    setRecentStorePurchases(prev => [newTx, ...prev.slice(0, 7)]);
    setPurchaseToast(`[TEBEX CHECKOUT] ${randomUser} purchased "${item.title}" for $${item.priceUSD.toFixed(2)} USD!`);

    setTimeout(() => {
      setPurchaseToast(null);
    }, 4000);
  };

  return (
    <div id="gta6-monetization-engine" className="flex-1 flex flex-col gap-5">
      {/* Top Banner with Vice City Aesthetic Glow */}
      <div className="relative overflow-hidden rounded-xl border border-pink-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-cyan-500/20 border border-pink-500/40 text-pink-400 shadow-md">
              <Flame className="w-7 h-7 text-pink-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase bg-pink-500/20 text-pink-300 border border-pink-500/40">
                  GTA 6 DAY-1 LAUNCH ENGINE
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800/60">
                  LEONIDA / VICE CITY
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase font-sans mt-0.5">
                GTA 6 Day-1 Monetization & Launch Revenue Engine
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                Comprehensive blueprint of every possible monetization mechanism for GTA 6 launch: Priority Queues, Battle Passes, Cosmetics, Franchises, Creator Affiliates, In-Game Ads, and Compliance Guardrails.
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 p-2.5 px-4 rounded-xl font-mono text-xs shadow-inner">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Projected Launch Gross</span>
              <span className="text-emerald-400 font-black text-base sm:text-lg">
                ${calculations.totalGrossDay1.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">Day 1</span>
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Month 1 Net Profit</span>
              <span className="text-pink-400 font-black text-base sm:text-lg">
                ${calculations.netProfitMonth1.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('briefing');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'briefing'
                ? 'bg-sky-600 text-white font-bold shadow-lg shadow-sky-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Executive Briefing</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('stakeholders');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'stakeholders'
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>4 Stakeholder Engines</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('strategies');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'strategies'
                ? 'bg-pink-600 text-white font-bold shadow-lg shadow-pink-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Revenue Playbooks ({GTA6_MONETIZATION_STRATEGIES.length})</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('hourbyhour');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'hourbyhour'
                ? 'bg-amber-600 text-white font-bold shadow-lg shadow-amber-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Hour-by-Hour Launch Room</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('calculator');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'calculator'
                ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Financial Modeler & Tebex</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('compliance');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'compliance'
                ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Jan 12 PLA & Disclaimer</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('infrastructure');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'infrastructure'
                ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Hosting & Hardware</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('storefront');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'storefront'
                ? 'bg-teal-600 text-white font-bold shadow-lg shadow-teal-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Compliant Store Simulator</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('sources');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'sources'
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>23 Sources</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {purchaseToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-lg text-xs font-mono flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{purchaseToast}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* 0. EXECUTIVE BRIEFING TAB */}
      {/* ==================================================== */}
      {activeTab === 'briefing' && <ExecutiveBriefing />}

      {/* ==================================================== */}
      {/* 0.1 4 STAKEHOLDER ENGINES TAB */}
      {/* ==================================================== */}
      {activeTab === 'stakeholders' && <StakeholderEnginesView />}

      {/* ==================================================== */}
      {/* 0.2 HOUR-BY-HOUR LAUNCH ROOM TAB */}
      {/* ==================================================== */}
      {activeTab === 'hourbyhour' && <HourByHourLaunchRoom />}

      {/* ==================================================== */}
      {/* 1. STRATEGIES BLUEPRINT TAB */}
      {/* ==================================================== */}
      {activeTab === 'strategies' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Strategies List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
                  Launch Revenue Channels
                </h3>
                <span className="text-[11px] font-mono text-slate-500">8 Channels</span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1 text-[11px] font-mono pb-1 border-b border-slate-800">
                {['All', 'Priority', 'Battle Pass', 'Cosmetics', 'Business', 'Streamer', 'Ads', 'Script'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      categoryFilter === cat
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Strategies List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredStrategies.map(strat => {
                  const isSelected = selectedStrategy.id === strat.id;
                  const Icon = strategyIcons[strat.iconName] || Zap;

                  return (
                    <div
                      key={strat.id}
                      onClick={() => {
                        soundEffects.playBeep(750, 0.03);
                        setSelectedStrategy(strat);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-slate-800/90 border-pink-500/60 shadow-lg ring-1 ring-pink-500/30'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-pink-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                              {strat.category}
                            </span>
                            <h4 className="text-xs font-bold text-white leading-tight mt-0.5">{strat.title}</h4>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 bg-slate-900 border border-slate-700 text-pink-300">
                          {strat.launchWindow}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/70">
                        <span className="text-slate-300 font-bold">{strat.pricePoint}</span>
                        <span className="text-emerald-400 font-bold">{strat.estimatedDay1Revenue}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Strategy Deep-Dive Details (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {selectedStrategy && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">
                        {selectedStrategy.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950 border border-cyan-800">
                        Window: {selectedStrategy.launchWindow}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1.5">{selectedStrategy.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {selectedStrategy.description}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right font-mono shrink-0">
                    <span className="text-[10px] text-slate-500 block">EST. DAY-1 BURST</span>
                    <span className="text-emerald-400 font-bold text-base">{selectedStrategy.estimatedDay1Revenue}</span>
                  </div>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Target Price Point</span>
                    <span className="text-xs font-bold text-white">{selectedStrategy.pricePoint}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Revenue Impact</span>
                    <span className="text-xs font-bold text-pink-400">{selectedStrategy.projectedRevenueImpact}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase">Expected Conversion</span>
                    <span className="text-xs font-bold text-cyan-400">{selectedStrategy.expectedConversionRate}</span>
                  </div>
                </div>

                {/* Implementation Roadmap / Action Steps */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-pink-400" />
                    Technical Implementation Architecture
                  </h4>
                  <div className="space-y-1.5">
                    {selectedStrategy.implementationDetails.map((detail, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-900 border border-pink-500/30 text-pink-400 text-[10px] font-mono flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Notes Safeguard */}
                <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-300 block">
                      Rockstar & CFX Policy Compliance Guarantee:
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {selectedStrategy.complianceNotes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. REVENUE CALCULATOR & FINANCIAL MODELING TAB */}
      {/* ==================================================== */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Controls & Sliders (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Day-1 Launch Projection Simulator
                </h3>
                <button
                  onClick={() => setParams(DEFAULT_PROJECTION_PARAMS)}
                  className="text-xs font-mono text-slate-400 hover:text-white"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="space-y-4">
                {/* Launch Playerbase Slider */}
                <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-bold">Total Expected Launch Playerbase</span>
                    <span className="text-cyan-400 font-black text-sm">{params.launchPlayerbase.toLocaleString()} Players</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="12000"
                    step="100"
                    value={params.launchPlayerbase}
                    onChange={(e) => setParams(p => ({ ...p, launchPlayerbase: Number(e.target.value) }))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block font-mono">
                    Estimated unique players connecting or queued during launch week.
                  </span>
                </div>

                {/* Priority Queue Pass */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">FastPass Queue Conversion</span>
                      <span className="text-pink-400 font-bold">{params.priorityQueueConversionPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="35"
                      step="1"
                      value={params.priorityQueueConversionPercent}
                      onChange={(e) => setParams(p => ({ ...p, priorityQueueConversionPercent: Number(e.target.value) }))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Pass Price: ${params.priorityQueuePriceUSD.toFixed(2)}</span>
                      <span className="text-emerald-400 font-bold">{calculations.prioBuyers} buyers</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">Battle Pass Conversion</span>
                      <span className="text-cyan-400 font-bold">{params.battlePassConversionPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="1"
                      value={params.battlePassConversionPercent}
                      onChange={(e) => setParams(p => ({ ...p, battlePassConversionPercent: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Season Pass: ${params.battlePassPriceUSD.toFixed(2)}</span>
                      <span className="text-emerald-400 font-bold">{calculations.battlePassBuyers} buyers</span>
                    </div>
                  </div>
                </div>

                {/* Cosmetics & Commercial Franchises */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">Cosmetics Shopper Share</span>
                      <span className="text-purple-400 font-bold">{params.cosmeticsConversionPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="25"
                      step="1"
                      value={params.cosmeticsConversionPercent}
                      onChange={(e) => setParams(p => ({ ...p, cosmeticsConversionPercent: Number(e.target.value) }))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Avg Spend: ${params.cosmeticsAvgSpendUSD.toFixed(2)}</span>
                      <span className="text-emerald-400 font-bold">${calculations.cosmeticsRev.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300">Business Concessions</span>
                      <span className="text-amber-400 font-bold">{params.franchiseLicenseHolders} Venues</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="25"
                      step="1"
                      value={params.franchiseLicenseHolders}
                      onChange={(e) => setParams(p => ({ ...p, franchiseLicenseHolders: Number(e.target.value) }))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>License Fee: ${params.franchiseLicensePriceUSD.toFixed(2)}</span>
                      <span className="text-emerald-400 font-bold">${calculations.franchiseRev.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Brand Sponsorships & Server Overhead */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs font-mono text-slate-300 block">External Brand Sponsorships</span>
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span>{params.sponsorDealsCount} Brand Deals @ ${params.sponsorAvgDealUSD.toLocaleString()}</span>
                      <span className="text-emerald-400 font-bold">${calculations.sponsorRev.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs font-mono text-slate-300 block">Server & Anti-DDoS Overhead</span>
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-rose-400 font-bold">-${params.monthlyServerInfraCostUSD.toLocaleString()} / mo</span>
                      <span className="text-slate-500 text-[10px]">Tier-4 Datacenter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Summary P&L (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Crown className="w-4 h-4 text-emerald-400" />
                Executive P&L Financial Projections
              </h3>

              {/* Big Metrics Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/30 text-left font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase">Day-1 Launch Burst</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400">
                    ${calculations.totalGrossDay1.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">Gross Day-1 Volume</span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-pink-500/30 text-left font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase">Month-1 Net Profit</span>
                  <span className="text-xl sm:text-2xl font-black text-pink-400">
                    ${calculations.netProfitMonth1.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">After Fees & Infra</span>
                </div>
              </div>

              {/* Revenue Stream Breakdown */}
              <div className="space-y-2 font-mono text-xs">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Gross Inflow Streams</span>
                
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">FastPass Priority Queues</span>
                  <span className="text-emerald-400 font-bold">${calculations.prioRev.toLocaleString()}</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Season 1 Battle Pass</span>
                  <span className="text-emerald-400 font-bold">${calculations.battlePassRev.toLocaleString()}</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Cosmetics & Custom 3D Drip</span>
                  <span className="text-emerald-400 font-bold">${calculations.cosmeticsRev.toLocaleString()}</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Commercial MLO Franchises</span>
                  <span className="text-emerald-400 font-bold">${calculations.franchiseRev.toLocaleString()}</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">In-Game Billboards & Sponsors</span>
                  <span className="text-emerald-400 font-bold">${calculations.sponsorRev.toLocaleString()}</span>
                </div>
              </div>

              {/* Outflows & Net */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/90 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Gross 30-Day Inflow:</span>
                  <span className="text-white font-bold">${calculations.totalGrossMonth1.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-rose-400">
                  <span>Tebex Blended Platform Fee (~7.5%):</span>
                  <span>-${calculations.tebexFees.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-rose-400">
                  <span>Server & Redis Cluster Hosting:</span>
                  <span>-${params.monthlyServerInfraCostUSD.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-emerald-400 font-bold text-sm">
                  <span>Estimated Recurring MRR:</span>
                  <span>${calculations.estimatedMRR.toLocaleString()} / mo</span>
                </div>
              </div>

              {/* Tebex vs Direct Gateway Fee Footprint Analysis */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2.5 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-300 font-bold text-[11px] uppercase tracking-wider">Gateway Fee Footprint</span>
                  <span className="text-[10px] text-sky-400">Section 4A Analysis</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Tebex (5-15% + 2.5%)</span>
                    <span className="text-rose-400 font-bold text-xs">${calculations.tebexFees.toLocaleString()}</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Official MoR & Tax</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Direct Stripe (2.9%+$0.30)</span>
                    <span className="text-emerald-400 font-bold text-xs">${calculations.stripeFees.toLocaleString()}</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Self-Managed Gateway</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 leading-tight">
                  <span className="font-bold text-amber-200">MoR Tradeoff: </span>
                  Tebex route costs an extra <span className="font-bold text-white">${calculations.tebexDivergence.toLocaleString()}/mo</span>, but assumes all VAT/sales tax liabilities, fraud disputes, and auto-delivers in-game commands.
                </div>
              </div>

              {/* Chargeback Risk & Anti-Fraud Guard */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-rose-500/30 flex flex-col gap-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-rose-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Chargeback Risk Threshold
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">Current: 0.35% (Safe)</span>
                </div>

                {/* Progress Gauge */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '38%' }} />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>0.0% Clean</span>
                  <span className="text-rose-400 font-bold">0.9% Visa/MC Hard Cap</span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                  Digital goods merchants face friendly fraud rates <span className="text-rose-300 font-bold">37.1% higher</span> than physical commerce. Chargeback ratios exceeding 0.9% trigger processor termination.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. TEBEX STOREFRONT SIMULATOR TAB */}
      {/* ==================================================== */}
      {activeTab === 'storefront' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Storefront Catalog (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Official CFX / Tebex Web Store Simulator
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {['All', 'Queue Passes', 'VIP & Identity', 'Apparel & Drip', 'Vehicles & Liveries', 'Properties & Decor'].map(c => (
                    <button
                      key={c}
                      onClick={() => setStoreCategory(c)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        storeCategory === c
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredStoreItems.map(item => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between gap-3 shadow-md hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          {item.badge}
                        </span>
                        <span className="text-sm font-black font-mono text-emerald-400">
                          ${item.priceUSD.toFixed(2)} USD
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mt-1.5">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-slate-500 block">Package Includes:</span>
                        {item.includes.slice(0, 3).map((inc, idx) => (
                          <div key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5 font-mono">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">{item.salesCount} purchases</span>
                      <button
                        onClick={() => handleSimulatePurchase(item)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Simulate Purchase</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Store Ledger & Tebex Webhook Feed (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono">
                <span className="text-xs font-bold text-slate-300 uppercase">Live Webhook Store Stream</span>
                <span className="text-emerald-400 font-bold text-xs">${simulatedRevenue.toLocaleString()} Vol</span>
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                Real-time simulated Tebex checkout webhooks notifying Discord & auto-whitelisting priority queues:
              </span>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1 font-mono text-xs">
                {recentStorePurchases.map(tx => (
                  <div key={tx.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-cyan-400 font-bold">{tx.user}</span>
                      <span className="text-emerald-400 font-bold">+${tx.amount.toFixed(2)}</span>
                    </div>
                    <span className="text-slate-300 text-[11px] line-clamp-1">{tx.item}</span>
                    <span className="text-[9px] text-slate-500">{tx.time} via Tebex Escrow API</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. COMPLIANCE & LEGAL SAFE-HARBOR TAB */}
      {/* ==================================================== */}
      {activeTab === 'compliance' && <PolicyComplianceAuditor />}

      {/* ==================================================== */}
      {/* 5. HOSTING ECONOMICS & HARDWARE SIZER TAB */}
      {/* ==================================================== */}
      {activeTab === 'infrastructure' && <HostingEconomicsMatrix />}

      {/* ==================================================== */}
      {/* 6. VERIFIED INDUSTRY SOURCES & BIBLIOGRAPHY TAB */}
      {/* ==================================================== */}
      {activeTab === 'sources' && <IndustrySourcesView />}
    </div>
  );
}
