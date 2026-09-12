import { useState, useMemo } from 'react';
import { Player, DispatchCall, ServerIncident, JobType } from '../types';
import { 
  Navigation, 
  Crosshair, 
  Radio, 
  AlertTriangle, 
  Shield, 
  HeartPulse, 
  Wrench, 
  Car, 
  User, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  DollarSign,
  Wifi,
  ExternalLink
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface LosSantosMapProps {
  players: Player[];
  incidents: ServerIncident[];
  calls: DispatchCall[];
  onSelectPlayer: (player: Player) => void;
  selectedPlayer: Player | null;
  onAdminAction?: (action: string, player: Player) => void;
}

export const LANDMARKS = [
  { name: 'Maze Bank Tower', x: 500, y: 530, type: 'landmark', icon: '🏢' },
  { name: 'Legion Square', x: 510, y: 540, type: 'hotspot', icon: '📍' },
  { name: 'Mission Row PD', x: 530, y: 555, type: 'police', icon: '🚓' },
  { name: 'Pillbox Hill Hospital', x: 495, y: 510, type: 'hospital', icon: '🏥' },
  { name: 'Bennys Original Works', x: 540, y: 590, type: 'mechanic', icon: '🔧' },
  { name: 'Del Perro Pier', x: 370, y: 570, type: 'landmark', icon: '🎡' },
  { name: 'Los Santos Airport (LSIA)', x: 460, y: 730, type: 'airport', icon: '✈️' },
  { name: 'Sandy Shores Airstrip', x: 460, y: 270, type: 'desert', icon: '🛩️' },
  { name: 'Bolingbroke Penitentiary', x: 530, y: 350, type: 'prison', icon: '🔒' },
  { name: 'Mount Chiliad Peak', x: 410, y: 80, type: 'mountain', icon: '⛰️' },
  { name: 'Paleto Bay Bank', x: 320, y: 130, type: 'town', icon: '🏦' },
];

export default function LosSantosMap({
  players,
  incidents,
  calls,
  onSelectPlayer,
  selectedPlayer,
  onAdminAction
}: LosSantosMapProps) {
  const [filterJob, setFilterJob] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<'island' | 'city' | 'county'>('island');
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    soundEffects.playBeep(750, 0.08);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredPlayers = useMemo(() => {
    if (filterJob === 'all') return players;
    return players.filter(p => p.job === filterJob);
  }, [players, filterJob]);

  // ViewBox transformation based on zoomLevel
  const viewBox = useMemo(() => {
    switch (zoomLevel) {
      case 'city':
        return '300 420 360 360'; // Metro Los Santos focus
      case 'county':
        return '250 40 400 380'; // Blaine County & Sandy Shores focus
      case 'island':
      default:
        return '150 0 550 820'; // Full San Andreas island map
    }
  }, [zoomLevel]);

  const getJobColor = (job: JobType) => {
    switch (job) {
      case 'lspd':
      case 'bcso':
        return '#3b82f6'; // Blue
      case 'ems':
        return '#ef4444'; // Red
      case 'mechanic':
        return '#eab308'; // Yellow
      case 'doj':
        return '#a855f7'; // Purple
      case 'gang':
        return '#ec4899'; // Pink / Magenta
      case 'taxi':
        return '#f97316'; // Orange
      case 'civilian':
      default:
        return '#10b981'; // Green
    }
  };

  return (
    <div id="gta-radar-container" className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] min-h-[640px]">
      {/* MAP CANVAS VIEWPORT */}
      <div className="relative flex-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Control Overlay */}
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Filter Pills */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-lg p-1 text-xs">
            <span className="text-slate-400 font-semibold px-2 flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              RADAR
            </span>
            {[
              { key: 'all', label: `All (${players.length})` },
              { key: 'lspd', label: 'LSPD', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
              { key: 'ems', label: 'EMS', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
              { key: 'mechanic', label: 'Mechanics', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
              { key: 'gang', label: 'Gangs', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
              { key: 'civilian', label: 'Civilians', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
            ].map(f => (
              <button
                key={f.key}
                id={`filter-${f.key}`}
                onClick={() => {
                  soundEffects.playBeep(800, 0.03);
                  setFilterJob(f.key);
                }}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  filterJob === f.key
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Map Controls */}
          <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-lg p-1 text-xs">
            <button
              id="zoom-island"
              onClick={() => {
                soundEffects.playBeep(700, 0.03);
                setZoomLevel('island');
              }}
              className={`px-2.5 py-1 rounded transition-all font-medium ${
                zoomLevel === 'island' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Full State
            </button>
            <button
              id="zoom-city"
              onClick={() => {
                soundEffects.playBeep(700, 0.03);
                setZoomLevel('city');
              }}
              className={`px-2.5 py-1 rounded transition-all font-medium ${
                zoomLevel === 'city' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Los Santos
            </button>
            <button
              id="zoom-county"
              onClick={() => {
                soundEffects.playBeep(700, 0.03);
                setZoomLevel('county');
              }}
              className={`px-2.5 py-1 rounded transition-all font-medium ${
                zoomLevel === 'county' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Blaine County
            </button>
            <div className="h-4 w-px bg-slate-700 mx-1" />
            <button
              id="toggle-landmarks"
              onClick={() => setShowLandmarks(!showLandmarks)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                showLandmarks ? 'text-amber-300' : 'text-slate-500'
              }`}
              title="Toggle Landmarks"
            >
              POI {showLandmarks ? 'ON' : 'OFF'}
            </button>
            <button
              id="toggle-incidents"
              onClick={() => setShowIncidents(!showIncidents)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                showIncidents ? 'text-rose-400 font-bold' : 'text-slate-500'
              }`}
              title="Toggle Incidents"
            >
              911 {showIncidents ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Live Vector Radar SVG */}
        <div className="relative w-full h-full flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black select-none">
          <svg
            viewBox={viewBox}
            className="w-full h-full transition-all duration-700 ease-out"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Radar Grid Pattern */}
              <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeOpacity="0.4" />
              </pattern>
              
              {/* Radial gradient for pulse */}
              <radialGradient id="beaconGlow">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ocean background grid */}
            <rect x="0" y="0" width="800" height="900" fill="#060d17" />
            <rect x="0" y="0" width="800" height="900" fill="url(#radarGrid)" />

            {/* San Andreas Landmass Contours (Authentic stylized coastline) */}
            <g id="san-andreas-landmass" className="filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              {/* Main Island shape */}
              <path
                d="M 280,110 
                   Q 350,60 440,70 
                   Q 510,90 540,150 
                   Q 580,220 570,300 
                   Q 620,380 600,480 
                   Q 630,560 610,640 
                   Q 580,720 530,770 
                   Q 460,820 410,770 
                   Q 360,740 340,680 
                   Q 310,610 330,550 
                   Q 290,470 310,380 
                   Q 270,310 290,220 
                   Z"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="2.5"
              />

              {/* Alamo Sea (Inland Salt Lake) */}
              <path
                d="M 430,260 
                   Q 480,240 520,270 
                   Q 540,300 500,320 
                   Q 440,310 420,290 
                   Z"
                fill="#060d17"
                stroke="#1e293b"
                strokeWidth="1.5"
              />

              {/* Major Highway Corridors (Senora Fwy, Los Santos Freeways) */}
              <path
                d="M 330,130 Q 360,250 420,380 Q 480,450 510,540 Q 520,680 470,750"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                strokeOpacity="0.3"
              />
              <path
                d="M 360,570 Q 440,560 520,550 Q 570,590 580,670"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1.2"
                strokeOpacity="0.25"
              />
              {/* Runway at LSIA */}
              <line x1="430" y1="730" x2="490" y2="730" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />
              {/* Runway at Sandy Shores */}
              <line x1="440" y1="270" x2="490" y2="270" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
            </g>

            {/* Zone Labels */}
            <g id="zone-labels" className="select-none pointer-events-none opacity-40 font-mono text-[10px] fill-slate-400">
              <text x="400" y="90">MT. CHILIAD</text>
              <text x="310" y="110">PALETO BAY</text>
              <text x="440" y="250">SANDY SHORES</text>
              <text x="520" y="340">BOLINGBROKE</text>
              <text x="440" y="500">LOS SANTOS METRO</text>
              <text x="440" y="760">LSIA</text>
            </g>

            {/* Landmarks / POI Pins */}
            {showLandmarks && LANDMARKS.map((landmark) => (
              <g 
                key={landmark.name} 
                transform={`translate(${landmark.x}, ${landmark.y})`}
                className="cursor-pointer group"
                onClick={() => showToast(`Waypoint set: ${landmark.name}`)}
              >
                <circle r="4" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                <text 
                  x="7" 
                  y="3" 
                  className="fill-slate-400 text-[8px] font-sans font-medium tracking-tight group-hover:fill-emerald-400 transition-colors"
                >
                  {landmark.name}
                </text>
              </g>
            ))}

            {/* Active 911 Incidents with Flashing Radii */}
            {showIncidents && incidents.map((inc) => (
              <g 
                key={inc.id} 
                transform={`translate(${inc.coords.x}, ${inc.coords.y})`}
                className="cursor-pointer"
                onClick={() => {
                  soundEffects.playDispatchAlert();
                  showToast(`Dispatch Alert: ${inc.title}`);
                }}
              >
                {/* Flashing Pulse Ring */}
                <circle r="18" fill="url(#beaconGlow)" className="animate-ping opacity-75" />
                <circle r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" className="shadow-lg" />
                <text x="0" y="2.5" textAnchor="middle" className="fill-white font-bold text-[7px] pointer-events-none">
                  !
                </text>
                <text 
                  x="0" 
                  y="-12" 
                  textAnchor="middle" 
                  className="fill-rose-400 text-[8px] font-bold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] uppercase"
                >
                  {inc.title}
                </text>
              </g>
            ))}

            {/* Players Blips */}
            {filteredPlayers.map((player) => {
              const isSelected = selectedPlayer?.id === player.id;
              const color = getJobColor(player.job);
              
              return (
                <g
                  key={player.id}
                  id={`blip-player-${player.id}`}
                  transform={`translate(${player.coordinates.x}, ${player.coordinates.y})`}
                  className="cursor-pointer transition-all duration-300 group"
                  onClick={() => {
                    soundEffects.playRadioChirp();
                    onSelectPlayer(player);
                  }}
                >
                  {/* Selected target ring */}
                  {isSelected && (
                    <circle
                      r="14"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.8"
                      strokeDasharray="3 3"
                      className="animate-spin"
                    />
                  )}

                  {/* Player Dot */}
                  <circle
                    r={isSelected ? "6" : "4.5"}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? "2" : "1"}
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* Vehicle Speed vector if moving */}
                  {player.vehicle && player.vehicle.speed > 10 && (
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-10"
                      stroke={color}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Player Label Tag */}
                  <g transform="translate(0, -9)">
                    <rect
                      x={- (player.characterName.length * 2.6)}
                      y="-7"
                      width={player.characterName.length * 5.2}
                      height="9"
                      rx="2"
                      fill="#020617"
                      fillOpacity="0.85"
                      stroke={color}
                      strokeWidth="0.5"
                    />
                    <text
                      x="0"
                      y="-1"
                      textAnchor="middle"
                      className="fill-white font-sans text-[6.5px] font-semibold tracking-tight"
                    >
                      {`[${player.id}] ${player.characterName.split(' ')[0]}`}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Compass Rose Bottom Right */}
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur border border-slate-700/80 rounded-lg p-2 flex flex-col items-center pointer-events-none">
            <Navigation className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span className="text-[10px] font-bold text-slate-300 font-mono mt-0.5">N</span>
          </div>

          {/* Coordinate HUD Bottom Left */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center gap-3 text-xs font-mono text-slate-300 pointer-events-none">
            <div className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>GPS SYNC ACTIVE</span>
            </div>
            <span className="text-slate-500">|</span>
            <span>LOS SANTOS COUNTY</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{filteredPlayers.length} BLIPS VISIBLE</span>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce z-30">
              <AlertTriangle className="w-4 h-4" />
              {toastMessage}
            </div>
          )}
        </div>
      </div>

      {/* TACTICAL TARGET HUD / SELECTED PLAYER DRAWER */}
      <div className="w-full lg:w-84 xl:w-96 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white tracking-wide uppercase">Tactical Tracker</h3>
          </div>
          <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
            {selectedPlayer ? `SERVER ID #${selectedPlayer.id}` : 'NO TARGET'}
          </span>
        </div>

        {selectedPlayer ? (
          <div className="flex flex-col gap-4 flex-1">
            {/* Player Main Identity */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 relative overflow-hidden">
              <div 
                className="absolute top-0 right-0 w-2 h-full"
                style={{ backgroundColor: getJobColor(selectedPlayer.job) }}
              />
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-base text-white">{selectedPlayer.characterName}</h4>
                  <p className="text-xs text-slate-400 font-mono">Steam: {selectedPlayer.steamName}</p>
                </div>
                <span 
                  className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                  style={{
                    backgroundColor: `${getJobColor(selectedPlayer.job)}20`,
                    color: getJobColor(selectedPlayer.job),
                    border: `1px solid ${getJobColor(selectedPlayer.job)}40`
                  }}
                >
                  {selectedPlayer.job.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-medium mt-1">{selectedPlayer.jobTitle}</p>
            </div>

            {/* Health & Armor */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1 text-rose-400">
                    <HeartPulse className="w-3.5 h-3.5" /> HP
                  </span>
                  <span className="font-mono text-white font-bold">{selectedPlayer.health}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full" 
                    style={{ width: `${selectedPlayer.health}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1 text-blue-400">
                    <Shield className="w-3.5 h-3.5" /> ARMOR
                  </span>
                  <span className="font-mono text-white font-bold">{selectedPlayer.armor}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${selectedPlayer.armor}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Location & GPS Info */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Zone</span>
                <span className="text-white font-medium">{selectedPlayer.coordinates.zone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Nearest Street</span>
                <span className="text-white font-medium">{selectedPlayer.coordinates.street}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-400">Vector Coordinates</span>
                <span className="text-emerald-400">
                  X: {selectedPlayer.coordinates.x.toFixed(1)}, Y: {selectedPlayer.coordinates.y.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Vehicle Telemetry if in vehicle */}
            {selectedPlayer.vehicle ? (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between text-amber-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Car className="w-4 h-4" /> Active Vehicle
                  </span>
                  <span className="font-mono text-white">{selectedPlayer.vehicle.speed} MPH</span>
                </div>
                <p className="text-slate-200 font-medium">{selectedPlayer.vehicle.model}</p>
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                  <span>Plate: <strong className="text-white">{selectedPlayer.vehicle.plate}</strong></span>
                  <span>Engine: <strong className="text-emerald-400">{(selectedPlayer.vehicle.engine / 10).toFixed(0)}%</strong></span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-lg p-3 text-xs text-slate-500 flex items-center justify-center gap-2">
                <User className="w-4 h-4" /> On Foot (Pedestrian Mode)
              </div>
            )}

            {/* Finances */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                <span className="text-slate-400 block text-[10px]">CASH ON HAND</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  ${selectedPlayer.cash.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                <span className="text-slate-400 block text-[10px]">BANK ACCOUNT</span>
                <span className="font-mono text-sky-400 font-bold text-sm">
                  ${selectedPlayer.bank.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick Admin Actions */}
            <div className="mt-auto pt-3 border-t border-slate-800 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                RCON Quick Operations
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-teleport-player"
                  onClick={() => {
                    soundEffects.playBeep(900, 0.05);
                    showToast(`Teleported to ${selectedPlayer.characterName} (ID: ${selectedPlayer.id})`);
                    if (onAdminAction) onAdminAction('teleport', selectedPlayer);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  Teleport To
                </button>

                <button
                  id="btn-revive-player"
                  onClick={() => {
                    soundEffects.playBeep(950, 0.05);
                    showToast(`Revived and healed ${selectedPlayer.characterName}`);
                    if (onAdminAction) onAdminAction('revive', selectedPlayer);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                  Revive / Heal
                </button>

                <button
                  id="btn-freeze-player"
                  onClick={() => {
                    soundEffects.playBeep(650, 0.05);
                    showToast(`Toggled freeze on ${selectedPlayer.characterName}`);
                    if (onAdminAction) onAdminAction('freeze', selectedPlayer);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Freeze Ped
                </button>

                <button
                  id="btn-spectate-player"
                  onClick={() => {
                    soundEffects.playRadioChirp();
                    showToast(`Now spectating ${selectedPlayer.characterName} in stealth camera mode`);
                    if (onAdminAction) onAdminAction('spectate', selectedPlayer);
                  }}
                  className="px-3 py-2 bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Spectate
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Crosshair className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
            <p className="font-semibold text-slate-400 text-sm">No Player Selected</p>
            <p className="text-xs text-slate-500 mt-1">
              Click any colored blip on the Los Santos radar to inspect player live telemetry, vehicle speed, and execute RCON actions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
