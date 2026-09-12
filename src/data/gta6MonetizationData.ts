import { 
  GTA6MonetizationStrategy, 
  GTA6StoreItem, 
  GTA6RevenueProjectionParams,
  HostingProviderSpec,
  HourByHourStep,
  PLAProhibitionRule,
  StakeholderEngine,
  IndustrySource
} from '../types';

export const GTA6_MONETIZATION_STRATEGIES: GTA6MonetizationStrategy[] = [
  {
    id: 'strat_prio_queue',
    title: 'Tiered Priority FastPass & Reconnect Grace System',
    category: 'Priority Queue & FastPass',
    launchWindow: 'Day-1 Launch',
    projectedRevenueImpact: 'Massive',
    pricePoint: '$15 - $45 / month',
    description: 'Capitalize on the massive Day-1 queue surge with multi-tier connection priority. When thousands of players fight for 256-1024 slots in Vice City, queue passes generate immediate high-margin MRR.',
    implementationDetails: [
      'Tier 1: Standard Prio (Bypasses 70% of standard queue)',
      'Tier 2: FastPass Express (Skips directly ahead of Tier 1)',
      'Tier 3: Streamer / Founder Diamond Instant Connect (Reserved buffer slots)',
      'Crash Protection Grace: 10-minute instant reconnect without queue if game crashes'
    ],
    complianceNotes: '100% CFX & Rockstar compliant as queue management convenience; does not alter in-game combat balance.',
    expectedConversionRate: '12% - 22% of total playerbase on Day-1 rush',
    iconName: 'Zap',
    estimatedDay1Revenue: '$18,500 - $65,000'
  },
  {
    id: 'strat_season_pass',
    title: 'Vice City "Neon Horizon" Season 1 Battle Pass',
    category: 'Battle Pass & Seasons',
    launchWindow: 'Day-1 Launch',
    projectedRevenueImpact: 'Massive',
    pricePoint: '$14.99 / season (or 50-tier progression)',
    description: 'A dedicated 60-day battle pass rewarding RP playtime, civilian job milestones, and syndicate achievements with exclusive tropical clothing, retro vehicle liveries, and customized radio soundbites.',
    implementationDetails: [
      'Free Track: In-game basic cosmetics, repair kits, civilian job XP boosts',
      'Premium Track ($14.99): Vice City pastel suits, flamingo neon weapon wraps, custom license frames',
      'Instant 20-Tier Skip Bundle ($29.99): For whales wanting Day-1 flex items',
      'Community Daily & Weekly Quests (e.g., Deliver 10 air freight crates in Leonida Keys)'
    ],
    complianceNotes: 'Compliant: rewards are purely cosmetic visual assets, sound effects, and emote animations.',
    expectedConversionRate: '18% - 30% of active players in first month',
    iconName: 'Trophy',
    estimatedDay1Revenue: '$25,000 - $80,000'
  },
  {
    id: 'strat_cosmetic_drip',
    title: 'Ocean Beach Neon Drip & Tropical Vanity Assets',
    category: 'Cosmetics & Vanity Drip',
    launchWindow: 'Day-1 Launch',
    projectedRevenueImpact: 'High',
    pricePoint: '$5 - $35 per cosmetic pack',
    description: 'Leverage GTA 6’s Florida/Vice City aesthetic with high-definition custom 3D clothing packs, animated sneaker glows, designer watches, pet alligators/dogs, and custom walk styles.',
    implementationDetails: [
      'Vice City Retro 1986 Pastel Designer Wardrobe Pack',
      'Custom Neon Underglow & Turbo Purge Smoke Kits for cars',
      'Exotic Pet Companions (Trained swamp gator, baby panther on leash with custom animations)',
      'Custom Voice Modulation filters & luxury cellular phone 3D cases'
    ],
    complianceNotes: 'Cosmetics only. No armor or inventory capacity enhancements.',
    expectedConversionRate: '10% - 16% recurring cosmetic shoppers',
    iconName: 'Sparkles',
    estimatedDay1Revenue: '$12,000 - $40,000'
  },
  {
    id: 'strat_franchise_realestate',
    title: 'Commercial Enterprise & Iconic MLO Franchising',
    category: 'Business & Real Estate Franchising',
    launchWindow: 'Week 1-2',
    projectedRevenueImpact: 'High',
    pricePoint: '$150 - $500 one-time lease reservation',
    description: 'Auction exclusive operational rights to high-profile Vice City venues (Malibu Club, Ocean View Marina, Port Gellhorn Air Strip, Grassrivers Swamp Tour airboat depot) with customized exterior branding.',
    implementationDetails: [
      'Exclusive in-game business licenses with custom MLO interior styling',
      'Custom Exterior Neon Signage with owner crew logo',
      'Dedicated business radio announcement slots on server news stations',
      'Optional monthly business upkeep fee paid via web store'
    ],
    complianceNotes: 'Ensure business confers RP privileges and aesthetic dominance rather than infinite automated cash generation.',
    expectedConversionRate: 'Top 2% - 5% dedicated community leaders and faction heads',
    iconName: 'Building2',
    estimatedDay1Revenue: '$8,000 - $25,000'
  },
  {
    id: 'strat_streamer_affiliate',
    title: 'Creator Rev-Share & Streamer Bounty Engine',
    category: 'Streamer & Creator Affiliates',
    launchWindow: 'Pre-Launch (T-60)',
    projectedRevenueImpact: 'Steady MRR',
    pricePoint: '20% - 30% affiliate rev-share',
    description: 'Onboard top Twitch, Kick, and YouTube streamers with custom creator codes. Fans support creators by buying server passes, while audience tips can fund community bounty events live on stream.',
    implementationDetails: [
      'Creator Promo Codes: Streamer gets 25% of all Tebex purchases made with their tag',
      'Stream-Triggered Server Bounties: Chat donations trigger in-game manhunts on the streamer',
      'VIP Cinematic Spectator Drone Pass: Allows designated camera operators to film cinema-grade RP reels',
      'Streamer Community Whitelist Fast-Track'
    ],
    complianceNotes: 'Standard influencer marketing model with transparent creator disclosures.',
    expectedConversionRate: 'Multiplies organic player onboarding by 400%+',
    iconName: 'Video',
    estimatedDay1Revenue: '$15,000 - $50,000'
  },
  {
    id: 'strat_in_game_ads',
    title: 'External Stream/Event Sponsorships & In-Lore Broadcast Network',
    category: 'In-Game Ads & Brand Sponsorships',
    launchWindow: 'Week 1-2',
    projectedRevenueImpact: 'Steady MRR',
    pricePoint: '$500 - $3,500 / month per sponsor partner',
    description: 'Monetize high-visibility community events via external media (Discord, Twitch stream overlays, YouTube series, and web portals). In-game billboards must feature fictional Rockstar parody lore to remain compliant with PLA Clause 7.',
    implementationDetails: [
      'External Broadcast Overlays: Sponsor banners on official server tournament Twitch streams',
      'Discord Community Sponsor Announcements & Dedicated Event Partner Roles',
      'Fictional In-Lore Radio Ads: Player-created radio commercials for RP businesses (Malibu Club, Little Haiti Bodega)',
      'Web Portal & Tebex Partner Banners: Permitted digital banner placements outside the game client'
    ],
    complianceNotes: 'CRITICAL COMPLIANCE: In-game real-world commercial brand sponsorships are strictly prohibited under PLA Clause 7. All corporate integrations must occur externally (Twitch/Discord/Web), while in-game ads must be fictional lore parodies.',
    expectedConversionRate: 'External brand sponsors (hardware, energy drinks, hosting providers) for stream coverage',
    iconName: 'Tv',
    estimatedDay1Revenue: '$5,000 - $18,000'
  },
  {
    id: 'strat_dev_licensing',
    title: 'GTA 6 Framework Scripts & Server-in-a-Box Licensing',
    category: 'Script & Framework Licensing',
    launchWindow: 'Pre-Launch (T-60)',
    projectedRevenueImpact: 'High',
    pricePoint: '$89 - $499 per developer license',
    description: 'Package your proprietary GTA 6 / CFX scripts (advanced inventory, realistic Florida hurricane weather system, AI police dispatch, custom UI phone) and sell to other emerging server owners.',
    implementationDetails: [
      'Leonida Essentials Framework: Plug-and-play complete server core',
      'Custom Everglades Airboat & Jet Ski Physics Handling Pack',
      'Vice City Police CAD/MDT Webhook Integration Bridge',
      'Encrypted Tebex Asset Escrow distribution'
    ],
    complianceNotes: 'Official CFX Tebex Asset Escrow protects code while generating developer royalties.',
    expectedConversionRate: 'Hundreds of new server hosts seeking Day-1 ready systems',
    iconName: 'Code2',
    estimatedDay1Revenue: '$20,000 - $75,000'
  },
  {
    id: 'strat_ticketed_events',
    title: 'Ticketed High-Stakes Tournaments & Charity Galas',
    category: 'Ticketed Tournament Events',
    launchWindow: 'Month 1+',
    projectedRevenueImpact: 'Medium',
    pricePoint: '$10 - $50 entry spectator / participant badge',
    description: 'Organize high-spectacle server events such as the "Vice City Millionaire Yacht Poker Gala" or the "Leonida 500 Supercar Rally" with dedicated spectator tiers, trophies, and commemorative badges.',
    implementationDetails: [
      'Participant entry tickets with custom vehicle livery and race helmet',
      'VIP Spectator Box tickets with champagne perks and drone fly-cam view',
      'Live Twitch / YouTube multi-cam broadcast with sponsors',
      'Portion of proceeds pledged to charity for community goodwill'
    ],
    complianceNotes: 'Strictly skill-based competitive sports/racing; no real-money gambling or chance.',
    expectedConversionRate: '35% of active community participates or tunes in',
    iconName: 'Award',
    estimatedDay1Revenue: '$6,000 - $22,000'
  }
];

