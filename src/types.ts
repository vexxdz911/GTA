export type JobType = 
  | 'lspd' 
  | 'bcso' 
  | 'ems' 
  | 'mechanic' 
  | 'doj' 
  | 'taxi' 
  | 'gang' 
  | 'civilian';

export interface ServerAchievement {
  id: string;
  title: string;
  description: string;
  category: 'wealth' | 'playtime' | 'career' | 'assets' | 'social' | 'combat';
  icon: string;
  badgeColor: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  tier: 1 | 2 | 3 | 4;
  criteria: string;
  points: number;
  rewardText?: string;
}

export interface Player {
  id: number;
  steamName: string;
  characterName: string;
  job: JobType;
  jobTitle: string;
  ping: number;
  health: number;
  armor: number;
  cash: number;
  bank: number;
  hoursPlayed: number;
  lifetimeEarnings: number;
  achievementIds: string[];
  coordinates: {
    x: number;
    y: number;
    street: string;
    zone: string;
  };
  vehicle?: {
    model: string;
    plate: string;
    speed: number;
    engine: number;
  };
  status: 'active' | 'in_vehicle' | 'downed' | 'in_jail' | 'afk';
  discordTag: string;
  connectedSince: string;
}

export interface DispatchCall {
  id: string;
  code: string;
  title: string;
  description: string;
  location: string;
  zone: string;
  timeAgo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  respondingUnits: string[];
  caller: string;
  status: 'active' | 'responding' | 'cleared';
  coords: { x: number; y: number };
}

export interface ServerIncident {
  id: string;
  type: 'bank' | 'store' | 'pursuit' | 'shots' | 'officer_down';
  title: string;
  location: string;
  active: boolean;
  alertLevel: 'code1' | 'code2' | 'code3';
  coords: { x: number; y: number };
  timestamp: string;
}

export interface ServerLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'RCON' | 'CHAT' | 'TXADMIN';
  source: string;
  message: string;
}

export interface ServerResource {
  name: string;
  author: string;
  version: string;
  status: 'started' | 'stopped' | 'restarting';
  memoryMb: number;
}

export interface BoloWanted {
  id: string;
  name: string;
  alias: string;
  offenses: string[];
  bounty: number;
  threatLevel: 'caution' | 'armed' | 'extreme';
  lastSeen: string;
  status: 'active' | 'captured';
}

export type WeatherType = 'EXTRASUNNY' | 'CLEAR' | 'CLOUDS' | 'RAIN' | 'THUNDER' | 'FOGGY' | 'XMAS';

export interface ServerStats {
  name: string;
  ip: string;
  port: number;
  cfxUrl: string;
  status: 'online' | 'restarting' | 'maintenance';
  playersOnline: number;
  maxPlayers: number;
  ping: number;
  tickrate: number;
  uptime: string;
  time: string;
  weather: WeatherType;
  onesync: boolean;
  gameBuild: string;
  txAdminVersion: string;
  cpuPercent: number;
  ramUsageMb: number;
  maxRamMb: number;
  bannerAnnouncement: string;
}

// ==========================================
// VEHICLES & PROPERTIES SYSTEM TYPES
// ==========================================
export type VehicleCategory = 
  | 'Street Tuner' 
  | 'Heavy Enforcement' 
  | 'Off-Road & Smuggler' 
  | 'Super & Exotic' 
  | 'Commercial Utility';

export interface VehicleModel {
  id: string;
  name: string;
  modelCode: string;
  brand: string;
  category: VehicleCategory;
  price: number;
  topSpeedMph: number;
  acceleration0to60: number; // in seconds
  handlingScore: number; // 1-100
  brakingScore: number; // 1-100
  trunkCapacityKg: number;
  gloveboxCapacityKg: number;
  seats: number;
  uniquePerk: string;
  acquisitionMethod: string;
  colorScheme: string;
  featuredLivery: string;
}

export interface OwnedVehicle {
  id: string;
  vehicleModelId: string;
  modelName: string;
  brand: string;
  category: VehicleCategory;
  ownerName: string;
  plate: string;
  garageLocation: string;
  mileageMiles: number;
  fuelPercent: number;
  engineHealth: number; // 0-1000
  bodyHealth: number; // 0-100
  mods: {
    engineTier: number; // 1-4
    brakesTier: number; // 1-4
    transmissionTier: number; // 1-3
    turboInstalled: boolean;
    armorTier: number; // 0-5
    windowTint: 'Stock' | 'Light Smoke' | 'Dark Smoke' | 'Limo' | 'Pure Black';
    primaryColor: string;
    neonUnderglow: boolean;
    neonColor: string;
    customPlateText: string;
  };
  trunkInventory: {
    name: string;
    weightKg: number;
    count: number;
    isIllegal: boolean;
  }[];
  impounded: boolean;
  dailyInsuranceFee: number;
}

