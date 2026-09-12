import { useState } from 'react';
import { RoleDefinition } from '../types';
import { ROLE_DEFINITIONS } from '../data/assetsAndEconomyData';
import { 
  ShieldAlert, 
  HeartPulse, 
  Flame, 
  Building2, 
  Scale, 
  Award, 
  ArrowRightLeft, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Terminal, 
  Play, 
  Radio, 
  Layers, 
  UserPlus 
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function PlayerRolesHub() {
  const [selectedRole, setSelectedRole] = useState<RoleDefinition>(ROLE_DEFINITIONS[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'progression' | 'interactions' | 'simulator'>('overview');
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([
    'System: Roleplay Action Simulator initialized. Select a special ability to trigger tactical server events.'
  ]);
  const [abilityCooldowns, setAbilityCooldowns] = useState<Record<string, boolean>>({});

  const roleIcons = {
    ShieldAlert,
    HeartPulse,
    Flame,
    Building2,
    Scale
  };

  const handleTriggerSimAbility = (abilityName: string, roleName: string) => {
    soundEffects.playRadioChirp();
    setAbilityCooldowns(prev => ({ ...prev, [abilityName]: true }));

    let logMsg = '';
    if (abilityName.includes('Plate')) {
      soundEffects.playBeep(920, 0.05);
      logMsg = `[POLICE MDT] Running Plate "DRIFT69": Registered to Antonio Silva. Status: VALID. Active Warrants: 1 (Felony Evading).`;
    } else if (abilityName.includes('PIT') || abilityName.includes('Spike')) {
      soundEffects.playDispatchAlert();
      logMsg = `[TACTICAL INTERDICTION] Spike strip deployed on Route 68! Pursuit vehicle tires punctured.`;
    } else if (abilityName.includes('CPR') || abilityName.includes('Defibrillator')) {
      soundEffects.playBeep(440, 0.15);
      logMsg = `[EMS MEDEVAC] Administered 200J shock to victim. Heart rhythm stabilized! Vitals: 78 BPM.`;
    } else if (abilityName.includes('Thermite') || abilityName.includes('Decryptor')) {
      soundEffects.playBeep(1200, 0.1);
      logMsg = `[HEIST BREACH] Thermite paste ignited on Fleeca Vault door! Security pins melting in 15 seconds.`;
    } else if (abilityName.includes('Hotwiring')) {
      soundEffects.playBeep(800, 0.04);
      logMsg = `[UNDERWORLD] Ignition wire bridged! Sultan RS engine started without activating factory alarm.`;
    } else if (abilityName.includes('Repair')) {
      soundEffects.playBeep(600, 0.08);
      logMsg = `[CIVILIAN MECHANIC] Engine radiator patched and oil filled. Vehicle condition restored to 95%.`;
    } else if (abilityName.includes('Warrant')) {
      soundEffects.playBeep(1000, 0.06);
      logMsg = `[DOJ JUDICIAL ORDER] Judge approved Search Warrant #4092 for Forum Drive property. Lawful entry authorized.`;
    } else {
      logMsg = `[${roleName.toUpperCase()}] Executed "${abilityName}" successfully in current game tick.`;
    }

    setSimulatedLogs(prev => [logMsg, ...prev.slice(0, 15)]);

    setTimeout(() => {
      setAbilityCooldowns(prev => ({ ...prev, [abilityName]: false }));
    }, 4000);
  };

  return (
    <div id="player-roles-system-hub" className="flex-1 flex flex-col gap-5">
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase font-sans">
              Player Roleplay Roles & Careers System
            </h2>
            <p className="text-xs text-slate-400">
              Structured faction duties, progression ladders, cross-role dynamics, and modular expandable careers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>5 Core Server Roles Configured</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Role Selector (4 cols) & Role Details / Simulator (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Roles Registry Selector */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono px-1">
              Select Career Faction
            </span>

            <div className="space-y-2">
              {ROLE_DEFINITIONS.map(role => {
                const isSelected = selectedRole.id === role.id;
                const IconComponent = roleIcons[role.iconName as keyof typeof roleIcons] || ShieldAlert;

                return (
                  <button
                    key={role.id}
                    id={`role-btn-${role.id}`}
                    onClick={() => {
                      soundEffects.playBeep(750, 0.03);
                      setSelectedRole(role);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${role.badgeColor}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{role.name.split('(')[0]}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono block">
                          {role.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Modular Extensibility Note */}
            <div className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed font-mono">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold mb-1">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Extensible Role Architecture</span>
              </div>
              New roles (San Andreas Highway Patrol, Park Rangers, Real Estate Brokers, News Anchors) can be hot-loaded via permissions node JSON without server restarts.
            </div>
          </div>
        </div>

        {/* Right Column: Role Deep-Dive, Ladder & Simulator */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-4">
            {/* Role Header Banner */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase ${selectedRole.badgeColor}`}>
                    {selectedRole.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedRole.department}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{selectedRole.name}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {selectedRole.overview}
                </p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-right font-mono">
                <span className="text-[10px] text-slate-500 block">BASE HOURLY STIPEND</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {selectedRole.baseSalaryPerTick > 0 ? `$${selectedRole.baseSalaryPerTick} / tick` : 'Illicit / Uncapped'}
                </span>
              </div>
            </div>

            {/* Sub-tab navigation */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'overview' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Duties & Gear Loadout</span>
              </button>
              <button
                onClick={() => setActiveTab('progression')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'progression' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Career Ranks ({selectedRole.progressionRanks.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('interactions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'interactions' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Cross-Role Dynamics</span>
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'simulator' ? 'bg-emerald-600 text-slate-950 font-bold' : 'text-emerald-400 hover:bg-slate-800'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Action Simulator</span>
              </button>
            </div>

            {/* Sub-view 1: Overview & Gear */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Core Duties */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Mandated Roleplay Duties
                  </h4>
                  <div className="space-y-1.5">
                    {selectedRole.coreDuties.map((duty, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{duty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Standard Loadout & Requirements */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2">
                      Issued Gear & Inventory Loadout
                    </h4>
                    <div className="space-y-1.5">
                      {selectedRole.standardLoadout.map((gear, idx) => (
                        <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between">
                          <span>{gear}</span>
                          <span className="text-[10px] text-emerald-400">ISSUED</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-1.5">
                      Recruitment & Licensing Requirements
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 font-mono">
                      {selectedRole.acquisitionRequirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-view 2: Progression Ladder */}
            {activeTab === 'progression' && (
              <div className="space-y-2.5">
                <span className="text-xs font-mono text-slate-400 block mb-1">
                  Promotions are earned through active logged duty hours, leadership certifications, and peer commendations.
                </span>
                {selectedRole.progressionRanks.map(rank => (
                  <div
                    key={rank.rank}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                        R{rank.rank}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{rank.title}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">Perk: {rank.perk}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <span className="text-slate-400">{rank.reqHours} Hours Required</span>
                      <span className="block text-emerald-400 font-bold">${rank.monthlyStipend.toLocaleString()} / mo</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-view 3: Cross-Role Interactions Matrix */}
            {activeTab === 'interactions' && (
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-400 block">
                  How <strong className="text-white">{selectedRole.name.split('(')[0]}</strong> interacts with other factions in the live server world:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedRole.crossRoleInteractions.map((inter, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between gap-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{inter.targetRole}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            inter.relationType === 'adversarial' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            inter.relationType === 'cooperative' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            inter.relationType === 'contractual' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                            'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}>
                            {inter.relationType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-900/50 p-2 rounded-lg border border-slate-800/80">
                          {inter.interactionExample}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-view 4: Interactive Roleplay Action Simulator */}
            {activeTab === 'simulator' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Interactive Role Abilities Sandbox
                  </h4>
                  <p className="text-xs text-slate-400 mb-3">
                    Click any ability below to simulate the in-game command, audio cues, and server MDT logging.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {selectedRole.specialAbilities.map((ab, idx) => {
                      const isOnCd = abilityCooldowns[ab.name];
                      return (
                        <div
                          key={idx}
                          className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between gap-2"
                        >
                          <div>
                            <span className="text-xs font-bold text-white block">{ab.name}</span>
                            <p className="text-[11px] text-slate-400 mt-1 leading-tight">{ab.description}</p>
                            <span className="text-[10px] font-mono text-amber-300 block mt-2">{ab.keybindPrompt}</span>
                          </div>

                          <button
                            disabled={isOnCd}
                            onClick={() => handleTriggerSimAbility(ab.name, selectedRole.name)}
                            className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                              isOnCd
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                            }`}
                          >
                            <Play className="w-3 h-3" />
                            <span>{isOnCd ? 'Cooldown...' : 'Simulate Ability'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulator Event Console Output */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Terminal className="w-3.5 h-3.5" />
                      Live Roleplay Server Console Feed
                    </span>
                    <button
                      onClick={() => setSimulatedLogs([])}
                      className="text-[10px] hover:text-slate-200"
                    >
                      Clear Log
                    </button>
                  </div>
                  <div className="bg-black/50 p-2.5 rounded-lg font-mono text-xs space-y-1 max-h-36 overflow-y-auto">
                    {simulatedLogs.map((log, idx) => (
                      <div key={idx} className="text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-500 select-none">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