export const GTA6_STORE_ITEMS: GTA6StoreItem[] = [
  {
    id: 'store_day1_founder',
    title: 'Vice City Day-1 Pioneer Founder Bundle',
    category: 'VIP & Identity',
    priceUSD: 79.99,
    badge: 'DAY-1 EXCLUSIVE',
    isPopular: true,
    isDay1Exclusive: true,
    description: 'The ultimate early-adopter flex for players entering Vice City on launch hour. Unlocks permanent Discord badge, exclusive retro 1986 synth suit, and Tier-2 FastPass.',
    includes: [
      '60 Days Tier-2 Priority FastPass (Bypasses regular queue)',
      'Exclusive "PIONEER #001" Gold Character ID & Chat Badge',
      'Retro Pastel Silk Suit & Neon Aviator Sunglasses',
      'Custom Vehicle Livery: "Vice 86 Sunset" gradient',
      'Day-1 Founder Discord Role & Private Dev Channel Access'
    ],
    salesCount: 342
  },
  {
    id: 'store_fastpass_monthly',
    title: 'Leonida Express FastPass (30 Days)',
    category: 'Queue Passes',
    priceUSD: 24.99,
    badge: 'BESTSELLER',
    isPopular: true,
    isDay1Exclusive: false,
    description: 'Skip the 500+ player launch queue instantly. Guaranteed priority connect slot with a 15-minute crash protection buffer window.',
    includes: [
      'Instant connection ahead of all standard players',
      '15-Minute Crash Grace Period (Reconnect without waiting)',
      'FastPass queue priority rank #2',
      'Server Supporter role in Discord'
    ],
    salesCount: 819
  },
  {
    id: 'store_season1_pass',
    title: 'Welcome to Vice City - Season 1 Battle Pass',
    category: 'VIP & Identity',
    priceUSD: 14.99,
    badge: 'SEASON 1',
    isPopular: true,
    isDay1Exclusive: false,
    description: 'Unlock 50 tiers of premium cosmetic rewards, custom sound effects, tropical liveries, and legal job bonus XP over 60 days.',
    includes: [
      '50 Premium Cosmetic Progression Tiers',
      'Ocean Drive Neon Underglow Kit for any personal vehicle',
      '3 Exclusive Character Outfits: Cartel Luxe, Vice Cop, Swamp Hunter',
      'Custom Flamingo Phone Wallpaper & Lifeinvader Verified Checkmark',
      '+15% Civilian Job Pay Bonus (Sanitation, Mining, Tow Truck)'
    ],
    salesCount: 654
  },
  {
    id: 'store_swamp_predator',
    title: 'Leonida Everglades "Gator Lord" Companion Pack',
    category: 'Apparel & Drip',
    priceUSD: 19.99,
    badge: 'NEW 3D ASSET',
    isPopular: false,
    isDay1Exclusive: false,
    description: 'Walk the streets of Vice City with a trained Everglades alligator pet companion on a gold chain leash, complete with custom animations.',
    includes: [
      'Summonable trained baby alligator pet with idle/sit animations',
      'Croc-leather trench coat & custom hunting boots',
      'Airboat custom "Swamp King" spray livery',
      'Special emote: "/gatorfeed" and "/gatorpet"'
    ],
    salesCount: 218
  },
  {
    id: 'store_malibu_concession',
    title: 'Commercial Enterprise Concession: Malibu Club MLO',
    category: 'Properties & Decor',
    priceUSD: 349.99,
    badge: 'HIGH VALUE / RARE',
    isPopular: false,
    isDay1Exclusive: true,
    description: 'Claim operational ownership and branding rights of the iconic Ocean Drive Malibu Nightclub. Includes VIP entrance control, custom drink menu, and radio shoutouts.',
    includes: [
      'Full MLO Nightclub Access & DJ Booth Control panel',
      'Custom Entrance Hologram with your crew / gang crest',
      'Door fee ticket sales & VIP bottle service revenue retention',
      'Weekly automated Weazel News radio promotion broadcast',
      'Dedicated 8-Car VIP parking lot with private security bollards'
    ],
    salesCount: 14
  },
  {
    id: 'store_supercar_underglow',
    title: 'Hyper-Exotic Neon Underglow & Sound FX Bundle',
    category: 'Vehicles & Liveries',
    priceUSD: 12.99,
    badge: 'COSMETIC ONLY',
    isPopular: false,
    isDay1Exclusive: false,
    description: 'Equip your vehicles with pulsating multi-color Miami sunset neon tubes, custom backfire flames, and dual-tone train horn sounds.',
    includes: [
      '12 Animated RGB Neon Pulse patterns',
      'Nitrous Purge colored smoke options (Pink, Cyan, Gold)',
      'Custom Backfire Crackle audio FX profile',
      'Vanity License Plate Voucher (Custom 8-character text)'
    ],
    salesCount: 420
  }
];

