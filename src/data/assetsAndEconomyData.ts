import { 
  VehicleModel, 
  OwnedVehicle, 
  PropertyListing, 
  RoleDefinition, 
  EconomyJob, 
  PlayerBusiness, 
  MarketCommodity 
} from '../types';

export const VEHICLE_CATALOG: VehicleModel[] = [
  {
    id: 'veh_sultan_rs',
    name: 'Karin Sultan RS Custom',
    modelCode: 'sultanrs',
    brand: 'Karin',
    category: 'Street Tuner',
    price: 145000,
    topSpeedMph: 138,
    acceleration0to60: 3.4,
    handlingScore: 92,
    brakingScore: 86,
    trunkCapacityKg: 65,
    gloveboxCapacityKg: 10,
    seats: 2,
    uniquePerk: 'AWD Rally Differential: +25% traction on wet asphalt and street drag races.',
    acquisitionMethod: 'Purchasable at Los Santos Customs Tuner Meet or PDM Showroom.',
    colorScheme: 'Midnight Purple / Neon Teal Pearl',
    featuredLivery: 'Fukaru Drift Spec Racing Livery'
  },
  {
    id: 'veh_futo_gtx',
    name: 'Karin Futo GTX Hatchback',
    modelCode: 'futogtx',
    brand: 'Karin',
    category: 'Street Tuner',
    price: 68000,
    topSpeedMph: 124,
    acceleration0to60: 4.8,
    handlingScore: 95,
    brakingScore: 78,
    trunkCapacityKg: 45,
    gloveboxCapacityKg: 8,
    seats: 2,
    uniquePerk: 'Inertial Drift Physics: Drift angle multiplier earns +15% rep in underground street crews.',
    acquisitionMethod: 'Underground Street Tuner Car Meet Auction.',
    colorScheme: 'Panda White / Matte Black Hood',
    featuredLivery: 'Touge King Retro Stripes'
  },
  {
    id: 'veh_buffalo_stx_cop',
    name: 'Bravado Buffalo STX Interceptor',
    modelCode: 'polbuffalostx',
    brand: 'Bravado',
    category: 'Heavy Enforcement',
    price: 210000,
    topSpeedMph: 152,
    acceleration0to60: 3.1,
    handlingScore: 89,
    brakingScore: 94,
    trunkCapacityKg: 120,
    gloveboxCapacityKg: 20,
    seats: 4,
    uniquePerk: 'Reinforced PIT Ram-Bar & Radar Scrambler: Immune to EMP disablers; built-in gun lockbox.',
    acquisitionMethod: 'LSPD / BCSO Department Supply Quartermaster (Rank: Sergeant+).',
    colorScheme: 'Gloss Black & White Patrol',
    featuredLivery: 'Los Santos Police Department High-Speed Interceptor'
  },
  {
    id: 'veh_kamacho_4x4',
    name: 'Canis Kamacho Smuggler Rig',
    modelCode: 'kamacho',
    brand: 'Canis',
    category: 'Off-Road & Smuggler',
    price: 118000,
    topSpeedMph: 118,
    acceleration0to60: 4.2,
    handlingScore: 82,
    brakingScore: 84,
    trunkCapacityKg: 180,
    gloveboxCapacityKg: 15,
    seats: 4,
    uniquePerk: 'Hidden False Floorbed: 80kg contraband stash undetectable by standard roadside K-9 sniffs.',
    acquisitionMethod: 'Sandy Shores Off-Road Dealership & Black Market Brokered.',
    colorScheme: 'Desert Khaki Tan / Olive Drab Matte',
    featuredLivery: 'Senora Overland Expedition'
  },
  {
    id: 'veh_zentorno_evo',
    name: 'Pegassi Zentorno EVO Hypercar',
    modelCode: 'zentorno',
    brand: 'Pegassi',
    category: 'Super & Exotic',
    price: 890000,
    topSpeedMph: 178,
    acceleration0to60: 2.6,
    handlingScore: 98,
    brakingScore: 96,
    trunkCapacityKg: 30,
    gloveboxCapacityKg: 5,
    seats: 2,
    uniquePerk: 'Active Carbon Aerodynamics: Diamond Casino VIP Valet access & +40% passive social prestige.',
    acquisitionMethod: 'Luxury Autos Dealership on Rockford Drive or Private Broker.',
    colorScheme: 'Lava Orange & Carbon Weave',
    featuredLivery: 'Pegassi Corse Tricolore'
  },
  {
    id: 'veh_boxville_cargo',
    name: 'Brute Boxville Heavy Hauler',
    modelCode: 'boxville',
    brand: 'Brute',
    category: 'Commercial Utility',
    price: 52000,
    topSpeedMph: 88,
    acceleration0to60: 8.5,
    handlingScore: 60,
    brakingScore: 72,
    trunkCapacityKg: 550,
    gloveboxCapacityKg: 25,
    seats: 2,
    uniquePerk: 'Industrial Cargo Stash: Qualifies for high-yield PostOP and logistics commercial delivery runs.',
    acquisitionMethod: 'Terminal Commercial Industrial Fleet Sales.',
    colorScheme: 'Industrial Blue / Metallic Gray',
    featuredLivery: 'GoPostal Express Delivery'
  }
];

