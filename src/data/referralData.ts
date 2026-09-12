import { ReferralTier, ReferredPlayerRecord, ReferralRewardItem } from '../types';

export const STARTER_REFERRAL_TIERS: ReferralTier[] = [
  {
    tierLevel: 1,
    title: 'Street Recruiter',
    minReferrals: 0,
    cashRewardPerReferral: 10000,
    badgeColor: 'text-slate-300 border-slate-700 bg-slate-800/80',
    exclusiveBonusItem: {
      id: 'reward_tier1_starter',
      name: 'Vice Starter Duffle Bag & Dual Radios',
      type: 'cosmetic',
      valueDisplay: '$5,000 Equiv.',
      iconName: 'Package',
      description: 'Tactical leather duffle bag with extra 25kg storage capacity and custom dual-frequency encrypted radio.',
      rarity: 'Common'
    }
  },
  {
    tierLevel: 2,
    title: 'Syndicate Scout',
    minReferrals: 3,
    cashRewardPerReferral: 15000,
    badgeColor: 'text-sky-400 border-sky-500/40 bg-sky-950/60',
    exclusiveBonusItem: {
      id: 'reward_tier2_weapon',
      name: 'Gilded Vice City Combat Pistol & Holster',
      type: 'weapon_skin',
      valueDisplay: '$25,000 Equiv.',
      iconName: 'Shield',
      description: 'Exclusive 24K gold-plated custom engraved combat pistol with quick-draw Miami under-shoulder holster.',
      rarity: 'Rare'
    }
  },
  {
    tierLevel: 3,
    title: 'Underworld Enforcer',
    minReferrals: 7,
    cashRewardPerReferral: 25000,
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/60',
    exclusiveBonusItem: {
      id: 'reward_tier3_pass',
      name: '14-Day FastPass Express Queue Pass',
      type: 'pass',
      valueDisplay: '$35,000 Equiv.',
      iconName: 'Zap',
      description: 'Skip peak 500+ player server queues instantly for 14 days with automatic 10-minute crash reconnect buffer.',
      rarity: 'Epic'
    }
  },
  {
    tierLevel: 4,
    title: 'Vice City Kingpin',
    minReferrals: 15,
    cashRewardPerReferral: 50000,
    badgeColor: 'text-amber-400 border-amber-500/50 bg-amber-950/60',
    exclusiveBonusItem: {
      id: 'reward_tier4_supercar',
      name: 'Exotic Pegassi Torero "Sunset Gold" Edition',
      type: 'vehicle',
      valueDisplay: '$250,000 Equiv.',
      iconName: 'Car',
      description: 'Limited edition classic supercar with custom twin-turbo tuning, Miami sunset neon pulse, and permanent insurance.',
      rarity: 'Legendary'
    }
  }
];

export const NEW_PLAYER_WELCOME_PACKAGE: {
  cashBonus: number;
  starterItems: ReferralRewardItem[];
  perks: string[];
} = {
  cashBonus: 15000,
  starterItems: [
    {
      id: 'newbie_welcome_pack',
      name: 'Leonida Citizen Arrival Stash',
      type: 'cosmetic',
      valueDisplay: '$10,000 Value',
      iconName: 'Gift',
      description: 'High-end smartphone with GPS map app unlocked, driver license voucher, 5x medkits, and 3x vehicle repair kits.',
      rarity: 'Rare'
    },
    {
      id: 'newbie_fast_xp',
      name: '48-Hour Double Career XP Booster',
      type: 'pass',
      valueDisplay: 'Active 48h',
      iconName: 'Sparkles',
      description: 'Earn 2x paycheck bonuses and career progression rep across civilian, mechanic, EMS, and courier jobs.',
      rarity: 'Epic'
    }
  ],
  perks: [
    'Instant $15,000 in-game bank deposit',
    'Driver License & Weapon Carry Permit Fee Waiver ($2,500 value)',
    '48-Hour 2x Career XP & Legal Job Pay bonus',
    'Starter Apartment 3-Day Free Rent Voucher in Little Haiti'
  ]
};

export const INITIAL_REFERRED_PLAYERS: ReferredPlayerRecord[] = [
  {
    id: 'ref_101',
    inviteCode: 'VICE-9402',
    newPlayerName: 'Jaxson_Blade',
    newPlayerDiscord: 'blade_runner#4412',
    joinedAt: '2 hours ago',
    status: 'verified',
    verificationMethod: 'Discord OAuth',
    referrerRewardClaimed: true,
    newPlayerRewardClaimed: true,
    bonusItemAwarded: 'Vice Starter Duffle Bag & Dual Radios',
    cashBonusAwarded: 10000
  },
  {
    id: 'ref_102',
    inviteCode: 'VICE-9402',
    newPlayerName: 'Mia_Santos_FL',
    newPlayerDiscord: 'mia_fl#8901',
    joinedAt: '5 hours ago',
    status: 'verified',
    verificationMethod: 'Steam VAC',
    referrerRewardClaimed: true,
    newPlayerRewardClaimed: true,
    bonusItemAwarded: 'Vice Starter Duffle Bag & Dual Radios',
    cashBonusAwarded: 10000
  },
  {
    id: 'ref_103',
    inviteCode: 'VICE-9402',
    newPlayerName: 'LeonidaDrifter_99',
    newPlayerDiscord: 'drifter_99#1204',
    joinedAt: '12 hours ago',
    status: 'pending',
    verificationMethod: 'Phone SMS',
    referrerRewardClaimed: false,
    newPlayerRewardClaimed: false,
    bonusItemAwarded: 'Pending Verification',
    cashBonusAwarded: 0
  },
  {
    id: 'ref_104',
    inviteCode: 'VICE-9402',
    newPlayerName: 'GatorHunter_Ron',
    newPlayerDiscord: 'ron_gator#7718',
    joinedAt: '1 day ago',
    status: 'pending',
    verificationMethod: 'CFX FiveM Token',
    referrerRewardClaimed: false,
    newPlayerRewardClaimed: false,
    bonusItemAwarded: 'Pending Verification',
    cashBonusAwarded: 0
  }
];