export const COMPLIANCE_GUIDELINES = [
  {
    title: 'Zero Pay-to-Win (P2W) Rule',
    description: 'Never sell weapons, body armor, godmode perks, or infinite in-game cash. All items must be purely cosmetic, social identity perks, or queue management.',
    isStrict: true
  },
  {
    title: 'CFX & Rockstar Monetization Policy',
    description: 'All payments must route through authorized Tebex storefronts to comply with Take-Two Interactive agreements and CFX server license terms.',
    isStrict: true
  },
  {
    title: 'No Real-Money Gambling or NFTs',
    description: 'Rockstar strictly bans cryptocurrency, blockchain NFTs, and in-game casino chips bought with real money. Stick to transparent flat-rate items.',
    isStrict: true
  },
  {
    title: 'Transparent Odds for Mystery Crates',
    description: 'If offering seasonal mystery crates, publish exact drop probabilities and guarantee duplicate protection to avoid regulatory loot-box crackdowns.',
    isStrict: false
  },
  {
    title: 'Refund & Uptime Safeguards',
    description: 'Maintain clear Discord ticket refund procedures for players experiencing game crashes or disconnects to prevent chargeback fees.',
    isStrict: false
  }
];

export const LAUNCH_ROADMAP_STEPS = [
  {
    phase: 'Phase 1: Pre-Launch Hype (T-60 to T-30 Days)',
    milestones: [
      'Launch official server Discord & cinematic teaser trailer showing custom Leonida map assets',
      'Open Day-1 Founder Pass pre-orders on Tebex with early-bird discount',
      'Recruit top 15 GTA RP streamers with dedicated 25% creator referral codes',
      'Conduct closed beta stress test with whitelist ticket holders'
    ]
  },
  {
    phase: 'Phase 2: Launch Eve Final Setup (T-7 Days)',
    milestones: [
      'Deploy automated Queue priority synchronization via Discord API + Tebex webhooks',
      'Setup dynamic billboard texture servers ready for brand sponsors',
      'Finalize Season 1 "Neon Horizon" 50-tier progression track & 3D clothing cache',
      'Pre-allocate server infrastructure (scalable 1024-slot Redis queue cluster)'
    ]
  },
  {
    phase: 'Phase 3: Launch Day Zero (Day 1)',
    milestones: [
      'Open server doors: expect 2,000 - 8,000 players queued simultaneously',
      'Trigger Day-1 FastPass rush notifications across Discord and live Twitch streams',
      'Monitor Tebex transaction velocity and server performance metrics',
      'Hold live opening celebration event at Ocean Beach with exclusive stream drops'
    ]
  },
  {
    phase: 'Phase 4: Month 1 Retention & High-Stakes Events',
    milestones: [
      'Host the $10,000 Vice City Supercar Grand Prix with sponsored broadcast',
      'Auction commercial real estate concessions (Malibu Club, Ocean View marina)',
      'Deliver Season 1 Mid-Season cosmetic expansion pack',
      'Transition one-time buyers into recurring monthly subscription members'
    ]
  }
];

export const DEFAULT_PROJECTION_PARAMS: GTA6RevenueProjectionParams = {
  launchPlayerbase: 3200,
  priorityQueueConversionPercent: 16,
  priorityQueuePriceUSD: 24.99,
  battlePassConversionPercent: 22,
  battlePassPriceUSD: 14.99,
  cosmeticsConversionPercent: 12,
  cosmeticsAvgSpendUSD: 28.50,
  franchiseLicenseHolders: 8,
  franchiseLicensePriceUSD: 275.00,
  sponsorDealsCount: 3,
  sponsorAvgDealUSD: 1500.00,
  monthlyServerInfraCostUSD: 850.00
};

// ==========================================
// EXECUTIVE BRIEFING & MARKET CONTEXT DATA
// ==========================================
export const INDUSTRY_TIMELINE_EVENTS = [
  { date: 'Dec 2023', event: 'Trailer 1 confirms Leonida / Vice City setting', impact: 'First look at Leonida Keys, Vice City, Everglades', source: '[10]' },
  { date: 'Aug 2023', event: 'Take-Two acquires Cfx.re (FiveM / RedM) for ~$20M', impact: 'Shifts modding policy from hostile enforcement to proprietary control', source: '[4]' },
  { date: 'May 2025', event: 'Trailer 2 released; launch target updated to May 26, 2026', impact: 'Expanded map reveals and enhanced physics demonstrated', source: '[1]' },
  { date: 'Nov 6, 2025', event: 'Second delay announced to Nov 19, 2026', impact: 'Console release locked; PC release separated into future window', source: '[2]' },
  { date: 'Jan 12, 2026', event: 'Cfx Marketplace launches with bundles up to $467.99', impact: 'Creator Platform License Agreement (PLA) codifies prohibited monetization', source: '[5], [8]' },
  { date: 'Mar 2026', event: '2,048-Player OneSync Infinity update for GTA V Enhanced', impact: 'Lower latency, fixed sync bugs, high-concurrency infrastructure verified', source: '[12]' },
  { date: 'Jun 25, 2026', event: 'Preorders open globally for PS5 & Xbox Series X|S', impact: 'Pre-launch hype cycle accelerates player acquisition pipelines', source: '[1]' },
  { date: 'Nov 19, 2026', event: 'Console Launch (PS5, Xbox Series X|S)', impact: 'Global launch; PC operators monetize via content, guides, and GTA V bridge servers', source: '[1], [2]' },
  { date: '2027-2028E', event: 'GTA 6 PC Launch Window (Unannounced SDK / SixM)', impact: 'Native SixM multiplayer servers go live with official Rockstar Creator Platform', source: '[3], [13]' }
];