export const INITIAL_OWNED_VEHICLES: OwnedVehicle[] = [
  {
    id: 'own_veh_01',
    vehicleModelId: 'veh_sultan_rs',
    modelName: 'Karin Sultan RS Custom',
    brand: 'Karin',
    category: 'Street Tuner',
    ownerName: 'Antonio "El Serpiente" Silva',
    plate: 'DRIFT69',
    garageLocation: 'Rancho Underground Garage Bay 4',
    mileageMiles: 1420.5,
    fuelPercent: 88,
    engineHealth: 980,
    bodyHealth: 95,
    mods: {
      engineTier: 4,
      brakesTier: 3,
      transmissionTier: 3,
      turboInstalled: true,
      armorTier: 2,
      windowTint: 'Limo',
      primaryColor: '#8a2be2',
      neonUnderglow: true,
      neonColor: '#00ffff',
      customPlateText: 'DRIFT69'
    },
    trunkInventory: [
      { name: 'Drift Slick Tires (Pair)', weightKg: 24, count: 2, isIllegal: false },
      { name: 'Electronic Lockpick', weightKg: 1.5, count: 3, isIllegal: true },
      { name: 'Roll of Nitrous Bottles (10lb)', weightKg: 18, count: 2, isIllegal: true }
    ],
    impounded: false,
    dailyInsuranceFee: 320
  },
  {
    id: 'own_veh_02',
    vehicleModelId: 'veh_kamacho_4x4',
    modelName: 'Canis Kamacho Smuggler Rig',
    brand: 'Canis',
    category: 'Off-Road & Smuggler',
    ownerName: 'Dusty Rhodes',
    plate: 'DESERT99',
    garageLocation: 'Sandy Shores Airfield Hangar',
    mileageMiles: 3840.0,
    fuelPercent: 64,
    engineHealth: 910,
    bodyHealth: 88,
    mods: {
      engineTier: 3,
      brakesTier: 4,
      transmissionTier: 2,
      turboInstalled: true,
      armorTier: 4,
      windowTint: 'Dark Smoke',
      primaryColor: '#c29b38',
      neonUnderglow: false,
      neonColor: '#ffffff',
      customPlateText: 'DESERT99'
    },
    trunkInventory: [
      { name: 'Hunting Rifle 7.62mm', weightKg: 8.5, count: 1, isIllegal: false },
      { name: 'Refined Moonshine Jugs', weightKg: 40, count: 8, isIllegal: true },
      { name: 'Heavy Tow Cable & Winch', weightKg: 15, count: 1, isIllegal: false }
    ],
    impounded: false,
    dailyInsuranceFee: 240
  },
  {
    id: 'own_veh_03',
    vehicleModelId: 'veh_buffalo_stx_cop',
    modelName: 'Bravado Buffalo STX Interceptor',
    brand: 'Bravado',
    category: 'Heavy Enforcement',
    ownerName: 'Capt. Chase Vance',
    plate: 'POLICE44',
    garageLocation: 'Mission Row PD Underground Motorpool',
    mileageMiles: 520.1,
    fuelPercent: 95,
    engineHealth: 1000,
    bodyHealth: 100,
    mods: {
      engineTier: 4,
      brakesTier: 4,
      transmissionTier: 3,
      turboInstalled: true,
      armorTier: 5,
      windowTint: 'Dark Smoke',
      primaryColor: '#0a0a0f',
      neonUnderglow: false,
      neonColor: '#ffffff',
      customPlateText: 'POLICE44'
    },
    trunkInventory: [
      { name: 'Carbine Rifle & 5.56 Mags', weightKg: 12, count: 1, isIllegal: false },
      { name: 'Tactical Spike Strips', weightKg: 18, count: 2, isIllegal: false },
      { name: 'Trauma First Aid Kit', weightKg: 8, count: 4, isIllegal: false }
    ],
    impounded: false,
    dailyInsuranceFee: 0
  }
];

