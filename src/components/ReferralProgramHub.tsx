import { useState, FormEvent } from 'react';
import { 
  ReferralTier, 
  ReferredPlayerRecord, 
  ReferralRewardItem 
} from '../types';
import { 
  STARTER_REFERRAL_TIERS, 
  NEW_PLAYER_WELCOME_PACKAGE, 
  INITIAL_REFERRED_PLAYERS 
} from '../data/referralData';
import { 
  Users, 
  Gift, 
  Copy, 
  Check, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  Zap, 
  Car, 
  Shield, 
  Package, 
  Share2, 
  AlertCircle, 
  RefreshCw, 
  Award,
  ArrowRight,
  TrendingUp,
  Key
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface ReferralProgramHubProps {
  playerCash: number;
  onAddCash: (amount: number) => void;
  onCreditReferralBonus?: (details: {
    amount: number;
    referredPlayerName: string;
    referrerName?: string;
    bonusItem?: string;
    method?: string;
    isWelcomeBonus?: boolean;
  }) => void;
}

export default function ReferralProgramHub({
  playerCash,
  onAddCash,
  onCreditReferralBonus
}: ReferralProgramHubProps) {
  // My Invite Code state
  const [myInviteCode, setMyInviteCode] = useState<string>('VICE-9402');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Referred players ledger
  const [referredPlayers, setReferredPlayers] = useState<ReferredPlayerRecord[]>(INITIAL_REFERRED_PLAYERS);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'overview' | 'invite' | 'redeem' | 'tiers'>('overview');

  // Redemption input states
  const [inputRedeemCode, setInputRedeemCode] = useState<string>('');
  const [newPlayerNameInput, setNewPlayerNameInput] = useState<string>('');
  const [verificationMethod, setVerificationMethod] = useState<'Discord OAuth' | 'Steam VAC' | 'Phone SMS' | 'CFX FiveM Token'>('Discord OAuth');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    soundEffects.playBeep(850, 0.06);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Derived counts
  const totalInvites = referredPlayers.length;
  const verifiedCount = referredPlayers.filter(p => p.status === 'verified' || p.status === 'claimed').length;
  const pendingCount = referredPlayers.filter(p => p.status === 'pending').length;
  const totalEarnings = referredPlayers
    .filter(p => p.referrerRewardClaimed)
    .reduce((sum, p) => sum + p.cashBonusAwarded, 0);

  // Current tier calculation
  const currentTier = STARTER_REFERRAL_TIERS.reduce((prev, curr) => {
    return verifiedCount >= curr.minReferrals ? curr : prev;
  }, STARTER_REFERRAL_TIERS[0]);

  const nextTier = STARTER_REFERRAL_TIERS.find(t => t.minReferrals > verifiedCount);
  const referralsNeededForNext = nextTier ? nextTier.minReferrals - verifiedCount : 0;

  // Copy code to clipboard
  const handleCopyCode = () => {
    soundEffects.playBeep(880, 0.05);
    navigator.clipboard.writeText(myInviteCode);
    setCopiedCode(true);
    showToast(`Invite code ${myInviteCode} copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy referral link
  const handleCopyLink = () => {
    soundEffects.playBeep(880, 0.05);
    const link = `https://vicecity.gta-server.net/join?ref=${myInviteCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast(`Referral join link copied to clipboard!`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Generate a new custom or randomized invite code
  const handleGenerateNewCode = () => {
    soundEffects.playBeep(920, 0.08);
    const prefixes = ['VICE', 'LEON', 'MIAMI', 'GATOR', 'PALM', 'TURBO'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomDigits = Math.floor(Math.random() * 9000 + 1000);
    const newCode = `${randomPrefix}-${randomDigits}`;
    setMyInviteCode(newCode);
    showToast(`Generated new unique referral invite code: ${newCode}`);
  };

  // Simulate verification of a pending referral by admin / server automated security checks
  const handleSimulateVerifyPlayer = (recordId: string) => {
    soundEffects.playBeep(980, 0.1);
    const target = referredPlayers.find(p => p.id === recordId);
    if (!target) return;

    const rewardCash = currentTier.cashRewardPerReferral;
    const bonusItem = currentTier.exclusiveBonusItem.name;

    setReferredPlayers(prev => prev.map(p => {
      if (p.id === recordId) {
        return {
          ...p,
          status: 'verified',
          referrerRewardClaimed: true,
          newPlayerRewardClaimed: true,
          bonusItemAwarded: bonusItem,
          cashBonusAwarded: rewardCash
        };
      }
      return p;
    }));

    // Credit in-game cash to referrer
    onAddCash(rewardCash);

    // Trigger immediate visual feedback toast
    if (onCreditReferralBonus) {
      onCreditReferralBonus({
        amount: rewardCash,
        referredPlayerName: target.newPlayerName,
        referrerName: 'You (Referrer)',
        bonusItem: bonusItem,
        method: target.verificationMethod,
        isWelcomeBonus: false
      });
    }

    showToast(`Account verified! Credited +$${rewardCash.toLocaleString()} to your wallet & unlocked "${bonusItem}"!`);
  };

  // Quick simulate a brand new referral joining and getting verified
  const handleQuickSimulateNewReferralBonus = () => {
    soundEffects.playRadioChirp();
    const sampleNames = ['Marcus_Vance', 'Chloe_Decker', 'Dexter_Morgan', 'Tommy_Vercetti', 'Mia_Torres', 'Enzo_Ferrari'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)] + '_' + Math.floor(Math.random() * 90 + 10);
    const rewardCash = currentTier.cashRewardPerReferral;
    const bonusItem = currentTier.exclusiveBonusItem.name;

    const newRecord: ReferredPlayerRecord = {
      id: `ref_sim_${Date.now().toString().slice(-4)}`,
      inviteCode: myInviteCode,
      newPlayerName: randomName,
      newPlayerDiscord: `${randomName.toLowerCase()}#${Math.floor(Math.random() * 9000 + 1000)}`,
      joinedAt: 'Just now',
      status: 'verified',
      verificationMethod: 'Discord OAuth',
      referrerRewardClaimed: true,
      newPlayerRewardClaimed: true,
      bonusItemAwarded: bonusItem,
      cashBonusAwarded: rewardCash
    };

    setReferredPlayers(prev => [newRecord, ...prev]);
    onAddCash(rewardCash);

    if (onCreditReferralBonus) {
      onCreditReferralBonus({
        amount: rewardCash,
        referredPlayerName: randomName,
        referrerName: 'You (Referrer)',
        bonusItem: bonusItem,
        method: 'Discord OAuth',
        isWelcomeBonus: false
      });
    }

    showToast(`Simulated referral verified! Credited +$${rewardCash.toLocaleString()} referral bonus!`);
  };

  // Redeem code as a newly arriving player
  const handleRedeemCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    setRedeemError(null);
    setRedeemSuccess(null);

    const cleanCode = inputRedeemCode.trim().toUpperCase();
    const playerName = newPlayerNameInput.trim() || 'Newbie_Citizen';

    if (!cleanCode) {
      setRedeemError('Please enter a valid referral invite code.');
      soundEffects.playBeep(320, 0.1);
      return;
    }

    if (cleanCode.length < 4) {
      setRedeemError('Invite codes must be at least 4 alphanumeric characters.');
      soundEffects.playBeep(320, 0.1);
      return;
    }

    setIsVerifying(true);
    soundEffects.playRadioChirp();

    setTimeout(() => {
      setIsVerifying(false);

      // Create new record in referral system
      const newRecordId = `ref_${Date.now().toString().slice(-4)}`;
      const rewardCash = NEW_PLAYER_WELCOME_PACKAGE.cashBonus;
      const starterBonusItem = `${NEW_PLAYER_WELCOME_PACKAGE.starterItems[0].name} + 48h 2x XP`;

      const newRecord: ReferredPlayerRecord = {
        id: newRecordId,
        inviteCode: cleanCode,
        newPlayerName: playerName,
        newPlayerDiscord: `${playerName.toLowerCase()}#${Math.floor(Math.random() * 9000 + 1000)}`,
        joinedAt: 'Just now',
        status: 'verified',
        verificationMethod: verificationMethod,
        referrerRewardClaimed: true,
        newPlayerRewardClaimed: true,
        bonusItemAwarded: starterBonusItem,
        cashBonusAwarded: currentTier.cashRewardPerReferral
      };

      setReferredPlayers(prev => [newRecord, ...prev]);

      // Credit cash bonus directly to player's wallet balance
      onAddCash(rewardCash);

      // Trigger immediate visual feedback toast
      if (onCreditReferralBonus) {
        onCreditReferralBonus({
          amount: rewardCash,
          referredPlayerName: playerName,
          bonusItem: starterBonusItem,
          method: verificationMethod,
          isWelcomeBonus: true
        });
      }

      setRedeemSuccess(`Verification successful via ${verificationMethod}! You received +$${rewardCash.toLocaleString()} in-game cash, "${NEW_PLAYER_WELCOME_PACKAGE.starterItems[0].name}", and 48-Hour Double Career XP!`);
      setInputRedeemCode('');
      setNewPlayerNameInput('');
    }, 1200);
  };

  // Helper icon for items
  const renderItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car': return <Car className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Package': return <Package className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Gift': return <Gift className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  return (
    <div id="referral-program-hub" className="flex-1 flex flex-col gap-5">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-emerald-500/40 text-emerald-400 shadow-md">
              <Users className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  PLAYER REFERRAL & REWARDS
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-sky-300 bg-sky-950/80 border border-sky-800/60">
                  VERIFIED ONLY
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase font-sans mt-0.5">
                Player Referral Program & Dual Rewards Hub
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                Invite friends with your unique code. Both you and newly verified players receive exclusive in-game cash deposits, custom cosmetics, and tiered unlocks upon successful account verification.
              </p>
            </div>
          </div>

          {/* Quick Wallet & Referral Metrics */}
          <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 p-2.5 px-4 rounded-xl font-mono text-xs shadow-inner">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Your In-Game Balance</span>
              <span className="text-emerald-400 font-black text-base sm:text-lg">
                ${playerCash.toLocaleString()}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Referral Earnings</span>
              <span className="text-amber-400 font-black text-base sm:text-lg">
                ${totalEarnings.toLocaleString()}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Verified Friends</span>
              <span className="text-sky-400 font-black text-base sm:text-lg">
                {verifiedCount} <span className="text-[10px] text-slate-500">/ {totalInvites}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('overview');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Referrals Ledger ({totalInvites})</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('invite');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'invite'
                ? 'bg-sky-600 text-white font-bold shadow-lg shadow-sky-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>My Invite Code & Link</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('redeem');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'redeem'
                ? 'bg-amber-600 text-white font-bold shadow-lg shadow-amber-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Redeem Code (New Player)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playBeep(700, 0.03);
              setActiveTab('tiers');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'tiers'
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Reward Tiers & Milestones</span>
          </button>
        </div>
      </div>

      {/* Toast alert */}
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-lg text-xs font-mono flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* 1. OVERVIEW & REFERRALS LEDGER TAB */}
      {/* ==================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Quick Stats & Current Tier Progress (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Tier Progress Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Current Recruiter Rank
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${currentTier.badgeColor}`}>
                  Tier {currentTier.tierLevel}: {currentTier.title}
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-300">Reward per verified friend:</span>
                <span className="text-emerald-400 font-bold text-sm">+${currentTier.cashRewardPerReferral.toLocaleString()}</span>
              </div>

              {/* Progress to next tier */}
              {nextTier ? (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Next Rank: <strong className="text-white">{nextTier.title}</strong></span>
                    <span className="text-sky-400 font-bold">{verifiedCount} / {nextTier.minReferrals}</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-sky-500 h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (verifiedCount / nextTier.minReferrals) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 block">
                    Verify {referralsNeededForNext} more player{referralsNeededForNext > 1 ? 's' : ''} to unlock <strong className="text-amber-400">{nextTier.exclusiveBonusItem.name}</strong>.
                  </span>
                </div>
              ) : (
                <div className="p-2.5 bg-slate-950 rounded-lg border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Maximum "Vice City Kingpin" Rank Achieved!</span>
                </div>
              )}

              {/* Active Tier Perk */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5 mt-1">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                  {renderItemIcon(currentTier.exclusiveBonusItem.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{currentTier.exclusiveBonusItem.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">({currentTier.exclusiveBonusItem.valueDisplay})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {currentTier.exclusiveBonusItem.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Share Code Widget */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase font-mono flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-sky-400" />
                Active Referral Code
              </span>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-950 border border-sky-500/40 rounded-xl p-2.5 text-center font-mono font-black text-lg text-sky-300 tracking-wider">
                  {myInviteCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-2.5 bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-400">
                <span>Both receive instant rewards upon verification</span>
                <button
                  onClick={handleGenerateNewCode}
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-[11px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate New</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Referred Players Table & Verification Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Referred Accounts Activity Ledger
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    Track verification status and claim your referrer rewards
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <button
                    id="btn-simulate-new-referral"
                    onClick={handleQuickSimulateNewReferralBonus}
                    className="px-2.5 py-1 rounded bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    title="Simulate a new friend joining and verifying with your invite code to test the immediate toast notification feedback"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+ Simulate Referral Bonus</span>
                  </button>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {verifiedCount} Verified
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {pendingCount} Pending
                  </span>
                </div>
              </div>

              {/* Player Cards */}
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {referredPlayers.map(record => {
                  const isVerified = record.status === 'verified' || record.status === 'claimed';

                  return (
                    <div
                      key={record.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                        isVerified
                          ? 'bg-slate-950/80 border-emerald-500/30'
                          : 'bg-slate-950/60 border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white font-mono">{record.newPlayerName}</span>
                            <span className="text-[11px] font-mono text-slate-400">{record.newPlayerDiscord}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-slate-400">
                            <span>Joined {record.joinedAt}</span>
                            <span>•</span>
                            <span className="text-sky-400">Via {record.verificationMethod}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isVerified ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              VERIFIED & CLAIMED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              PENDING VERIFICATION
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Rewards Details */}
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Gift className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[11px] text-slate-300">
                            Bonus: <strong className="text-white">{record.bonusItemAwarded}</strong>
                          </span>
                        </div>

                        {isVerified ? (
                          <span className="text-emerald-400 font-bold text-xs">
                            +${record.cashBonusAwarded.toLocaleString()} In-Game Cash
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSimulateVerifyPlayer(record.id)}
                            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-all shadow active:scale-95"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Simulate Verification & Claim</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. INVITE CODE & SHARE LINK TAB */}
      {/* ==================================================== */}
      {activeTab === 'invite' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-6 flex flex-col gap-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Share2 className="w-4 h-4 text-sky-400" />
                Invite Friends & Earn Rewards
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Distribute your custom invite code across Discord, Twitch, TikTok, or Steam groups.
              </p>
            </div>
            <button
              onClick={handleGenerateNewCode}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: Direct Invite Code */}
            <div className="p-4 sm:p-5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  Direct In-Game Code
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Share this code with players at registration
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  New players enter this code during character creation or at any City Hall / Police kiosk to link their account.
                </p>

                <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-sky-500/40 flex items-center justify-between">
                  <span className="font-mono font-black text-2xl text-sky-300 tracking-wider">
                    {myInviteCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 font-mono text-xs text-slate-400 flex items-center justify-between">
                <span>Verification window: 7 Days</span>
                <span className="text-emerald-400 font-bold">100% Guaranteed Payout</span>
              </div>
            </div>

            {/* Box 2: Direct Join Webhook Link */}
            <div className="p-4 sm:p-5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  Web Browser & FiveM Deep Link
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  One-Click Server Direct Connect URL
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Auto-opens FiveM client, downloads server cache, and pre-fills your referral tracking code automatically.
                </p>

                <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-emerald-500/40 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-emerald-400 truncate">
                    https://vicecity.gta-server.net/join?ref={myInviteCode}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 font-mono text-xs text-slate-400 flex items-center justify-between">
                <span>CFX Protocol auto-bind</span>
                <span className="text-sky-400 font-bold">FiveM v2026 Compatible</span>
              </div>
            </div>
          </div>

          {/* How It Works 3-Step Strip */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Referral Protocol Flow:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-slate-900 border border-sky-500/40 text-sky-400 flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-white block">Share Unique Code</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                    Send your code to friends or social followers joining Vice City RP.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-slate-900 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-white block">Security Verification</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                    New player connects and authenticates via Discord OAuth, Steam VAC, or CFX token.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-white block">Dual Reward Delivery</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                    Both parties instantly receive bank deposits, starter gear, and XP boosters.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. REDEEM CODE (NEW PLAYER VERIFICATION) TAB */}
      {/* ==================================================== */}
      {activeTab === 'redeem' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  New Player Code Redemption & Verification
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Enter an invite code from an existing citizen to claim your $15,000 starter bank deposit and welcome bundle.
                </p>
              </div>

              <form onSubmit={handleRedeemCodeSubmit} className="space-y-4">
                {/* Code input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 block">
                    Invite Code:
                  </label>
                  <input
                    type="text"
                    value={inputRedeemCode}
                    onChange={(e) => setInputRedeemCode(e.target.value)}
                    placeholder="e.g. VICE-9402"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-sm text-amber-300 uppercase tracking-wider focus:outline-none focus:border-amber-500/80 transition-colors"
                  />
                  <span className="text-[11px] font-mono text-slate-500">
                    Case-insensitive. Provided by your recruiting friend or sponsor.
                  </span>
                </div>

                {/* Player Character Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 block">
                    Your Character Name:
                  </label>
                  <input
                    type="text"
                    value={newPlayerNameInput}
                    onChange={(e) => setNewPlayerNameInput(e.target.value)}
                    placeholder="e.g. Marcus_Vance"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-sky-500/80 transition-colors"
                  />
                </div>

                {/* Verification method select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 block">
                    Account Verification Method (Anti-Sybil / Alt Protection):
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { id: 'Discord OAuth', label: 'Discord OAuth', icon: ShieldCheck },
                      { id: 'Steam VAC', label: 'Steam VAC Token', icon: Shield },
                      { id: 'Phone SMS', label: 'SMS 2FA Code', icon: Key },
                      { id: 'CFX FiveM Token', label: 'CFX FiveM License', icon: Zap }
                    ].map(method => {
                      const Icon = method.icon;
                      const isSelected = verificationMethod === method.id;

                      return (
                        <button
                          type="button"
                          key={method.id}
                          onClick={() => setVerificationMethod(method.id as any)}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Alerts */}
                {redeemError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{redeemError}</span>
                  </div>
                )}

                {redeemSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-mono flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{redeemSuccess}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-sm font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Security Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Claim Welcome Rewards</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* What New Players Receive Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-400" />
                New Player Welcome Package
              </h3>

              {/* Big Cash Card */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-500/30 text-left font-mono">
                <span className="text-[10px] text-slate-400 block uppercase">Instant Bank Deposit</span>
                <span className="text-2xl font-black text-emerald-400">
                  +${NEW_PLAYER_WELCOME_PACKAGE.cashBonus.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Credited immediately to personal Maze Bank account</span>
              </div>

              {/* Items included */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Bonus Items & Perks Unlocked:
                </span>
                {NEW_PLAYER_WELCOME_PACKAGE.starterItems.map(item => (
                  <div key={item.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-sky-400 shrink-0">
                      {renderItemIcon(item.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400">{item.valueDisplay}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Included Perks Checklist */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 font-mono text-xs">
                {NEW_PLAYER_WELCOME_PACKAGE.perks.map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. REWARD TIERS & RECRUITER MILESTONES TAB */}
      {/* ==================================================== */}
      {activeTab === 'tiers' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-6 flex flex-col gap-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Recruiter Tier Progression & Milestone Rewards
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Every verified referral increases your recruitment rank and unlocks permanent exclusive vehicles, weapon skins, and queue priority passes.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
              Current Rank: Tier {currentTier.tierLevel} ({currentTier.title})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STARTER_REFERRAL_TIERS.map(tier => {
              const isUnlocked = verifiedCount >= tier.minReferrals;
              const isCurrent = currentTier.tierLevel === tier.tierLevel;

              return (
                <div
                  key={tier.tierLevel}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                    isCurrent
                      ? 'bg-slate-950 border-amber-500/80 shadow-xl ring-1 ring-amber-500/40'
                      : isUnlocked
                      ? 'bg-slate-950/90 border-emerald-500/40'
                      : 'bg-slate-950/50 border-slate-800 opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${tier.badgeColor}`}>
                        Tier {tier.tierLevel}
                      </span>
                      {isUnlocked ? (
                        <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs font-mono">
                          Requires {tier.minReferrals} Friends
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white mt-2">{tier.title}</h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold block mt-0.5">
                      +${tier.cashRewardPerReferral.toLocaleString()} / referral
                    </span>

                    {/* Milestone Item */}
                    <div className="mt-3 p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-950 text-amber-400">
                          {renderItemIcon(tier.exclusiveBonusItem.iconName)}
                        </div>
                        <span className="text-xs font-bold text-white leading-tight">
                          {tier.exclusiveBonusItem.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {tier.exclusiveBonusItem.description}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 block font-bold">
                        Rarity: {tier.exclusiveBonusItem.rarity} ({tier.exclusiveBonusItem.valueDisplay})
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                    {tier.minReferrals === 0 ? 'Starting tier' : `Unlocked at ${tier.minReferrals} verified referrals`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