export const TAKETWO_MODDING_STRATEGY = [
  { period: '2015', action: 'FiveM launch labeled "piracy-enabling"', posture: 'Hostile', meaning: 'Aggressive C&D attempts and legal friction with independent community dev teams.' },
  { period: 'Aug 2023', action: 'Acquisition of Cfx.re for estimated ~$20M', posture: 'Absorption', meaning: 'Take-Two and Rockstar absorb the leading GTA V multiplayer modding stack directly.' },
  { period: 'Jan 2026', action: 'Cfx Marketplace live ($23.99/mo to $467.99 bundles)', posture: 'Monetization', meaning: 'Rockstar creates a formal curated storefront, taking platform cuts alongside Tebex.' },
  { period: 'Jul-Aug 2026', action: 'alt:V and RAGE:MP cease-and-desist structured shutdowns', posture: 'Consolidation', meaning: 'FiveM becomes the sole authorized multiplayer modding platform ecosystem.' }
];

// ==========================================
// JAN 12, 2026 CREATOR PLA PROHIBITIONS
// ==========================================
export const PLA_PROHIBITIONS: PLAProhibitionRule[] = [
  {
    id: 'pla_clause_1',
    clauseNumber: 1,
    title: 'Cash-Out Mechanics & Real-Money Gambling',
    prohibition: 'Real money cannot be paid and subsequently transferred between users, won as cash stakes, or wagered in casino games.',
    compliantAlternative: 'In-game casino games must operate strictly on fictional, earned in-game RP money with zero cash-out or conversion ability.',
    severity: 'Critical / Instant Blacklist'
  },
  {
    id: 'pla_clause_2',
    clauseNumber: 2,
    title: 'Loot Boxes, Gacha, and Random Drawings',
    prohibition: 'Sale of mystery crates, gacha pulls, sweepstakes, or random outcome boxes for real-world currency or virtual currency.',
    compliantAlternative: 'Direct catalog purchases only: publish clear item prices where players get exactly what they buy with 0% RNG.',
    severity: 'Critical / Instant Blacklist'
  },
  {
    id: 'pla_clause_3',
    clauseNumber: 3,
    title: 'Selling Virtual Currency for Real Money',
    prohibition: 'Directly selling in-game cash (e.g., "$10 for $1,000,000 Maze Bank Dollars") for real-world currency.',
    compliantAlternative: 'Sell queue priority, membership badges, cosmetic liveries, or whitelist access. Currency must be earned via gameplay jobs only.',
    severity: 'Critical / Instant Blacklist'
  },
  {
    id: 'pla_clause_4',
    clauseNumber: 4,
    title: 'Reselling Rockstar-Created Virtual Items',
    prohibition: 'Selling, gating, or facilitating paywalled access to stock assets, cars, weapons, or models authored by Rockstar Games.',
    compliantAlternative: 'Charge only for original, custom-made 3D models, textures, liveries, and unique community scripts.',
    severity: 'High Risk'
  },
  {
    id: 'pla_clause_5',
    clauseNumber: 5,
    title: 'Operating Server on Behalf of a Third-Party Brand',
    prohibition: 'Hosting an "Official Nike Server", "Monster Energy Roleplay", or operating as a commercial front for outside corporations.',
    compliantAlternative: 'Independent community branding. External brand sponsors may sponsor web or stream broadcasts, but cannot own or operate the server.',
    severity: 'High Risk'
  },
  {
    id: 'pla_clause_6',
    clauseNumber: 6,
    title: 'Operating Storefront Aggregating Third-Party Content',
    prohibition: 'Reselling gray-market scripts, asset bundles from Discord leaks, or unauthorized multi-creator resell hubs.',
    compliantAlternative: 'Use the official Cfx Marketplace or individual server Tebex stores with verified author escrow credentials.',
    severity: 'Strict Revocation'
  },
  {
    id: 'pla_clause_7',
    clauseNumber: 7,
    title: 'In-Game Commercial Brand Ads & Product Placement',
    prohibition: 'Placing paid real-world product advertisements, commercial brand logos, or sponsored corporate billboards inside the game environment.',
    compliantAlternative: 'All in-game billboards must feature Rockstar satire / fictional lore. Real brand sponsorships are allowed ONLY on external media (Twitch overlays, Discord, web).',
    severity: 'High Risk'
  },
  {
    id: 'pla_clause_8',
    clauseNumber: 8,
    title: 'Cryptocurrencies, NFTs, and Meme Coins',
    prohibition: 'Facilitating the use, purchase, sale, or promotion of blockchain tokens, crypto wallets, NFTs, or decentralized currency.',
    compliantAlternative: 'Standard fiat checkout via Tebex (Credit Card, PayPal, PaySafeCard, Apple Pay, Google Pay).',
    severity: 'Critical / Instant Blacklist'
  }
];