export const PROPERTY_CATALOG: PropertyListing[] = [
  {
    id: 'prop_vinewood_villa',
    name: 'Vinewood Hills Skyline Villa',
    category: 'Mansion',
    neighborhood: 'Kimble Hill Dr, Vinewood Hills',
    purchasePrice: 2450000,
    weeklyRent: 12500,
    garageSlots: 10,
    stashLimitKg: 650,
    securityTier: 'Fortified High-Security',
    passiveBenefit: 'Prestige Social Status: +25% business meeting influence, rooftop helicopter pad, private infinity pool.',
    acquisitionMethod: 'Dynasty 8 Executive Real Estate or Foreclosure Auction.',
    features: [
      '10-Car Underground Climate-Controlled Garage',
      'Private Helipad on Master Balcony',
      'Wine Cellar Hidden Stash Safe (650kg capacity)',
      'High-Speed CCTV Camera Perimeter Integration'
    ],
    isOwned: true,
    ownerName: 'Antonio "El Serpiente" Silva',
    currentRentDue: 0,
    lockStatus: 'locked',
    interiorTheme: 'Modern Marble & Walnut Luxury'
  },
  {
    id: 'prop_strawberry_safehouse',
    name: 'Strawberry Back-Alley Safehouse & Chop Bay',
    category: 'Safehouse & Chop',
    neighborhood: 'Forum Drive, Strawberry',
    purchasePrice: 320000,
    weeklyRent: 2100,
    garageSlots: 3,
    stashLimitKg: 380,
    securityTier: 'Off-Grid Scrambler',
    passiveBenefit: 'Search Warrant Immunity: Off-grid deed requires DOJ Tier-3 federal warrant to breach; in-house vehicle chop bench.',
    acquisitionMethod: 'Direct Syndicate Turf Deed Purchase from local street broker.',
    features: [
      'Direct Hydraulic Lift for Stripping Stolen Vehicles',
      'Reinforced Trapdoor Armory Safe (380kg)',
      'Unregistered Spawn Point for Heat Evasion',
      'Police Radio Scanner Receiver'
    ],
    isOwned: true,
    ownerName: 'Marcus "Gearhead" Stone',
    currentRentDue: 0,
    lockStatus: 'locked',
    interiorTheme: 'Gritty Industrial Workshop'
  },
  {
    id: 'prop_vespucci_condo',
    name: 'Vespucci Canals Waterfront Penthouse',
    category: 'Penthouse & Condo',
    neighborhood: 'Bay City Ave, Vespucci',
    purchasePrice: 850000,
    weeklyRent: 4600,
    garageSlots: 2,
    stashLimitKg: 280,
    securityTier: 'Reinforced Deadbolt',
    passiveBenefit: 'Stress Relief Haven: Sleeping here reduces character stress by 60%; direct private boat slip to ocean.',
    acquisitionMethod: 'Dynasty 8 Coastal Division Listing.',
    features: [
      '2-Car Gated Subterranean Parking',
      'Private Marina Dock for Speedboats & Jet Skis',
      'Panoramic Ocean & Canal Balcony Deck',
      'Fully Furnished Gourmet Kitchen Buff Station'
    ],
    isOwned: false,
    lockStatus: 'locked',
    interiorTheme: 'Minimalist Coastal Scandinavian'
  },
  {
    id: 'prop_sandy_compound',
    name: 'Senora Desert Fortified Outpost Compound',
    category: 'Industrial Compound',
    neighborhood: 'Marina Drive, Sandy Shores',
    purchasePrice: 1150000,
    weeklyRent: 6800,
    garageSlots: 6,
    stashLimitKg: 950,
    securityTier: 'Fortified High-Security',
    passiveBenefit: 'Off-Grid Production: Heavy-duty diesel generator supports automated moonshine distillation and scrap smelting.',
    acquisitionMethod: 'Blaine County Land Auction or Bank Foreclosure.',
    features: [
      '6-Vehicle Heavy Truck & Off-Road Dirt Yard',
      'Reinforced Metal Bunker Bulk Stash (950kg capacity)',
      'Automated Contraband Processing Workbench',
      'Rooftop Sniper Watchtower overlooking Route 68'
    ],
    isOwned: false,
    lockStatus: 'locked',
    interiorTheme: 'Desert Militant Bunker'
  },
  {
    id: 'prop_legion_storefront',
    name: 'Legion Square Commercial Storefront & Offices',
    category: 'Commercial Storefront',
    neighborhood: 'San Andreas Ave, Downtown Los Santos',
    purchasePrice: 1650000,
    weeklyRent: 9200,
    garageSlots: 4,
    stashLimitKg: 500,
    securityTier: 'Reinforced Deadbolt',
    passiveBenefit: 'Prime Retail Foot Traffic: Increases customer retail transaction velocity by 35%; POS cash register terminal.',
    acquisitionMethod: 'Dynasty 8 Commercial Real Estate Broker.',
    features: [
      'Glass-front Display Showroom for Player Merchandise',
      'Customer Cash Register & Direct Bank Deposit Safe',
      '4-Car Private Delivery Alley Garage',
      'Upper Floor Executive Boardroom & Office'
    ],
    isOwned: false,
    lockStatus: 'locked',
    interiorTheme: 'Modern Corporate Sleek'
  }
];

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: 'role_police',
    name: 'Law Enforcement Officer (LSPD / BCSO)',
    tag: 'POLICE',
    category: 'Law Enforcement',
    department: 'Los Santos Police Dept & Blaine County Sheriff',
    baseSalaryPerTick: 1450,
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    iconName: 'ShieldAlert',
    overview: 'Maintain public safety, patrol jurisdiction beats, execute tactical 10-80 vehicle pursuits, investigate felony crime scenes, and enforce the San Andreas Penal Code.',
    coreDuties: [
      'Execute routine traffic stops, speed traps, and DUI checkpoints.',
      'Respond to Code-3 dispatch calls (bank robberies, shootouts, store alarms).',
      'Engage in PIT maneuvers, box-ins, and high-speed highway interdiction.',
      'Collect DNA swabs, bullet casings, and fingerprint evidence for court.',
      'Process suspects through Mission Row PD holding cells and file MDT incident reports.'
    ],
    specialAbilities: [
      {
        name: 'MDT License Plate & Warrant Run',
        description: 'Instantly lookup registered owner, active warrants, and insurance status of any visible plate.',
        cooldownSec: 5,
        keybindPrompt: 'Press [G] or /mdt'
      },
      {
        name: 'Tactical PIT & Spike Deployment',
        description: 'Deploy tire deflator spike strips in front of fleeing pursuit vehicles.',
        cooldownSec: 45,
        keybindPrompt: 'Press [X] near cruiser trunk'
      },
      {
        name: 'Breathalyzer & GSR Ballistics Swab',
        description: 'Test suspect for alcohol content and Gunshot Residue within last 20 minutes.',
        cooldownSec: 15,
        keybindPrompt: 'Target suspect -> Medical & Evidence'
      }
    ],
    standardLoadout: [
      'Glock 19 (9mm Combat Pistol)',
      'Taser X26P & Stun Cartridges',
      'Collapsible Steel Baton',
      'Class A Level IV Body Armor (100 AP)',
      'Handcuffs, Zip-ties, Radio & Flashlight'
    ],
    progressionRanks: [
      { rank: 1, title: 'Cadet / Probationary Officer', reqHours: 0, monthlyStipend: 2800, perk: 'Basic cruiser access, must patrol with FTO partner' },
      { rank: 2, title: 'Officer II / Deputy', reqHours: 25, monthlyStipend: 3600, perk: 'Solo patrol clearance, assault rifle certification' },
      { rank: 3, title: 'Senior Lead Officer / Corporal', reqHours: 75, monthlyStipend: 4500, perk: 'Buffalo STX Interceptor pursuit vehicle access' },
      { rank: 4, title: 'Sergeant / Watch Commander', reqHours: 160, monthlyStipend: 5800, perk: 'Authorize pursuit terminations, SWAT deployment, search warrants' },
      { rank: 5, title: 'Captain / Chief of Police', reqHours: 350, monthlyStipend: 7800, perk: 'Full department command, hiring/firing, state budget allocation' }
    ],
    crossRoleInteractions: [
      {
        targetRole: 'Criminal / Syndicate',
        relationType: 'adversarial',
        interactionExample: 'Engages in intense tactical pursuits, negotiates hostage terms at bank heists, and conducts raids on illegal drug labs.'
      },
      {
        targetRole: 'Doctor / EMS',
        relationType: 'cooperative',
        interactionExample: 'Secures hazardous hot zones before EMS can enter to triage wounded civilians, officers, and arrested suspects.'
      },
      {
        targetRole: 'Civilian / Business',
        relationType: 'contractual',
        interactionExample: 'Contracts certified mechanics for cruiser maintenance and consults store owners for CCTV footage during robbery investigations.'
      },
      {
        targetRole: 'Judicial / DOJ',
        relationType: 'supervisory',
        interactionExample: 'Presents collected forensic evidence and arrest logs to State Prosecutors and Judges to secure search warrants and indictments.'
      }
    ],
    acquisitionRequirements: [
      'Clean background check (no violent felonies within 14 in-game days).',
      'Pass San Andreas Police Academy oral board and driving obstacle course.',
      'Possess valid Class 1 Driver’s License and Weapon Carry Permit.'
    ]
  },
  {
    id: 'role_doctor',
    name: 'Doctor & Paramedic (EMS / Pillbox Health)',
    tag: 'MEDICAL',
    category: 'Medical & Rescue',
    department: 'San Andreas Fire & Rescue / Pillbox Hill Hospital',
    baseSalaryPerTick: 1550,
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    iconName: 'HeartPulse',
    overview: 'Provide 24/7 rapid medical response across San Andreas, stabilize critically wounded gunshot and crash victims, perform hospital surgical procedures, and manage pharmaceuticals.',
    coreDuties: [
      'Respond to 10-52 medical emergencies and downed citizen distress beacons.',
      'Administer field CPR, apply tourniquets, and stabilize collapsed lungs.',
      'Transport critical patients via ambulance or Air-1 Medevac helicopter to ICU.',
      'Conduct hospital surgical operations to remove bullets and fix fractures.',
      'Dispense prescription painkillers, bandages, and psychological clearances.'
    ],
    specialAbilities: [
      {
        name: 'Defibrillator CPR & Field Adrenaline',
        description: 'Revive downed players from critical coma within golden 10-minute window.',
        cooldownSec: 10,
        keybindPrompt: 'Target downed player -> Administer Defibrillator'
      },
      {
        name: 'Diagnostic Body Scan & Autopsy',
        description: 'Inspect wounded player to identify exact bullet calibers, entry wounds, and weapon types.',
        cooldownSec: 5,
        keybindPrompt: 'Press [E] with Medical Tablet'
      },
      {
        name: 'Air Medevac Flight Clearance',
        description: 'Deploy Swift or Frogger medical helicopter for mountain rescues on Mount Chiliad.',
        cooldownSec: 120,
        keybindPrompt: 'Mount Zonah Rooftop Helipad Terminal'
      }
    ],
    standardLoadout: [
      'Lifepak 15 Defibrillator & EKG Monitor',
      'Trauma Bag (Tourniquets, Suture Kits, Morphine Ampoules)',
      'Sterile Scalpels & Bone Clamps',
      'Oxygen Resuscitation Mask & Splints',
      'Radio, Flashlight, Heavy High-Vis Paramedic Parka'
    ],
    progressionRanks: [
      { rank: 1, title: 'EMT Trainee', reqHours: 0, monthlyStipend: 3000, perk: 'Ambulance passenger, basic triage and bandage application' },
      { rank: 2, title: 'Paramedic', reqHours: 30, monthlyStipend: 4100, perk: 'Solo ambulance drive, advanced defibrillator & morphine dispensing' },
      { rank: 3, title: 'Flight Paramedic / Field Surgeon', reqHours: 85, monthlyStipend: 5200, perk: 'Air Medevac pilot certification, ICU surgery room operator' },
      { rank: 4, title: 'Attending Physician', reqHours: 180, monthlyStipend: 6500, perk: 'Issue medical marijuana licenses and mental competency certifications' },
      { rank: 5, title: 'Hospital Chief of Medicine', reqHours: 360, monthlyStipend: 8500, perk: 'Oversee hospital pharmacy supply chain, hiring, department budget' }
    ],
    crossRoleInteractions: [
      {
        targetRole: 'Police / LSPD',
        relationType: 'cooperative',
        interactionExample: 'Furnishes forensic medical autopsy reports for murder trials and treats wounded officers priority-one.'
      },
      {
        targetRole: 'Criminal / Syndicate',
        relationType: 'contractual',
        interactionExample: 'Under strict Hippocratic oath, treats injured fugitives without taking sides, or corrupt underground back-alley doctors who patch wounds off-the-books for cash.'
      },
      {
        targetRole: 'Civilian',
        relationType: 'supervisory',
        interactionExample: 'Treats factory and mining workplace injuries, performs health checkups, and sells wellness remedies.'
      }
    ],
    acquisitionRequirements: [
      'Pass San Andreas Medical Board licensing examination.',
      'Completed 15 hours of supervised internship at Pillbox Hill ER.',
      'Active certification in Advanced Cardiac Life Support (ACLS).'
    ]
  },
  {
    id: 'role_criminal',
    name: 'Criminal Syndicate & Street Hustler',
    tag: 'UNDERWORLD',
    category: 'Underworld Syndicate',
    department: 'Independent Crews, Cartels & Street Gangs',
    baseSalaryPerTick: 0, // No municipal wage, earned through heists and trades
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    iconName: 'Flame',
    overview: 'Carve out illicit empires through coordinated bank heists, contraband trafficking, underground street racing, vehicle chop shops, and territory protection.',
    coreDuties: [
      'Plan and execute Fleeca Bank vault hacks and jewelry store smash-and-grabs.',
      'Establish hydroponic grow houses for cannabis and synthetic chemical labs.',
      'Boost high-end luxury vehicles and scratch VIN plates at underground chop shops.',
      'Launder dirty cash notes through player-owned nightclubs and diners.',
      'Defend neighborhood gang turf and supply weapons to street affiliates.'
    ],
    specialAbilities: [
      {
        name: 'Thermite Vault Burn & Laptop Decryptor',
        description: 'Initiate security panel bypass minigame on bank safety vaults and security cameras.',
        cooldownSec: 60,
        keybindPrompt: 'Use Thermite / Decryptor near vault door'
      },
      {
        name: 'Slim Jim & Lockpick Hotwiring',
        description: 'Silently crack locked vehicle doors and hotwire ignition circuits without triggering car alarm.',
        cooldownSec: 15,
        keybindPrompt: 'Press [H] near target vehicle door'
      },
      {
        name: 'Black Market Radio Scrambler',
        description: 'Jam local police dispatch alerts for 45 seconds within a 150m radius during a job.',
        cooldownSec: 180,
        keybindPrompt: 'Activate Jammer from inventory'
      }
    ],
    standardLoadout: [
      'Micro SMG 9mm (Scratched Serial)',
      'Advanced Lockpick Set & Drill Bits',
      'Thermite Paste & Electronic Decryptor Laptop',
      'Duffel Bag for Cash & Gold Bullion',
      'Ski Mask, Kevlar Vest & Encrypted Burner Phone'
    ],
    progressionRanks: [
      { rank: 1, title: 'Street Runner / Associate', reqHours: 0, monthlyStipend: 0, perk: 'Corner selling, low-tier store robberies, lockpick usage' },
      { rank: 2, title: 'Crew Enforcer', reqHours: 30, monthlyStipend: 0, perk: 'Fleeca Bank heist access, access to illegal arms dealers' },
      { rank: 3, title: 'Heist Specialist / Wheelman', reqHours: 90, monthlyStipend: 0, perk: 'Pacific Standard vault drilling, high-tier chop shop discounts' },
      { rank: 4, title: 'Underboss / Syndicate Lieutenant', reqHours: 200, monthlyStipend: 0, perk: 'Manage gang territory turf, set street tax, bulk wholesale imports' },
      { rank: 5, title: 'Kingpin / Cartel Patron', reqHours: 400, monthlyStipend: 0, perk: 'Direct black market shipping routes, money laundering shell corporations' }
    ],
    crossRoleInteractions: [
      {
        targetRole: 'Police Officer',
        relationType: 'adversarial',
        interactionExample: 'Engages in strategic cat-and-mouse getaways, decoy routes, hostage negotiations, and shootouts.'
      },
      {
        targetRole: 'Civilian Mechanic',
        relationType: 'contractual',
        interactionExample: 'Pays premium under-the-table cash for untraceable engine mods, nitrous kits, and bulletproof window tinting.'
      },
      {
        targetRole: 'DOJ Defense Attorney',
        relationType: 'contractual',
        interactionExample: 'Retains high-priced defense lawyers to dismiss search warrant evidence on procedural Fourth Amendment grounds.'
      }
    ],
    acquisitionRequirements: [
      'No formal application needed: Build street reputation through roleplay connections.',
      'Acquire illegal tools from underground contacts or black market drop points.',
      'Form or join a recognized crew of at least 3 players.'
    ]
  },
  {
    id: 'role_civilian',
    name: 'Civilian Entrepreneur, Artisan & Logistics',
    tag: 'CIVILIAN',
    category: 'Civic & Commerce',
    department: 'San Andreas Chamber of Commerce & Private Industry',
    baseSalaryPerTick: 950,
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    iconName: 'Building2',
    overview: 'The economic backbone of Los Santos. Run restaurants, tuning garages, taxi fleets, news agencies, freight logistics, and supply raw materials to the entire island.',
    coreDuties: [
      'Manufacture food, coffee, and energy drinks with stamina and stress-buff effects.',
      'Tune, paint, repair, and maintain private, commercial, and emergency vehicles.',
      'Transport passengers and deliver wholesale materials between Blaine County and LS.',
      'Extract raw metals from Davis Quartz Quarry and process ingots for crafting.',
      'Broadcast investigative journalism news reports and host citywide car shows.'
    ],
    specialAbilities: [
      {
        name: 'Repair Kit & Engine Diagnostics',
        description: 'Perform roadside vehicle repairs to fix blown gaskets and restore vehicle to drivable state.',
        cooldownSec: 20,
        keybindPrompt: 'Open vehicle hood -> Use Repair Kit'
      },
      {
        name: 'Culinary Crafting Buff Station',
        description: 'Cook specialty recipes that grant players +20% sprint stamina and 50% slower hunger depletion.',
        cooldownSec: 10,
        keybindPrompt: 'Interact with restaurant cooking stove'
      },
      {
        name: 'Freight Invoice & Commercial Manifest',
        description: 'Generate commercial cargo delivery routes with automated shipping insurance.',
        cooldownSec: 30,
        keybindPrompt: 'Terminal Depot Logistics Console'
      }
    ],
    standardLoadout: [
      'Heavy Duty Tool Kit & Diagnostic Scanner',
      'Commercial Delivery Clipboard & Barcode Reader',
      'Food Safety Thermometer & Chef Utensils',
      'High-Vis Safety Vest & Work Boots',
      'Mobile Banking Terminal & Business Card Deck'
    ],
    progressionRanks: [
      { rank: 1, title: 'Independent Contractor', reqHours: 0, monthlyStipend: 2000, perk: 'Access to public job board (sanitation, taxi, mining)' },
      { rank: 2, title: 'Certified Tradesperson', reqHours: 25, monthlyStipend: 3200, perk: 'Benny’s or Los Santos Customs mechanic workstation access' },
      { rank: 3, title: 'Storefront General Manager', reqHours: 80, monthlyStipend: 4500, perk: 'Ability to purchase and manage inventory at player-owned businesses' },
      { rank: 4, title: 'Commercial Enterprise Owner', reqHours: 180, monthlyStipend: 6200, perk: 'Multi-property business licensing, hire up to 10 staff members' },
      { rank: 5, title: 'Industrial Tycoon / Chamber President', reqHours: 350, monthlyStipend: 8000, perk: 'Influence city tax rates, sponsor municipal public events' }
    ],
    crossRoleInteractions: [
      {
        targetRole: 'Police / LSPD',
        relationType: 'contractual',
        interactionExample: 'Maintains police cruiser fleet, reports suspicious activity, and files insurance claims for store break-ins.'
      },
      {
        targetRole: 'Criminal',
        relationType: 'contractual',
        interactionExample: 'Negotiates protection fees or secretly provides discreet vehicle repair without asking awkward questions.'
      },
      {
        targetRole: 'Doctor / EMS',
        relationType: 'cooperative',
        interactionExample: 'Supplies hospital cafeterias with nutritional food and delivers sterile surgical tool shipments.'
      }
    ],
    acquisitionRequirements: [
      'Open to all citizens: Register identity at City Hall Clerk Office.',
      'Obtain relevant business permit from Department of Consumer Affairs.',
      'Register bank account for municipal tax filings.'
    ]
  },
  {
    id: 'role_doj',
    name: 'Department of Justice (Prosecutor & Judge)',
    tag: 'JUDICIAL',
    category: 'Judicial & Legal',
    department: 'San Andreas Department of Justice & District Court',
    baseSalaryPerTick: 1800,
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    iconName: 'Scale',
    overview: 'Uphold the rule of law through formal court bench trials, preside over criminal bail hearings, draft state legislation, and represent defendants in constitutional challenges.',
    coreDuties: [
      'Review police incident reports and authorize federal search & wiretap warrants.',
      'Preside over jury and bench trials for major felony and capital murder indictments.',
      'Represent criminal suspects as private defense counsel or public defenders.',
      'Draft legislation, city ordinances, and business contracts.',
      'Conduct license suspension hearings and approve expungement petitions.'
    ],
    specialAbilities: [
      {
        name: 'Warrant Approval & Issuance',
        description: 'Digitally approve or reject police search warrant affidavits submitted via MDT.',
        cooldownSec: 10,
        keybindPrompt: 'Access DOJ Portal on Court Terminal'
      },
      {
        name: 'Subpoena & Record Freeze',
        description: 'Legally order financial institutions to freeze suspect bank accounts pending trial.',
        cooldownSec: 60,
        keybindPrompt: 'Issue Judicial Order command'
      },
      {
        name: 'Courtroom Contempt & Gavel Order',
        description: 'Silence disruptive attendees in court with an automated contempt fine and 15-minute cell hold.',
        cooldownSec: 30,
        keybindPrompt: 'Press [F10] Bench Controls'
      }
    ],
    standardLoadout: [
      'Official Judicial Gavel & Docket Briefcase',
      'San Andreas Penal Code Reference Compendium',
      'Encrypted Court Tablet & Stenographer Recorder',
      'Executive Concealed Carry Permit',
      'Department of Justice Gold Seal Credential'
    ],
    progressionRanks: [
      { rank: 1, title: 'Paralegal / Law Clerk', reqHours: 0, monthlyStipend: 3200, perk: 'Review court transcripts and assist trial attorneys' },
      { rank: 2, title: 'Public Defender / Junior Associate', reqHours: 35, monthlyStipend: 4500, perk: 'Represent criminal defendants in municipal court' },
      { rank: 3, title: 'State Prosecutor / Senior Defense Attorney', reqHours: 100, monthlyStipend: 6000, perk: 'File felony grand jury indictments, argue appellate cases' },
      { rank: 4, title: 'District Judge', reqHours: 220, monthlyStipend: 7800, perk: 'Preside over trials, sentence prisoners to Bolingbroke Penitentiary' },
      { rank: 5, title: 'Chief Justice of San Andreas', reqHours: 420, monthlyStipend: 10000, perk: 'Head the judiciary, appoint judges, strike down unconstitutional server laws' }
    ],
    crossRoleInteractions: [
      {
        targetRole: 'Police Officer',
        relationType: 'supervisory',
        interactionExample: 'Reviews officer probable cause affidavits, suppresses illegally obtained evidence, and guides prosecution strategy.'
      },
      {
        targetRole: 'Criminal',
        relationType: 'adversarial',
        interactionExample: 'Sentences convicted felons, offers plea bargain deals, or defends client rights against police misconduct.'
      },
      {
        targetRole: 'Civilian Business',
        relationType: 'contractual',
        interactionExample: 'Drafts partnership LLC agreements, drafts non-disclosure agreements, and arbitrates commercial contract disputes.'
      }
    ],
    acquisitionRequirements: [
      'Pass the San Andreas State Bar Examination with 80%+ score.',
      'Undergo complete background investigation by Internal Affairs.',
      'Possess recognized legal roleplay portfolio or apprenticeship under existing judge.'
    ]
  }
];

