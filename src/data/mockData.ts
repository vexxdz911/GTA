import { Player, DispatchCall, ServerIncident, ServerLog, ServerResource, BoloWanted, ServerStats } from '../types';

export const INITIAL_SERVER_STATS: ServerStats = {
  name: 'LOS SANTOS STATE ROLEPLAY',
  ip: 'connect.lsrp-fivem.net',
  port: 30120,
  cfxUrl: 'https://cfx.re/join/lsrp2026',
  status: 'online',
  playersOnline: 184,
  maxPlayers: 256,
  ping: 21,
  tickrate: 64.0,
  uptime: '18h 42m',
  time: '21:15',
  weather: 'CLEAR',
  onesync: true,
  gameBuild: 'b3095 (The Chop Shop)',
  txAdminVersion: 'v7.2.4',
  cpuPercent: 32.4,
  ramUsageMb: 8940,
  maxRamMb: 32768,
  bannerAnnouncement: '🚨 SERVER EVENT: Double Paycheck for LSPD & EMS on duty tonight! Purge Event scheduled Sunday 20:00 EST.',
};

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 1,
    steamName: 'ViperSquad_Official',
    characterName: 'Capt. Chase Vance',
    job: 'lspd',
    jobTitle: 'LSPD Watch Commander',
    ping: 18,
    health: 100,
    armor: 100,
    cash: 4250,
    bank: 142000,
    hoursPlayed: 142,
    lifetimeEarnings: 420000,
    achievementIds: ['century_club', 'guardian_shield'],
    coordinates: { x: 520, y: 580, street: 'Atlee Street', zone: 'Mission Row' },
    vehicle: { model: 'Vapid Stanier Police Cruiser (Unit 1-A-12)', plate: 'LSPD01', speed: 45, engine: 980 },
    status: 'in_vehicle',
    discordTag: 'Vance#0001',
    connectedSince: '3h 12m'
  },
  {
    id: 14,
    steamName: 'NightHawk_RP',
    characterName: 'Ofc. Evelyn Reyes',
    job: 'lspd',
    jobTitle: 'Senior Patrol Officer',
    ping: 24,
    health: 100,
    armor: 75,
    cash: 1120,
    bank: 67300,
    hoursPlayed: 68,
    lifetimeEarnings: 195000,
    achievementIds: ['guardian_shield'],
    coordinates: { x: 480, y: 510, street: 'Legion Square East', zone: 'Downtown' },
    vehicle: { model: 'Bravado Buffalo STX Interceptor', plate: 'POLICE44', speed: 72, engine: 940 },
    status: 'in_vehicle',
    discordTag: 'Evelyn#4120',
    connectedSince: '1h 45m'
  },
  {
    id: 29,
    steamName: 'MedicDan',
    characterName: 'Dr. Sarah Higgins',
    job: 'ems',
    jobTitle: 'Pillbox Hill Lead Surgeon',
    ping: 19,
    health: 100,
    armor: 0,
    cash: 3800,
    bank: 215400,
    hoursPlayed: 115,
    lifetimeEarnings: 580000,
    achievementIds: ['century_club', 'lifesaver', 'community_pillar'],
    coordinates: { x: 495, y: 490, street: 'Elgin Avenue', zone: 'Pillbox Hill' },
    vehicle: { model: 'Brute Ambulance (MEDIC-02)', plate: 'EMS02', speed: 0, engine: 1000 },
    status: 'active',
    discordTag: 'DrHiggins#1129',
    connectedSince: '4h 05m'
  },
  {
    id: 42,
    steamName: 'ShadowReaper99',
    characterName: 'Antonio "El Serpiente" Silva',
    job: 'gang',
    jobTitle: 'Vagos Lieutenant',
    ping: 35,
    health: 90,
    armor: 40,
    cash: 34500,
    bank: 450000,
    hoursPlayed: 185,
    lifetimeEarnings: 1250000,
    achievementIds: ['first_million', 'century_club', 'syndicate_kingpin', 'fleet_master'],
    coordinates: { x: 570, y: 640, street: 'Innocence Blvd', zone: 'Rancho' },
    vehicle: { model: 'Albany Buccaneer Custom', plate: 'VAGOS01', speed: 30, engine: 850 },
    status: 'in_vehicle',
    discordTag: 'Silva#9901',
    connectedSince: '2h 10m'
  },
  {
    id: 55,
    steamName: 'WrenchMaster',
    characterName: 'Marcus "Gearhead" Stone',
    job: 'mechanic',
    jobTitle: 'Bennys Customs Lead Tech',
    ping: 22,
    health: 100,
    armor: 0,
    cash: 8900,
    bank: 189000,
    hoursPlayed: 104,
    lifetimeEarnings: 480000,
    achievementIds: ['century_club', 'master_wrench'],
    coordinates: { x: 550, y: 550, street: 'Power Street', zone: 'Alta' },
    vehicle: { model: 'Vapid Slamvan Tow Truck', plate: 'BENNY01', speed: 0, engine: 990 },
    status: 'active',
    discordTag: 'Marcus#3391',
    connectedSince: '5h 22m'
  },
  {
    id: 88,
    steamName: 'JusticeNow',
    characterName: 'Judge Harold Sterling',
    job: 'doj',
    jobTitle: 'Superior Court Magistrate',
    ping: 15,
    health: 100,
    armor: 0,
    cash: 560,
    bank: 890000,
    hoursPlayed: 230,
    lifetimeEarnings: 1840000,
    achievementIds: ['first_million', 'century_club', 'pillar_of_justice', 'community_pillar'],
    coordinates: { x: 440, y: 470, street: 'San Andreas Ave', zone: 'Rockford Hills' },
    status: 'active',
    discordTag: 'Sterling#0077',
    connectedSince: '1h 05m'
  },
  {
    id: 104,
    steamName: 'GhostRider_GTA',
    characterName: 'Jaxson "Crow" Teller',
    job: 'gang',
    jobTitle: 'Lost MC Enforcer',
    ping: 42,
    health: 80,
    armor: 20,
    cash: 18200,
    bank: 76000,
    hoursPlayed: 92,
    lifetimeEarnings: 310000,
    achievementIds: ['syndicate_kingpin'],
    coordinates: { x: 430, y: 280, street: 'Algonquin Blvd', zone: 'Sandy Shores' },
    vehicle: { model: 'Western Daemon Chopper', plate: 'LOSTMC', speed: 85, engine: 780 },
    status: 'in_vehicle',
    discordTag: 'JaxCrow#6612',
    connectedSince: '3h 40m'
  },
  {
    id: 112,
    steamName: 'TurboTuner',
    characterName: 'Kenji Takahashi',
    job: 'civilian',
    jobTitle: 'Midnight Club Racer',
    ping: 28,
    health: 100,
    armor: 0,
    cash: 42000,
    bank: 620000,
    hoursPlayed: 120,
    lifetimeEarnings: 1100000,
    achievementIds: ['first_million', 'century_club', 'speed_demon', 'fleet_master'],
    coordinates: { x: 380, y: 560, street: 'Del Perro Freeway', zone: 'Del Perro' },
    vehicle: { model: 'Karin Sultan RS Drift Spec', plate: 'MIDNIGHT', speed: 115, engine: 970 },
    status: 'in_vehicle',
    discordTag: 'KenjiT#8888',
    connectedSince: '0h 52m'
  },
  {
    id: 128,
    steamName: 'DowntownCabbie',
    characterName: 'Bob Henderson',
    job: 'taxi',
    jobTitle: 'Downtown Cab Co Dispatcher',
    ping: 20,
    health: 100,
    armor: 0,
    cash: 3100,
    bank: 45000,
    hoursPlayed: 108,
    lifetimeEarnings: 220000,
    achievementIds: ['century_club', 'transit_titan'],
    coordinates: { x: 510, y: 530, street: 'Vinewood Blvd', zone: 'Vinewood' },
    vehicle: { model: 'Vapid Taxi Cab #42', plate: 'CAB42', speed: 38, engine: 890 },
    status: 'in_vehicle',
    discordTag: 'BobCabbie#2022',
    connectedSince: '2h 30m'
  },
  {
    id: 144,
    steamName: 'DeputyDawg',
    characterName: 'Sgt. Wyatt Colt',
    job: 'bcso',
    jobTitle: 'Blaine County Sheriff Deputy',
    ping: 27,
    health: 100,
    armor: 100,
    cash: 2100,
    bank: 82000,
    hoursPlayed: 135,
    lifetimeEarnings: 390000,
    achievementIds: ['century_club', 'guardian_shield'],
    coordinates: { x: 450, y: 260, street: 'Panorama Drive', zone: 'Sandy Shores' },
    vehicle: { model: 'Vapid Caracara 4x4 Cruiser', plate: 'BCSO08', speed: 60, engine: 960 },
    status: 'in_vehicle',
    discordTag: 'Wyatt#1888',
    connectedSince: '4h 15m'
  },
  {
    id: 157,
    steamName: 'StreetKid_LS',
    characterName: 'Darnell Watkins',
    job: 'civilian',
    jobTitle: 'Store Clerk / Aspiring Producer',
    ping: 31,
    health: 30,
    armor: 0,
    cash: 850,
    bank: 12400,
    hoursPlayed: 18,
    lifetimeEarnings: 24000,
    achievementIds: [],
    coordinates: { x: 530, y: 680, street: 'Grove Street', zone: 'Davis' },
    status: 'downed',
    discordTag: 'Darnell#5512',
    connectedSince: '1h 14m'
  },
  {
    id: 172,
    steamName: 'PaletoFisher',
    characterName: 'Gunnar Ericson',
    job: 'civilian',
    jobTitle: 'Commercial Crab Fisherman',
    ping: 25,
    health: 100,
    armor: 0,
    cash: 14500,
    bank: 198000,
    hoursPlayed: 74,
    lifetimeEarnings: 340000,
    achievementIds: [],
    coordinates: { x: 310, y: 120, street: 'Procopio Drive', zone: 'Paleto Bay' },
    status: 'active',
    discordTag: 'Gunnar#0441',
    connectedSince: '6h 10m'
  }
];

