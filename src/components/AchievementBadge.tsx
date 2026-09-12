import React from 'react';
import { 
  Trophy, 
  Clock, 
  Sparkles, 
  Shield, 
  HeartPulse, 
  Zap, 
  Flame, 
  Car, 
  Award, 
  Wrench, 
  Compass, 
  Star 
} from 'lucide-react';
import { SERVER_ACHIEVEMENTS } from '../data/achievementsData';

interface AchievementBadgeProps {
  key?: React.Key;
  achievementId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
  isUnlocked?: boolean;
}

export const ACHIEVEMENT_ICON_MAP: Record<string, React.ElementType> = {
  Trophy,
  Clock,
  Sparkles,
  Shield,
  HeartPulse,
  Zap,
  Flame,
  Car,
  Award,
  Wrench,
  Compass,
  Star
};

export default function AchievementBadge({
  achievementId,
  size = 'sm',
  showLabel = false,
  onClick,
  isUnlocked = true
}: AchievementBadgeProps) {
  const achievement = SERVER_ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return null;

  const IconComponent = ACHIEVEMENT_ICON_MAP[achievement.icon] || Trophy;

  // Visual styling mapped to badgeColor and rarity
  const getColorStyles = (color: string, unlocked: boolean) => {
    if (!unlocked) {
      return {
        wrapper: 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-60 grayscale',
        glow: '',
        iconColor: 'text-slate-600',
        textColor: 'text-slate-500'
      };
    }

    switch (color) {
      case 'amber':
        return {
          wrapper: 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)] hover:border-amber-400 hover:bg-amber-500/20',
          glow: 'from-amber-500/20 to-yellow-500/0',
          iconColor: 'text-amber-400',
          textColor: 'text-amber-300'
        };
      case 'cyan':
        return {
          wrapper: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:border-cyan-400 hover:bg-cyan-500/20',
          glow: 'from-cyan-500/20 to-blue-500/0',
          iconColor: 'text-cyan-400',
          textColor: 'text-cyan-300'
        };
      case 'purple':
        return {
          wrapper: 'bg-purple-500/10 border-purple-500/40 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)] hover:border-purple-400 hover:bg-purple-500/20',
          glow: 'from-purple-500/20 to-pink-500/0',
          iconColor: 'text-purple-400',
          textColor: 'text-purple-300'
        };
      case 'rose':
        return {
          wrapper: 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)] hover:border-rose-400 hover:bg-rose-500/20',
          glow: 'from-rose-500/20 to-orange-500/0',
          iconColor: 'text-rose-400',
          textColor: 'text-rose-300'
        };
      case 'emerald':
        return {
          wrapper: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:border-emerald-400 hover:bg-emerald-500/20',
          glow: 'from-emerald-500/20 to-teal-500/0',
          iconColor: 'text-emerald-400',
          textColor: 'text-emerald-300'
        };
      case 'pink':
        return {
          wrapper: 'bg-pink-500/10 border-pink-500/40 text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.15)] hover:border-pink-400 hover:bg-pink-500/20',
          glow: 'from-pink-500/20 to-rose-500/0',
          iconColor: 'text-pink-400',
          textColor: 'text-pink-300'
        };
      case 'yellow':
        return {
          wrapper: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.15)] hover:border-yellow-400 hover:bg-yellow-500/20',
          glow: 'from-yellow-500/20 to-amber-500/0',
          iconColor: 'text-yellow-300',
          textColor: 'text-yellow-200'
        };
      case 'orange':
        return {
          wrapper: 'bg-orange-500/10 border-orange-500/40 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)] hover:border-orange-400 hover:bg-orange-500/20',
          glow: 'from-orange-500/20 to-red-500/0',
          iconColor: 'text-orange-400',
          textColor: 'text-orange-300'
        };
      case 'blue':
      default:
        return {
          wrapper: 'bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)] hover:border-blue-400 hover:bg-blue-500/20',
          glow: 'from-blue-500/20 to-indigo-500/0',
          iconColor: 'text-blue-400',
          textColor: 'text-blue-300'
        };
    }
  };

  const styles = getColorStyles(achievement.badgeColor, isUnlocked);

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const containerSizes = {
    xs: 'p-1 rounded text-[10px]',
    sm: 'p-1.5 rounded-md text-xs',
    md: 'p-2 rounded-lg text-xs',
    lg: 'p-3 rounded-xl text-sm'
  };

  // Special highlight for 'first_million' and 'century_club'
  const isSpecialHighlight = isUnlocked && (achievement.id === 'first_million' || achievement.id === 'century_club');

  return (
    <div
      id={`achievement-badge-${achievement.id}`}
      onClick={onClick}
      title={`${achievement.title} (${achievement.points} AP) - ${achievement.description}`}
      className={`relative group inline-flex items-center gap-1.5 border transition-all select-none cursor-pointer ${styles.wrapper} ${containerSizes[size]} ${
        isSpecialHighlight ? 'ring-1 ring-amber-400/40' : ''
      }`}
    >
      <IconComponent className={`${iconSizes[size]} ${styles.iconColor} shrink-0`} />
      
      {showLabel && (
        <span className={`font-mono font-bold whitespace-nowrap ${styles.textColor}`}>
          {achievement.title}
        </span>
      )}

      {/* Rarity Star Dot for Legendary/Epic */}
      {isUnlocked && (achievement.rarity === 'legendary' || achievement.rarity === 'epic') && (
        <span 
          className={`w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5 ${
            achievement.rarity === 'legendary' ? 'bg-amber-400 animate-pulse' : 'bg-purple-400'
          }`} 
        />
      )}
    </div>
  );
}
