import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ui/Toast';
import { Trophy, Gift, Award, TrendingUp, Sparkles, CheckCircle2, Star, ArrowRight, Ticket, User } from 'lucide-react';

export default function CivicRewards() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const credits = user && user.civic_credits !== undefined ? user.civic_credits : 150;
  const verifiedFixes = user && user.verified_fixes !== undefined ? user.verified_fixes : 3;

  const [selectedReward, setSelectedReward] = useState(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const leaderboard = [
    { rank: 1, name: 'Eleanor Vance', fixes: 24, credits: 1200, badge: '🌟 Elite Guardian' },
    { rank: 2, name: 'Marcus Sterling', fixes: 19, credits: 950, badge: '🥇 Civic Champion' },
    { rank: 3, name: 'Sophia Chen', fixes: 15, credits: 750, badge: '🥈 Community Leader' },
    { rank: 4, name: 'David Miller', fixes: 12, credits: 600, badge: '🥉 Proactive Citizen' },
    { rank: 5, name: user ? user.full_name || user.email || 'You' : 'You (Demo Citizen)', fixes: verifiedFixes, credits: credits, badge: '⭐ Civic Contributor', isUser: true },
  ];

  const rewardsCatalog = [
    { id: 1, title: 'All-Day Municipal Parking Pass', credits: 100, desc: 'Free parking at any downtown municipal parking structure or street meter for a full 24 hours.', icon: <Trophy className="w-8 h-8 text-amber-500" /> },
    { id: 2, title: 'Weekly City Transit Voucher', credits: 200, desc: 'Full access pass to municipal bus lines, subway networks, and light rail systems for seven consecutive days.', icon: <Ticket className="w-8 h-8 text-blue-600" /> },
    { id: 3, title: 'Annual Property Tax Raffle Entry', credits: 350, desc: 'One official entry into the municipal end-of-year raffle for a $1,000 property tax deduction credit.', icon: <Award className="w-8 h-8 text-emerald-600" /> },
    { id: 4, title: 'VIP Community Center Day Pass', credits: 150, desc: 'Exclusive access to city recreational centers, swimming pools, tennis courts, and fitness facilities.', icon: <Star className="w-8 h-8 text-violet-600" /> },
  ];

  const handleRedeem = (reward) => {
    if (!user) {
      showToast('Please log in to redeem civic rewards.', 'warning');
      return;
    }
    if (credits < reward.credits) {
      showToast(`Insufficient Civic Credits. You need ${reward.credits} credits to redeem this reward.`, 'error');
      return;
    }
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedemption = () => {
    setShowRedeemModal(false);
    showToast(`Success! You have officially redeemed the "${selectedReward.title}". Your voucher code has been dispatched to your email!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 animate-fade-in">
      {/* Premium Hero Section */}
      <div className="mb-12 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-[2.5rem] p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Civic Gamification Engine</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
            Earn Civic Credits & Impact Rewards
          </h1>
          <p className="text-amber-50 text-base sm:text-lg leading-relaxed mb-8">
            Every time an issue you report gets fully resolved and verified by municipal engineers, you earn 50 Civic Credits. Redeem your points for exclusive city perks, parking passes, transit vouchers, and property tax raffle entries!
          </p>

          {/* Quick User Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl bg-slate-900/20 backdrop-blur-md p-6 rounded-3xl border border-white/20">
            <div>
              <p className="text-xs font-semibold text-amber-100 uppercase tracking-wider mb-1">Your Civic Credits</p>
              <p className="text-3xl font-black text-white flex items-center gap-1.5">
                <span>🏆</span>
                <span>{credits}</span>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-100 uppercase tracking-wider mb-1">Verified Fixes</p>
              <p className="text-3xl font-black text-white flex items-center gap-1.5">
                <span>✅</span>
                <span>{verifiedFixes}</span>
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold text-amber-100 uppercase tracking-wider mb-1">City Leaderboard</p>
              <p className="text-3xl font-black text-white flex items-center gap-1.5">
                <span>⭐</span>
                <span>Rank #5</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Rewards Catalog */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Gift className="w-6 h-6 text-amber-500" />
              <span>Redeemable Municipal Rewards</span>
            </h2>
            <p className="text-sm text-slate-500 mb-6">Choose from our curated catalog of municipal perks and community access vouchers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewardsCatalog.map((rew) => (
              <div key={rew.id} className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {rew.icon}
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{rew.title}</h3>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs rounded-xl mb-4">
                    <span>🏆</span>
                    <span>{rew.credits} Credits</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{rew.desc}</p>
                </div>

                <button
                  onClick={() => handleRedeem(rew)}
                  className={`w-full py-3 rounded-2xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 ${
                    credits >= rew.credits
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{credits >= rew.credits ? 'Redeem Reward Now' : `Locked (${rew.credits} Credits Reqd)`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Top Contributor Leaderboard */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-blue-600" />
              <span>Civic Leaderboard</span>
            </h2>
            <p className="text-sm text-slate-500 mb-6">Top proactive citizens driving verified change this month.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            {leaderboard.map((lb) => (
              <div
                key={lb.rank}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  lb.isUser ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm' : 'bg-slate-50/70 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center flex-shrink-0 ${
                    lb.rank === 1 ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' :
                    lb.rank === 2 ? 'bg-slate-300 text-slate-800' :
                    lb.rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-white border border-slate-200 text-slate-600'
                  }`}>
                    #{lb.rank}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${lb.isUser ? 'text-amber-900 font-extrabold' : 'text-slate-900'}`}>
                      {lb.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{lb.badge}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-slate-900">{lb.credits} pts</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{lb.fixes} fixes</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-7 rounded-3xl shadow-lg relative overflow-hidden">
            <h3 className="text-lg font-bold mb-2">How are credits verified?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              When a municipal engineer inspects your reported issue and successfully transitions the status to <strong>RESOLVED</strong>, our automated ledger instantly credits your account.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
            >
              <span>Report an Issue & Earn →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Redemption Confirmation Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRedeemModal(false)} />
          <div className="ui-card relative w-full max-w-md p-7 animate-fade-in-up bg-white text-slate-900 text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Redemption</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              You are about to redeem <strong>{selectedReward.credits} Civic Credits</strong> for the <strong>{selectedReward.title}</strong>.
            </p>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-amber-800 text-left mb-6 space-y-1">
              <p className="font-bold flex items-center gap-1"><Sparkles className="w-4 h-4 text-amber-500" /> Immediate Dispatch</p>
              <p>Your official municipal voucher code and QR access pass will be instantly emailed to your registered address upon confirmation.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRedeemModal(false)}
                className="px-5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRedemption}
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 rounded-xl transition-all shadow-md shadow-amber-500/25 flex-1"
              >
                Confirm Redeem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