export const INITIAL_DISPATCH_CALLS: DispatchCall[] = [
  {
    id: 'CAD-9102',
    code: '10-90',
    title: 'Bank Robbery in Progress (Silent Alarm)',
    description: 'Silent panic tripped at Fleeca Bank. Multiple armed suspects spotted inside with drills.',
    location: 'Legion Square Branch, Downtown Los Santos',
    zone: 'Downtown',
    timeAgo: '2m ago',
    priority: 'urgent',
    respondingUnits: ['1-A-12 (Vance)', 'POLICE44 (Reyes)'],
    caller: 'Automated Security System',
    status: 'active',
    coords: { x: 490, y: 520 }
  },
  {
    id: 'CAD-9103',
    code: '10-99',
    title: 'High Speed Reckless Pursuit',
    description: 'Blacked-out Sultan RS clocked at 120+ mph weaving through incoming freeway traffic.',
    location: 'Del Perro Freeway Westbound',
    zone: 'Del Perro',
    timeAgo: '4m ago',
    priority: 'high',
    respondingUnits: ['BCSO08 (Colt)'],
    caller: 'Traffic CCTV Radar #14',
    status: 'responding',
    coords: { x: 390, y: 550 }
  },
  {
    id: 'CAD-9104',
    code: '10-52',
    title: 'Ambulance / Medical Emergency Required',
    description: 'Citizen report of gunshot victim collapsed in Davis cul-de-sac. Bleeding heavily.',
    location: 'Grove Street Cul-de-Sac',
    zone: 'Davis',
    timeAgo: '6m ago',
    priority: 'urgent',
    respondingUnits: ['MEDIC-02 (Dr. Higgins)'],
    caller: 'Concerned Resident (911)',
    status: 'responding',
    coords: { x: 530, y: 680 }
  },
  {
    id: 'CAD-9105',
    code: '10-31',
    title: 'Disturbance / Armed Robbery',
    description: '24/7 Supermarket cashier held at gunpoint for cash register and lotto tickets.',
    location: 'Innocence Blvd & Roy Lowenstein',
    zone: 'Rancho',
    timeAgo: '12m ago',
    priority: 'medium',
    respondingUnits: [],
    caller: 'Store Owner',
    status: 'active',
    coords: { x: 560, y: 630 }
  }
];