// ==========================================
// FOUR STAKEHOLDER REVENUE ENGINES
// ==========================================
export const STAKEHOLDER_ENGINES: StakeholderEngine[] = [
  {
    id: 'stakeholder_server_operators',
    stakeholder: 'Server Operators',
    subtitle: 'The Seven Compliant Streams & Tebex Economy',
    coreModel: 'Monetize connection access and visual identity while strictly keeping gameplay systems non-P2W.',
    keyMetrics: [
      '60% - 80% of server revenue generated by Tiered Memberships & Queue Priority',
      'Tebex fee footprint: 5% platform commission (15% for FiveM), ~7-8% total processing',
      'VIP members exhibit 3x - 5x longer retention over standard players',
      'Target chargeback ratio under 0.9% to maintain merchant standing'
    ],
    primaryStreams: [
      {
        title: '1. Direct Donations',
        revenueRange: '$5 - $50 per transaction / $100 - $500/mo typical',
        description: 'Voluntary player contributions via Patreon or Tebex. Taxable as revenue over $600 in the US.',
        complianceNote: 'Must not grant competitive advantage if categorized as a donation.'
      },
      {
        title: '2. Tiered Memberships (Bronze to Platinum)',
        revenueRange: '$5 - $150/month recurring',
        description: 'Bronze ($5-15/mo), Silver ($15-30/mo), Gold ($30-60/mo), Platinum ($60-150/mo). Cumulative perks without disrupting RP.',
        complianceNote: 'NoPixel queue pass model generates estimated $10,000 - $50,000 monthly.'
      },
      {
        title: '3. Compliant Cosmetic Shops',
        revenueRange: '$2 - $25 per asset / Limited editions 3x-5x premium',
        description: 'Vehicle cosmetics ($2-20), custom clothing ($1-15), interior property decor ($3-25). Generates $500 - $5,000+ monthly.',
        complianceNote: 'Must be 100% original IP, not Rockstar virtual items, and not imported copyrighted real-world logos.'
      },
      {
        title: '4. VIP Perks (Convenience, Not Power)',
        revenueRange: '$15 - $45 / month included in passes',
        description: 'Queue priority slots, exclusive social lounges, instant vehicle retrieval, customized chat titles and badges.',
        complianceNote: 'Fully compliant as quality-of-life convenience; no body armor or combat advantages.'
      },
      {
        title: '5-7. Ancillary External Streams',
        revenueRange: '$500 - $3,500 / month external deals',
        description: 'Monetized externally through Discord roles, tournament broadcasts, community web portals, and creator affiliate tags.',
        complianceNote: 'Keep commercial branding strictly external to respect PLA Clause 7.'
      }
    ],
    day1Playbook: [
      'Register official Tebex store and configure automated txAdmin grant/refund webhooks',
      'Deploy 4-tier membership structure (Bronze, Silver, Gold, Platinum)',
      'Launch Day-1 Founder Pass for early adopters before queue congestion peaks',
      'Enforce anti-chargeback protocol with strict Discord billing ticket resolution'
    ]
  },
  {
    id: 'stakeholder_rp_communities',
    stakeholder: 'RP Communities',
    subtitle: 'The NoPixel Blueprint for Leonida',
    coreModel: 'Curated whitelist applications, scarcity-driven queue passes, and lore-accurate civic factions.',
    keyMetrics: [
      'Whitelist application fee: $15 minimum donation for priority review',
      'Patreon queue priority, not guaranteed acceptance, preserving scarcity and prestige',
      'NoPixel V featured directly on Rockstar Games Launcher (Sept 8, 2026, GTA$1.5M + Burger Shot Drops)',
      'YouTube Gaming 12-part sponsored RP episodic series'
    ],
    primaryStreams: [
      {
        title: 'Whitelist Application Review Fee',
        revenueRange: '$15 - $25 per application submission',
        description: 'Non-refundable review fee to screen roleplayers, verify mic quality, and weed out griefers and stream-snipers.',
        complianceNote: 'Compliant administrative screening fee; does not guarantee automatic server acceptance.'
      },
      {
        title: 'Scarcity-Driven Queue Priority',
        revenueRange: '$30 - $100 / month subscriber passes',
        description: 'Allows accepted players to bypass 1,000+ waiting queues during peak US & EU evening prime times.',
        complianceNote: 'Patreon / Tebex queue tier model pioneered by NoPixel.'
      },
      {
        title: 'Lore-Accurate Civic Factions',
        revenueRange: 'Organic RP retention & faction support',
        description: 'Vice City Police Department (VCPD), Leonida Keys Smugglers, Port Gellhorn Dockworkers, Everglades Eco-Rangers.',
        complianceNote: '100% original parody lore protects community from trademark infringement.'
      }
    ],
    day1Playbook: [
      'Open pre-launch whitelist applications with $15 screening fees',
      'Establish lore factions based on confirmed Leonida sub-regions (Keys, Port Gellhorn, Ambrosia)',
      'Partner with mid-tier streamers for fast-tracked whitelisting to seed natural storylines',
      'Deploy in-game legal jobs with robust pay scaling to eliminate desire for gray-market currency'
    ]
  },
  {
    id: 'stakeholder_content_creators',
    stakeholder: 'Content Creators',
    subtitle: 'Platform Synergy & Creator Economy',
    coreModel: 'Capitalize on Twitch Drops, YouTube violence policy changes, Machinima series, and creator codes.',
    keyMetrics: [
      'YouTube Sept 2026 update permits graphic gameplay violence monetization within 8-15 seconds',
      'Twitch Drops integration: up to GTA$1M and Rockstar Racing Suit for viewing Marbella RP',
      'Top Machinima creators earn $15,000 - $30,000 monthly (+43% cinematic viewership in 2025)',
      'Rockstar hiring Creator Platform team (Roblox & Fortnite creator crossover)'
    ],
    primaryStreams: [
      {
        title: 'Live Streaming Subs, Bits & Superchats',
        revenueRange: '$2,000 - $25,000+ / month during launch window',
        description: 'Livestreaming Day-1 exploration, heist attempts, and police chases across Twitch, YouTube, and TikTok Live.',
        complianceNote: 'Standard platform monetization with zero game policy conflicts.'
      },
      {
        title: 'Affiliate Creator Codes (Tebex Rev-Share)',
        revenueRange: '20% - 30% cut of player store purchases',
        description: 'Streamers promote server passes using their custom creator code, earning automated revenue share on every checkout.',
        complianceNote: 'Transparent creator disclosure compliant with FTC guidelines.'
      },
      {
        title: 'Episodic Machinima & Lore Series',
        revenueRange: '$15,000 - $30,000 / month in ad revenue',
        description: 'Cinematic roleplay documentaries, syndicate dramas, and undercover cop narratives using spectator drone passes.',
        complianceNote: 'Take-Two friendly video policy supports creative cinematic storytelling.'
      }
    ],
    day1Playbook: [
      'Broadcast Launch Hour (Nov 19, 2026) console exploration and map walkthroughs',
      'Publish rapid-fire 60-second YouTube Shorts & TikTok guides on secret map locations',
      'Bridge audiences to GTA V Enhanced Leonida-themed servers with creator discount tags',
      'Engage Rockstar Creator Platform community coordinators for future SixM pilot access'
    ]
  },
  {
    id: 'stakeholder_developer_networks',
    stakeholder: 'Developer Networks',
    subtitle: 'Marketplace First & Asset Monetization',
    coreModel: 'Curated distribution on Cfx Marketplace, recurring script subscriptions, and asset conversion.',
    keyMetrics: [
      'Cfx Marketplace launched Jan 12, 2026 with 16 verified launch creators',
      'Premium mod bundles priced up to $467.99 and recurring monthly subscriptions at $23.99/mo',
      'Tebex $500M+ creator payout legacy now integrated into Take-Two modding ecosystem',
      'Alchemist tool converts existing GTA V 3D assets to Enhanced / future SixM compatibility'
    ],
    primaryStreams: [
      {
        title: 'Cfx Marketplace Premium Bundles',
        revenueRange: '$49 - $467.99 per enterprise mod bundle',
        description: 'Complete MLO interior packs, advanced custom vehicle physics packs, and comprehensive dispatch cores.',
        complianceNote: 'Fully authorized curated marketplace with Take-Two revenue-sharing.'
      },
      {
        title: 'Recurring Script Subscriptions',
        revenueRange: '$9.99 - $23.99 / month recurring per server',
        description: 'Continually updated live-service scripts (dynamic hurricane weather, AI traffic logic, custom MDT webhooks).',
        complianceNote: 'Protected by official asset escrow encryption.'
      },
      {
        title: 'Asset Conversion & Custom Engineering',
        revenueRange: '$500 - $3,000 per bespoke client project',
        description: 'Converting legacy 3D assets via Alchemist tool and optimizing servers for 2,048 OneSync concurrency.',
        complianceNote: 'Direct engineering service contracts.'
      }
    ],
    day1Playbook: [
      'Submit application for Cfx Marketplace verified creator badge',
      'Build modular, lore-accurate assets (Florida Keys airboats, Vice City neon props, swamp wildlife)',
      'Convert asset libraries using Alchemist tool to ensure Day-1 compatibility',
      'Phase out gray-market Discord sales to avoid PLA Clause 6 enforcement action'
    ]
  }
];

