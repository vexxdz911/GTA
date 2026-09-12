import { useState, useMemo } from 'react';
import { Player, ServerAchievement } from '../types';
import { SERVER_ACHIEVEMENTS, calculatePlayerScore, getPlayerTierTitle } from '../data/achievementsData';
import AchievementBadge, { ACHIEVEMENT_ICON_MAP } from './AchievementBadge';
import { 
  Trophy, 
  Users, 
  Sparkles, 
  Award, 
  Star, 
  Flame, 
  Search, 
  Crown, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface AchievementsLeaderboardViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onOpenAchievementsModal: (player: Player) => void;
}

export default function AchievementsLeaderboardView({
  players,
  onSelectPlayer,
  onOpenAchievementsModal
}: AchievementsLeaderboardViewProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Calculate Leaderboard rankings
  const rankedPlayers = useMemo(() => {
    return [...players].map(p => {
      const score = calculatePlayerScore(p.achievementIds || []);
      const count = (p.achievementIds || []).length;
      const tier = getPlayerTierTitle(score);
      return {
        ...p,
        achievementScore: score,
        unlockedCount: count,
        tier
      };
    }).sort((a, b) => b.achievementScore - a.achievementScore || b.unlockedCount - a.unlockedCount);
  }, [players]);

  // Calculate unlock percentage across all active server players
  const achievementStats = useMemo(() => {
    const total = players.length || 1;
    return SERVER_ACHIEVEMENTS.map(ach => {
      const holders = players.filter(p => (p.achievementIds || []).includes(ach.id));
      const percentage = Math.round((holders.length / total) * 100);
      return {
        ...ach,
        holderCount: holders.length,
        percentage,
        holders
      };
    });
  }, [players]);

  const filteredStats = useMemo(() => {
    return achievementStats.filter(ach => {
      if (categoryFilter !== 'all' && ach.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return ach.title.toLowerCase().includes(q) || ach.description.toLowerCase().includes(q) || ach.criteria.toLowerCase().includes(q);
      }
      return true;
    });
  }, [achievementStats, categoryFilter, search]);

  return (
    <div id="achievements-leaderboard-container" className="flex flex-col gap-5">
      {/* Top Banner & Server Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              San Andreas State Achievements & Hall of Fame
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified badges earned through active roleplay, milestone accumulation, and community dedication.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-2 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">TOTAL SERVER BADGES</span>
            <span className="text-amber-400 text-sm font-bold">{SERVER_ACHIEVEMENTS.length} Milestones</span>
          </div>
          <div className="px-3 py-2 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">AVG AP PER CITIZEN</span>
            <span className="text-cyan-400 text-sm font-bold">
              {Math.round(rankedPlayers.reduce((acc, p) => acc + p.achievementScore, 0) / (rankedPlayers.length || 1))} AP
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Hall of Fame Leaderboard (Left) + Milestones Catalog (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Top Citizens Leaderboard */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col gap-3.5 shadow-lg">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Prestige Leaderboard
            </h4>
            <span className="text-[10px] font-mono text-slate-400">{rankedPlayers.length} Synced</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[580px] pr-1">
            {rankedPlayers.map((player, idx) => {
              const isFirstMillion = (player.achievementIds || []).includes('first_million');
              const is100Hours = (player.achievementIds || []).includes('century_club');

              return (
                <div
                  key={player.id}
                  onClick={() => {
                    soundEffects.playBeep(800, 0.03);
                    onOpenAchievementsModal(player);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer hover:border-slate-700 flex items-center justify-between gap-3 ${
                    idx === 0 
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm' 
                      : idx === 1 
                      ? 'bg-slate-800/80 border-slate-700' 
                      : idx === 2 
                      ? 'bg-purple-950/20 border-purple-800/40' 
                      : 'bg-slate-950 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                      idx === 0 
                        ? 'bg-amber-400 text-slate-950 shadow-md' 
                        : idx === 1 
                        ? 'bg-slate-300 text-slate-950' 
                        : idx === 2 
                        ? 'bg-amber-700 text-amber-100' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{idx + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white truncate">{player.characterName}</span>
                        {idx === 0 && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>{player.hoursPlayed}h</span>
                        <span>•</span>
                        <span className="text-emerald-400">${((player.cash + player.bank) / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold font-mono text-amber-400">
                      {player.achievementScore} AP
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {isFirstMillion && (
                        <span title="First Million Earned" className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-[10px]">
                          🏆
                        </span>
                      )}
                      {is100Hours && (
                        <span title="100+ Hours Veteran" className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-[10px]">
                          ⏳
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-400 px-1 py-0.2 bg-slate-900 rounded">
                        {player.unlockedCount} 🏅
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 cols): Server Milestones Catalog */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col gap-3.5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                Server Milestones & Badges Directory
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Review all unlockable credentials, points value, criteria, and global distribution.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['all', 'wealth', 'playtime', 'career', 'assets', 'social'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] uppercase transition-colors whitespace-nowrap ${
                    categoryFilter === cat 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' 
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search milestone by name, criteria, or description..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Milestones Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[520px] pr-1">
            {filteredStats.map(ach => {
              const IconComp = ACHIEVEMENT_ICON_MAP[ach.icon] || Trophy;
              const isFirstMillion = ach.id === 'first_million';
              const is100Hours = ach.id === 'century_club';

              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                    isFirstMillion 
                      ? 'bg-amber-950/20 border-amber-500/40 shadow-sm' 
                      : is100Hours 
                      ? 'bg-cyan-950/20 border-cyan-500/40 shadow-sm' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                      ach.badgeColor === 'amber'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : ach.badgeColor === 'cyan'
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                        : ach.badgeColor === 'purple'
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                        : ach.badgeColor === 'rose'
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="font-bold text-xs text-white truncate font-mono">{ach.title}</h5>
                        <span className="text-[10px] font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0">
                          +{ach.points} AP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono flex items-center justify-between text-slate-400">
                    <span className="truncate max-w-[170px]">Req: {ach.criteria}</span>
                    <span className="text-cyan-400 font-bold shrink-0">
                      {ach.holderCount} / {players.length} ({ach.percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