export const INITIAL_INCIDENTS: ServerIncident[] = [
  {
    id: 'inc-1',
    type: 'bank',
    title: 'Fleeca Bank Legion Square',
    location: 'Downtown Los Santos',
    active: true,
    alertLevel: 'code3',
    coords: { x: 490, y: 520 },
    timestamp: '21:13'
  },
  {
    id: 'inc-2',
    type: 'pursuit',
    title: '10-80 Vehicle Pursuit',
    location: 'Del Perro Freeway',
    active: true,
    alertLevel: 'code3',
    coords: { x: 390, y: 550 },
    timestamp: '21:11'
  },
  {
    id: 'inc-3',
    type: 'officer_down',
    title: 'Citizen Down - Medical Urgent',
    location: 'Grove Street, Davis',
    active: true,
    alertLevel: 'code2',
    coords: { x: 530, y: 680 },
    timestamp: '21:09'
  }
];

export const INITIAL_LOGS: ServerLog[] = [
  {
    id: 'log-1',
    timestamp: '21:15:02',
    level: 'INFO',
    source: 'qb-core',
    message: 'Player Capt. Chase Vance [ID: 1] clocked on duty as LSPD (Grade: Watch Commander).'
  },
  {
    id: 'log-2',
    timestamp: '21:14:48',
    level: 'INFO',
    source: 'ox_inventory',
    message: 'Dropped item stash at Mission Row Evidence Locker synchronized in 1.8ms.'
  },
  {
    id: 'log-3',
    timestamp: '21:13:22',
    level: 'WARN',
    source: 'qb-banking',
    message: 'Silent alarm triggered for Fleeca Bank [VaultID: 3]. Alert broadcasted to police dispatch.'
  },
  {
    id: 'log-4',
    timestamp: '21:11:05',
    level: 'CHAT',
    source: 'OOC',
    message: '[OOC] Kenji Takahashi (112): Anyone down for car meet at LS Customs in 15 mins?'
  },
  {
    id: 'log-5',
    timestamp: '21:08:50',
    level: 'TXADMIN',
    source: 'txAdmin',
    message: 'Scheduled server restart warning set for 04:00 AM EST (in 6 hours 45 mins).'
  },
  {
    id: 'log-6',
    timestamp: '21:05:14',
    level: 'INFO',
    source: 'CitizenFX',
    message: 'Player Gunnar Ericson connected (License: license:8f20b5a341e, Ping: 25ms).'
  }
];