// ==========================================
// HOSTING ECONOMICS & INFRASTRUCTURE MATRIX
// ==========================================
export const HOSTING_PROVIDERS: HostingProviderSpec[] = [
  {
    id: 'host_rocketnode',
    name: 'RocketNode',
    startingPrice: '$6.50/mo (2GB) - $98.50/mo (32GB)',
    specs: 'Ryzen 9 7950X / NVMe Gen4 / txAdmin Pre-installed',
    ddosMitigation: 'RocketGuard up to 17 Tbps global mitigation',
    notes: 'Budget leader; popular choice for fast-growing US and EU servers.',
    isOfficialPartner: false,
    recommendedSlots: '64 - 512 players'
  },
  {
    id: 'host_zap',
    name: 'Zap-Hosting',
    startingPrice: '$9.16/mo starting base',
    specs: 'Intel/AMD Enterprise SSD, automated server installer',
    ddosMitigation: 'Proprietary enterprise DDoS protection',
    notes: 'Long-standing official partner with deep European presence and one-click Tebex linking.',
    isOfficialPartner: true,
    recommendedSlots: '32 - 256 players'
  },
  {
    id: 'host_gravelhost',
    name: 'GravelHost',
    startingPrice: '$5/mo (3.5GB) - $23/mo (12GB)',
    specs: 'Ryzen 9 5900X @ 4.7GHz, Free Managed MySQL database',
    ddosMitigation: 'Multi-layer game-specific filtering across 12 data centers',
    notes: 'Cost-effective high clock speed per core; ideal for Lua thread execution.',
    isOfficialPartner: false,
    recommendedSlots: '32 - 200 players'
  },
  {
    id: 'host_xrealm',
    name: 'xREALM',
    startingPrice: '€9.99/mo for 10 slots',
    specs: 'High-frequency NVMe, native Tebex store integration',
    ddosMitigation: 'Custom Game-DDoS filtering with live monitoring',
    notes: 'Official partner with top tier support ratings in 2026.',
    isOfficialPartner: true,
    recommendedSlots: '64 - 512 players'
  },
  {
    id: 'host_gportal',
    name: 'GPORTAL',
    startingPrice: '$9.00 (10 slots) - $37.06 (48 slots) / 30d',
    specs: 'Fast SSD storage, slot-based dynamic scaling',
    ddosMitigation: 'Corero SmartWall DDoS defense',
    notes: 'Official partner; great reliability for mid-sized community clusters.',
    isOfficialPartner: true,
    recommendedSlots: '32 - 128 players'
  },
  {
    id: 'host_self_hosted',
    name: 'Enterprise Bare-Metal (Self-Hosted)',
    startingPrice: '$180 - $450/mo dedicated server',
    specs: 'Ryzen 9 9950X @ 5.7GHz / 64GB DDR5 / Dual NVMe RAID 1 / Kafka / PostgreSQL',
    ddosMitigation: 'Path.net / Voxility BGP filtering (10+ Tbps)',
    notes: 'Required for 1,000 - 2,048 player OneSync Infinity scale. Proven 1M player load test on PostgreSQL.',
    isOfficialPartner: false,
    recommendedSlots: '1,024 - 2,048 players'
  }
];

