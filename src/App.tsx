import { useState, useEffect } from 'react';
import { 
  Player, 
  DispatchCall, 
  ServerIncident, 
  ServerLog, 
  ServerResource, 
  BoloWanted, 
  ServerStats,
  WeatherType,
  ToastNotification,
  ServerAchievement
} from './types';
import { 
  INITIAL_SERVER_STATS, 
  INITIAL_PLAYERS, 
  INITIAL_DISPATCH_CALLS, 
  INITIAL_INCIDENTS, 
  INITIAL_LOGS, 
  SERVER_RESOURCES, 
  INITIAL_BOLOS 
} from './data/mockData';
import Header, { MainTabKey } from './components/Header';
import LosSantosMap from './components/LosSantosMap';
import CadDispatch from './components/CadDispatch';
import PlayerDirectory from './components/PlayerDirectory';
import ServerConsole from './components/ServerConsole';
import ServerOverview from './components/ServerOverview';
import VehiclesAndProperties from './components/VehiclesAndProperties';
import PlayerRolesHub from './components/PlayerRolesHub';
import EconomyAndMarket from './components/EconomyAndMarket';
import GTA6MonetizationHub from './components/GTA6MonetizationHub';
import ReferralProgramHub from './components/ReferralProgramHub';
import ToastNotificationSystem from './components/ToastNotificationSystem';
import { soundEffects } from './utils/audio';
import { evaluatePlayerAchievements, SERVER_ACHIEVEMENTS } from './data/achievementsData';