export const SERVER_RESOURCES: ServerResource[] = [
  { name: 'qb-core', author: 'Qbox / QB Team', version: 'v1.4.1', status: 'started', memoryMb: 42.8 },
  { name: 'ox_inventory', author: 'Overextended', version: 'v2.41.0', status: 'started', memoryMb: 68.4 },
  { name: 'ox_target', author: 'Overextended', version: 'v1.18.2', status: 'started', memoryMb: 14.1 },
  { name: 'pma-voice', author: 'Aapo', version: 'v3.2.0', status: 'started', memoryMb: 28.5 },
  { name: 'ps-housing', author: 'Project Sloth', version: 'v2.1.0', status: 'started', memoryMb: 35.6 },
  { name: 'illenium-appearance', author: 'IlleniumStudios', version: 'v1.3.4', status: 'started', memoryMb: 48.2 },
  { name: 'Renewed-Banking', author: 'Renewed Scripts', version: 'v1.0.8', status: 'started', memoryMb: 18.9 },
  { name: 'lb-phone', author: 'LB Scripts', version: 'v1.8.4', status: 'started', memoryMb: 52.0 },
  { name: 'rcore_police', author: 'Reliable Core', version: 'v2.0.1', status: 'started', memoryMb: 31.2 },
  { name: 'cd_dispatch', author: 'Codesign', version: 'v1.9.0', status: 'started', memoryMb: 24.3 }
];

