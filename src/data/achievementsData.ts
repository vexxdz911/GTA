import { ServerAchievement, Player } from '../types';

export type { ServerAchievement };

export const SERVER_ACHIEVEMENTS: ServerAchievement[] = [
  {
    id: 'first_million',
    title: 'First Million Earned',
    description: 'Amass a total net worth or lifetime earnings of $1,000,000 or greater across cash, investments, and bank balances.',
    category: 'wealth',
    icon: 'Trophy',
    badgeColor: 'amber',
    rarity: 'legendary',
    tier: 3,
    criteria: 'Combined Net Worth or Lifetime Earnings ≥ $1,000,000',
    points: 100,
    rewardText: 'Title: "The High Roller" + VIP Banking Perks'
  },
  {
    id: 'century_club',
    title: '100 Hours Played',
    description: 'Demonstrate deep loyalty to Los Santos by logging over 100 hours of active, verified character roleplay on the server.',
    category: 'playtime',
    icon: 'Clock',
    badgeColor: 'cyan',
    rarity: 'epic',
    tier: 3,
    criteria: 'Logged Server Time ≥ 100 Hours',
    points: 100,
    rewardText: 'Title: "Century Club" + Priority Queue Tier 1'
  },
  {
    id: 'veteran_500h',
    title: 'Server Pioneer (500h)',
    description: 'An indelible cornerstone of our community with over 500 lifetime server hours logged.',
    category: 'playtime',
    icon: 'Sparkles',
    badgeColor: 'purple',
    rarity: 'legendary',
    tier: 4,
    criteria: 'Logged Server Time ≥ 500 Hours',
    points: 250,
    rewardText: 'Custom License Plate Voucher + Gold Radio Skin'
  },
  {
    id: 'guardian_shield',
    title: 'Shield of San Andreas',
    description: 'Sworn law enforcement officer actively keeping order in Los Santos and Blaine County.',
    category: 'career',
    icon: 'Shield',
    badgeColor: 'blue',
    rarity: 'rare',
    tier: 2,
    criteria: 'Active LSPD or BCSO Sworn Officer',
    points: 50,
    rewardText: 'Department Commendation Ribbon'
  },
  {
    id: 'lifesaver',
    title: 'Miracle Worker',
    description: 'Dedicated Pillbox Hill medical professional certified in trauma surgery and emergency field resuscitation.',
    category: 'career',
    icon: 'HeartPulse',
    badgeColor: 'rose',
    rarity: 'rare',
    tier: 2,
    criteria: 'Active EMS / Pillbox Medical Specialist',
    points: 50,
    rewardText: 'Caduceus Lapel Pin'
  },
  {
    id: 'speed_demon',
    title: 'Midnight Speed Demon',
    description: 'Pushed a performance vehicle to extreme limits, clocking verified radar speeds exceeding 110 MPH.',
    category: 'assets',
    icon: 'Zap',
    badgeColor: 'yellow',
    rarity: 'rare',
    tier: 2,
    criteria: 'Operated Vehicle ≥ 110 MPH',
    points: 40,
    rewardText: 'Custom Nitrous Purge Livery'
  },
  {
    id: 'syndicate_kingpin',
    title: 'Underworld Kingpin',
    description: 'Held commanding leadership within an influential syndicate or recognized motorcycle club.',
    category: 'social',
    icon: 'Flame',
    badgeColor: 'pink',
    rarity: 'epic',
    tier: 3,
    criteria: 'Syndicate Lieutenant, Boss, or Enforcer Rank',
    points: 75,
    rewardText: 'Custom Black Market Radio Channel'
  },
  {
    id: 'fleet_master',
    title: 'Luxury Fleet Collector',
    description: 'Maintains an elite motor stable with substantial financial backing and customized street vehicles.',
    category: 'assets',
    icon: 'Car',
    badgeColor: 'emerald',
    rarity: 'epic',
    tier: 3,
    criteria: 'Net Worth ≥ $500,000 & Custom Owned Vehicle',
    points: 60,
    rewardText: 'Access to Private Vinewood Hangar / Garage'
  },
  {
    id: 'pillar_of_justice',
    title: 'Gavel of Truth',
    description: 'Presided over constitutional hearings and justice proceedings within the Department of Justice.',
    category: 'career',
    icon: 'Award',
    badgeColor: 'purple',
    rarity: 'epic',
    tier: 3,
    criteria: 'Department of Justice / Magistrate Authority',
    points: 80,
    rewardText: 'Seal of the San Andreas Superior Court'
  },
  {
    id: 'master_wrench',
    title: 'Master Craftsman',
    description: 'Certified automotive technician keeping the fleet of Los Santos tuned, repaired, and race-ready.',
    category: 'career',
    icon: 'Wrench',
    badgeColor: 'amber',
    rarity: 'common',
    tier: 1,
    criteria: 'Bennys or LS Customs Certified Mechanic',
    points: 30,
    rewardText: 'Hydraulic Lift Fast-Track'
  },
  {
    id: 'transit_titan',
    title: 'City Navigator',
    description: 'Expert urban driver connecting the boroughs of Los Santos safely behind the wheel of Downtown Cab Co.',
    category: 'career',
    icon: 'Compass',
    badgeColor: 'orange',
    rarity: 'common',
    tier: 1,
    criteria: 'Downtown Cab Co Driver / Dispatcher',
    points: 25,
    rewardText: 'Fare Multiplier Bonus'
  },
  {
    id: 'community_pillar',
    title: 'Server Community Pillar',
    description: 'Prestigious server staff commendation awarded for exemplary sportsmanship, welcoming newcomers, and great roleplay.',
    category: 'social',
    icon: 'Star',
    badgeColor: 'emerald',
    rarity: 'legendary',
    tier: 4,
    criteria: 'Special Staff Commendation or 150+ Hours Clean Record',
    points: 150,
    rewardText: 'Golden Community Star Badge & Discord VIP Role'
  }
];

