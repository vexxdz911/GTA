import { useState, useMemo, FormEvent } from 'react';
import { Player, JobType } from '../types';
import { 
  Users, 
  Search, 
  Shield, 
  HeartPulse, 
  Car, 
  DollarSign, 
  UserX, 
  MessageSquare, 
  Navigation, 
  AlertCircle, 
  Filter, 
  Sparkles, 
  Wifi, 
  MoreVertical, 
  Check, 
  Trophy, 
  Clock, 
  Award, 
  Crown, 
  Medal,
  Star 
} from 'lucide-react';
import { soundEffects } from '../utils/audio';
import AchievementBadge from './AchievementBadge';
import PlayerAchievementsModal from './PlayerAchievementsModal';
import AchievementsLeaderboardView from './AchievementsLeaderboardView';
import { calculatePlayerScore, getPlayerTierTitle } from '../data/achievementsData';

interface PlayerDirectoryProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onKickPlayer: (playerId: number, reason: string) => void;
  onRevivePlayer: (playerId: number) => void;
  onSendMessage: (playerId: number, msg: string) => void;
  onGiveMoney: (playerId: number, amount: number) => void;
  onToggleAchievement?: (playerId: number, achievementId: string) => void;
}

export default function PlayerDirectory({
  players,
  onSelectPlayer,
  onKickPlayer,
  onRevivePlayer,
  onSendMessage,
  onGiveMoney,
  onToggleAchievement
}: PlayerDirectoryProps) {
  const [viewMode, setViewMode] = useState<'roster' | 'leaderboard'>('roster');
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [achievementFilter, setAchievementFilter] = useState<string>('all');
  const [selectedAchievementsPlayer, setSelectedAchievementsPlayer] = useState<Player | null>(null);

  const [activeModalPlayer, setActiveModalPlayer] = useState<Player | null>(null);
  const [modalAction, setModalAction] = useState<'kick' | 'dm' | 'money' | null>(null);
  const [actionInput, setActionInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Job and milestone breakdown counts
  const counts = useMemo(() => {
    return {
      total: players.length,
      lspd: players.filter(p => p.job === 'lspd' || p.job === 'bcso').length,
      ems: players.filter(p => p.job === 'ems').length,
      mechanic: players.filter(p => p.job === 'mechanic').length,
      gang: players.filter(p => p.job === 'gang').length,
      civilians: players.filter(p => p.job === 'civilian').length,
      firstMillion: players.filter(p => (p.achievementIds || []).includes('first_million')).length,
      centuryClub: players.filter(p => (p.achievementIds || []).includes('century_club') || (p.hoursPlayed || 0) >= 100).length
    };
  }, [players]);

  const filtered = useMemo(() => {
    return players.filter(p => {
      if (selectedJob !== 'all' && p.job !== selectedJob) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      // Achievement milestone filter
      if (achievementFilter === 'first_million' && !(p.achievementIds || []).includes('first_million')) {
        return false;
      }
      if (achievementFilter === 'century_club' && !(p.achievementIds || []).includes('century_club')) {
        return false;
      }
      if (achievementFilter === 'has_badges' && (p.achievementIds || []).length === 0) {
        return false;
      }

      if (search) {
        const q = search.toLowerCase();
        return (
          p.characterName.toLowerCase().includes(q) ||
          p.steamName.toLowerCase().includes(q) ||
          p.id.toString() === q ||
          p.discordTag.toLowerCase().includes(q) ||
          p.jobTitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [players, selectedJob, statusFilter, achievementFilter, search]);

  const getJobBadge = (job: JobType) => {
    switch (job) {
      case 'lspd':
      case 'bcso':
        return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', label: 'LSPD / SHERIFF' };
      case 'ems':
        return { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', label: 'EMS / MEDICAL' };
      case 'mechanic':
        return { bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', label: 'MECHANIC' };
      case 'doj':
        return { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', label: 'DOJ / JUDGE' };
      case 'gang':
        return { bg: 'bg-pink-500/10 text-pink-400 border-pink-500/30', label: 'SYNDICATE' };
      case 'taxi':
        return { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30', label: 'TAXI CAB' };
      case 'civilian':
      default:
        return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: 'CITIZEN' };
    }
  };

  const handleModalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!activeModalPlayer) return;

    if (modalAction === 'kick') {
      onKickPlayer(activeModalPlayer.id, actionInput || 'Kicked by Server Administrator');
      showToast(`Kicked ${activeModalPlayer.characterName} from server`);
    } else if (modalAction === 'dm') {
      onSendMessage(activeModalPlayer.id, actionInput);
      showToast(`Sent admin PM to ${activeModalPlayer.characterName}`);
    } else if (modalAction === 'money') {
      const amount = parseInt(actionInput, 10) || 5000;
      onGiveMoney(activeModalPlayer.id, amount);
      showToast(`Granted $${amount.toLocaleString()} to ${activeModalPlayer.characterName}`);
    }

    setModalAction(null);
    setActiveModalPlayer(null);
    setActionInput('');
  };

  // Keep modal player up to date if players state changes
  const currentModalPlayer = selectedAchievementsPlayer 
    ? players.find(p => p.id === selectedAchievementsPlayer.id) || selectedAchievementsPlayer 
    : null;

  return (
    <div id="player-directory-container" className="flex flex-col gap-4">
      {/* Top View Toggle Sub-Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            id="tab-view-roster"
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setViewMode('roster');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'roster'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Active Player Roster & Badges ({players.length})
          </button>

          <button
            id="tab-view-achievements"
            onClick={() => {
              soundEffects.playBeep(850, 0.03);
              setViewMode('leaderboard');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'leaderboard'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Achievements Showcase & Leaderboard
          </button>
        </div>

        {/* Milestone Quick Highlights Counter */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{counts.firstMillion}</span>
            <span className="text-slate-400 text-[11px]">$1M+ Earners</span>
          </div>
          <div className="px-2.5 py-1 bg-slate-950 rounded-lg border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">{counts.centuryClub}</span>
            <span className="text-slate-400 text-[11px]">100h+ Veterans</span>
          </div>
        </div>
      </div>

      {/* VIEW: ACHIEVEMENTS LEADERBOARD */}
      {viewMode === 'leaderboard' && (
        <AchievementsLeaderboardView
          players={players}
          onSelectPlayer={(p) => onSelectPlayer(p)}
          onOpenAchievementsModal={(p) => setSelectedAchievementsPlayer(p)}
        />
      )}

      {/* VIEW: MAIN ROSTER GRID */}
      {viewMode === 'roster' && (
        <>
          {/* Top Counts & Roster Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div 
              onClick={() => setSelectedJob('all')}
              className={`bg-slate-900 border p-3 rounded-xl cursor-pointer transition-all ${
                selectedJob === 'all' ? 'border-emerald-500/80 bg-slate-800/80' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Online</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xl font-bold font-mono text-white mt-1 block">{counts.total}</span>
            </div>

            <div 
              onClick={() => setSelectedJob('lspd')}
              className={`bg-slate-900 border p-3 rounded-xl cursor-pointer transition-all ${
                selectedJob === 'lspd' ? 'border-blue-500/80 bg-slate-800/80' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Law Enforce</span>
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xl font-bold font-mono text-blue-400 mt-1 block">{counts.lspd} Units</span>
            </div>

            <div 
              onClick={() => setSelectedJob('ems')}
              className={`bg-slate-900 border p-3 rounded-xl cursor-pointer transition-all ${
                selectedJob === 'ems' ? 'border-rose-500/80 bg-slate-800/80' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Paramedics</span>
                <HeartPulse className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">{counts.ems} Units</span>
            </div>

            <div 
              onClick={() => setSelectedJob('mechanic')}
              className={`bg-slate-900 border p-3 rounded-xl cursor-pointer transition-all ${
                selectedJob === 'mechanic' ? 'border-yellow-500/80 bg-slate-800/80' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Mechanics</span>
                <Car className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-xl font-bold font-mono text-yellow-400 mt-1 block">{counts.mechanic} Techs</span>
            </div>

            <div 
              onClick={() => setSelectedJob('gang')}
              className={`bg-slate-900 border p-3 rounded-xl cursor-pointer transition-all ${
                selectedJob === 'gang' ? 'border-pink-500/80 bg-slate-800/80' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Syndicates</span>
                <AlertCircle className="w-4 h-4 text-pink-400" />
              </div>
              <span className="text-xl font-bold font-mono text-pink-400 mt-1 block">{counts.gang} Members</span>
            </div>

            <div 
              onClick={() => setSelectedJob('civilian')}
              className={`bg-slate-900 border p-3 rounded-xl cursor-pointer transition-all ${
                selectedJob === 'civilian' ? 'border-emerald-500/80 bg-slate-800/80' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Citizens</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">{counts.civilians} Active</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="search-player-input"
                type="text"
                placeholder="Search character name, Steam ID, server ID (e.g. 14, Vance)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
              >
                <option value="all">All States</option>
                <option value="in_vehicle">In Vehicle</option>
                <option value="active">On Foot</option>
                <option value="downed">Downed / Unconscious</option>
                <option value="in_jail">Bolingbroke Prison</option>
              </select>
            </div>

            {/* Milestone / Badge Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Milestones:</span>
              <select
                id="select-milestone-filter"
                value={achievementFilter}
                onChange={(e) => setAchievementFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Players</option>
                <option value="first_million">🏆 First Million ($1M+)</option>
                <option value="century_club">⏳ 100+ Hours Club</option>
                <option value="has_badges">⭐ Has Any Badges</option>
              </select>
            </div>
          </div>

          {/* Players List Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((player) => {
              const badge = getJobBadge(player.job);
              const isDowned = player.status === 'downed';
              const achievementIds = player.achievementIds || [];
              const score = calculatePlayerScore(achievementIds);
              const tier = getPlayerTierTitle(score);

              const hasFirstMillion = achievementIds.includes('first_million');
              const hasCenturyClub = achievementIds.includes('century_club') || (player.hoursPlayed || 0) >= 100;

              return (
                <div
                  key={player.id}
                  id={`player-card-${player.id}`}
                  className={`bg-slate-900 border rounded-xl p-4 flex flex-col justify-between transition-all hover:border-slate-700 ${
                    isDowned 
                      ? 'border-rose-500/60 bg-rose-950/10' 
                      : hasFirstMillion 
                      ? 'border-slate-800 hover:border-amber-500/50' 
                      : 'border-slate-800'
                  }`}
                >
                  <div>
                    {/* Header: ID, Name, Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-300">
                          #{player.id}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-white leading-snug">{player.characterName}</h4>
                          <p className="text-[11px] text-slate-400 font-mono">Steam: {player.steamName}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Job Title & Discord */}
                    <div className="flex items-center justify-between text-xs mb-2.5 text-slate-300">
                      <span className="text-emerald-400 font-medium">{player.jobTitle}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{player.discordTag}</span>
                    </div>

                    {/* ACHIEVEMENTS & BADGES VISUAL ROW */}
                    <div 
                      id={`player-badges-row-${player.id}`}
                      onClick={() => {
                        soundEffects.playBeep(850, 0.03);
                        setSelectedAchievementsPlayer(player);
                      }}
                      className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/90 mb-3 cursor-pointer hover:border-amber-500/40 transition-all flex flex-col gap-1.5"
                      title="Click to inspect player achievements and trophy room"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          <span className="font-bold text-slate-200">Badges & Prestige:</span>
                        </span>
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {score} AP ({achievementIds.length})
                        </span>
                      </div>

                      {/* Visual representations of unlocked badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
                        {achievementIds.length > 0 ? (
                          <>
                            {achievementIds.slice(0, 4).map(achId => (
                              <AchievementBadge
                                key={achId}
                                achievementId={achId}
                                size="xs"
                                isUnlocked={true}
                              />
                            ))}
                            {achievementIds.length > 4 && (
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                                +{achievementIds.length - 4} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">No badges unlocked yet</span>
                        )}

                        {/* Special Milestone Callouts */}
                        {hasFirstMillion && (
                          <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            🏆 $1M
                          </span>
                        )}
                        {hasCenturyClub && !hasFirstMillion && (
                          <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                            ⏳ 100h
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Health & Armor Mini Bars */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-rose-400 flex items-center gap-1 font-semibold">
                            <HeartPulse className="w-3 h-3" /> HP
                          </span>
                          <span className="font-mono font-bold text-white">{player.health}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500" style={{ width: `${player.health}%` }} />
                        </div>
                      </div>

                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-blue-400 flex items-center gap-1 font-semibold">
                            <Shield className="w-3 h-3" /> ARMOR
                          </span>
                          <span className="font-mono font-bold text-white">{player.armor}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${player.armor}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Status & Location Details */}
                    <div className="text-xs text-slate-400 space-y-1 mb-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 font-sans">
                      <div className="flex items-center justify-between">
                        <span>Location:</span>
                        <span className="text-slate-200 font-medium">{player.coordinates.zone} ({player.coordinates.street})</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Playtime:</span>
                        <span className="text-cyan-400 font-mono font-medium">{player.hoursPlayed || 0} Hours logged</span>
                      </div>

                      {player.vehicle ? (
                        <div className="flex items-center justify-between text-amber-400">
                          <span className="flex items-center gap-1">
                            <Car className="w-3.5 h-3.5" /> In Vehicle:
                          </span>
                          <span className="text-slate-200 font-medium">{player.vehicle.model.split('(')[0]}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span>Status:</span>
                          <span className={`font-semibold ${isDowned ? 'text-rose-400' : 'text-slate-300'}`}>
                            {isDowned ? '⚠️ UNCONSCIOUS (10-52)' : 'Pedestrian On Foot'}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                        <span>Total Net Worth:</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          ${(player.cash + player.bank).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Action Buttons */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1.5">
                    <button
                      id={`btn-inspect-${player.id}`}
                      onClick={() => {
                        soundEffects.playRadioChirp();
                        onSelectPlayer(player);
                      }}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                      View on GPS
                    </button>

                    {/* Inspect Badges / Trophy Room Button */}
                    <button
                      id={`btn-achievements-${player.id}`}
                      onClick={() => {
                        soundEffects.playBeep(850, 0.04);
                        setSelectedAchievementsPlayer(player);
                      }}
                      className="p-1.5 bg-amber-950/40 border border-amber-800/40 hover:bg-amber-900/50 text-amber-400 rounded text-xs transition-colors"
                      title="Inspect Badges & Trophy Room"
                    >
                      <Trophy className="w-4 h-4" />
                    </button>

                    <button
                      id={`btn-revive-quick-${player.id}`}
                      onClick={() => {
                        soundEffects.playBeep(900, 0.04);
                        onRevivePlayer(player.id);
                        showToast(`Healed and revived ${player.characterName}`);
                      }}
                      className="p-1.5 bg-rose-950/40 border border-rose-800/40 hover:bg-rose-900/50 text-rose-400 rounded text-xs transition-colors"
                      title="Revive / Heal"
                    >
                      <HeartPulse className="w-4 h-4" />
                    </button>

                    <button
                      id={`btn-dm-${player.id}`}
                      onClick={() => {
                        soundEffects.playBeep(750, 0.04);
                        setActiveModalPlayer(player);
                        setModalAction('dm');
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded text-xs transition-colors"
                      title="Send In-Game Admin Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      id={`btn-money-${player.id}`}
                      onClick={() => {
                        soundEffects.playBeep(850, 0.04);
                        setActiveModalPlayer(player);
                        setModalAction('money');
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-xs transition-colors"
                      title="Give In-Game Cash"
                    >
                      <DollarSign className="w-4 h-4" />
                    </button>

                    <button
                      id={`btn-kick-${player.id}`}
                      onClick={() => {
                        soundEffects.playBeep(600, 0.06);
                        setActiveModalPlayer(player);
                        setModalAction('kick');
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded text-xs transition-colors"
                      title="Kick Player from Server"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* PLAYER ACHIEVEMENTS & TROPHY ROOM DOSSIER MODAL */}
      {currentModalPlayer && (
        <PlayerAchievementsModal
          player={currentModalPlayer}
          onClose={() => setSelectedAchievementsPlayer(null)}
          onToggleAchievement={(pId, aId) => {
            if (onToggleAchievement) {
              onToggleAchievement(pId, aId);
            }
          }}
        />
      )}

      {/* MODAL FOR KICK / DM / MONEY */}
      {modalAction && activeModalPlayer && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              {modalAction === 'kick' && `Kick Player [ID: ${activeModalPlayer.id}]`}
              {modalAction === 'dm' && `Send Admin Message to [ID: ${activeModalPlayer.id}]`}
              {modalAction === 'money' && `Grant In-Game Funds to [ID: ${activeModalPlayer.id}]`}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Target Character: <strong className="text-white">{activeModalPlayer.characterName}</strong>
            </p>

            <form onSubmit={handleModalSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {modalAction === 'kick' && 'Reason for Kick'}
                  {modalAction === 'dm' && 'Announcement / Warning Message'}
                  {modalAction === 'money' && 'Amount in USD ($)'}
                </label>
                <input
                  type={modalAction === 'money' ? 'number' : 'text'}
                  required
                  autoFocus
                  placeholder={
                    modalAction === 'kick' 
                      ? 'e.g. Breaking server rule VDM / Metagaming' 
                      : modalAction === 'dm' 
                      ? 'e.g. Please pull over and follow police instructions' 
                      : '5000'
                  }
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setModalAction(null);
                    setActiveModalPlayer(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg text-xs font-semibold shadow-md ${
                    modalAction === 'kick' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  Confirm Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce z-50">
          <Check className="w-4 h-4" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
