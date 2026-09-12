import { useState, useEffect, FormEvent } from 'react';
import { DispatchCall, BoloWanted, Player } from '../types';
import { TEN_CODES } from '../data/mockData';
import { 
  ShieldAlert, 
  Radio, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  UserCheck, 
  AlertOctagon, 
  Plus, 
  Search, 
  Volume2, 
  DollarSign, 
  FileText,
  BadgeAlert,
  Keyboard,
  HelpCircle,
  X,
  ArrowUp,
  ArrowDown,
  Zap,
  Check
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface CadDispatchProps {
  calls: DispatchCall[];
  bolos: BoloWanted[];
  players: Player[];
  onAddCall: (newCall: DispatchCall) => void;
  onClearCall: (callId: string) => void;
  onAssignUnit: (callId: string, unitName: string) => void;
  onToggleBoloStatus: (boloId: string) => void;
  onAddBolo: (newBolo: BoloWanted) => void;
}

export default function CadDispatch({
  calls,
  bolos,
  players,
  onAddCall,
  onClearCall,
  onAssignUnit,
  onToggleBoloStatus,
  onAddBolo
}: CadDispatchProps) {
  const [activeTab, setActiveTab] = useState<'calls' | 'bolos' | 'tenCodes'>('calls');
  const [callFilter, setCallFilter] = useState<'all' | 'urgent' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard navigation & selected target call state
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [showShortcutsGuide, setShowShortcutsGuide] = useState(false);
  const [shortcutFeedback, setShortcutFeedback] = useState<{
    text: string;
    type: 'assign' | 'clear' | 'nav' | 'filter' | 'info';
    timestamp: number;
  } | null>(null);

  const showFeedback = (text: string, type: 'assign' | 'clear' | 'nav' | 'filter' | 'info' = 'info') => {
    setShortcutFeedback({ text, type, timestamp: Date.now() });
  };

  useEffect(() => {
    if (!shortcutFeedback) return;
    const timer = setTimeout(() => {
      setShortcutFeedback(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [shortcutFeedback?.timestamp]);
  
  // New call modal state
  const [isCreatingCall, setIsCreatingCall] = useState(false);
  const [newCode, setNewCode] = useState('10-31');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('Legion Square, Downtown');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');

  // New BOLO modal state
  const [isCreatingBolo, setIsCreatingBolo] = useState(false);
  const [newBoloName, setNewBoloName] = useState('');
  const [newBoloAlias, setNewBoloAlias] = useState('');
  const [newBoloOffenses, setNewBoloOffenses] = useState('');
  const [newBoloBounty, setNewBoloBounty] = useState('25000');
  const [newBoloThreat, setNewBoloThreat] = useState<'caution' | 'armed' | 'extreme'>('armed');
  const [newBoloLastSeen, setNewBoloLastSeen] = useState('South Los Santos');

  const onDutyUnits = players.filter(p => p.job === 'lspd' || p.job === 'bcso' || p.job === 'ems');

  const handleCreateCallSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    soundEffects.playDispatchAlert();

    const createdCall: DispatchCall = {
      id: `CAD-${Math.floor(1000 + Math.random() * 9000)}`,
      code: newCode,
      title: newTitle,
      description: newDesc || 'No supplemental report provided by dispatcher.',
      location: newLocation,
      zone: newLocation.split(',')[1]?.trim() || 'Central LS',
      timeAgo: 'Just now',
      priority: newPriority,
      respondingUnits: [],
      caller: 'LSPD Dispatch Console',
      status: 'active',
      coords: { x: 450 + Math.random() * 100, y: 500 + Math.random() * 100 }
    };

    onAddCall(createdCall);
    setIsCreatingCall(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleCreateBoloSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newBoloName) return;

    soundEffects.playBeep(700, 0.08);

    const createdBolo: BoloWanted = {
      id: `BOLO-${Math.floor(10 + Math.random() * 90)}`,
      name: newBoloName,
      alias: newBoloAlias ? `"${newBoloAlias}"` : '',
      offenses: newBoloOffenses.split(',').map(s => s.trim()).filter(Boolean),
      bounty: parseInt(newBoloBounty, 10) || 10000,
      threatLevel: newBoloThreat,
      lastSeen: newBoloLastSeen,
      status: 'active'
    };

    onAddBolo(createdBolo);
    setIsCreatingBolo(false);
    setNewBoloName('');
    setNewBoloAlias('');
    setNewBoloOffenses('');
  };

  const filteredCalls = calls.filter(c => {
    if (callFilter === 'urgent' && c.priority !== 'urgent') return false;
    if (callFilter === 'active' && c.status !== 'active') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Determine currently selected call for keyboard dispatcher operations
  const effectiveSelectedCallId = (selectedCallId && filteredCalls.some(c => c.id === selectedCallId))
    ? selectedCallId
    : (filteredCalls[0]?.id || null);

  const handleAssignUnitToCall = (call: DispatchCall) => {
    const available = onDutyUnits.find(u => !call.respondingUnits.some(r => r.includes(u.characterName)));
    const unitName = available ? `${available.characterName} (ID: ${available.id})` : 'Unit 1-A-12 (Watch Commander)';
    soundEffects.playRadioChirp();
    onAssignUnit(call.id, unitName);
    showFeedback(`[A] UNIT ATTACHED: ${unitName} responding to ${call.id} (${call.code})`, 'assign');
  };

  const handleClearCallAction = (call: DispatchCall) => {
    soundEffects.playBeep(600, 0.05);
    onClearCall(call.id);
    showFeedback(`[C] 10-98 CLEARED: Incident ${call.id} resolved and closed.`, 'clear');
    
    // Automatically advance to the next call in the queue
    const remaining = filteredCalls.filter(c => c.id !== call.id);
    if (remaining.length > 0) {
      setSelectedCallId(remaining[0].id);
    } else {
      setSelectedCallId(null);
    }
  };

  // Keyboard shortcut listener for rapid CAD dispatching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping = 
        activeEl instanceof HTMLInputElement || 
        activeEl instanceof HTMLTextAreaElement || 
        activeEl instanceof HTMLSelectElement;

      // When the user is typing in a form or input, don't trigger hotkeys
      if (isTyping) {
        if (e.key === 'Escape') {
          (activeEl as HTMLElement).blur();
        }
        return;
      }

      // If Escape is pressed, close any open modal
      if (e.key === 'Escape') {
        if (showShortcutsGuide) {
          setShowShortcutsGuide(false);
          return;
        }
        if (isCreatingCall) {
          setIsCreatingCall(false);
          return;
        }
        if (isCreatingBolo) {
          setIsCreatingBolo(false);
          return;
        }
      }

      // If modal is currently open, don't trigger background call shortcuts
      if (isCreatingCall || isCreatingBolo) return;

      const key = e.key.toLowerCase();

      // '?' or Shift+'/' -> Toggle Hotkeys Guide
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsGuide(prev => !prev);
        soundEffects.playBeep(800, 0.03);
        return;
      }

      // '/' -> Focus Search input
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('search-cad-calls');
        if (searchInput) {
          searchInput.focus();
          showFeedback('Focused search filter [/]', 'info');
        }
        return;
      }

      // 'N' -> New Incident Dispatch
      if (key === 'n' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsCreatingCall(true);
        soundEffects.playBeep(900, 0.04);
        return;
      }

      // 'U' -> Toggle Urgent priority filter
      if (key === 'u') {
        e.preventDefault();
        setCallFilter(prev => {
          const next = prev === 'urgent' ? 'all' : 'urgent';
          showFeedback(next === 'urgent' ? 'Filter: URGENT Priority Only [U]' : 'Filter: ALL Priority Levels [U]', 'filter');
          return next;
        });
        soundEffects.playBeep(750, 0.03);
        return;
      }

      // Only perform emergency call hotkeys if on 911 Calls tab
      if (activeTab !== 'calls') return;

      if (filteredCalls.length === 0) return;

      const currentIndex = filteredCalls.findIndex(c => c.id === effectiveSelectedCallId);
      const targetCall = filteredCalls.find(c => c.id === effectiveSelectedCallId) || filteredCalls[0];

      // 'A' -> Attach / Assign Unit to selected call
      if (key === 'a' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (targetCall) {
          handleAssignUnitToCall(targetCall);
        }
        return;
      }

      // 'C' -> 10-98 Clear Call
      if (key === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (targetCall) {
          handleClearCallAction(targetCall);
        }
        return;
      }

      // Arrow Down or 'J' -> Next call in queue
      if (e.key === 'ArrowDown' || key === 'j') {
        e.preventDefault();
        const nextIdx = currentIndex < filteredCalls.length - 1 ? currentIndex + 1 : 0;
        const nextCall = filteredCalls[nextIdx];
        setSelectedCallId(nextCall.id);
        soundEffects.playBeep(950, 0.02);
        showFeedback(`Selected Call #${nextIdx + 1}: ${nextCall.code} - ${nextCall.title}`, 'nav');
        return;
      }

      // Arrow Up or 'K' -> Previous call in queue
      if (e.key === 'ArrowUp' || key === 'k') {
        e.preventDefault();
        const prevIdx = currentIndex > 0 ? currentIndex - 1 : filteredCalls.length - 1;
        const prevCall = filteredCalls[prevIdx];
        setSelectedCallId(prevCall.id);
        soundEffects.playBeep(950, 0.02);
        showFeedback(`Selected Call #${prevIdx + 1}: ${prevCall.code} - ${prevCall.title}`, 'nav');
        return;
      }

      // Number keys 1-9 -> Jump directly to call #1-#9
      if (/^[1-9]$/.test(e.key)) {
        const numIndex = parseInt(e.key, 10) - 1;
        if (numIndex < filteredCalls.length) {
          e.preventDefault();
          const target = filteredCalls[numIndex];
          setSelectedCallId(target.id);
          soundEffects.playBeep(900, 0.02);
          showFeedback(`Quick Selected Call #${numIndex + 1}: ${target.code} ${target.title}`, 'nav');
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeTab,
    filteredCalls,
    effectiveSelectedCallId,
    isCreatingCall,
    isCreatingBolo,
    showShortcutsGuide,
    onDutyUnits,
    callFilter
  ]);

  return (
    <div id="cad-mdt-terminal" className="flex flex-col gap-4">
      {/* Top Header & Navigation Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">SAN ANDREAS CAD-MDT SYSTEM</h2>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded text-[10px] font-mono font-bold">
                SECURE POLICE & EMS FEED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Authorized Dispatch Terminal • On-Duty First Responders: <strong className="text-blue-400">{onDutyUnits.length} Units Active</strong>
            </p>
          </div>
        </div>

        {/* CAD Navigation Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            id="tab-cad-calls"
            onClick={() => {
              soundEffects.playRadioChirp();
              setActiveTab('calls');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'calls'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            911 Calls ({calls.length})
          </button>

          <button
            id="tab-cad-bolos"
            onClick={() => {
              soundEffects.playBeep(800, 0.04);
              setActiveTab('bolos');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'bolos'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            BOLO Warrants ({bolos.filter(b => b.status === 'active').length})
          </button>

          <button
            id="tab-cad-codes"
            onClick={() => {
              soundEffects.playBeep(700, 0.04);
              setActiveTab('tenCodes');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'tenCodes'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            10-Codes Guide
          </button>
        </div>
      </div>

      {/* TAB 1: 911 CALLS DISPATCH */}
      {activeTab === 'calls' && (
        <div className="flex flex-col gap-4">
          {/* Tactical Dispatcher Hotkeys HUD Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-950/70 border border-blue-700/60 rounded-lg text-blue-300 font-mono font-semibold">
                <Keyboard className="w-3.5 h-3.5 text-blue-400" />
                <span>HOTKEYS ARMED</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
                <kbd className="px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded font-mono font-bold text-amber-300 text-[11px] shadow-sm">
                  A
                </kbd>
                <span className="text-slate-400">Assign Unit</span>
              </div>

              <span className="text-slate-700 hidden sm:inline">•</span>

              <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
                <kbd className="px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded font-mono font-bold text-emerald-400 text-[11px] shadow-sm">
                  C
                </kbd>
                <span className="text-slate-400">10-98 Clear</span>
              </div>

              <span className="text-slate-700 hidden md:inline">•</span>

              <div className="hidden md:flex items-center gap-1.5 text-slate-300">
                <kbd className="px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded font-mono font-bold text-sky-400 text-[11px] shadow-sm">
                  ↑ / ↓
                </kbd>
                <span className="text-slate-400">Target Call</span>
              </div>

              <span className="text-slate-700 hidden lg:inline">•</span>

              <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
                <kbd className="px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded font-mono font-bold text-purple-300 text-[11px] shadow-sm">
                  1-9
                </kbd>
                <span className="text-slate-400">Direct Jump</span>
              </div>
            </div>

            {/* Target Status & Feedback alert or Cheatsheet toggle */}
            <div className="flex items-center gap-2">
              {shortcutFeedback ? (
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    shortcutFeedback.type === 'assign'
                      ? 'bg-blue-900/70 border border-blue-500 text-blue-200'
                      : shortcutFeedback.type === 'clear'
                      ? 'bg-emerald-900/70 border border-emerald-500 text-emerald-200'
                      : 'bg-slate-800 border border-slate-600 text-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{shortcutFeedback.text}</span>
                </div>
              ) : effectiveSelectedCallId ? (
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-md">
                  <span className="text-blue-400">🎯 Target:</span>
                  <span className="text-white font-bold">{effectiveSelectedCallId}</span>
                </div>
              ) : null}

              <button
                id="btn-cad-shortcuts-help"
                onClick={() => {
                  soundEffects.playBeep(850, 0.03);
                  setShowShortcutsGuide(prev => !prev);
                }}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="View All Dispatcher Keyboard Shortcuts [?]"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Shortcuts</span>
                <kbd className="px-1.5 py-0.2 bg-slate-800 border border-slate-600 rounded text-[10px] font-mono text-slate-300">
                  ?
                </kbd>
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="search-cad-calls"
                  type="text"
                  placeholder="Filter 10-code, incident name, or street... (Press [/] to focus)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-1 text-xs">
                {(['all', 'urgent', 'active'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setCallFilter(f)}
                    className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                      callFilter === f
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="btn-open-create-call"
              onClick={() => {
                soundEffects.playBeep(900, 0.04);
                setIsCreatingCall(true);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Dispatch New Incident</span>
              <kbd className="hidden sm:inline px-1 bg-blue-700 border border-blue-500 rounded text-[10px] font-mono">
                N
              </kbd>
            </button>
          </div>

          {/* Calls Cards Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCalls.map((call, idx) => {
              const isUrgent = call.priority === 'urgent';
              const isHigh = call.priority === 'high';
              const isSelected = call.id === effectiveSelectedCallId;

              return (
                <div
                  key={call.id}
                  id={`cad-call-${call.id}`}
                  onClick={() => setSelectedCallId(call.id)}
                  className={`border rounded-xl p-4 flex flex-col justify-between transition-all relative overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-blue-500 border-blue-400 bg-slate-900 shadow-lg shadow-blue-950/40'
                      : isUrgent
                      ? 'border-rose-500/50 bg-rose-950/10 hover:border-rose-400'
                      : isHigh
                      ? 'border-amber-500/40 bg-amber-950/10 hover:border-amber-400'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  {/* Left priority accent indicator */}
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full ${
                      isSelected ? 'bg-blue-400' : isUrgent ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                  />

                  <div>
                    {/* Selected Call Banner */}
                    {isSelected && (
                      <div className="mb-2.5 -mt-1 pl-2 flex items-center justify-between gap-2 py-1 px-2.5 bg-blue-500/15 border border-blue-500/40 rounded-lg text-[11px] text-blue-300 font-mono font-semibold">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                          <span>🎯 ACTIVE KEYBOARD TARGET</span>
                        </span>
                        <span className="text-[10px] text-slate-300">
                          Press <kbd className="px-1 bg-slate-900 border border-slate-700 rounded text-amber-300 font-bold">A</kbd> Assign • <kbd className="px-1 bg-slate-900 border border-slate-700 rounded text-emerald-400 font-bold">C</kbd> Clear
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2 mb-2 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-white flex items-center gap-1.5">
                          <span className="text-[10px] px-1 bg-blue-900/60 text-blue-300 rounded border border-blue-700/50">
                            #{idx + 1}
                          </span>
                          <span>{call.code}</span>
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{call.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isUrgent
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : isHigh
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {call.priority} PRIORITY
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {call.timeAgo}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-base text-white pl-2 mb-1">{call.title}</h4>
                    <p className="text-xs text-slate-300 pl-2 leading-relaxed mb-3">
                      {call.description}
                    </p>

                    <div className="pl-2 flex flex-col gap-1 text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-slate-200">{call.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                        <span>Source: <strong className="text-slate-300">{call.caller}</strong></span>
                      </div>
                    </div>

                    {/* Responding Units */}
                    <div className="pl-2 mb-3">
                      <span className="text-[11px] font-bold text-slate-400 block mb-1">
                        ATTACHED UNITS ({call.respondingUnits.length}):
                      </span>
                      {call.respondingUnits.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {call.respondingUnits.map((u) => (
                            <span
                              key={u}
                              className="text-[11px] bg-blue-950/70 border border-blue-700/50 text-blue-200 px-2 py-0.5 rounded font-mono"
                            >
                              🚔 {u}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-amber-400 italic">
                          No units assigned yet — Waiting for 10-8 response
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Call Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 pl-2">
                    <button
                      id={`btn-attach-${call.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignUnitToCall(call);
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <kbd className="px-1.5 py-0.2 bg-slate-950 border border-slate-600 rounded text-[10px] font-mono font-bold text-amber-300 shadow-sm">
                        A
                      </kbd>
                      <UserCheck className="w-3.5 h-3.5 text-blue-300" />
                      <span>Attach Unit</span>
                    </button>

                    <button
                      id={`btn-clear-${call.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearCallAction(call);
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                          : 'bg-emerald-950/50 border border-emerald-700/40 hover:bg-emerald-900/50 text-emerald-300'
                      }`}
                    >
                      <kbd className="px-1.5 py-0.2 bg-slate-950 border border-emerald-600 rounded text-[10px] font-mono font-bold text-emerald-300 shadow-sm">
                        C
                      </kbd>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>10-98 Clear Call</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BOLO & ACTIVE WARRANTS */}
      {activeTab === 'bolos' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Active BOLO Notices (Be On The Lookout)
              </h3>
              <p className="text-xs text-slate-400">High priority warrants issued by DOJ & San Andreas State Police</p>
            </div>

            <button
              id="btn-open-create-bolo"
              onClick={() => {
                soundEffects.playBeep(850, 0.04);
                setIsCreatingBolo(true);
              }}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Issue New BOLO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bolos.map((bolo) => (
              <div
                key={bolo.id}
                id={`bolo-card-${bolo.id}`}
                className={`bg-slate-900 border rounded-xl p-4 flex flex-col justify-between transition-all ${
                  bolo.status === 'captured'
                    ? 'border-slate-800 opacity-60'
                    : bolo.threatLevel === 'extreme'
                    ? 'border-rose-500/60 shadow-lg shadow-rose-950/20'
                    : 'border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-xs text-slate-400 font-bold">{bolo.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        bolo.status === 'captured'
                          ? 'bg-slate-800 text-slate-400'
                          : bolo.threatLevel === 'extreme'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {bolo.status === 'captured' ? 'IN CUSTODY' : `${bolo.threatLevel.toUpperCase()} THREAT`}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{bolo.name}</h4>
                  {bolo.alias && (
                    <p className="text-xs text-amber-400 font-semibold mb-2">{bolo.alias}</p>
                  )}

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 mb-3">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                      Outstanding Charges:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {bolo.offenses.map((off, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-400">•</span>
                          <span>{off}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 mb-3">
                    <p>Last Known Location: <strong className="text-slate-200">{bolo.lastSeen}</strong></p>
                    <div className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                      <DollarSign className="w-3.5 h-3.5" />
                      Bounty Reward: ${bolo.bounty.toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-toggle-bolo-${bolo.id}`}
                  onClick={() => {
                    soundEffects.playBeep(800, 0.05);
                    onToggleBoloStatus(bolo.id);
                  }}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    bolo.status === 'captured'
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  <BadgeAlert className="w-3.5 h-3.5" />
                  {bolo.status === 'captured' ? 'Reopen Warrant' : 'Mark as Arrested / 10-15'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 10-CODES REFERENCE */}
      {activeTab === 'tenCodes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">San Andreas Standard Police Radio 10-Codes</h3>
            <p className="text-xs text-slate-400">Official brevity codes used by LSPD, BCSO, and San Andreas State Police.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {TEN_CODES.map((tc) => (
              <div
                key={tc.code}
                className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 flex items-center gap-3 hover:border-blue-500/40 transition-colors"
              >
                <span className="font-mono text-base font-bold text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded border border-blue-800/40">
                  {tc.code}
                </span>
                <span className="text-xs text-slate-300 font-medium">{tc.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE NEW CALL MODAL */}
      {isCreatingCall && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Create Emergency Dispatch Call</h3>
            <p className="text-xs text-slate-400 mb-4">Broadcast an active 911 alert to all on-duty units.</p>

            <form onSubmit={handleCreateCallSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">10-Code Type</label>
                <select
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="10-31">10-31 (Crime in Progress)</option>
                  <option value="10-90">10-90 (Bank Alarm)</option>
                  <option value="10-80">10-80 (Vehicle Pursuit)</option>
                  <option value="10-52">10-52 (Ambulance Needed)</option>
                  <option value="10-99">10-99 (Officer in Distress)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pacific Standard Bank silent alarm"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Incident Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe suspect clothing, weapons spotted, number of hostages..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent (Code 3)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingCall(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md"
                >
                  Broadcast Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE BOLO MODAL */}
      {isCreatingBolo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Issue Warrant / BOLO Notice</h3>
            <p className="text-xs text-slate-400 mb-4">Post a wanted notice for high-priority suspects.</p>

            <form onSubmit={handleCreateBoloSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frank Castle"
                  value={newBoloName}
                  onChange={(e) => setNewBoloName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Street Alias / Nickname</label>
                <input
                  type="text"
                  placeholder="e.g. The Punisher"
                  value={newBoloAlias}
                  onChange={(e) => setNewBoloAlias(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Offenses (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Bank Robbery, Aggravated Assault, Evading"
                  value={newBoloOffenses}
                  onChange={(e) => setNewBoloOffenses(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Bounty ($)</label>
                  <input
                    type="number"
                    value={newBoloBounty}
                    onChange={(e) => setNewBoloBounty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Threat Level</label>
                  <select
                    value={newBoloThreat}
                    onChange={(e) => setNewBoloThreat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="caution">Caution (Non-violent)</option>
                    <option value="armed">Armed & Dangerous</option>
                    <option value="extreme">Extreme (Shoot on Sight)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingBolo(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md"
                >
                  Publish BOLO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISPATCHER SHORTCUTS REFERENCE MODAL */}
      {showShortcutsGuide && (
        <div 
          id="modal-shortcuts-guide"
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowShortcutsGuide(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">CAD Dispatcher Keyboard Hotkeys</h3>
                  <p className="text-xs text-slate-400">Accelerate 911 incident handling and patrol unit assignments</p>
                </div>
              </div>
              <button
                onClick={() => setShowShortcutsGuide(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 font-mono">
                  ⚡ Emergency Operations (Targeted Call)
                </h4>
                <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Attach next available on-duty unit</span>
                    <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold rounded shadow-sm">
                      A
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">10-98 Clear & archive incident</span>
                    <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold rounded shadow-sm">
                      C
                    </kbd>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 font-mono">
                  🎯 Target Call Selection & Navigation
                </h4>
                <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Select next call down the queue</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-sky-300 font-mono font-bold rounded">
                        ↓
                      </kbd>
                      <span className="text-slate-500 text-[10px]">or</span>
                      <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-sky-300 font-mono font-bold rounded">
                        J
                      </kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Select previous call up the queue</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-sky-300 font-mono font-bold rounded">
                        ↑
                      </kbd>
                      <span className="text-slate-500 text-[10px]">or</span>
                      <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-sky-300 font-mono font-bold rounded">
                        K
                      </kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Directly target call #1 through #9</span>
                    <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-purple-300 font-mono font-bold rounded">
                      1 – 9
                    </kbd>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 font-mono">
                  🛠️ CAD Tools & Search
                </h4>
                <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Create & broadcast new emergency incident</span>
                    <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-200 font-mono font-bold rounded">
                      N
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Toggle Urgent priority filter</span>
                    <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-rose-400 font-mono font-bold rounded">
                      U
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Focus search and filter box</span>
                    <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 font-mono font-bold rounded">
                      /
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Close modal / Cancel form / Blur</span>
                    <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-400 font-mono font-bold rounded">
                      Esc
                    </kbd>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Hotkeys automatically pause while typing in text inputs.</span>
              <button
                onClick={() => setShowShortcutsGuide(false)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