// ==========================================
// HOUR-BY-HOUR DAY-1 LAUNCH ENGINE
// ==========================================
export const HOUR_BY_HOUR_PLAYBOOK: HourByHourStep[] = [
  {
    id: 'step_t_minus_30',
    timeframe: 'T-30 Days to Launch',
    phase: 'Pre-Flight Preparation & Compliance Lock',
    badge: 'PRE-LAUNCH',
    summary: 'Secure hosting infrastructure, configure Tebex rails, apply for Cfx creator status, and test grant/refund flows.',
    actions: [
      'Select hosting provider (xREALM, Zap-Hosting, or 5GHz+ dedicated bare metal)',
      'Register official Tebex store, link txAdmin, and verify webhook grant/retry/refund workflows',
      'Submit application for Cfx Marketplace verified creator status with 3 launch-ready assets',
      'Set up external monetization rails: Patreon tiers, Discord roles, and YouTube channel trailer',
      'Embed mandatory PLA disclaimer on all server portals and store footers'
    ],
    risksToMitigate: [
      'Payment gateway freezes: Test microtransactions to verify account merchant tier',
      'Trademark scrutiny: Strip real car badges, real brand logos, and copyrighted music'
    ],
    revenueOpportunities: 'Founder Pass early-bird reservations ($50 - $100) and whitelist application fees'
  },
  {
    id: 'step_hour_0_6',
    timeframe: 'Launch Hour 0 - 6 (Nov 19, 2026 00:00 EST)',
    phase: 'Console Launch Window & Content Wave',
    badge: 'LAUNCH HOUR',
    summary: 'Console players enter story mode. PC server operators monetize via live streaming, guides, and GTA V Enhanced bridge servers.',
    actions: [
      'Livestream console launch exploration of Vice City and Leonida Keys across Twitch/YouTube',
      'Publish Day-1 Vice City map guides, vehicle spawn locations, and money methods',
      'Open GTA V Enhanced RP server with Leonida branding as a bridge for PC players',
      'Activate NoPixel-style $30/mo priority queue passes on the bridge server',
      'Link Twitch Drops to reward stream viewers with in-game cosmetic tokens'
    ],
    risksToMitigate: [
      'Viewer fatigue: Focus on high-tempo gameplay and novel Florida wildlife encounters',
      'Queue crashes on bridge server: Enable 10-minute crash grace period buffer'
    ],
    revenueOpportunities: 'Twitch subs, YouTube Superchats, and massive queue pass sales on bridge RP server'
  },
  {
    id: 'step_day_6_24',
    timeframe: 'Launch Day 6 - 24 Hours',
    phase: 'Community Scaling & Tiered Rollout',
    badge: 'DAY 1 SCALE',
    summary: 'Deploy teaser server content, activate 4-tier memberships, and push compliant cosmetic collections.',
    actions: [
      'Deploy teaser server content reflecting Trailer 1/2 locations without duplicating Rockstar missions',
      'Roll out Tiered Memberships: Bronze ($10), Silver ($25), Gold ($50), Platinum ($100)',
      'Open Compliant Cosmetic Shop with 100% original Vice City neon apparel and liveries',
      'Content creators publish "First 10 Hours in Leonida" with mid-roll ads and affiliate tags',
      'Monitor server CPU thread affinity and PostgreSQL database connection pools'
    ],
    risksToMitigate: [
      'TOS violations: Ensure no custom stories directly copy single-player campaign heists',
      'Friendly fraud: Monitor Tebex anti-fraud filter triggers'
    ],
    revenueOpportunities: '$15,000 - $65,000 Day-1 gross across queue passes, memberships, and cosmetics'
  },
  {
    id: 'step_week_1',
    timeframe: 'Week 1 Post-Launch',
    phase: 'Creator Platform Engagement & Retention',
    badge: 'WEEK 1',
    summary: 'Engage Rockstar Creator Platform team, transition to Cfx Marketplace assets, and maintain strict chargeback controls.',
    actions: [
      'Connect with Rockstar Creator Platform team via community coordinator listings; pitch server as case study',
      'Transition server dependencies to official Cfx Marketplace assets and verified scripts',
      'Audit chargeback ratio daily: maintain strictly under 0.9% to prevent merchant penalties',
      'Host server-wide community opening celebration at Ocean Beach with exclusive stream rewards',
      'Transition one-time launch buyers into auto-renewing 30-day membership subscribers'
    ],
    risksToMitigate: [
      'Chargeback velocity: Digital goods face 37.1% higher friendly fraud; resolve refund tickets within 4 hours',
      'Player burnout: Rotate daily civilian job bonuses and legal career double XP'
    ],
    revenueOpportunities: 'Long-term recurring MRR stability ($10,000 - $40,000/mo ongoing)'
  },
  {
    id: 'step_pc_window',
    timeframe: 'PC Launch Window (Late 2027 - 2028E)',
    phase: 'Native SixM Infrastructure & First-Mover Capture',
    badge: 'FUTURE HORIZON',
    summary: 'When PC version releases, official SixM infrastructure goes live. Verified operators capture immediate first-mover advantage.',
    actions: [
      'Migrate pre-tested PostgreSQL databases (scalable up to 1M player records) to native SixM SDK',
      'Deploy Alchemist-converted 3D vehicles, custom buildings, and clothing assets into native engine',
      'Launch full 2,048-slot OneSync server clusters across US East, US West, and Europe',
      'Integrate with official Rockstar Launcher discovery if accepted into partner program',
      'Scale enterprise creator affiliate network with automated Tebex rev-share payouts'
    ],
    risksToMitigate: [
      'Engine migration breaking changes: Maintain modular script architectures',
      'Server hardware bottlenecks: Pre-reserve 64GB+ DDR5 bare-metal nodes'
    ],
    revenueOpportunities: 'Multi-million dollar ecosystem share in Bank of America $2.2B annual GTA Online market'
  }
];