export const ECONOMY_JOBS: EconomyJob[] = [
  {
    id: 'job_sanitation',
    title: 'Sanitation Waste Collection Route',
    type: 'legal',
    category: 'Municipal',
    wagePerShift: 1850,
    riskLevel: 'None',
    description: 'Drive the municipal Trashmaster along designated residential streets, load city waste bins into the hydraulic compactor, and deliver load to the recycling depot.',
    tasks: [
      'Pick up Trashmaster from Little Seoul Sanitation Depot.',
      'Stop at 8 marked residential waste collection points.',
      'Carry heavy trash bags into vehicle rear hopper.',
      'Deliver compacted load to Davis Recycling Center for payout.'
    ],
    gearProvided: ['High-Vis Neon Vest', 'Heavy Industrial Rubber Gloves', 'Trashmaster Vehicle Keys'],
    impactOnEconomy: 'Keeps city cleanliness index high; generates raw recycled plastics and glass that reduce packaging costs for store businesses.',
    cooldownMin: 10
  },
  {
    id: 'job_mining',
    title: 'Quarry Mining & Metal Smelting',
    type: 'legal',
    category: 'Resource Extraction',
    wagePerShift: 2400,
    riskLevel: 'Low',
    description: 'Drill raw ore veins at Davis Quartz Quarry, wash the gravel in settling troughs, and smelt high-purity iron, copper, and aluminum ingots at the foundry.',
    tasks: [
      'Use pneumatic jackhammer to fracture quarry rock faces.',
      'Wash gravel in water flumes to separate raw ore.',
      'Smelt ores into Refined Steel and Copper Ingots at the kiln.',
      'Deliver ingots to Benny’s Motorworks or the Central Industrial Exchange.'
    ],
    gearProvided: ['Hard Hat with Headlamp', 'Pneumatic Mining Drill', 'Heat-Resistant Smelting Apron'],
    impactOnEconomy: 'Directly dictates the wholesale supply of steel. High mining output lowers vehicle modification and armor repair costs island-wide.',
    cooldownMin: 15
  },
  {
    id: 'job_trucking',
    title: 'Long-Haul Logistics Freight Delivery',
    type: 'legal',
    category: 'Logistics',
    wagePerShift: 3100,
    riskLevel: 'Low',
    description: 'Hook up a 53-foot refrigerated or dry freight trailer at the Port of Los Santos and navigate the highways to deliver consumer goods to Paleto Bay and Sandy Shores.',
    tasks: [
      'Inspect trailer brake seals and load manifest at Port Terminal.',
      'Drive heavy semi-truck through city and mountain highway routes.',
      'Maintain vehicle speed to protect delicate cargo seals.',
      'Reverse into destination loading bay and collect signed manifest.'
    ],
    gearProvided: ['Commercial Driver Log Tablet', 'High-Vis Safety Gear', 'Fuel Card Voucher'],
    impactOnEconomy: 'Distributes inventory from the seaport to remote stores, preventing stock shortages and food price inflation in Blaine County.',
    cooldownMin: 20
  },
  {
    id: 'job_weed_grow',
    title: 'Hydroponic Cannabis Cultivation & Distribution',
    type: 'illegal',
    category: 'Underworld Felony',
    wagePerShift: 4800,
    riskLevel: 'High - Felony',
    description: 'Tend to high-intensity hydroponic cannabis plants in concealed grow houses, regulate humidity and nutrients, harvest buds, and package into vacuum-sealed bricks.',
    tasks: [
      'Mix hydroponic nutrient water and calibrate UV lighting.',
      'Prune and harvest mature flower colas.',
      'Package buds into 1lb vacuum-sealed bricks using heat sealer.',
      'Deliver discreet bundles to street corners avoiding police radar.'
    ],
    gearProvided: ['Pruning Shears', 'Digital Gram Scale', 'Vacuum Sealing Machine'],
    impactOnEconomy: 'Injects high volumes of dirty cash into the underworld; drives demand for luxury goods, vehicle tuning, and money laundering businesses.',
    cooldownMin: 25
  },
  {
    id: 'job_oxy_runs',
    title: 'Oxycodone Courier Exchange Drops',
    type: 'illegal',
    category: 'Underworld Felony',
    wagePerShift: 3900,
    riskLevel: 'High - Felony',
    description: 'Meet anonymous contacts across back-alleys, collect medical prescription painkiller bundles, and execute stealth drop-offs to discrete buyers while on the move.',
    tasks: [
      'Receive encrypted pager coordinate for the initial supplier.',
      'Collect package and navigate through back alleys.',
      'Hand off to 5 different customer contacts without staying stationary.',
      'Launder dirty cash notes or collect clean envelopes.'
    ],
    gearProvided: ['Encrypted Pager Receiver', 'Discreet Duffle Bag'],
    impactOnEconomy: 'Provides high-stress relief items used by criminals before big heists; elevates local police alert frequency and increases patrol presence.',
    cooldownMin: 20
  },
  {
    id: 'job_chop_shop',
    title: 'Vehicle VIN Scratch & Chop Shop Stripping',
    type: 'illegal',
    category: 'Syndicate Logistics',
    wagePerShift: 5500,
    riskLevel: 'Extreme - Federal',
    description: 'Steal target vehicle models specified on daily black market lists, evade tracking beacons, transport to hidden chop bays, and dismantle into valuable spare parts.',
    tasks: [
      'Locate target vehicle model from anonymous contracted list.',
      'Bypass vehicle alarm and hack GPS tracker within 60 seconds.',
      'Deliver to hidden chop garage without police cruisers tailing.',
      'Dismantle doors, engine block, and catalytic converters with angle grinders.'
    ],
    gearProvided: ['Angle Grinder & Cutting Torches', 'GPS Tracker Jammer', 'Impact Wrenches'],
    impactOnEconomy: 'Supplies cheap untraceable engine parts to underground mechanics, reducing tuning costs while triggering higher police insurance payouts.',
    cooldownMin: 30
  }
];