export default function App() {
  const [stats, setStats] = useState<ServerStats>(INITIAL_SERVER_STATS);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [calls, setCalls] = useState<DispatchCall[]>(INITIAL_DISPATCH_CALLS);
  const [incidents, setIncidents] = useState<ServerIncident[]>(INITIAL_INCIDENTS);
  const [bolos, setBolos] = useState<BoloWanted[]>(INITIAL_BOLOS);
  const [logs, setLogs] = useState<ServerLog[]>(INITIAL_LOGS);
  const [resources, setResources] = useState<ServerResource[]>(SERVER_RESOURCES);

  const [activeTab, setActiveTab] = useState<MainTabKey>('gta6');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(INITIAL_PLAYERS[0]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playerCash, setPlayerCash] = useState<number>(54800);

  // Global Toast Notification queue state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Dismiss a toast notification by id
  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sound effects toggle
  const toggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    soundEffects.enabled = nextState;
    if (nextState) {
      soundEffects.playRadioChirp();
    }
  };

  // Helper to trigger achievement unlock toast with fanfare and full metadata
  const triggerAchievementToast = (player: Player, achievement: ServerAchievement) => {
    soundEffects.playAchievementFanfare();
    const newToast: ToastNotification = {
      id: `ach-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'achievement',
      title: 'ACHIEVEMENT UNLOCKED!',
      message: achievement.title,
      details: achievement.description,
      points: achievement.points,
      perkText: achievement.rewardText,
      iconName: achievement.icon,
      rarity: achievement.rarity,
      playerName: `${player.characterName} [ID: ${player.id}]`,
      playerId: player.id,
      timestamp: Date.now(),
      durationMs: 7000,
      actionLabel: 'View Trophy Room',
      onClickAction: () => {
        setSelectedPlayer(player);
        setActiveTab('players');
      }
    };

    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    addLog('INFO', 'qb-achievements', `🏆 Unlocked [${achievement.title}] (+${achievement.points} AP) for ${player.characterName}.`);
  };

  // Helper to trigger referral bonus credit toast with distinct chime
  const triggerReferralBonusToast = (details: {
    amount: number;
    referredPlayerName: string;
    referrerName?: string;
    bonusItem?: string;
    method?: string;
    isWelcomeBonus?: boolean;
  }) => {
    soundEffects.playCashBonusChime();
    const newToast: ToastNotification = {
      id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'referral',
      title: details.isWelcomeBonus ? 'WELCOME BONUS CREDITED!' : 'REFERRAL BONUS CREDITED!',
      message: `+$${details.amount.toLocaleString()} In-Game Cash Added`,
      details: details.isWelcomeBonus
        ? `Starter recruitment package deposited after verified join via ${details.method || 'Discord OAuth'}.`
        : `Account verified for referred friend "${details.referredPlayerName}" via ${details.method || 'Discord OAuth'}.`,
      cashAmount: details.amount,
      bonusItem: details.bonusItem,
      playerName: details.referredPlayerName,
      timestamp: Date.now(),
      durationMs: 7000,
      actionLabel: 'View Referral Hub',
      onClickAction: () => {
        setActiveTab('referrals');
      }
    };

    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    addLog('INFO', 'qb-referrals', `💰 Referral bonus credited: +$${details.amount.toLocaleString()} for ${details.referredPlayerName}.`);
  };

  // Quick simulation trigger for testing Achievement Toast feedback
  const handleTestAchievementToast = () => {
    const sampleAchievements = SERVER_ACHIEVEMENTS.filter(a => ['first_million', 'century_club', 'speed_demon', 'fleet_master', 'community_pillar'].includes(a.id));
    const randomAch = sampleAchievements[Math.floor(Math.random() * sampleAchievements.length)] || SERVER_ACHIEVEMENTS[0];
    const candidatePlayer = selectedPlayer || players[0] || { id: 14, characterName: 'Vance Sterling' } as Player;
    triggerAchievementToast(candidatePlayer, randomAch);
  };

  // Quick simulation trigger for testing Referral Bonus Toast feedback
  const handleTestReferralToast = () => {
    const sampleNames = ['Marcus_Vance', 'Chloe_Decker', 'Dexter_Morgan', 'Tommy_Vercetti', 'Mia_Torres'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const amounts = [15000, 25000, 50000];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    
    // Credit to balance as well so user sees instant live balance increment
    setPlayerCash(prev => prev + randomAmount);

    triggerReferralBonusToast({
      amount: randomAmount,
      referredPlayerName: randomName,
      bonusItem: 'Gilded Combat Pistol & Holster + 48h 2x XP',
      method: 'Discord OAuth',
      isWelcomeBonus: false
    });
  };

  // Helper to add log
  const addLog = (level: ServerLog['level'], source: string, message: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: ServerLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      level,
      source,
      message
    };
    setLogs(prev => [...prev.slice(-100), newLog]);
  };

  // Real-time subtle game world simulation (vehicles moving, player pings fluctuating)
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev => prev.map(p => {
        // Random ping fluctuation
        const jitter = (Math.random() - 0.5) * 2;
        const newPing = Math.max(10, Math.min(80, Math.round(p.ping + jitter)));

        // Slight movement for vehicle drivers
        if (p.vehicle && p.vehicle.speed > 0) {
          const deltaX = (Math.random() - 0.5) * 3;
          const deltaY = (Math.random() - 0.5) * 3;
          return {
            ...p,
            ping: newPing,
            coordinates: {
              ...p.coordinates,
              x: Math.max(160, Math.min(680, p.coordinates.x + deltaX)),
              y: Math.max(80, Math.min(780, p.coordinates.y + deltaY))
            }
          };
        }
        return { ...p, ping: newPing };
      }));

      // If selected player changed, update reference
      setSelectedPlayer(prev => {
        if (!prev) return null;
        return players.find(p => p.id === prev.id) || prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [players]);

  // Command execution
  const handleExecuteCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    addLog('RCON', 'txAdmin', `Admin executed console command: /${cmd}`);

    if (lower.startsWith('weather ')) {
      const w = cmd.split(' ')[1]?.toUpperCase() as WeatherType;
      if (w) {
        setStats(prev => ({ ...prev, weather: w }));
        addLog('INFO', 'qb-weathersync', `Weather state synchronized to [${w}] across all clients.`);
      }
    } else if (lower.startsWith('time ')) {
      const parts = cmd.split(' ');
      const hour = parts[1] || '12';
      const min = parts[2] || '00';
      const timeStr = `${hour.padStart(2, '0')}:${min.padStart(2, '0')}`;
      setStats(prev => ({ ...prev, time: timeStr }));
      addLog('INFO', 'qb-weathersync', `Server clock forced to [${timeStr}].`);
    } else if (lower.startsWith('say ') || lower.startsWith('announce ')) {
      const msg = cmd.replace(/^(say|announce)\s+/i, '');
      setStats(prev => ({ ...prev, bannerAnnouncement: msg }));
      addLog('WARN', 'broadcast', `Global Announcement: "${msg}"`);
    } else if (lower === 'revive all') {
      setPlayers(prev => prev.map(p => ({
        ...p,
        health: 100,
        armor: p.job === 'lspd' || p.job === 'bcso' ? 100 : p.armor,
        status: p.status === 'downed' ? 'active' : p.status
      })));
      addLog('INFO', 'qb-ambulancejob', 'Admin executed global mass revival: All incapacitated citizens treated.');
    } else if (lower === 'clear vehicles') {
      addLog('INFO', 'ox_target', 'Entity cleanup sweep completed: 14 unoccupied/destroyed vehicles deleted from grid.');
    } else if (lower.startsWith('kick ')) {
      const id = parseInt(cmd.split(' ')[1], 10);
      handleKickPlayer(id, 'Kicked via RCON console');
    } else if (lower.startsWith('restart ')) {
      const resName = cmd.split(' ')[1];
      if (resName) handleRestartResource(resName);
    } else {
      addLog('INFO', 'CitizenFX', `Command "${cmd}" acknowledged.`);
    }
  };

  // Weather & Time controls
  const handleChangeWeather = (weather: WeatherType) => {
    setStats(prev => ({ ...prev, weather }));
    addLog('INFO', 'qb-weathersync', `Weather changed to ${weather}`);
  };

  const handleChangeTime = (time: string) => {
    setStats(prev => ({ ...prev, time }));
    addLog('INFO', 'qb-weathersync', `Game time shifted to ${time}`);
  };

  const handleBroadcastAnnouncement = (bannerAnnouncement: string) => {
    setStats(prev => ({ ...prev, bannerAnnouncement }));
    addLog('WARN', 'broadcast', `Broadcasted: "${bannerAnnouncement}"`);
  };

  // Resource restart
  const handleRestartResource = (name: string) => {
    setResources(prev => prev.map(r => r.name === name ? { ...r, status: 'restarting' } : r));
    addLog('WARN', 'CitizenFX', `Stopping resource: ${name}...`);

    setTimeout(() => {
      setResources(prev => prev.map(r => r.name === name ? { ...r, status: 'started' } : r));
      addLog('INFO', 'CitizenFX', `Resource ${name} restarted and initialized in 142ms.`);
    }, 1200);
  };

  // Player Operations
  const handleKickPlayer = (id: number, reason: string) => {
    const target = players.find(p => p.id === id);
    if (!target) return;

    setPlayers(prev => prev.filter(p => p.id !== id));
    setStats(prev => ({ ...prev, playersOnline: Math.max(0, prev.playersOnline - 1) }));
    addLog('WARN', 'txAdmin', `Kicked ${target.characterName} [ID: ${target.id}, Steam: ${target.steamName}] Reason: "${reason}"`);
    if (selectedPlayer?.id === id) {
      setSelectedPlayer(null);
    }
  };

  const handleRevivePlayer = (id: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, health: 100, status: p.status === 'downed' ? 'active' : p.status };
      }
      return p;
    }));
    const target = players.find(p => p.id === id);
    if (target) {
      addLog('INFO', 'qb-ambulancejob', `Admin healed and revived ${target.characterName} [ID: ${target.id}].`);
    }
  };

  const handleSendMessage = (id: number, msg: string) => {
    const target = players.find(p => p.id === id);
    if (target) {
      addLog('CHAT', 'ADMIN-PM', `To [${target.id}] ${target.characterName}: ${msg}`);
    }
  };

  const handleGiveMoney = (id: number, amount: number) => {
    let newlyUnlockedAchievements: ServerAchievement[] = [];
    let updatedTargetPlayer: Player | null = null;

    setPlayers(prev => prev.map(p => {
      if (p.id === id) {
        const currentBadges = p.achievementIds || [];
        const updatedPlayer = {
          ...p,
          cash: p.cash + amount,
          lifetimeEarnings: (p.lifetimeEarnings || (p.cash + p.bank)) + amount
        };
        const nextBadges = evaluatePlayerAchievements(updatedPlayer);
        
        // Find which badges are newly unlocked by this cash addition
        const newlyUnlockedIds = nextBadges.filter(aId => !currentBadges.includes(aId));
        newlyUnlockedIds.forEach(aId => {
          const found = SERVER_ACHIEVEMENTS.find(a => a.id === aId);
          if (found) {
            newlyUnlockedAchievements.push(found);
          }
        });

        updatedTargetPlayer = {
          ...updatedPlayer,
          achievementIds: nextBadges
        };
        return updatedTargetPlayer;
      }
      return p;
    }));

    // Trigger visual toast and audio for any milestones crossed
    if (updatedTargetPlayer && newlyUnlockedAchievements.length > 0) {
      newlyUnlockedAchievements.forEach(ach => {
        triggerAchievementToast(updatedTargetPlayer!, ach);
      });
    }

    const target = players.find(p => p.id === id);
    if (target) {
      addLog('INFO', 'qb-banking', `Granted $${amount.toLocaleString()} cash to ${target.characterName} [ID: ${target.id}].`);
    }
  };

  const handleToggleAchievement = (playerId: number, achievementId: string) => {
    let newlyGranted = false;
    let targetPlayerObj: Player | null = null;

    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        const current = p.achievementIds || [];
        const exists = current.includes(achievementId);
        newlyGranted = !exists;
        const updated = exists 
          ? current.filter(aId => aId !== achievementId)
          : [...current, achievementId];
        targetPlayerObj = { ...p, achievementIds: updated };
        return targetPlayerObj;
      }
      return p;
    }));

    const target = players.find(p => p.id === playerId);
    if (target) {
      addLog('INFO', 'qb-achievements', `Admin updated achievement [${achievementId}] for ${target.characterName}.`);
      if (newlyGranted) {
        const ach = SERVER_ACHIEVEMENTS.find(a => a.id === achievementId);
        if (ach) {
          triggerAchievementToast(target, ach);
        }
      }
    }
  };

  // CAD Operations
  const handleAddCall = (newCall: DispatchCall) => {
    setCalls(prev => [newCall, ...prev]);
    addLog('WARN', 'cd_dispatch', `New Emergency Call [${newCall.code}] ${newCall.title} at ${newCall.location}`);
  };

  const handleClearCall = (callId: string) => {
    setCalls(prev => prev.filter(c => c.id !== callId));
    addLog('INFO', 'cd_dispatch', `Incident [${callId}] marked 10-98 (Cleared & Resolved).`);
  };

  const handleAssignUnit = (callId: string, unitName: string) => {
    setCalls(prev => prev.map(c => {
      if (c.id === callId && !c.respondingUnits.includes(unitName)) {
        return {
          ...c,
          status: 'responding',
          respondingUnits: [...c.respondingUnits, unitName]
        };
      }
      return c;
    }));
    addLog('INFO', 'cd_dispatch', `Unit ${unitName} attached to Call ${callId}.`);
  };

  // BOLO Operations
  const handleToggleBolo = (boloId: string) => {
    setBolos(prev => prev.map(b => {
      if (b.id === boloId) {
        const nextStatus = b.status === 'active' ? 'captured' : 'active';
        addLog(
          nextStatus === 'captured' ? 'WARN' : 'INFO',
          'rcore_police',
          `BOLO warrant ${b.name} (${b.id}) updated to: ${nextStatus.toUpperCase()}`
        );
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  const handleAddBolo = (newBolo: BoloWanted) => {
    setBolos(prev => [newBolo, ...prev]);
    addLog('WARN', 'rcore_police', `New High Threat BOLO issued for: ${newBolo.name} (Bounty: $${newBolo.bounty.toLocaleString()})`);
  };

  return (
    <div id="gta-server-portal-app" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        stats={stats}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        audioEnabled={audioEnabled}
        onToggleAudio={toggleAudio}
        onTestAchievementToast={handleTestAchievementToast}
        onTestReferralToast={handleTestReferralToast}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {activeTab === 'radar' && (
          <LosSantosMap
            players={players}
            incidents={incidents}
            calls={calls}
            onSelectPlayer={setSelectedPlayer}
            selectedPlayer={selectedPlayer}
            onAdminAction={(action, p) => {
              if (action === 'revive') handleRevivePlayer(p.id);
            }}
          />
        )}

        {activeTab === 'dispatch' && (
          <CadDispatch
            calls={calls}
            bolos={bolos}
            players={players}
            onAddCall={handleAddCall}
            onClearCall={handleClearCall}
            onAssignUnit={handleAssignUnit}
            onToggleBoloStatus={handleToggleBolo}
            onAddBolo={handleAddBolo}
          />
        )}

        {activeTab === 'gta6' && (
          <GTA6MonetizationHub />
        )}

        {activeTab === 'referrals' && (
          <ReferralProgramHub
            playerCash={playerCash}
            onAddCash={(amt) => {
              setPlayerCash(prev => prev + amt);
              addLog('INFO', 'qb-referrals', `Referral bonus deposited to bank account: +$${amt.toLocaleString()}`);
            }}
            onCreditReferralBonus={triggerReferralBonusToast}
          />
        )}

        {activeTab === 'roles' && (
          <PlayerRolesHub />
        )}

        {activeTab === 'assets' && (
          <VehiclesAndProperties
            playerCash={playerCash}
            onDeductCash={(amt) => {
              setPlayerCash(prev => Math.max(0, prev - amt));
              addLog('INFO', 'qb-banking', `Vehicle / Property expense transaction settled: -$${amt.toLocaleString()}`);
            }}
          />
        )}

        {activeTab === 'economy' && (
          <EconomyAndMarket
            playerCash={playerCash}
            onAddCash={(amt) => {
              setPlayerCash(prev => prev + amt);
              addLog('INFO', 'qb-banking', `Economy payout deposited: +$${amt.toLocaleString()}`);
            }}
            onDeductCash={(amt) => {
              setPlayerCash(prev => Math.max(0, prev - amt));
              addLog('INFO', 'qb-banking', `Market purchase debited: -$${amt.toLocaleString()}`);
            }}
          />
        )}

        {activeTab === 'players' && (
          <PlayerDirectory
            players={players}
            onSelectPlayer={(p) => {
              setSelectedPlayer(p);
              setActiveTab('radar');
            }}
            onKickPlayer={handleKickPlayer}
            onRevivePlayer={handleRevivePlayer}
            onSendMessage={handleSendMessage}
            onGiveMoney={handleGiveMoney}
            onToggleAchievement={handleToggleAchievement}
          />
        )}

        {activeTab === 'console' && (
          <ServerConsole
            logs={logs}
            resources={resources}
            stats={stats}
            onExecuteCommand={handleExecuteCommand}
            onChangeWeather={handleChangeWeather}
            onChangeTime={handleChangeTime}
            onBroadcastAnnouncement={handleBroadcastAnnouncement}
            onRestartResource={handleRestartResource}
            onClearLogs={() => setLogs([])}
          />
        )}

        {activeTab === 'info' && (
          <ServerOverview stats={stats} />
        )}
      </main>

      {/* Global Toast Notification System */}
      <ToastNotificationSystem
        toasts={toasts}
        onDismiss={dismissToast}
      />

      {/* Bottom Status Ticker */}
      <footer className="bg-slate-950 border-t border-slate-900 py-2.5 px-4 text-center text-xs text-slate-500 font-mono flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>CFX.RE FIVEM REVERSE PROXY: HEALTHY</span>
          <span className="text-slate-700">|</span>
          <span>CITIZENFX CORE ARTIFACT: {stats.gameBuild}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>PORT: 30120 UDP/TCP</span>
          <span>TICK: {stats.tickrate} HZ</span>
          <span>PLAYERS: {players.length} SYNCED</span>
        </div>
      </footer>
    </div>
  );
}
