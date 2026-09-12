import { useState, useRef, useEffect, FormEvent } from 'react';
import { ServerLog, ServerResource, WeatherType, ServerStats } from '../types';
import { 
  Terminal, 
  Send, 
  RefreshCw, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  Clock, 
  Megaphone, 
  RotateCcw, 
  Trash2, 
  Check, 
  Sliders,
  Play,
  Square,
  Activity,
  Cpu,
  Server
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface ServerConsoleProps {
  logs: ServerLog[];
  resources: ServerResource[];
  stats: ServerStats;
  onExecuteCommand: (command: string) => void;
  onChangeWeather: (weather: WeatherType) => void;
  onChangeTime: (time: string) => void;
  onBroadcastAnnouncement: (message: string) => void;
  onRestartResource: (resourceName: string) => void;
  onClearLogs: () => void;
}

export default function ServerConsole({
  logs,
  resources,
  stats,
  onExecuteCommand,
  onChangeWeather,
  onChangeTime,
  onBroadcastAnnouncement,
  onRestartResource,
  onClearLogs
}: ServerConsoleProps) {
  const [commandInput, setCommandInput] = useState('');
  const [activeTab, setActiveTab] = useState<'console' | 'resources' | 'weatherTime'>('console');
  const [announcementText, setAnnouncementText] = useState('');
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    soundEffects.playBeep(900, 0.04);
    onExecuteCommand(commandInput.trim());
    setCommandInput('');
  };

  const handleAnnounceSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    soundEffects.playDispatchAlert();
    onBroadcastAnnouncement(announcementText.trim());
    showToast('Broadcast sent to all active players!');
    setAnnouncementText('');
    setShowAnnounceModal(false);
  };

  const getLogLevelClass = (level: ServerLog['level']) => {
    switch (level) {
      case 'ERROR':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/50';
      case 'WARN':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/50';
      case 'RCON':
        return 'text-sky-400 bg-sky-950/40 border-sky-800/50';
      case 'TXADMIN':
        return 'text-purple-400 bg-purple-950/40 border-purple-800/50';
      case 'CHAT':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
      case 'INFO':
      default:
        return 'text-slate-400 bg-slate-800/40 border-slate-700/50';
    }
  };

  return (
    <div id="server-console-terminal-root" className="flex flex-col gap-4">
      {/* Top txAdmin Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">txAdmin SERVER CONSOLE</h2>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-mono font-bold">
                {stats.txAdminVersion}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              FXServer Artifact: <strong className="text-white">{stats.gameBuild}</strong> • Uptime: <strong className="text-emerald-400">{stats.uptime}</strong>
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            id="tab-console-terminal"
            onClick={() => {
              soundEffects.playBeep(800, 0.03);
              setActiveTab('console');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'console'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Live Logs
          </button>

          <button
            id="tab-console-environment"
            onClick={() => {
              soundEffects.playBeep(800, 0.03);
              setActiveTab('weatherTime');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'weatherTime'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Weather & World
          </button>

          <button
            id="tab-console-resources"
            onClick={() => {
              soundEffects.playBeep(800, 0.03);
              setActiveTab('resources');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'resources'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Resources ({resources.length})
          </button>

          <button
            id="btn-open-announcement-modal"
            onClick={() => {
              soundEffects.playRadioChirp();
              setShowAnnounceModal(true);
            }}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 transition-colors shadow-sm ml-1"
          >
            <Megaphone className="w-3.5 h-3.5" />
            Broadcast
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE RCON TERMINAL */}
      {activeTab === 'console' && (
        <div className="flex flex-col gap-3">
          {/* Quick Command Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl text-xs">
            <span className="text-slate-400 font-semibold text-[11px] px-2">Quick Commands:</span>
            {[
              { cmd: 'weather EXTRASUNNY', label: '☀️ Clear Weather' },
              { cmd: 'weather RAIN', label: '🌧️ Heavy Rain' },
              { cmd: 'time 12 00', label: '🕛 High Noon' },
              { cmd: 'time 22 00', label: '🌙 Night Time' },
              { cmd: 'revive all', label: '🏥 Revive All Downed' },
              { cmd: 'clear vehicles', label: '🚗 Wipe Abandoned Cars' },
              { cmd: 'restart ox_inventory', label: '🔄 Reload Inventory' },
            ].map((chip) => (
              <button
                key={chip.cmd}
                onClick={() => {
                  soundEffects.playBeep(850, 0.03);
                  onExecuteCommand(chip.cmd);
                  showToast(`Executed: /${chip.cmd}`);
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-mono transition-colors border border-slate-700"
              >
                {chip.label}
              </button>
            ))}
            <button
              onClick={onClearLogs}
              className="ml-auto px-2 py-1 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded text-[11px] flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear Console
            </button>
          </div>

          {/* Terminal Box */}
          <div className="bg-black/90 border border-slate-800 rounded-xl p-4 font-mono text-xs shadow-2xl flex flex-col h-[480px]">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300 font-bold ml-2">root@lsrp-server: /fxserver/resources</span>
              </div>
              <div className="flex items-center gap-3">
                <span>BUFFER: {logs.length} LINES</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  RCON STREAM CONNECTED
                </span>
              </div>
            </div>

            {/* Scrollable Logs Output */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 font-mono">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 leading-relaxed hover:bg-slate-900/60 p-0.5 rounded">
                  <span className="text-slate-500 select-none text-[11px]">{log.timestamp}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${getLogLevelClass(log.level)}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-400 select-none text-[11px]">[{log.source}]</span>
                  <span className="text-slate-200 flex-1 break-words">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Command Prompt Input */}
            <form onSubmit={handleCommandSubmit} className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
              <span className="text-emerald-400 font-bold select-none text-sm">$</span>
              <input
                id="rcon-command-prompt"
                type="text"
                placeholder="Type RCON or FXServer command (e.g. say, restart ox_inventory, kick [id], weather RAIN)..."
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-slate-600 focus:outline-none text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Send className="w-3 h-3" />
                EXEC
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: WEATHER & WORLD CONTROL */}
      {activeTab === 'weatherTime' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weather Presets */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-white">Weather Controller</h3>
                </div>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-xs font-mono font-bold">
                  ACTIVE: {stats.weather}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Instantly synchronize San Andreas atmospheric weather sync across all connected clients.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { type: 'EXTRASUNNY', label: 'Extra Sunny', icon: '☀️' },
                  { type: 'CLEAR', label: 'Clear Skies', icon: '🌤️' },
                  { type: 'CLOUDS', label: 'Cloudy / Overcast', icon: '☁️' },
                  { type: 'RAIN', label: 'Downpour Rain', icon: '🌧️' },
                  { type: 'THUNDER', label: 'Severe Thunderstorm', icon: '⚡' },
                  { type: 'FOGGY', label: 'Dense Fog', icon: '🌫️' },
                ].map((w) => (
                  <button
                    key={w.type}
                    onClick={() => {
                      soundEffects.playBeep(900, 0.04);
                      onChangeWeather(w.type as WeatherType);
                      showToast(`Weather set to ${w.label}`);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      stats.weather === w.type
                        ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-xl block mb-1">{w.icon}</span>
                    <span className="text-xs">{w.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Presets */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-base text-white">In-Game Time Sync</h3>
                </div>
                <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded text-xs font-mono font-bold">
                  SERVER TIME: {stats.time}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Override the game clock. Daylight cycles accelerate or freeze based on txAdmin configuration.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { time: '07:00', label: '🌅 Sunrise (07:00)' },
                  { time: '12:00', label: '☀️ Noon (12:00)' },
                  { time: '19:30', label: '🌆 Sunset (19:30)' },
                  { time: '00:00', label: '🌙 Midnight (00:00)' },
                ].map((t) => (
                  <button
                    key={t.time}
                    onClick={() => {
                      soundEffects.playBeep(850, 0.04);
                      onChangeTime(t.time);
                      showToast(`In-game time updated to ${t.time}`);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      stats.time === t.time
                        ? 'border-sky-400 bg-sky-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Emergency Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Emergency Server Actions
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    soundEffects.playBeep(950, 0.05);
                    onExecuteCommand('revive all');
                    showToast('All downed players have been revived.');
                  }}
                  className="px-3 py-2 bg-rose-950/40 border border-rose-800/40 hover:bg-rose-900/40 text-rose-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  Revive All Downed (Global)
                </button>
                <button
                  onClick={() => {
                    soundEffects.playBeep(700, 0.05);
                    onExecuteCommand('clear vehicles');
                    showToast('Abandoned vehicles purged from entity pool.');
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  Purge Abandoned Cars
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RESOURCE MANAGER */}
      {activeTab === 'resources' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Active FXServer Resources & Frameworks</h3>
              <p className="text-xs text-slate-400">Manage, reload, and inspect loaded Lua / C# scripts.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>ACTIVE SCRIPTS: <strong className="text-white">{resources.length}</strong></span>
              <span>MEMORY USAGE: <strong className="text-emerald-400">{resources.reduce((acc, r) => acc + r.memoryMb, 0).toFixed(1)} MB</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resources.map((res) => (
              <div
                key={res.name}
                className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">{res.name}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                      {res.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    By {res.author} • {res.version} • <span className="text-slate-300 font-mono">{res.memoryMb} MB</span>
                  </p>
                </div>

                <button
                  id={`btn-restart-res-${res.name}`}
                  onClick={() => {
                    soundEffects.playBeep(900, 0.05);
                    onRestartResource(res.name);
                    showToast(`Restarted resource: ${res.name}`);
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                  Restart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {showAnnounceModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Broadcast Global Server Announcement</h3>
            <p className="text-xs text-slate-400 mb-4">
              This message will flash across all 184 active players' HUDs with audio chime.
            </p>

            <form onSubmit={handleAnnounceSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Announcement Text</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. 🚨 Server restart in 15 minutes for security update. Please finish active RP scenarios and save character data!"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md"
                >
                  Send Announcement
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