export const PLAYER_BUSINESSES: PlayerBusiness[] = [
  {
    id: 'biz_bennys',
    name: "Benny's Original Motor Works",
    businessType: 'Custom Tuning Garage',
    owner: 'Marcus "Gearhead" Stone',
    location: 'Power Street, Strawberry',
    valuation: 1850000,
    bankBalance: 428500,
    dailyRevenue: 48500,
    dailyUpkeep: 12400,
    employeesCount: 6,
    inventoryCapacityKg: 1200,
    currentStockPercent: 78,
    customerPopularity: 96,
    recentTransactions: [
      { id: 'tx_b1', time: '10 min ago', description: 'Full Turbo & Engine Tier 4 install (Sultan RS)', amount: 28500, type: 'credit' },
      { id: 'tx_b2', time: '1h ago', description: 'Bulk wholesale order of High-Performance Brake Rotors', amount: 8400, type: 'debit' },
      { id: 'tx_b3', time: '3h ago', description: 'Vehicle Armor & Custom Pearlescent Paint (Buffalo STX)', amount: 16200, type: 'credit' },
      { id: 'tx_b4', time: '6h ago', description: 'Employee Payroll Distribution (6 Techs)', amount: 6000, type: 'debit' }
    ]
  },
  {
    id: 'biz_bahama_mamas',
    name: 'Bahama Mamas West Nightclub',
    businessType: 'Nightclub',
    owner: 'Chloe Fontaine',
    location: 'Del Perro Blvd, Del Perro',
    valuation: 2400000,
    bankBalance: 810200,
    dailyRevenue: 62000,
    dailyUpkeep: 18500,
    employeesCount: 8,
    inventoryCapacityKg: 850,
    currentStockPercent: 85,
    customerPopularity: 92,
    recentTransactions: [
      { id: 'tx_bm1', time: '25 min ago', description: 'VIP Penthouse Bottle Service & Cover Charge', amount: 14500, type: 'credit' },
      { id: 'tx_bm2', time: '2h ago', description: 'Cash Cleaning Fee (Dirty Cash Exchange Service)', amount: 22000, type: 'credit' },
      { id: 'tx_bm3', time: '4h ago', description: 'Wholesale Premium Spirits & Champagne Delivery', amount: 9800, type: 'debit' },
      { id: 'tx_bm4', time: '8h ago', description: 'DJ Performance Contract & Security Staffing', amount: 7500, type: 'debit' }
    ]
  },
  {
    id: 'biz_yellow_jack',
    name: 'Yellow Jack Saloon & Grill',
    businessType: 'Saloon & Diner',
    owner: 'Dusty Rhodes',
    location: 'Panorama Drive, Grand Senora Desert',
    valuation: 720000,
    bankBalance: 165000,
    dailyRevenue: 19800,
    dailyUpkeep: 5200,
    employeesCount: 4,
    inventoryCapacityKg: 600,
    currentStockPercent: 62,
    customerPopularity: 88,
    recentTransactions: [
      { id: 'tx_yj1', time: '40 min ago', description: 'Biker Club Meal Buff Orders & Desert Ale Kegs', amount: 4800, type: 'credit' },
      { id: 'tx_yj2', time: '3h ago', description: 'Local Farm Fresh Meat & Potato Supply Restock', amount: 2400, type: 'debit' },
      { id: 'tx_yj3', time: '5h ago', description: 'Billiards Tournament Entry Fees & Bar Tab', amount: 3600, type: 'credit' }
    ]
  },
  {
    id: 'biz_247_supermarket',
    name: 'Los Santos 24/7 Supermarket Chain',
    businessType: '24/7 Supermarket',
    owner: 'Elena Rostova',
    location: 'Innocence Blvd, Strawberry',
    valuation: 1250000,
    bankBalance: 340000,
    dailyRevenue: 34500,
    dailyUpkeep: 8900,
    employeesCount: 5,
    inventoryCapacityKg: 1500,
    currentStockPercent: 91,
    customerPopularity: 90,
    recentTransactions: [
      { id: 'tx_sm1', time: '15 min ago', description: 'Retail Walk-in Sales (Bandages, Phones, Food, Fuel)', amount: 7200, type: 'credit' },
      { id: 'tx_sm2', time: '2h ago', description: 'Industrial Pallet Restock from Seaport Depot', amount: 5600, type: 'debit' },
      { id: 'tx_sm3', time: '5h ago', description: 'Lottery Ticket & Scratch-off Payout Claims', amount: 1200, type: 'debit' }
    ]
  }
];