export type PropertyCategory = 
  | 'Mansion' 
  | 'Safehouse & Chop' 
  | 'Penthouse & Condo' 
  | 'Industrial Compound' 
  | 'Commercial Storefront';

export interface PropertyListing {
  id: string;
  name: string;
  category: PropertyCategory;
  neighborhood: string;
  purchasePrice: number;
  weeklyRent: number;
  garageSlots: number;
  stashLimitKg: number;
  securityTier: 'Standard' | 'Reinforced Deadbolt' | 'Fortified High-Security' | 'Off-Grid Scrambler';
  passiveBenefit: string;
  acquisitionMethod: string;
  features: string[];
  isOwned: boolean;
  ownerName?: string;
  currentRentDue?: number;
  lockStatus: 'locked' | 'unlocked';
  interiorTheme: string;
}

// ==========================================
// PLAYER ROLES SYSTEM TYPES
// ==========================================
export type RoleCategory = 
  | 'Law Enforcement' 
  | 'Medical & Rescue' 
  | 'Underworld Syndicate' 
  | 'Civic & Commerce' 
  | 'Judicial & Legal';

export interface RoleDefinition {
  id: string;
  name: string;
  tag: string;
  category: RoleCategory;
  department: string;
  baseSalaryPerTick: number;
  badgeColor: string;
  iconName: string;
  overview: string;
  coreDuties: string[];
  specialAbilities: {
    name: string;
    description: string;
    cooldownSec: number;
    keybindPrompt: string;
  }[];
  standardLoadout: string[];
  progressionRanks: {
    rank: number;
    title: string;
    reqHours: number;
    monthlyStipend: number;
    perk: string;
  }[];
  crossRoleInteractions: {
    targetRole: string;
    relationType: 'adversarial' | 'cooperative' | 'contractual' | 'supervisory';
    interactionExample: string;
  }[];
  acquisitionRequirements: string[];
}

// ==========================================
// IN-GAME ECONOMY & MARKETPLACE TYPES
// ==========================================
export type JobTypeCategory = 'Legal Civ' | 'Municipal' | 'Contractor' | 'Resource Extraction' | 'Logistics' | 'Underworld Felony' | 'Syndicate Logistics';

export interface EconomyJob {
  id: string;
  title: string;
  type: 'legal' | 'illegal';
  category: JobTypeCategory;
  wagePerShift: number;
  riskLevel: 'None' | 'Low' | 'Medium' | 'High - Felony' | 'Extreme - Federal';
  description: string;
  tasks: string[];
  gearProvided: string[];
  impactOnEconomy: string;
  cooldownMin: number;
}

export interface PlayerBusiness {
  id: string;
  name: string;
  businessType: 'Nightclub' | 'Custom Tuning Garage' | 'Saloon & Diner' | '24/7 Supermarket' | 'Logistics Depot' | 'Pawn & Luxury Exchange';
  owner: string;
  location: string;
  valuation: number;
  bankBalance: number;
  dailyRevenue: number;
  dailyUpkeep: number;
  employeesCount: number;
  inventoryCapacityKg: number;
  currentStockPercent: number;
  customerPopularity: number; // 0-100
  recentTransactions: {
    id: string;
    time: string;
    description: string;
    amount: number;
    type: 'credit' | 'debit';
  }[];
}

export interface MarketCommodity {
  id: string;
  name: string;
  symbol: string;
  category: 'Industrial Metals' | 'Medical & Pharma' | 'Contraband & Narcotics' | 'Electronics & Hardware' | 'Luxury Commodities';
  currentPrice: number;
  basePrice: number;
  priceChange24h: number;
  supplyUnits: number;
  demandIndex: number; // 1-100
  economicDriver: string;
  isIllegal: boolean;
  unit: string;
}

// ==========================================
// GTA 6 LAUNCH MONETIZATION ENGINE TYPES
// ==========================================
export type GTA6MonetizationCategory = 
  | 'Priority Queue & FastPass'
  | 'Cosmetics & Vanity Drip'
  | 'Battle Pass & Seasons'
  | 'Business & Real Estate Franchising'
  | 'Streamer & Creator Affiliates'
  | 'In-Game Ads & Brand Sponsorships'
  | 'Script & Framework Licensing'
  | 'Ticketed Tournament Events';