export const INITIAL_BOLOS: BoloWanted[] = [
  {
    id: 'BOLO-01',
    name: 'Antonio Silva',
    alias: '"El Serpiente"',
    offenses: ['Armed Bank Robbery', 'Attempted Murder of Peace Officer', 'Illegal Class 3 Firearm Possession'],
    bounty: 75000,
    threatLevel: 'extreme',
    lastSeen: 'Rancho / Innocence Blvd driving Albany Buccaneer',
    status: 'active'
  },
  {
    id: 'BOLO-02',
    name: 'Jaxson Teller',
    alias: '"Crow"',
    offenses: ['Weapons Trafficking', 'Evading Police 10-80', 'Assault with a Deadly Weapon'],
    bounty: 35000,
    threatLevel: 'armed',
    lastSeen: 'Sandy Shores Airstrip riding chopper',
    status: 'active'
  },
  {
    id: 'BOLO-03',
    name: 'Vladislav Kozlov',
    alias: '"The Ghost"',
    offenses: ['High Tier Exotic Vehicle Theft', 'Wire Fraud'],
    bounty: 20000,
    threatLevel: 'caution',
    lastSeen: 'Terminal Docks / Elysian Island',
    status: 'active'
  }
];

export const TEN_CODES = [
  { code: '10-4', meaning: 'Affirmative / Message Received' },
  { code: '10-7', meaning: 'Out of Service / Off Duty' },
  { code: '10-8', meaning: 'In Service / On Duty Available' },
  { code: '10-13', meaning: 'Officer In Need of Immediate Assistance' },
  { code: '10-20', meaning: 'Current Location' },
  { code: '10-31', meaning: 'Crime in Progress' },
  { code: '10-50', meaning: 'Motor Vehicle Accident' },
  { code: '10-52', meaning: 'Ambulance Needed' },
  { code: '10-80', meaning: 'Vehicle Pursuit in Progress' },
  { code: '10-90', meaning: 'Bank Robbery Alarm' },
  { code: '10-99', meaning: 'Stolen Vehicle / Officer in Distress' }
];

export const SERVER_RULES = [
  {
    title: 'RDM (Random Death Match)',
    desc: 'Attacking or killing another player without prior roleplay initiation or valid in-character reasoning is strictly prohibited.'
  },
  {
    title: 'VDM (Vehicle Death Match)',
    desc: 'Using your vehicle as a primary weapon to ram, run over, or crush players is forbidden and will result in immediate bans.'
  },
  {
    title: 'NLR (New Life Rule)',
    desc: 'If your character is incapacitated and respawns at Pillbox Hill Medical, you forget all memories leading up to your death.'
  },
  {
    title: 'Fear RP / Value of Life',
    desc: 'You must realistically value your life at all times. If someone has a gun aimed at your head at point-blank range, you must comply.'
  },
  {
    title: 'Metagaming',
    desc: 'Using information obtained outside of the game (Discord, Twitch streams, web portals) in-character is considered cheating.'
  },
  {
    title: 'Cop Baiting',
    desc: 'Purposely performing illegal maneuvers or honking in front of police cruisers solely to trigger police chases is prohibited.'
  }
];
