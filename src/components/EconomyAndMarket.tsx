import { useState } from 'react';
import { EconomyJob, PlayerBusiness, MarketCommodity } from '../types';
import { 
  ECONOMY_JOBS, 
  PLAYER_BUSINESSES, 
  MARKET_COMMODITIES 
} from '../data/assetsAndEconomyData';
import { 
  Briefcase, 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  Clock, 
  AlertTriangle, 
  Check, 
  Flame, 
  ShieldCheck, 
  ArrowUpRight, 
  ShoppingCart, 
  Sparkles,
  PieChart
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface EconomyAndMarketProps {
  playerCash: number;
  onAddCash: (amount: number) => void;
  onDeductCash: (amount: number) => void;
}

export default function EconomyAndMarket({
  playerCash,
  onAddCash,
  onDeductCash
}: EconomyAndMarketProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'businesses' | 'market'>('jobs');
  const [jobCategoryFilter, setJobCategoryFilter] = useState<'All' | 'legal' | 'illegal'>('All');

  // Jobs state
  const [jobs] = useState<EconomyJob[]>(ECONOMY_JOBS);
  const [selectedJob, setSelectedJob] = useState<EconomyJob>(ECONOMY_JOBS[0]);
  const [activeJobShift, setActiveJobShift] = useState<{ jobId: string; progress: number } | null>(null);

  // Businesses state
  const [businesses, setBusinesses] = useState<PlayerBusiness[]>(PLAYER_BUSINESSES);
  const [selectedBusiness, setSelectedBusiness] = useState<PlayerBusiness>(PLAYER_BUSINESSES[0]);

  // Market commodities state
  const [commodities, setCommodities] = useState<MarketCommodity[]>(MARKET_COMMODITIES);
  const [selectedCommodity, setSelectedCommodity] = useState<MarketCommodity>(MARKET_COMMODITIES[0]);
  const [tradeQuantity, setTradeQuantity] = useState<number>(1);
  const [tradeToast, setTradeToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setTradeToast(msg);
    soundEffects.playBeep(850, 0.06);
    setTimeout(() => setTradeToast(null), 3500);
  };

  // Filtered jobs
  const filteredJobs = jobs.filter(j => {
    if (jobCategoryFilter === 'All') return true;
    return j.type === jobCategoryFilter;
  });

  // Handle shift start & completion simulator
  const handleStartShift = (job: EconomyJob) => {
    if (activeJobShift) return;
    soundEffects.playRadioChirp();
    setActiveJobShift({ jobId: job.id, progress: 10 });

    const interval = setInterval(() => {
      setActiveJobShift(prev => {
        if (!prev) return null;
        if (prev.progress >= 100) {
          clearInterval(interval);
          onAddCash(job.wagePerShift);
          soundEffects.playBeep(980, 0.1);
          showToast(`Shift Completed: "${job.title}". Paid $${job.wagePerShift.toLocaleString()} in clean cash.`);

          // Simulate economic ripple effect on commodities
          if (job.id === 'job_mining') {
            setCommodities(prevComms => prevComms.map(c => 
              c.symbol === 'STEEL' ? { ...c, supplyUnits: c.supplyUnits + 150, currentPrice: Math.max(120, c.currentPrice - 3) } : c
            ));
          } else if (job.id === 'job_weed_grow') {
            setCommodities(prevComms => prevComms.map(c => 
              c.symbol === 'WEED' ? { ...c, supplyUnits: c.supplyUnits + 45, currentPrice: Math.max(800, c.currentPrice - 15) } : c
            ));
          }

          return null;
        }
        return { ...prev, progress: prev.progress + 30 };
      });
    }, 600);
  };

  // Handle Business action
  const handleBusinessAction = (action: 'restock' | 'promo' | 'payroll') => {
    if (!selectedBusiness) return;
    const bizId = selectedBusiness.id;

    if (action === 'restock') {
      const cost = 5000;
      if (playerCash < cost) {
        showToast('Insufficient personal or business funds for inventory delivery ($5,000 required).');
        return;
      }
      onDeductCash(cost);
      setBusinesses(prev => prev.map(b => {
        if (b.id === bizId) {
          const newStock = Math.min(100, b.currentStockPercent + 15);
          return {
            ...b,
            currentStockPercent: newStock,
            recentTransactions: [
              {
                id: `tx_${Date.now()}`,
                time: 'Just now',
                description: 'Wholesale pallet inventory delivery restock',
                amount: cost,
                type: 'debit'
              },
              ...b.recentTransactions
            ]
          };
        }
        return b;
      }));
      showToast(`Restocked ${selectedBusiness.name}! Inventory capacity now +15%.`);
    } else if (action === 'promo') {
      const cost = 3500;
      onDeductCash(cost);
      setBusinesses(prev => prev.map(b => {
        if (b.id === bizId) {
          const newPop = Math.min(100, b.customerPopularity + 4);
          return {
            ...b,
            customerPopularity: newPop,
            dailyRevenue: b.dailyRevenue + 4500,
            recentTransactions: [
              {
                id: `tx_${Date.now()}`,
                time: 'Just now',
                description: 'Weazel News radio ad campaign promotion',
                amount: cost,
                type: 'debit'
              },
              ...b.recentTransactions
            ]
          };
        }
        return b;
      }));
      showToast(`Radio ad campaign launched! Popularity reached ${Math.min(100, selectedBusiness.customerPopularity + 4)}%.`);
    } else if (action === 'payroll') {
      setBusinesses(prev => prev.map(b => {
        if (b.id === bizId) {
          return {
            ...b,
            recentTransactions: [
              {
                id: `tx_${Date.now()}`,
                time: 'Just now',
                description: `Staff bonus & payroll distribution (${b.employeesCount} employees)`,
                amount: b.employeesCount * 800,
                type: 'debit'
              },
              ...b.recentTransactions
            ]
          };
        }
        return b;
      }));
      showToast(`Employee payroll processed for ${selectedBusiness.employeesCount} staff members.`);
    }

    // Refresh selectedBusiness state
    setTimeout(() => {
      setSelectedBusiness(prev => businesses.find(b => b.id === prev.id) || prev);
    }, 50);
  };

  // Handle Trade Execution
  const handleExecuteTrade = (action: 'buy' | 'sell') => {
    if (!selectedCommodity || tradeQuantity <= 0) return;
    const totalCost = selectedCommodity.currentPrice * tradeQuantity;

    if (action === 'buy') {
      if (playerCash < totalCost) {
        showToast(`Insufficient funds. Need $${totalCost.toLocaleString()} to purchase ${tradeQuantity} units.`);
        return;
      }
      onDeductCash(totalCost);
      // Buying reduces supply and drives price slightly up
      setCommodities(prev => prev.map(c => {
        if (c.id === selectedCommodity.id) {
          const newSupply = Math.max(10, c.supplyUnits - tradeQuantity);
          const newPrice = Math.round(c.currentPrice * 1.02);
          return { ...c, supplyUnits: newSupply, currentPrice: newPrice };
        }
        return c;
      }));
      showToast(`Purchased ${tradeQuantity}x ${selectedCommodity.name} for $${totalCost.toLocaleString()}.`);
    } else {
      onAddCash(totalCost);
      // Selling increases supply and drives price slightly down
      setCommodities(prev => prev.map(c => {
        if (c.id === selectedCommodity.id) {
          const newSupply = c.supplyUnits + tradeQuantity;
          const newPrice = Math.max(20, Math.round(c.currentPrice * 0.98));
          return { ...c, supplyUnits: newSupply, currentPrice: newPrice };
        }
        return c;
      }));
      showToast(`Sold ${tradeQuantity}x ${selectedCommodity.name} for $${totalCost.toLocaleString()} to exchange.`);
    }

    setTimeout(() => {
      setSelectedCommodity(prev => commodities.find(c => c.id === prev.id) || prev);
    }, 50);
  };

  return (
    <div id="economy-and-marketplace-system" className="flex-1 flex flex-col gap-5">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase font-sans">
              San Andreas Dynamic Economy & Marketplace
            </h2>
            <p className="text-xs text-slate-400">
              Player-run businesses, legal & illicit labor markets, dynamic supply/demand commodity pricing
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('jobs');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'jobs'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Jobs Board ({jobs.length})</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('businesses');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'businesses'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Player Businesses</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('market');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'market'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Commodity Exchange</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {tradeToast && (
        <div className="bg-amber-500/10 border border-amber-500/40 text-amber-300 px-4 py-2.5 rounded-lg text-xs font-mono flex items-center gap-2 shadow-lg animate-fade-in">
          <Check className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{tradeToast}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* 1. JOBS BOARD: LEGAL & ILLEGAL JOBS & ECONOMIC IMPACT */}
      {/* ==================================================== */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Jobs List (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  Labor Exchange & Employment Board
                </h3>
                <div className="flex items-center gap-1">
                  {(['All', 'legal', 'illegal'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setJobCategoryFilter(f)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono capitalize font-semibold transition-colors ${
                        jobCategoryFilter === f
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jobs Grid */}
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {filteredJobs.map(job => {
                  const isSelected = selectedJob.id === job.id;
                  const isBusy = activeJobShift?.jobId === job.id;

                  return (
                    <div
                      key={job.id}
                      onClick={() => {
                        soundEffects.playBeep(750, 0.03);
                        setSelectedJob(job);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800/90 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              job.type === 'legal'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {job.type}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">{job.category}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">{job.title}</h4>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-xs font-black text-amber-400">${job.wagePerShift.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500 block">/ SHIFT</span>
                        </div>
                      </div>

                      {/* Active Progress Bar if this job is underway */}
                      {isBusy && activeJobShift && (
                        <div className="mt-2.5 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                          <div
                            className="bg-amber-400 h-full transition-all duration-300"
                            style={{ width: `${activeJobShift.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Job Inspector & Shift Simulator (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {selectedJob && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase font-bold text-amber-400">{selectedJob.category}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{selectedJob.title}</h3>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-500 block">LEGAL RISK TIER</span>
                    <span className={`text-xs font-bold ${selectedJob.type === 'legal' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedJob.riskLevel}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {selectedJob.description}
                </p>

                {/* How Player Actions Impact the Economy */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col gap-1.5">
                  <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    How Player Actions Impact the Macro Economy
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedJob.impactOnEconomy}
                  </p>
                </div>

                {/* Tasks Breakdown */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Shift Work Checklist</span>
                  <div className="space-y-1 text-xs">
                    {selectedJob.tasks.map((task, idx) => (
                      <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 text-slate-300 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clock In / Start Shift Button */}
                <div className="pt-2">
                  <button
                    disabled={Boolean(activeJobShift)}
                    onClick={() => handleStartShift(selectedJob)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                      activeJobShift
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-98'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>
                      {activeJobShift ? `Shift In Progress (${activeJobShift.progress}%)...` : `Clock In & Complete Shift (Earn $${selectedJob.wagePerShift.toLocaleString()})`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. PLAYER-OWNED & MANAGED BUSINESSES */}
      {/* ==================================================== */}
      {activeTab === 'businesses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Business Directory (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Player Enterprises & Storefronts
              </h3>

              <div className="space-y-2.5">
                {businesses.map(biz => {
                  const isSelected = selectedBusiness.id === biz.id;
                  return (
                    <div
                      key={biz.id}
                      onClick={() => {
                        soundEffects.playBeep(750, 0.03);
                        setSelectedBusiness(biz);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800/90 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">{biz.businessType}</span>
                          <h4 className="text-sm font-bold text-white">{biz.name}</h4>
                          <span className="text-xs text-slate-400 font-mono">Owner: {biz.owner}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-xs font-bold text-emerald-400">+${biz.dailyRevenue.toLocaleString()}</span>
                          <span className="text-[9px] text-slate-500 block">DAILY GROSS</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                        <span>Stock: {biz.currentStockPercent}%</span>
                        <span>Popularity: {biz.customerPopularity}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Business Management Dashboard (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {selectedBusiness && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase font-bold text-amber-400">Enterprise Balance Sheet</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{selectedBusiness.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">{selectedBusiness.location}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-500 block">COMMERCIAL VALUATION</span>
                    <span className="text-sm font-black text-amber-300">${selectedBusiness.valuation.toLocaleString()}</span>
                  </div>
                </div>

                {/* Financial Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">BUSINESS TREASURY</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-400">${selectedBusiness.bankBalance.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">DAILY EXPENSE UPKEEP</span>
                    <span className="text-xs sm:text-sm font-bold text-rose-400">-${selectedBusiness.dailyUpkeep.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">ACTIVE PAYROLL STAFF</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-200">{selectedBusiness.employeesCount} Employees</span>
                  </div>
                </div>

                {/* Management Action Buttons */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Owner Management Controls</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleBusinessAction('restock')}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-200 text-xs font-bold flex flex-col items-center gap-1 transition-colors"
                    >
                      <Package className="w-4 h-4 text-emerald-400" />
                      <span>Order Restock Pallet</span>
                      <span className="text-[10px] font-mono text-slate-400">Cost: $5,000</span>
                    </button>

                    <button
                      onClick={() => handleBusinessAction('promo')}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-slate-200 text-xs font-bold flex flex-col items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Radio Ad Campaign</span>
                      <span className="text-[10px] font-mono text-slate-400">Cost: $3,500</span>
                    </button>

                    <button
                      onClick={() => handleBusinessAction('payroll')}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-500/50 text-slate-200 text-xs font-bold flex flex-col items-center gap-1 transition-colors"
                    >
                      <Users className="w-4 h-4 text-sky-400" />
                      <span>Distribute Payroll</span>
                      <span className="text-[10px] font-mono text-slate-400">{selectedBusiness.employeesCount} Staff</span>
                    </button>
                  </div>
                </div>

                {/* Transaction Ledger */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Recent Enterprise Transactions</span>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {selectedBusiness.recentTransactions.map(tx => (
                      <div
                        key={tx.id}
                        className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between font-mono text-xs"
                      >
                        <div>
                          <span className="text-slate-300 block">{tx.description}</span>
                          <span className="text-[10px] text-slate-500">{tx.time}</span>
                        </div>
                        <span className={tx.type === 'credit' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. DYNAMIC COMMODITY MARKETPLACE */}
      {/* ==================================================== */}
      {activeTab === 'market' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Commodities Live Board (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  San Andreas Commodity Ticker & Contraband Exchange
                </h3>
                <span className="text-xs font-mono text-slate-400">Live Server Liquidity</span>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {commodities.map(comm => {
                  const isSelected = selectedCommodity.id === comm.id;
                  const isPositive = comm.priceChange24h >= 0;

                  return (
                    <div
                      key={comm.id}
                      onClick={() => {
                        soundEffects.playBeep(750, 0.03);
                        setSelectedCommodity(comm);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-white">
                          {comm.symbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{comm.name}</h4>
                            {comm.isIllegal && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                                ILLICIT
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            Supply: {comm.supplyUnits.toLocaleString()} {comm.unit}
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-sm font-bold text-white">${comm.currentPrice.toLocaleString()}</span>
                        <div className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{isPositive ? '+' : ''}{comm.priceChange24h}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trade Execution Terminal (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {selectedCommodity && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase font-bold">{selectedCommodity.category}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{selectedCommodity.name}</h3>
                    <span className="text-xs font-mono text-slate-400">Unit: {selectedCommodity.unit}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-500 block">SPOT PRICE</span>
                    <span className="text-lg font-black text-emerald-400">${selectedCommodity.currentPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Macro Economic Driver Explanation */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-mono font-bold text-amber-300 block mb-1">
                    Market Driver & Player Impact:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedCommodity.economicDriver}
                  </p>
                </div>

                {/* Trade Order Box */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>ORDER QUANTITY:</span>
                    <div className="flex items-center gap-1">
                      {[1, 5, 10, 50].map(qty => (
                        <button
                          key={qty}
                          onClick={() => setTradeQuantity(qty)}
                          className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                            tradeQuantity === qty
                              ? 'bg-emerald-600 text-slate-950'
                              : 'bg-slate-900 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {qty}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-xs">
                    <span className="text-slate-400">TRANSACTION TOTAL:</span>
                    <span className="text-sm font-bold text-white">
                      ${(selectedCommodity.currentPrice * tradeQuantity).toLocaleString()}
                    </span>
                  </div>

                  {/* Buy / Sell Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => handleExecuteTrade('buy')}
                      className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Buy Order</span>
                    </button>
                    <button
                      onClick={() => handleExecuteTrade('sell')}
                      className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Sell Order</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
