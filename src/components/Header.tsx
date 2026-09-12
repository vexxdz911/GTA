import { useState } from 'react';
import { ServerStats } from '../types';
import { 
  Radio, 
  Users, 
  Wifi, 
  Clock, 
  Sun, 
  CloudRain, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ShieldAlert, 
  Terminal, 
  Compass, 
  Info,
  ExternalLink,
  Flame,
  Car,
  Layers,
  TrendingUp,
  DollarSign,
  Gift,
  Trophy,
  Bell
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export type MainTabKey = 'radar' | 'dispatch' | 'roles' | 'assets' | 'economy' | 'gta6' | 'referrals' | 'players' | 'console' | 'info';

interface HeaderProps {
  stats: ServerStats;
  activeTab: MainTabKey;
  onSelectTab: (tab: MainTabKey) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onTestAchievementToast?: () => void;
  onTestReferralToast?: () => void;
}

export default function Header({
  stats,
  activeTab,
  onSelectTab,
  audioEnabled,
  onToggleAudio,
  onTestAchievementToast,
  onTestReferralToast
}: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyConnect = () => {
    soundEffects.playBeep(900, 0.05);
    navigator.clipboard.writeText(stats.cfxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { key: 'gta6', label: 'GTA 6 Monetize', icon: Flame, badge: 'HOT' },
    { key: 'referrals', label: 'Referrals & Rewards', icon: Gift, badge: 'REWARDS' },
    { key: 'radar', label: 'Live GPS Radar', icon: Compass },
    { key: 'dispatch', label: 'CAD / MDT', icon: ShieldAlert },
    { key: 'roles', label: 'Roles & Careers', icon: Layers },
    { key: 'assets', label: 'Vehicles & Properties', icon: Car },
    { key: 'economy', label: 'Economy & Market', icon: TrendingUp },
    { key: 'players', label: 'Players Roster', icon: Users, badge: `${stats.playersOnline}` },
    { key: 'console', label: 'txAdmin Console', icon: Terminal },
    { key: 'info', label: 'Server Info & Rules', icon: Info },
  ] as const;

  return (
    <header id="main-server-header" className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
      {/* Top Ticker / Global Announcement Marquee */}
      {stats.bannerAnnouncement && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-b border-amber-500/30 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2 overflow-hidden">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{stats.bannerAnnouncement}</span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold shrink-0 ml-3">
            OFFICIAL BROADCAST
          </span>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-950/50 border border-emerald-400/40">
            <span className="font-mono text-sm tracking-tighter">LSRP</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-wider text-white uppercase font-sans">
                {stats.name}
              </h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
              <span>FIVEM ONESYNC</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{stats.playersOnline} / {stats.maxPlayers} SLOTS</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-sky-400">{stats.ping}ms PING</span>
            </div>
          </div>
        </div>

        {/* Action Controls Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Synthesizer SFX Switch */}
          <button
            id="btn-toggle-audio-sfx"
            onClick={onToggleAudio}
            className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              audioEnabled
                ? 'bg-slate-900 border-slate-700 text-emerald-400 hover:text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={audioEnabled ? 'Audio SFX Enabled (Click to Mute)' : 'Audio SFX Muted (Click to Enable)'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline font-mono text-[11px]">{audioEnabled ? 'SFX ON' : 'MUTED'}</span>
          </button>

          {/* Quick World Stats Pill */}
          <div className="hidden lg:flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {stats.time}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              {stats.weather}
            </span>
          </div>

          {/* Toast Notification Simulation Buttons */}
          {(onTestAchievementToast || onTestReferralToast) && (
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg">
              {onTestAchievementToast && (
                <button
                  id="btn-test-achievement-toast"
                  onClick={onTestAchievementToast}
                  className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                  title="Test Achievement Unlocked Toast Notification with Fanfare Audio"
                >
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span className="hidden xl:inline">Test Achievement</span>
                  <span className="xl:hidden">Achieve</span>
                </button>
              )}
              {onTestReferralToast && (
                <button
                  id="btn-test-referral-toast"
                  onClick={onTestReferralToast}
                  className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                  title="Test Referral Bonus Credited Toast Notification with Bell Chime Audio"
                >
                  <Gift className="w-3 h-3 text-emerald-400" />
                  <span className="hidden xl:inline">Test Referral</span>
                  <span className="xl:hidden">Referral</span>
                </button>
              )}
            </div>
          )}

          {/* Direct Connect Launcher Button */}
          <button
            id="btn-quick-connect"
            onClick={handleCopyConnect}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied CFX URL!' : 'Direct Connect'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-slate-900 scrollbar-none py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              id={`nav-tab-${item.key}`}
              onClick={() => {
                soundEffects.playRadioChirp();
                onSelectTab(item.key);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {'badge' in item && item.badge && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