// Helper to evaluate and return all achievement IDs a player qualifies for
export function evaluatePlayerAchievements(player: Player): string[] {
  const unlocked = new Set<string>(player.achievementIds || []);

  const totalWealth = (player.cash || 0) + (player.bank || 0);
  const lifetime = player.lifetimeEarnings || totalWealth;

  // 1. First Million Earned
  if (totalWealth >= 1000000 || lifetime >= 1000000) {
    unlocked.add('first_million');
  }

  // 2. 100 Hours Played
  if ((player.hoursPlayed || 0) >= 100) {
    unlocked.add('century_club');
  }

  // 3. 500 Hours Pioneer
  if ((player.hoursPlayed || 0) >= 500) {
    unlocked.add('veteran_500h');
  }

  // 4. Shield of San Andreas (Police)
  if (player.job === 'lspd' || player.job === 'bcso') {
    unlocked.add('guardian_shield');
  }

  // 5. Miracle Worker (EMS)
  if (player.job === 'ems') {
    unlocked.add('lifesaver');
  }

  // 6. Midnight Speed Demon
  if (player.vehicle && player.vehicle.speed >= 110) {
    unlocked.add('speed_demon');
  }

  // 7. Syndicate Kingpin
  if (player.job === 'gang') {
    unlocked.add('syndicate_kingpin');
  }

  // 8. Luxury Fleet Collector
  if (totalWealth >= 500000 && player.vehicle) {
    unlocked.add('fleet_master');
  }

  // 9. Gavel of Truth (DOJ)
  if (player.job === 'doj') {
    unlocked.add('pillar_of_justice');
  }

  // 10. Master Wrench
  if (player.job === 'mechanic') {
    unlocked.add('master_wrench');
  }

  // 11. Transit Titan
  if (player.job === 'taxi') {
    unlocked.add('transit_titan');
  }

  // 12. Community Pillar (Keep existing if awarded, or automatically if 150+ hours and clean)
  if ((player.hoursPlayed || 0) >= 150 && player.health === 100 && (player.achievementIds?.includes('community_pillar'))) {
    unlocked.add('community_pillar');
  }

  return Array.from(unlocked);
}

// Calculate total achievement score for a player
export function calculatePlayerScore(achievementIds: string[]): number {
  return achievementIds.reduce((total, id) => {
    const ach = SERVER_ACHIEVEMENTS.find(a => a.id === id);
    return total + (ach?.points || 0);
  }, 0);
}

// Player Tier Title based on achievement score
export function getPlayerTierTitle(score: number): { title: string; color: string; rank: string } {
  if (score >= 400) return { title: 'Living Legend', color: 'text-amber-400', rank: 'Tier IV - Grandmaster' };
  if (score >= 250) return { title: 'Server Veteran', color: 'text-purple-400', rank: 'Tier III - Luminary' };
  if (score >= 120) return { title: 'Distinguished Citizen', color: 'text-cyan-400', rank: 'Tier II - Established' };
  return { title: 'Rising Resident', color: 'text-slate-300', rank: 'Tier I - Novice' };
}
