import { useState } from 'react';
import { 
  VehicleModel, 
  OwnedVehicle, 
  PropertyListing, 
  VehicleCategory, 
  PropertyCategory 
} from '../types';
import { 
  VEHICLE_CATALOG, 
  INITIAL_OWNED_VEHICLES, 
  PROPERTY_CATALOG 
} from '../data/assetsAndEconomyData';
import { 
  Car, 
  Home, 
  Gauge, 
  Zap, 
  ShieldCheck, 
  Key, 
  Wrench, 
  Paintbrush, 
  Package, 
  Building, 
  Lock, 
  Unlock, 
  DollarSign, 
  Check, 
  AlertTriangle,
  Info,
  Sliders,
  Sparkles,
  Search
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface VehiclesAndPropertiesProps {
  playerCash: number;
  onDeductCash?: (amount: number) => void;
}

export default function VehiclesAndProperties({ 
  playerCash: _playerCash, 
  onDeductCash 
}: VehiclesAndPropertiesProps) {
  const [subTab, setSubTab] = useState<'vehicles' | 'properties' | 'guide'>('vehicles');
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<string>('All');
  const [selectedPropertyCategory, setSelectedPropertyCategory] = useState<string>('All');

  // Owned vehicles state
  const [ownedVehicles, setOwnedVehicles] = useState<OwnedVehicle[]>(INITIAL_OWNED_VEHICLES);
  const [selectedOwnedVeh, setSelectedOwnedVeh] = useState<OwnedVehicle>(INITIAL_OWNED_VEHICLES[0]);

  // Catalog vehicles state
  const [selectedCatalogVeh, setSelectedCatalogVeh] = useState<VehicleModel>(VEHICLE_CATALOG[0]);
  const [vehicleSearch, setVehicleSearch] = useState('');

  // Properties state
  const [properties, setProperties] = useState<PropertyListing[]>(PROPERTY_CATALOG);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing>(PROPERTY_CATALOG[0]);

  // Mod shop active tab
  const [modView, setModView] = useState<'inspect' | 'tuner' | 'trunk'>('inspect');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    soundEffects.playBeep(880, 0.08);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // Filtered vehicles
  const filteredCatalog = VEHICLE_CATALOG.filter(v => {
    const matchCat = selectedVehicleCategory === 'All' || v.category === selectedVehicleCategory;
    const matchSearch = v.name.toLowerCase().includes(vehicleSearch.toLowerCase()) || 
                        v.brand.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                        v.category.toLowerCase().includes(vehicleSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filtered properties
  const filteredProperties = properties.filter(p => {
    return selectedPropertyCategory === 'All' || p.category === selectedPropertyCategory;
  });

  // Handle vehicle tuning upgrade
  const handleUpgradeMod = (type: 'engine' | 'brakes' | 'turbo' | 'armor', cost: number) => {
    if (!selectedOwnedVeh) return;

    const currentVehId = selectedOwnedVeh.id;
    let upgraded = false;

    setOwnedVehicles(prev => prev.map(v => {
      if (v.id === currentVehId) {
        const newMods = { ...v.mods };
        if (type === 'engine' && newMods.engineTier < 4) {
          newMods.engineTier += 1;
          upgraded = true;
        } else if (type === 'brakes' && newMods.brakesTier < 4) {
          newMods.brakesTier += 1;
          upgraded = true;
        } else if (type === 'turbo') {
          newMods.turboInstalled = !newMods.turboInstalled;
          upgraded = true;
        } else if (type === 'armor' && newMods.armorTier < 5) {
          newMods.armorTier += 1;
          upgraded = true;
        }
        return { ...v, mods: newMods };
      }
      return v;
    }));

    if (upgraded) {
      if (onDeductCash) onDeductCash(cost);
      showNotification(`Tuning Applied to [${selectedOwnedVeh.plate}]! Incurred $${cost.toLocaleString()} parts fee.`);
      // Update active selection
      setTimeout(() => {
        setSelectedOwnedVeh(prev => {
          const found = ownedVehicles.find(item => item.id === prev.id);
          return found || prev;
        });
      }, 50);
    }
  };

  // Handle custom plate change
  const handleCustomPlate = (newPlate: string) => {
    if (!selectedOwnedVeh || !newPlate.trim()) return;
    const cleanPlate = newPlate.trim().toUpperCase().slice(0, 8);
    setOwnedVehicles(prev => prev.map(v => 
      v.id === selectedOwnedVeh.id ? { ...v, plate: cleanPlate, mods: { ...v.mods, customPlateText: cleanPlate } } : v
    ));
    showNotification(`Department of Motor Vehicles re-registered plate: "${cleanPlate}".`);
  };

  // Handle property lock toggle
  const handleTogglePropertyLock = (propId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propId) {
        const nextStatus = p.lockStatus === 'locked' ? 'unlocked' : 'locked';
        soundEffects.playRadioChirp();
        return { ...p, lockStatus: nextStatus };
      }
      return p;
    }));
  };

  // Handle property buy / rent
  const handleAcquireProperty = (prop: PropertyListing) => {
    setProperties(prev => prev.map(p => {
      if (p.id === prop.id) {
        return { ...p, isOwned: true, ownerName: 'Active Character' };
      }
      return p;
    }));
    showNotification(`Congratulations! Deed to "${prop.name}" registered via Dynasty 8.`);
  };

  return (
    <div id="vehicles-and-properties-system" className="flex-1 flex flex-col gap-5">
      {/* Sub-navigation & Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg backdrop-blur">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase font-sans">
                Custom Vehicles & Real Estate System
              </h2>
              <p className="text-xs text-slate-400">
                Premium dealerships, underground tuner performance mods, Dynasty 8 luxury properties & secure stashes
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            id="tab-btn-vehicles"
            onClick={() => {
              soundEffects.playBeep(700, 0.04);
              setSubTab('vehicles');
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              subTab === 'vehicles'
                ? 'bg-emerald-600 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Vehicles & Garage</span>
          </button>
          <button
            id="tab-btn-properties"
            onClick={() => {
              soundEffects.playBeep(700, 0.04);
              setSubTab('properties');
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              subTab === 'properties'
                ? 'bg-emerald-600 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dynasty 8 Properties</span>
          </button>
          <button
            id="tab-btn-guide"
            onClick={() => {
              soundEffects.playBeep(700, 0.04);
              setSubTab('guide');
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all ${
              subTab === 'guide'
                ? 'bg-emerald-600 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Acquisition & Benefits Guide</span>
          </button>
        </div>
      </div>

      {/* Action toast */}
      {actionSuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-lg text-xs font-mono flex items-center gap-2 shadow-lg animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* VEHICLES TAB: DEALERSHIP CATALOG + OWNED GARAGE MODS */}
      {/* ==================================================== */}
      {subTab === 'vehicles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Dealership Showroom & Catalog (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  Vehicle Showroom & Import Catalog
                </h3>
                {/* Search input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search brand, model..."
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-44"
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {(['All', 'Street Tuner', 'Heavy Enforcement', 'Off-Road & Smuggler', 'Super & Exotic', 'Commercial Utility'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      soundEffects.playBeep(650, 0.03);
                      setSelectedVehicleCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      selectedVehicleCategory === cat
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Catalog Vehicles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 max-h-[460px] overflow-y-auto pr-1">
                {filteredCatalog.map(veh => {
                  const isSelected = selectedCatalogVeh.id === veh.id;
                  return (
                    <div
                      key={veh.id}
                      onClick={() => {
                        soundEffects.playBeep(750, 0.04);
                        setSelectedCatalogVeh(veh);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                            {veh.brand}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            {veh.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                          {veh.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mt-1">
                          <DollarSign className="w-3.5 h-3.5 -mr-1" />
                          <span>{veh.price.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500 font-normal">MSRP</span>
                        </div>
                      </div>

                      {/* Specs Mini Bar */}
                      <div className="grid grid-cols-3 gap-1.5 pt-3 mt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                        <div>
                          <span className="text-[9px] text-slate-500 block">TOP SPEED</span>
                          <span className="text-slate-200 font-semibold">{veh.topSpeedMph} MPH</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">0-60 MPH</span>
                          <span className="text-slate-200 font-semibold">{veh.acceleration0to60}s</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">TRUNK</span>
                          <span className="text-slate-200 font-semibold">{veh.trunkCapacityKg}kg</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Catalog Vehicle Deep-Dive */}
              {selectedCatalogVeh && (
                <div className="mt-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-400 font-mono font-bold uppercase">Spec Sheet Inspector</span>
                      <h4 className="text-base font-bold text-white">{selectedCatalogVeh.name}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-mono">Acquisition Price</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">${selectedCatalogVeh.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <strong className="text-amber-400 font-medium">Unique In-Game Perk: </strong>
                    {selectedCatalogVeh.uniquePerk}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
                    <span>Acquisition: <span className="text-slate-200">{selectedCatalogVeh.acquisitionMethod}</span></span>
                    <span>Livery: <span className="text-slate-200">{selectedCatalogVeh.featuredLivery}</span></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Registered Player Garage & Tuner Mod Shop (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  My Registered Garage
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {ownedVehicles.length} Vehicles Owned
                </span>
              </div>

              {/* Owned Vehicle Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {ownedVehicles.map(veh => (
                  <button
                    key={veh.id}
                    onClick={() => {
                      soundEffects.playBeep(800, 0.04);
                      setSelectedOwnedVeh(veh);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      selectedOwnedVeh?.id === veh.id
                        ? 'bg-emerald-600 text-slate-950 font-bold shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{veh.plate}</span>
                  </button>
                ))}
              </div>

              {selectedOwnedVeh && (
                <div className="flex flex-col gap-3">
                  {/* Vehicle Card Header */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{selectedOwnedVeh.brand}</span>
                        <h4 className="text-sm font-bold text-white">{selectedOwnedVeh.modelName}</h4>
                        <span className="text-xs font-mono text-slate-400 block mt-0.5">
                          Location: <span className="text-slate-200">{selectedOwnedVeh.garageLocation}</span>
                        </span>
                      </div>
                      <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-xs font-bold text-amber-300">
                        {selectedOwnedVeh.plate}
                      </div>
                    </div>

                    {/* Vitals Telemetry */}
                    <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 text-center">
                      <div className="bg-slate-900/60 p-1.5 rounded">
                        <span className="text-slate-500 block">ENGINE</span>
                        <span className="text-emerald-400 font-bold">{selectedOwnedVeh.engineHealth / 10}%</span>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded">
                        <span className="text-slate-500 block">BODY</span>
                        <span className="text-sky-400 font-bold">{selectedOwnedVeh.bodyHealth}%</span>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded">
                        <span className="text-slate-500 block">FUEL</span>
                        <span className="text-amber-400 font-bold">{selectedOwnedVeh.fuelPercent}%</span>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded">
                        <span className="text-slate-500 block">MILEAGE</span>
                        <span className="text-slate-300 font-bold">{selectedOwnedVeh.mileageMiles.toFixed(0)} mi</span>
                      </div>
                    </div>
                  </div>

                  {/* Mod Shop Action Sub-Tabs */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModView('inspect')}
                        className={`pb-1 font-semibold transition-colors ${
                          modView === 'inspect' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Installed Mods
                      </button>
                      <button
                        onClick={() => setModView('tuner')}
                        className={`pb-1 font-semibold transition-colors ${
                          modView === 'tuner' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Performance Tuning
                      </button>
                      <button
                        onClick={() => setModView('trunk')}
                        className={`pb-1 font-semibold transition-colors ${
                          modView === 'trunk' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Trunk Stash ({selectedOwnedVeh.trunkInventory.length})
                      </button>
                    </div>
                  </div>

                  {/* View 1: Installed Mods Overview */}
                  {modView === 'inspect' && (
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-slate-400">Engine Tuning:</span>
                        <span className="text-emerald-400 font-bold">Tier {selectedOwnedVeh.mods.engineTier} EMS V8</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-slate-400">Braking System:</span>
                        <span className="text-emerald-400 font-bold">Tier {selectedOwnedVeh.mods.brakesTier} Ceramic Calipers</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-slate-400">Turbocharger:</span>
                        <span className={selectedOwnedVeh.mods.turboInstalled ? "text-emerald-400 font-bold" : "text-slate-500"}>
                          {selectedOwnedVeh.mods.turboInstalled ? 'Equipped (Garrett Twin-Turbo)' : 'Stock Naturally Aspirated'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-slate-400">Armor Rating:</span>
                        <span className="text-sky-400 font-bold">Tier {selectedOwnedVeh.mods.armorTier} (Ballistic Plating)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-slate-400">Underglow Neon:</span>
                        <span className={selectedOwnedVeh.mods.neonUnderglow ? "text-purple-400 font-bold" : "text-slate-500"}>
                          {selectedOwnedVeh.mods.neonUnderglow ? 'Neon Glow Enabled' : 'None'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* View 2: Performance Tuner Shop Actions */}
                  {modView === 'tuner' && (
                    <div className="space-y-2.5 text-xs">
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-white block">Upgrade Engine Block</span>
                          <span className="text-[10px] text-slate-400 font-mono">Current: Tier {selectedOwnedVeh.mods.engineTier}/4 (+$250/tier)</span>
                        </div>
                        <button
                          disabled={selectedOwnedVeh.mods.engineTier >= 4}
                          onClick={() => handleUpgradeMod('engine', 12500)}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                            selectedOwnedVeh.mods.engineTier >= 4
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                          }`}
                        >
                          {selectedOwnedVeh.mods.engineTier >= 4 ? 'MAX TIER' : 'Upgrade ($12.5k)'}
                        </button>
                      </div>

                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-white block">Install Twin Turbocharger</span>
                          <span className="text-[10px] text-slate-400 font-mono">Status: {selectedOwnedVeh.mods.turboInstalled ? 'Active' : 'Stock'}</span>
                        </div>
                        <button
                          onClick={() => handleUpgradeMod('turbo', 18000)}
                          className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors"
                        >
                          {selectedOwnedVeh.mods.turboInstalled ? 'Remove Turbo' : 'Install ($18k)'}
                        </button>
                      </div>

                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-white block">Reinforce Ballistic Armor</span>
                          <span className="text-[10px] text-slate-400 font-mono">Current: Tier {selectedOwnedVeh.mods.armorTier}/5</span>
                        </div>
                        <button
                          disabled={selectedOwnedVeh.mods.armorTier >= 5}
                          onClick={() => handleUpgradeMod('armor', 24000)}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                            selectedOwnedVeh.mods.armorTier >= 5
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                          }`}
                        >
                          {selectedOwnedVeh.mods.armorTier >= 5 ? 'MAX TIER' : 'Upgrade ($24k)'}
                        </button>
                      </div>

                      {/* Custom Plate Edit */}
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <span className="font-semibold text-white block text-xs">Custom Vanity Plate</span>
                          <span className="text-[10px] text-slate-400 font-mono">DMV San Andreas fee: $5,000</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            defaultValue={selectedOwnedVeh.plate}
                            maxLength={8}
                            id="input-vanity-plate"
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-amber-300 font-mono font-bold uppercase w-24 text-center focus:outline-none focus:border-amber-400"
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById('input-vanity-plate') as HTMLInputElement;
                              if (input) handleCustomPlate(input.value);
                            }}
                            className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* View 3: Trunk Stash Inventory */}
                  {modView === 'trunk' && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] pb-1 border-b border-slate-800">
                        <span>ITEM DESCRIPTION</span>
                        <span>QTY / WEIGHT</span>
                      </div>
                      {selectedOwnedVeh.trunkInventory.length === 0 ? (
                        <p className="text-slate-500 text-center py-4 font-mono text-xs">Trunk is currently empty.</p>
                      ) : (
                        selectedOwnedVeh.trunkInventory.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800/80 font-mono"
                          >
                            <div className="flex items-center gap-2">
                              <Package className="w-3.5 h-3.5 text-slate-400" />
                              <span className={item.isIllegal ? 'text-amber-400 font-semibold' : 'text-slate-200'}>
                                {item.name}
                              </span>
                              {item.isIllegal && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-500/20 text-red-400 border border-red-500/30">
                                  CONTRABAND
                                </span>
                              )}
                            </div>
                            <span className="text-slate-400 font-bold">
                              x{item.count} ({item.weightKg} kg)
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* PROPERTIES TAB: DYNASTY 8 REAL ESTATE CATALOG & MANAGEMENT */}
      {/* ==================================================== */}
      {subTab === 'properties' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Properties Listings (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-400" />
                  Dynasty 8 Real Estate & Safehouses
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {filteredProperties.length} Properties Available
                </span>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {(['All', 'Mansion', 'Safehouse & Chop', 'Penthouse & Condo', 'Industrial Compound', 'Commercial Storefront'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      soundEffects.playBeep(650, 0.03);
                      setSelectedPropertyCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      selectedPropertyCategory === cat
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {filteredProperties.map(prop => {
                  const isSelected = selectedProperty.id === prop.id;
                  return (
                    <div
                      key={prop.id}
                      onClick={() => {
                        soundEffects.playBeep(750, 0.04);
                        setSelectedProperty(prop);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                            {prop.category}
                          </span>
                          {prop.isOwned ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              DEED OWNED
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              FOR SALE
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-white mt-1">
                          {prop.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {prop.neighborhood}
                        </p>
                      </div>

                      {/* Specs Row */}
                      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-[9px] text-slate-500 block">GARAGE</span>
                          <span className="text-slate-200 font-semibold">{prop.garageSlots} Slots</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">STASH</span>
                          <span className="text-slate-200 font-semibold">{prop.stashLimitKg} kg</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-500 block">BUY PRICE</span>
                          <span className="text-emerald-400 font-bold">${prop.purchasePrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Property Detailed Inspector (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {selectedProperty && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase font-bold">Property Deed & Blueprint</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{selectedProperty.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">{selectedProperty.neighborhood}</span>
                  </div>
                  <button
                    onClick={() => handleTogglePropertyLock(selectedProperty.id)}
                    className={`p-2 rounded-lg border transition-colors ${
                      selectedProperty.lockStatus === 'locked'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}
                    title="Toggle Electronic Door Lock"
                  >
                    {selectedProperty.lockStatus === 'locked' ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">PURCHASE OUTRIGHT</span>
                    <span className="text-emerald-400 font-bold text-sm">${selectedProperty.purchasePrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">WEEKLY PROPERTY TAX / RENT</span>
                    <span className="text-amber-300 font-bold text-sm">${selectedProperty.weeklyRent.toLocaleString()} / wk</span>
                  </div>
                </div>

                {/* Security Tier & Passive Benefit */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Security Rating:</span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                      {selectedProperty.securityTier}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <strong className="text-amber-400 font-medium">Passive Asset Benefit: </strong>
                    {selectedProperty.passiveBenefit}
                  </div>
                </div>

                {/* Included Features List */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Included Property Amenities</span>
                  <div className="space-y-1 text-xs">
                    {selectedProperty.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acquisition / Management Button */}
                <div className="pt-2">
                  {selectedProperty.isOwned ? (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                      <span className="text-xs font-bold text-amber-300 font-mono block">
                        Registered to: {selectedProperty.ownerName}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Keys distributed to 2 trusted roommates. Door currently {selectedProperty.lockStatus.toUpperCase()}.
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAcquireProperty(selectedProperty)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                    >
                      <Key className="w-4 h-4" />
                      <span>Purchase Deed (${selectedProperty.purchasePrice.toLocaleString()})</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* GUIDE TAB: EXPLANATION OF ACQUISITION & BENEFITS */}
      {/* ==================================================== */}
      {subTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Vehicles Guide Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Vehicle Acquisition & Ownership Benefits
                </h3>
                <span className="text-xs text-slate-400">How to buy, tune, and leverage vehicles in Los Santos</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <h4 className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  1. Acquisition Channels
                </h4>
                <p>
                  <strong>PDM (Premium Deluxe Motorsport):</strong> Standard entry-level commuter cars, SUVs, and commercial vans.
                  <br />
                  <strong>Luxury Autos (Rockford Hills):</strong> Exotic supercars requiring high credit scores or bank wire transfers.
                  <br />
                  <strong>Tuner Car Meets & Auctions:</strong> Street drift cars with unlocked ECU modifications.
                  <br />
                  <strong>Underground Chop Shops:</strong> Stolen vehicles with scratched VINs at 30% cost, but vulnerable to police impound if caught.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <h4 className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  2. Tangible Ownership Benefits
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong className="text-slate-200">Trunk Inventory:</strong> Carry heavy weapons, contraband weed bricks, or delivery freight.</li>
                  <li><strong className="text-slate-200">Job Pre-requisites:</strong> High-capacity haulers (Boxville) enable 6-figure logistics delivery missions.</li>
                  <li><strong className="text-slate-200">Getaway Performance:</strong> Tuned turbo and armor plating ensure successful escapes during bank heists.</li>
                  <li><strong className="text-slate-200">Asset Resale:</strong> Player-to-player title transfers with custom plates on the open market.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Properties Guide Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Property Acquisition & Real Estate Benefits
                </h3>
                <span className="text-xs text-slate-400">Dynasty 8 deed mechanics, secure stashes, and raid protection</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <h4 className="font-bold text-sky-400 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  1. How Players Acquire Properties
                </h4>
                <p>
                  <strong>Dynasty 8 Executive Realtors:</strong> Browse catalog and sign official contracts with weekly mortgage/rent debits.
                  <br />
                  <strong>City Hall Foreclosure Auctions:</strong> Defaulted properties seized by the state are auctioned off every Saturday night.
                  <br />
                  <strong>Syndicate Turf Deeds:</strong> Gangs control territory safehouses that can be bought with untraceable cash notes.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <h4 className="font-bold text-sky-400 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  2. Exclusive Asset Benefits
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong className="text-slate-200">Permanent Item Stashes:</strong> 250kg to 950kg storage unaffected by player character deaths.</li>
                  <li><strong className="text-slate-200">Garage Bays:</strong> Protect up to 10 vehicles from street theft, impound fees, and damage.</li>
                  <li><strong className="text-slate-200">Fourth Amendment Protection:</strong> Police cannot search private property without an authorized judicial warrant signed by a Judge.</li>
                  <li><strong className="text-slate-200">Workbenches & Stills:</strong> Craft moonshine, smelt metals, or dismantle stolen cars in private.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