// ==========================================
// 23 VERIFIED INDUSTRY SOURCES & BIBLIOGRAPHY
// ==========================================
export const INDUSTRY_SOURCES: IndustrySource[] = [
  { id: 1, title: "Want GTA 6? What to know so you don't miss out", publisher: 'USA Today', url: 'https://www.usatoday.com/story/tech/gaming/2026/06/25/gta-6-pre-order-release-date/90691233007/', keyFinding: 'Confirmed June 25, 2026 preorder opening and November 19, 2026 console release schedule.' },
  { id: 2, title: 'GTA 6 now delayed until Nov. 2026', publisher: "Tom's Guide", url: 'https://www.tomsguide.com/gaming/rockstar-announces-grand-theft-auto-iv-delayed-to-november-2026', keyFinding: 'Second delay announcement detailing Rockstar timeline adjustments from May 2026 to Nov 2026.' },
  { id: 3, title: "A former Grand Theft Auto dev weighs in on GTA 6's delayed PC version", publisher: 'PC Gamer', url: 'https://www.pcgamer.com/a-former-grand-theft-auto-dev-weighs-in-on-gta-6s-delayed-pc-version-its-hard-to-do-that-as-a-developer-because-the-team-isnt-big-enough/', keyFinding: 'Technical insights explaining Rockstar historical 13-19 month PC release gap.' },
  { id: 4, title: 'Take-Two Just Explained Why It Bought FiveM for GTA 6', publisher: 'GTA BOOM', url: 'https://www.gtaboom.com/take-two-just-explained-why-it-bought-fivem-for-gta-6-fcea', keyFinding: 'CEO Strauss Zelnick statement: "Instead of trying to beat them, we join them" regarding Cfx.re acquisition.' },
  { id: 5, title: 'GTA Finds New Ways To Print Money With Pricey Mod Marketplace', publisher: 'Kotaku', url: 'https://kotaku.com/gta-cfx-marketplace-mods-online-rdr2-2000659824', keyFinding: 'Jan 12, 2026 Cfx Marketplace launch details with 16 verified creators and $467.99 mod bundles.' },
  { id: 6, title: "Take-Two's real GTA 6 jackpot may not be the game itself", publisher: 'TheStreet', url: 'https://www.thestreet.com/investing/take-two-gta-6-jackpot-not-game-but-online-repeat-spending', keyFinding: 'Bank of America $2.2B fiscal 2028 GTA Online bookings forecast based on $60 annual MAU spend.' },
  { id: 7, title: 'Roleplay (RP) Servers Support Policy', publisher: 'Rockstar Support', url: 'https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers', keyFinding: 'Official boundaries prohibiting loot boxes, virtual currency sales, crypto, and real-world IP misuse.' },
  { id: 8, title: 'Platform License Agreement (12 Jan 2026)', publisher: 'Cfx.re', url: 'https://static.cfx.re/platform-license-agreement-12-jan-2026.pdf', keyFinding: 'The binding legal document codifying 8 prohibited commercial exploitation methods and disclaimer mandates.' },
  { id: 9, title: 'Overwolf acquires server monetisation firm Tebex for $29m', publisher: 'GamesIndustry.biz', url: 'https://www.gamesindustry.biz/mods-specialist-overwolf-acquires-server-monetisation-firm-tebex-for-usd29m', keyFinding: 'Overwolf acquisition history of Tebex following $500M+ in creator transactions facilitated.' },
  { id: 10, title: 'GTA 6 map: Vice City, new locations revealed & mapping project explained', publisher: 'Radio Times', url: 'https://www.radiotimes.com/technology/gaming/gta-6-map-explained/', keyFinding: 'Confirmed geography of Leonida, Vice City, Leonida Keys, and Port Gellhorn sub-regions.' },
  { id: 11, title: 'GTA 6 map returns to Vice City and explores Leonida', publisher: 'GamesRadar', url: 'https://www.gamesradar.com/games/grand-theft-auto/gta-6-map-returns-to-vice-city-and-explores-the-riches-of-the-florida-lite-state-of-leonida-malt-liquor-painkillers-and-truck-stop-energy-drinks/', keyFinding: 'Deep exploration of the Florida satire setting, culture, and environmental landmarks.' },
  { id: 12, title: "GTA V Enhanced Gets 2,048-Player Servers Thanks to FiveM's Next Big Update", publisher: 'GTA BOOM', url: 'https://www.gtaboom.com/fivem-2048-player-servers-gta-v-enhanced-8aa4', keyFinding: 'OneSync Infinity 2,048-slot architecture, Alchemist 3D tool, and closed-source security migration.' },
  { id: 13, title: 'GTA 6 may have robust Roblox-like UGC economy: Rockstar hiring four Creator Platform roles', publisher: 'TweakTown', url: 'https://www.tweaktown.com/news/110968/gta-6-may-have-robust-roblox-like-ugc-economy-or-even-sixm-support-from-cfx-rockstar-hiring-four-creator-platform-roles/index.html', keyFinding: 'Rockstar job listings for Creator Platform team targeting Roblox/Fortnite creator ecosystems.' },
  { id: 14, title: '9 Best FiveM Server Hosting Providers in 2026', publisher: 'Geekflare', url: 'https://geekflare.com/guides/best-fivem-server-hosting/', keyFinding: 'Comprehensive benchmark comparison of RocketNode, Zap-Hosting, GravelHost, xREALM, and GPORTAL.' },
  { id: 15, title: 'Breaking Free from Tebex: The Complete Guide to FiveM Server Monetization', publisher: 'FiveMX', url: 'https://fivemx.com/complete-guide-fivem-server-monetization/', keyFinding: 'Detailed breakdown of the seven compliant server revenue streams, fee structures, and tax thresholds.' },
  { id: 16, title: 'FiveM Tebex Alternatives: What the Cfx.re Rules Allow', publisher: 'FiveMX', url: 'https://fivemx.com/best-fivem-tebex-alternatives/', keyFinding: 'Legal analysis establishing Tebex as the sole sanctioned payment rail for server-linked perks.' },
  { id: 17, title: 'Setting up a Tebex Store', publisher: 'CitizenFX / FiveM Documentation', url: 'https://github.com/citizenfx/fivem-docs/blob/HEAD/content/docs/server-manual/setting-up-a-tebex-store.md', keyFinding: 'Official technical documentation on connecting txAdmin to Tebex secret keys and webhook endpoints.' },
  { id: 18, title: 'GTA RP NoPixel server: What is it, How to Apply, and more', publisher: 'Dot Esports', url: 'https://dotesports.com/streaming/news/what-are-nopixel-servers-how-to-apply-to-play-gta-roleplay', keyFinding: 'Breakdown of NoPixel $15 whitelist application review fee and queue priority dynamics.' },
  { id: 19, title: 'Rockstar finally confirms NoPixel V and offers GTA$1.5 million to watch it launch', publisher: 'Dexerto', url: 'https://www.dexerto.com/gaming/rockstar-finally-confirms-nopixel-v-and-offers-gta1-5-million-to-watch-it-launch-3404803/', keyFinding: 'Details on NoPixel V official Rockstar Launcher integration and Burger Shot Twitch Drops.' },
  { id: 20, title: 'Rockstar May Embrace User-Generated Content In Grand Theft Auto 6 - Report', publisher: 'GameSpot', url: 'https://www.gamespot.com/articles/rockstar-may-embrace-user-generated-content-in-grand-theft-auto-6-report/1100-6529549/', keyFinding: 'Reporting on Rockstar discussions with prominent Fortnite and Roblox world creators.' },
  { id: 21, title: 'GTA 6 Hub & Creator Economy Evolution', publisher: 'TweakTown', url: 'https://www.tweaktown.com/hubs/gta-6/index2.html', keyFinding: 'Analysis of Take-Two shifting from passive RP tolerance to active native UGC monetization.' },
  { id: 22, title: 'YouTube overhauls monetization rules for gameplay violence ahead of GTA 6', publisher: 'Unilad Tech', url: 'https://www.uniladtech.com/gaming/gta-forces-youtube-change-monetization-rules-gameplay-violence-178766-20260908', keyFinding: 'YouTube September 2026 advertiser guideline reform permitting violence monetization in early video seconds.' },
  { id: 23, title: '105 Creative Grand Theft Auto YouTube Niche Ideas', publisher: 'Subscribr', url: 'https://subscribr.ai/p/grand-theft-auto-youtube-niche-ideas', keyFinding: 'Creator economy monetization strategies spanning Machinima, 60-second tips, and hardware affiliates.' }
];
