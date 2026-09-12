import { useState } from 'react';
import { Player, ServerAchievement } from '../types';
import { 
  SERVER_ACHIEVEMENTS, 
  calculatePlayerScore, 
  getPlayerTierTitle 
} from '../data/achievementsData';
import { ACHIEVEMENT_ICON_MAP } from './AchievementBadge';
import { 
  X, 
  Trophy, 
  Clock, 
  Lock, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface PlayerAchievementsModalProps {
  player: Player;
  onClose: () => void;
  onToggleAchievement: (playerId: number, achievementId: string) => void;
}

export default function PlayerAchievementsModal({
  player,
  onClose,
  onToggleAchievement
}: PlayerAchievementsModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterUnlockedOnly, setFilterUnlockedOnly] = useState(false);

  const unlockedIds = new Set<string>(player.achievementIds || []);
  const totalScore = calculatePlayerScore(player.achievementIds || []);
  const tierInfo = getPlayerTierTitle(totalScore);

  const totalPossibleScore = SERVER_ACHIEVEMENTS.reduce((acc, a) => acc + a.points, 0);
  const completionPercent = Math.round((totalScore / totalPossibleScore) * 100);

  const filteredAchievements = SERVER_ACHIEVEMENTS.filter(ach => {
    if (activeCategory !== 'all' && ach.category !== activeCategory) return false;
    if (filterUnlockedOnly && !unlockedIds.has(ach.id)) return false;
    return true;
  });

  // Calculate live progress for quantifiable achievements
  const getAchievementProgress = (ach: ServerAchievement) => {
    const isUnlocked = unlockedIds.has(ach.id);
    if (isUnlocked) return { percent: 100, label: 'COMPLETED & UNLOCKED' };

    const netWorth = (player.cash || 0) + (player.bank || 0);
    const hours = player.hoursPlayed || 0;

    if (ach.id === 'first_million') {
      const current = Math.max(netWorth, player.lifetimeEarnings || 0);
      const target = 1000000;
      const pct = Math.min(100, Math.round((current / target) * 100));
      return {
        percent: pct,
        label: `$${current.toLocaleString()} / $1,000,000 (${pct}%)`
      };
    }

    if (ach.id === 'century_club') {
      const target = 100;
      const pct = Math.min(100, Math.round((hours / target) * 100));
      return {
        percent: pct,
        label: `${hours} / 100 Server Hours (${pct}%)`
      };
    }

    if (ach.id === 'veteran_500h') {
      const target = 500;
      const pct = Math.min(100, Math.round((hours / target) * 100));
      return {
        percent: pct,
        label: `${hours} / 500 Server Hours (${pct}%)`
      };
    }

    if (ach.id === 'fleet_master') {
      const target = 500000;
      const pct = Math.min(100, Math.round((netWorth / target) * 100));
      return {
        percent: pct,
        label: `$${netWorth.toLocaleString()} / $500,000 (${pct}%)`
      };
    }

    return {
      percent: 0,
      label: 'Criteria Not Yet Satisfied'
    };
  };

  const handleToggle = (achievementId: string) => {
    const willUnlock = !unlockedIds.has(achievementId);
    if (willUnlock) {
      soundEffects.playSuccess();
    } else {
      soundEffects.playBeep(450, 0.05);
    }
    onToggleAchievement(player.id, achievementId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="player-achievements-modal"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 via-purple-500/10 to-cyan-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-mono">{player.characterName}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">
                  ID #{player.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Steam: <span className="text-slate-200">{player.steamName}</span> • Discord: <span className="text-slate-300">{player.discordTag}</span>
              </p>
            </div>
          </div>

          <button
            id="btn-close-achievements-modal"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Stats & Gamerscore Banner */}
        <div className="bg-slate-950/60 p-4 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Prestige Tier
            </span>
            <div className={`text-sm font-bold font-mono mt-0.5 ${tierInfo.color}`}>
              {tierInfo.title}
            </div>
            <span className="text-[10px] text-slate-500">{tierInfo.rank}</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              Achievement Score
            </span>
            <div className="text-sm font-bold font-mono text-white mt-0.5">
              <span className="text-cyan-400">{totalScore}</span>
              <span className="text-slate-500 text-xs"> / {totalPossibleScore} AP</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full" 
                style={{ width: `${completionPercent}%` }} 
              />
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Logged Hours
            </span>
            <div className="text-sm font-bold font-mono text-purple-300 mt-0.5">
              {player.hoursPlayed || 0} Hours
            </div>
            <span className="text-[10px] text-slate-500">Session: {player.connectedSince}</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Net Worth
            </span>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
              ${((player.cash || 0) + (player.bank || 0)).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">
              Career: ${(player.lifetimeEarnings || ((player.cash || 0) + (player.bank || 0))).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {[
              { id: 'all', label: 'All Badges' },
              { id: 'wealth', label: '💰 Wealth' },
              { id: 'playtime', label: '⏳ Playtime' },
              { id: 'career', label: '🛡️ Career' },
              { id: 'assets', label: '🏎️ Assets' },
              { id: 'social', label: '⭐ Commendations' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors whitespace-nowrap ${
                  activeCategory === cat.id 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' 
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-mono text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterUnlockedOnly}
              onChange={(e) => setFilterUnlockedOnly(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span>Show Unlocked Only ({unlockedIds.size}/{SERVER_ACHIEVEMENTS.length})</span>
          </label>
        </div>

        {/* Badges Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAchievements.map(ach => {
              const isUnlocked = unlockedIds.has(ach.id);
              const progress = getAchievementProgress(ach);
              const IconComp = ACHIEVEMENT_ICON_MAP[ach.icon] || Trophy;

              const isMilestoneHighlight = ach.id === 'first_million' || ach.id === 'century_club';

              return (
                <div
                  key={ach.id}
                  id={`achievement-card-${ach.id}`}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    isUnlocked 
                      ? isMilestoneHighlight
                        ? 'bg-slate-900 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.12)]'
                        : 'bg-slate-900/90 border-slate-700 hover:border-slate-600'
                      : 'bg-slate-950/70 border-slate-800/70 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Badge Medal Visual */}
                    <div className={`w-12 h-12 rounded-xl border shrink-0 flex items-center justify-center relative ${
                      isUnlocked
                        ? ach.badgeColor === 'amber'
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md'
                          : ach.badgeColor === 'cyan'
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-md'
                          : ach.badgeColor === 'purple'
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-md'
                          : ach.badgeColor === 'rose'
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-md'
                          : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}>
                      <IconComp className="w-6 h-6" />
                      {isUnlocked ? (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center text-[9px]">
                          <Lock className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-sm font-bold font-mono truncate ${
                          isUnlocked ? 'text-white' : 'text-slate-400'
                        }`}>
                          {ach.title}
                        </h4>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          ach.rarity === 'legendary' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : ach.rarity === 'epic'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          +{ach.points} AP
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {ach.description}
                      </p>

                      <div className="mt-2 text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                        <span className="text-slate-400">Criteria:</span>
                        <span>{ach.criteria}</span>
                      </div>

                      {ach.rewardText && (
                        <div className="mt-1 text-[11px] text-amber-300/90 font-mono flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>Perk: {ach.rewardText}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar & Admin Toggle */}
                  <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className={isUnlocked ? 'text-emerald-400 font-semibold flex items-center gap-1' : 'text-slate-400'}>
                          {isUnlocked && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {progress.label}
                        </span>
                        {!isUnlocked && progress.percent > 0 && (
                          <span className="text-slate-400">{progress.percent}%</span>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isUnlocked 
                              ? 'bg-emerald-400' 
                              : progress.percent > 0 
                              ? 'bg-amber-400' 
                              : 'bg-slate-700'
                          }`}
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Admin Override Toggle Button */}
                    <button
                      id={`btn-toggle-badge-${ach.id}`}
                      onClick={() => handleToggle(ach.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all shrink-0 ${
                        isUnlocked 
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                      title="Admin Toggle: Grant or Revoke Badge"
                    >
                      {isUnlocked ? 'Revoke' : 'Grant Badge'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono">
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Milestones verified by CFX Player State & MySQL Database sync.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