export interface GTA6MonetizationStrategy {
  id: string;
  title: string;
  category: GTA6MonetizationCategory;
  launchWindow: 'Pre-Launch (T-60)' | 'Day-1 Launch' | 'Week 1-2' | 'Month 1+';
  projectedRevenueImpact: 'Massive' | 'High' | 'Medium' | 'Steady MRR';
  pricePoint: string;
  description: string;
  implementationDetails: string[];
  complianceNotes: string;
  expectedConversionRate: string;
  iconName: string;
  estimatedDay1Revenue: string;
}

export interface GTA6StoreItem {
  id: string;
  title: string;
  category: 'Queue Passes' | 'Apparel & Drip' | 'Vehicles & Liveries' | 'Properties & Decor' | 'VIP & Identity';
  priceUSD: number;
  badge: string;
  isPopular: boolean;
  isDay1Exclusive: boolean;
  description: string;
  includes: string[];
  salesCount: number;
}

export interface GTA6RevenueProjectionParams {
  launchPlayerbase: number;
  priorityQueueConversionPercent: number;
  priorityQueuePriceUSD: number;
  battlePassConversionPercent: number;
  battlePassPriceUSD: number;
  cosmeticsConversionPercent: number;
  cosmeticsAvgSpendUSD: number;
  franchiseLicenseHolders: number;
  franchiseLicensePriceUSD: number;
  sponsorDealsCount: number;
  sponsorAvgDealUSD: number;
  monthlyServerInfraCostUSD: number;
}

export interface HostingProviderSpec {
  id: string;
  name: string;
  startingPrice: string;
  specs: string;
  ddosMitigation: string;
  notes: string;
  isOfficialPartner: boolean;
  recommendedSlots: string;
}

export interface HourByHourStep {
  id: string;
  timeframe: string;
  phase: string;
  badge: string;
  summary: string;
  actions: string[];
  risksToMitigate: string[];
  revenueOpportunities: string;
}

export interface PLAProhibitionRule {
  id: string;
  clauseNumber: number;
  title: string;
  prohibition: string;
  compliantAlternative: string;
  severity: 'Critical / Instant Blacklist' | 'High Risk' | 'Strict Revocation';
}

export interface StakeholderEngine {
  id: string;
  stakeholder: 'Server Operators' | 'RP Communities' | 'Content Creators' | 'Developer Networks';
  subtitle: string;
  coreModel: string;
  keyMetrics: string[];
  primaryStreams: {
    title: string;
    revenueRange: string;
    description: string;
    complianceNote: string;
  }[];
  day1Playbook: string[];
}

export interface IndustrySource {
  id: number;
  title: string;
  publisher: string;
  url: string;
  keyFinding: string;
}

// ==========================================
// PLAYER REFERRAL PROGRAM TYPES
// ==========================================
export interface ReferralRewardItem {
  id: string;
  name: string;
  type: 'currency' | 'vehicle' | 'pass' | 'cosmetic' | 'weapon_skin' | 'title';
  valueDisplay: string;
  iconName: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export type VerificationStatus = 'pending' | 'verified' | 'claimed';

export interface ReferredPlayerRecord {
  id: string;
  inviteCode: string;
  newPlayerName: string;
  newPlayerDiscord: string;
  joinedAt: string;
  status: VerificationStatus;
  verificationMethod: 'Discord OAuth' | 'Phone SMS' | 'Steam VAC' | 'CFX FiveM Token';
  referrerRewardClaimed: boolean;
  newPlayerRewardClaimed: boolean;
  bonusItemAwarded: string;
  cashBonusAwarded: number;
}

export interface ReferralTier {
  tierLevel: number;
  title: string;
  minReferrals: number;
  cashRewardPerReferral: number;
  exclusiveBonusItem: ReferralRewardItem;
  badgeColor: string;
}

export interface ReferralProgramState {
  myCode: string;
  totalReferrals: number;
  verifiedReferrals: number;
  pendingReferrals: number;
  totalCashEarned: number;
  currentTier: number;
}

export type ToastType = 'achievement' | 'referral' | 'success' | 'info';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  details?: string;
  points?: number;
  cashAmount?: number;
  badgeColor?: string;
  rarity?: string;
  iconName?: string;
  playerName?: string;
  playerId?: number;
  perkText?: string;
  bonusItem?: string;
  timestamp: number;
  durationMs?: number;
  actionLabel?: string;
  onClickAction?: () => void;
}
