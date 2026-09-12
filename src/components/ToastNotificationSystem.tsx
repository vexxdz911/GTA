import React, { useState, useEffect } from 'react';
import { ToastNotification } from '../types';
import { 
  Trophy, 
  Gift, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Clock, 
  Shield, 
  Car, 
  Zap, 
  Flame, 
  Award, 
  HeartPulse, 
  X, 
  ArrowRight,
  Info,
  Check
} from 'lucide-react';

interface ToastNotificationSystemProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

// Map achievement icon name to Lucide component
const getToastIcon = (type: string, iconName?: string) => {
  if (type === 'referral') {
    return <Gift className="w-5 h-5 text-emerald-400 animate-pulse" />;
  }
  
  switch (iconName) {
    case 'Trophy': return <Trophy className="w-5 h-5 text-amber-400" />;
    case 'Clock': return <Clock className="w-5 h-5 text-cyan-400" />;
    case 'Shield': return <Shield className="w-5 h-5 text-blue-400" />;
    case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-400" />;
    case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
    case 'Flame': return <Flame className="w-5 h-5 text-pink-400" />;
    case 'Car': return <Car className="w-5 h-5 text-purple-400" />;
    case 'Award': return <Award className="w-5 h-5 text-indigo-400" />;
    case 'Star': return <Star className="w-5 h-5 text-amber-400" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-emerald-400" />;
    default:
      return type === 'achievement' 
        ? <Trophy className="w-5 h-5 text-amber-400" /> 
        : <Info className="w-5 h-5 text-cyan-400" />;
  }
};

interface ToastItemProps {
  key?: React.Key;
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

// Single Toast Item with countdown progress bar and hover pause
function ToastItem({ 
  toast, 
  onDismiss 
}: ToastItemProps) {
  const duration = toast.durationMs || 5500;
  const [remaining, setRemaining] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = 50; // tick every 50ms
    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= interval) {
          clearInterval(timer);
          onDismiss(toast.id);
          return 0;
        }
        return prev - interval;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [toast.id, isPaused, duration, onDismiss]);

  const progressPercent = Math.max(0, (remaining / duration) * 100);

  const isAchievement = toast.type === 'achievement';
  const isReferral = toast.type === 'referral';

  return (
    <div
      id={`toast-item-${toast.id}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative overflow-hidden rounded-2xl border pointer-events-auto backdrop-blur-xl transition-all transform animate-in slide-in-from-right-8 duration-300 shadow-2xl ${
        isAchievement
          ? 'bg-slate-950/95 border-amber-500/70 shadow-[0_12px_40px_rgba(245,158,11,0.22)] ring-1 ring-amber-500/30'
          : isReferral
          ? 'bg-slate-950/95 border-emerald-500/70 shadow-[0_12px_40px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/30'
          : 'bg-slate-950/95 border-slate-700/80 shadow-xl'
      }`}
    >
      {/* Top radiant neon edge */}
      <div 
        className={`h-1 w-full ${
          isAchievement 
            ? 'bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500' 
            : isReferral
            ? 'bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500'
            : 'bg-blue-500'
        }`} 
      />

      <div className="p-4 flex flex-col gap-2.5">
        {/* Header Eyebrow Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span 
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wider uppercase flex items-center gap-1.5 ${
                isAchievement
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : isReferral
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {isAchievement && <Trophy className="w-3 h-3 text-amber-400" />}
              {isReferral && <Gift className="w-3 h-3 text-emerald-400" />}
              {toast.title}
            </span>

            {toast.points !== undefined && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                <Star className="w-2.5 h-2.5 fill-slate-950" />
                +{toast.points} AP
              </span>
            )}

            {toast.cashAmount !== undefined && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-sm">
                <DollarSign className="w-2.5 h-2.5 text-slate-950" />
                +${toast.cashAmount.toLocaleString()}
              </span>
            )}
          </div>

          <button
            id={`btn-dismiss-toast-${toast.id}`}
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Dismiss Notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex items-start gap-3">
          {/* Main Visual Badge Icon */}
          <div 
            className={`p-2.5 rounded-xl border shrink-0 flex items-center justify-center ${
              isAchievement
                ? 'bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border-amber-500/40 shadow-inner'
                : isReferral
                ? 'bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border-emerald-500/40 shadow-inner'
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            {getToastIcon(toast.type, toast.iconName)}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-white leading-tight font-sans">
              {toast.message}
            </h4>

            {toast.playerName && (
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Player: <strong className="text-slate-200">{toast.playerName}</strong>
              </p>
            )}

            {toast.details && (
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                {toast.details}
              </p>
            )}

            {/* Perk / Bonus Item callout */}
            {toast.perkText && (
              <div className="mt-2 text-[11px] font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Perk: {toast.perkText}</span>
              </div>
            )}

            {toast.bonusItem && (
              <div className="mt-2 text-[11px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Item: {toast.bonusItem}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button if provided */}
        {toast.onClickAction && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">
              Click to view details in dashboard
            </span>
            <button
              id={`btn-action-toast-${toast.id}`}
              onClick={() => {
                toast.onClickAction?.();
                onDismiss(toast.id);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isAchievement
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50'
                  : isReferral
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <span>{toast.actionLabel || 'Inspect Details'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Countdown Progress Bar */}
      <div className="h-1 bg-slate-900 w-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-75 ${
            isAchievement 
              ? 'bg-amber-400' 
              : isReferral
              ? 'bg-emerald-400'
              : 'bg-blue-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

export default function ToastNotificationSystem({
  toasts,
  onDismiss
}: ToastNotificationSystemProps) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div 
      id="toast-notification-system-container"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md w-[92vw] sm:w-[420px] pointer-events-none"
    >
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}