export const MARKET_COMMODITIES: MarketCommodity[] = [
  {
    id: 'comm_steel',
    name: 'Refined Industrial Steel Ingots',
    symbol: 'STEEL',
    category: 'Industrial Metals',
    currentPrice: 195,
    basePrice: 180,
    priceChange24h: 8.3,
    supplyUnits: 4200,
    demandIndex: 88,
    economicDriver: 'High demand from mechanics repairing vehicle damage caused by high-speed police chases and bank getaways.',
    isIllegal: false,
    unit: 'ingot (5kg)'
  },
  {
    id: 'comm_copper',
    name: 'High-Conductivity Copper Wire Spools',
    symbol: 'COPR',
    category: 'Industrial Metals',
    currentPrice: 140,
    basePrice: 150,
    priceChange24h: -6.7,
    supplyUnits: 5800,
    demandIndex: 65,
    economicDriver: 'Surplus output from Blaine County mining operations has slightly softened copper market rates.',
    isIllegal: false,
    unit: 'spool (10m)'
  },
  {
    id: 'comm_trauma_kit',
    name: 'Advanced Combat Trauma First-Aid Kits',
    symbol: 'MEDX',
    category: 'Medical & Pharma',
    currentPrice: 460,
    basePrice: 400,
    priceChange24h: 15.0,
    supplyUnits: 1250,
    demandIndex: 94,
    economicDriver: 'Increased hospital admissions and gang turf conflicts have created a tight medical supply deficit.',
    isIllegal: false,
    unit: 'sterile kit'
  },
  {
    id: 'comm_weed_brick',
    name: 'Hydroponic High-Grade Cannabis Brick',
    symbol: 'WEED',
    category: 'Contraband & Narcotics',
    currentPrice: 1280,
    basePrice: 1100,
    priceChange24h: 16.4,
    supplyUnits: 890,
    demandIndex: 92,
    economicDriver: 'LSPD narcotics squad recently raided 2 large grow houses in Sandy Shores, squeezing street supply and driving prices up.',
    isIllegal: true,
    unit: 'brick (1 lb)'
  },
  {
    id: 'comm_decryptor',
    name: 'Military-Grade Electronic Decryptors',
    symbol: 'HACK',
    category: 'Electronics & Hardware',
    currentPrice: 3200,
    basePrice: 2800,
    priceChange24h: 14.2,
    supplyUnits: 320,
    demandIndex: 96,
    economicDriver: 'Heavy demand from crews attempting vault security hacks at Fleeca and Pacific Standard branches.',
    isIllegal: true,
    unit: 'encrypted tablet'
  },
  {
    id: 'comm_gold_bar',
    name: 'Certified 99.9% Gold Bullion Bars',
    symbol: 'GOLD',
    category: 'Luxury Commodities',
    currentPrice: 8650,
    basePrice: 8500,
    priceChange24h: 1.8,
    supplyUnits: 450,
    demandIndex: 78,
    economicDriver: 'Safe haven asset used by high-net-worth players and syndicates to shield assets from inflation and government seizure.',
    isIllegal: false,
    unit: 'bar (10 oz)'
  }
];
