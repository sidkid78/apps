
import React, { useEffect, useState } from 'react';
import { Subscription, AIAnalysisResult, UserPlan, SharedMember, UserConsent } from '../types';
import { analyzeSubscription } from '../services/geminiService';
import { X, ExternalLink, ShieldAlert, Sparkles, TrendingDown, Users, DollarSign, Mail, ChevronRight, Copy, Lock, ArrowRight, Check, AlertCircle, Plus, Trash2, HardDrive, Monitor, FileText } from 'lucide-react';

interface SubscriptionDetailProps {
  subscription: Subscription;
  onClose: () => void;
  userPlan: UserPlan;
  userConsent: UserConsent;
  onOpenUpgrade: () => void;
  onUpdateConsent: (key: keyof UserConsent) => void;
}

type CancelStep = 'initial' | 'tier2' | 'tier3';

export const SubscriptionDetail: React.FC<SubscriptionDetailProps> = ({ subscription, onClose, userPlan, userConsent, onOpenUpgrade, onUpdateConsent }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelStep, setCancelStep] = useState<CancelStep>('initial');
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Shared Subscription State
  const [sharedMembers, setSharedMembers] = useState<SharedMember[]>(subscription.sharedMembersList || []);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  const isFree = userPlan === 'FREE';
  const hasAIConsent = userConsent.aiProcessing;
  const hasSharedConsent = userConsent.sharedData;

  useEffect(() => {
    let mounted = true;
    const fetchAnalysis = async () => {
      // Only fetch analysis if consent is granted
      if (!hasAIConsent) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const result = await analyzeSubscription(subscription);
        if (mounted) setAnalysis(result);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAnalysis();
    return () => { mounted = false; };
  }, [subscription, hasAIConsent]);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Shared Management Logic
  const splitAmount = subscription.amount / (sharedMembers.length + 1); // +1 for the user

  const toggleMemberStatus = (memberId: string) => {
    setSharedMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, status: m.status === 'PAID' ? 'PENDING' : 'PAID' } : m
    ));
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const newMember: SharedMember = {
      id: `m-${Date.now()}`,
      name: newMemberName,
      status: 'PENDING',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMemberName}`
    };
    setSharedMembers([...sharedMembers, newMember]);
    setNewMemberName('');
    setIsAddingMember(false);
  };

  const handleRemoveMember = (id: string) => {
    setSharedMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleRequestRepayment = () => {
    const pendingAmount = sharedMembers.filter(m => m.status === 'PENDING').length * splitAmount;
    const venmoUrl = `https://venmo.com/?txn=charge&amount=${pendingAmount.toFixed(2)}&note=${encodeURIComponent(subscription.name + ' split')}`;
    window.open(venmoUrl, '_blank');
  };

  const renderCancelModal = () => (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cancel {subscription.name}</h3>
          <button onClick={() => setShowCancelModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {cancelStep === 'initial' && (
          <div className="space-y-3">
             <p className="text-slate-600 dark:text-slate-300">Choose how you would like to proceed with the cancellation.</p>
             
             <button 
               onClick={() => setCancelStep('tier2')}
               className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all text-left"
             >
               <div className="flex items-center">
                 <div className="bg-white dark:bg-slate-900 p-2 rounded-lg mr-3 shadow-sm border border-slate-100 dark:border-slate-700">
                   <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-slate-900 dark:text-white">View Guided Instructions</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Step-by-step guide for {subscription.merchant}</p>
                 </div>
               </div>
               <ChevronRight className="text-slate-300 dark:text-slate-600" />
             </button>

             <button 
               onClick={() => setCancelStep('tier3')}
               className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all text-left"
             >
               <div className="flex items-center">
                 <div className="bg-white dark:bg-slate-900 p-2 rounded-lg mr-3 shadow-sm border border-slate-100 dark:border-slate-700">
                   <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-slate-900 dark:text-white">Generate Email</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Auto-generated cancellation request</p>
                 </div>
               </div>
               <ChevronRight className="text-slate-300 dark:text-slate-600" />
             </button>
          </div>
        )}

        {cancelStep === 'tier2' && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm space-y-2 text-slate-700 dark:text-slate-300">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Instructions for {subscription.merchant}</h4>
              <p className="flex items-start"><span className="font-bold mr-2">1.</span> Go to {subscription.merchant}'s website and log in.</p>
              <p className="flex items-start"><span className="font-bold mr-2">2.</span> Navigate to Account Settings &gt; Billing.</p>
              <p className="flex items-start"><span className="font-bold mr-2">3.</span> Look for "Cancel Membership" or "Manage Subscription".</p>
              <p className="flex items-start"><span className="font-bold mr-2">4.</span> Follow the prompts to confirm cancellation.</p>
            </div>
            <button 
               onClick={() => window.open(`https://google.com/search?q=cancel ${subscription.merchant}`, '_blank')}
               className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Go to Website
            </button>
            <button onClick={() => setCancelStep('initial')} className="w-full py-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-sm">Back</button>
          </div>
        )}

        {cancelStep === 'tier3' && (
          <div className="space-y-4">
             <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm relative">
                <button onClick={() => copyToClipboard(`Subject: Cancellation Request - Account [INSERT ID]\n\nTo Whom It May Concern,\n\nPlease cancel my subscription for ${subscription.name} associated with my account. I would like this cancellation to be effective immediately.\n\nPlease confirm this cancellation via email.\n\nThank you.`)} className="absolute top-2 right-2 text-blue-600 dark:text-blue-400 p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded">
                  <Copy size={16} />
                </button>
                <p className="font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                  Subject: Cancellation Request - Account [INSERT ID]
                  <br/><br/>
                  To Whom It May Concern,
                  <br/><br/>
                  Please cancel my subscription for {subscription.name} associated with my account. I would like this cancellation to be effective immediately.
                  <br/><br/>
                  Please confirm this cancellation via email.
                  <br/><br/>
                  Thank you.
                </p>
             </div>
             <button 
               onClick={() => window.open(`mailto:support@${subscription.merchant.toLowerCase().replace(/\s/g, '')}.com?subject=Cancellation Request&body=Please cancel my subscription...`)}
               className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Open Email App
            </button>
             <button onClick={() => setCancelStep('initial')} className="w-full py-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-sm">Back</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out">
        <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Subscription Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-8 pb-32">
          {/* Header Info */}
          <div className="flex items-center space-x-4">
            <img src={subscription.logoUrl} alt={subscription.name} className="w-16 h-16 rounded-xl shadow-sm bg-slate-100 dark:bg-slate-800 object-cover" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{subscription.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">${subscription.amount.toFixed(2)} / {subscription.frequency}</p>
              {subscription.currentTier && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md">
                  {subscription.currentTier.name} Tier
                </span>
              )}
            </div>
          </div>

          {/* Usage Metrics (New: Input Data Visualization) */}
          {(subscription.currentTier?.maxStorageGB || subscription.currentTier?.maxSeats) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center">
                <Monitor className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
                Utilization Metrics
              </h3>
              
              {/* Storage Usage Bar */}
              {subscription.currentTier.maxStorageGB && subscription.usageStats?.dataUsageGB && (
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    <span className="flex items-center"><HardDrive size={12} className="mr-1"/> Storage</span>
                    <span>{subscription.usageStats.dataUsageGB}GB / {subscription.currentTier.maxStorageGB}GB</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (subscription.usageStats.dataUsageGB / subscription.currentTier.maxStorageGB) < 0.2 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(subscription.usageStats.dataUsageGB / subscription.currentTier.maxStorageGB) * 100}%` }}
                    ></div>
                  </div>
                  {(subscription.usageStats.dataUsageGB / subscription.currentTier.maxStorageGB) < 0.2 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">Underutilized: Less than 20% used.</p>
                  )}
                </div>
              )}

              {/* Seat Usage Bar */}
               {subscription.currentTier.maxSeats && subscription.usageStats?.activeSeats && (
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    <span className="flex items-center"><Users size={12} className="mr-1"/> Seats</span>
                    <span>{subscription.usageStats.activeSeats} / {subscription.currentTier.maxSeats} active</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${(subscription.usageStats.activeSeats / subscription.currentTier.maxSeats) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Insights Section */}
          <div className="relative">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-lg">AI Optimization Engine</h3>
            </div>

            {!hasAIConsent ? (
              // Privacy Lock State
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center">
                <div className="bg-slate-200 dark:bg-slate-700 p-3 rounded-full mb-3">
                  <ShieldAlert className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">AI Features Disabled</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-xs">You haven't granted permission for AI profiling. Enable this to see Usage Scores and savings.</p>
                <button 
                  onClick={() => onUpdateConsent('aiProcessing')}
                  className="px-5 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors"
                >
                  Enable AI Processing
                </button>
              </div>
            ) : loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                
                {/* 1. Potential Savings Hook - Always Visible */}
                {analysis.savingsPotential > 0 && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2 mb-1 text-emerald-700 dark:text-emerald-400">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-bold text-md">Potential Savings</span>
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-300 font-medium">We found a way to save you money.</p>
                    </div>
                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">${analysis.savingsPotential.toFixed(2)}<span className="text-sm font-normal">/mo</span></div>
                  </div>
                )}

                {/* 2. Gated Content Area (Premium Gate) */}
                <div className="relative">
                  {/* Gating Overlay for Free Plan */}
                  {isFree && (
                    <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/70 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center text-center p-6 border border-slate-100 dark:border-slate-800">
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg mb-3">
                        <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Unlock AI Insights</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-[200px]">Get detailed Usage Scores and actionable recommendations.</p>
                      <button 
                        onClick={onOpenUpgrade}
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all text-sm"
                      >
                        Upgrade to Premium
                      </button>
                    </div>
                  )}

                  {/* Content (Blurred if Free) */}
                  <div className={`space-y-4 ${isFree ? 'opacity-50 pointer-events-none select-none filter blur-[1px]' : ''}`}>
                    
                    {/* Usage Score Card */}
                    <div className={`p-5 rounded-xl border-l-4 shadow-sm ${
                      analysis.usageScore < 40 
                        ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500' 
                        : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold ${analysis.usageScore < 40 ? 'text-rose-700 dark:text-rose-400' : 'text-indigo-700 dark:text-indigo-400'}`}>
                          Usage Score: {analysis.usageScore}/100
                        </h4>
                        {analysis.usageScore < 40 && <ShieldAlert className="w-5 h-5 text-rose-500" />}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{analysis.usageAnalysis}</p>
                    </div>

                    {/* Recommendations Grid */}
                    <div className="space-y-4">
                      {/* Tier Opt */}
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2 text-indigo-600 dark:text-indigo-400">
                          <TrendingDown className="w-4 h-4" />
                          <span className="font-semibold text-sm">Tier Recommendation</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{analysis.tierRecommendation}</p>
                      </div>

                      {/* Affiliate / Value Comparison */}
                      {analysis.affiliateOffer ? (
                         <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border-2 border-indigo-100 dark:border-indigo-900 shadow-md">
                           <div className="flex items-center space-x-2 mb-3 text-indigo-700 dark:text-indigo-400">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-bold text-sm">Switch & Save (Partner Offer)</span>
                           </div>
                           <p className="text-sm text-slate-800 dark:text-slate-200 font-medium mb-1">{analysis.affiliateOffer.offerDescription}</p>
                           <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Partner: {analysis.affiliateOffer.partnerName}</p>
                           <button 
                            onClick={() => window.open(analysis.affiliateOffer?.link, '_blank')}
                            className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center justify-center"
                           >
                             View Offer <ArrowRight className="w-4 h-4 ml-1" />
                           </button>
                         </div>
                      ) : (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                          <div className="flex items-center space-x-2 mb-2 text-slate-700 dark:text-slate-300">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold text-sm">Value Comparison</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{analysis.competitorComparison}</p>
                        </div>
                      )}

                      {/* Bundle */}
                      {analysis.bundleOpportunity && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-xl border border-purple-100 dark:border-purple-800 shadow-sm">
                          <div className="flex items-center space-x-2 mb-2 text-purple-700 dark:text-purple-400">
                            <Users className="w-4 h-4" />
                            <span className="font-semibold text-sm">Bundle Opportunity</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{analysis.bundleOpportunity}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 dark:text-slate-400 text-center py-8">Analysis unavailable.</div>
            )}
          </div>

          {/* Shared Subscription Management */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 relative">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" /> 
              Shared Plan Management
            </h3>

            {!hasSharedConsent ? (
               <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                 <div className="flex items-center text-blue-800 dark:text-blue-300 text-sm">
                   <FileText className="w-4 h-4 mr-2" />
                   <span>Enable "Shared Data" to manage family plans.</span>
                 </div>
                 <button 
                   onClick={() => onUpdateConsent('sharedData')}
                   className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700"
                 >
                   Enable
                 </button>
               </div>
            ) : (
              <div className="relative">
                {isFree && (
                   <div className="absolute inset-0 z-20 bg-white/60 dark:bg-slate-900/70 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                      <button onClick={onOpenUpgrade} className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                        Upgrade to Manage Shared Plans
                      </button>
                   </div>
                )}

                <div className={`space-y-4 ${isFree ? 'opacity-40 blur-[1px]' : ''}`}>
                   
                   {/* Split Cost Card */}
                   <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-300">Total Monthly Cost</span>
                        <span className="font-bold text-slate-900 dark:text-white">${subscription.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-blue-700 dark:text-blue-400">
                        <span className="text-sm font-medium">Cost per Person ({sharedMembers.length + 1})</span>
                        <span className="font-bold text-lg">${splitAmount.toFixed(2)}</span>
                      </div>
                   </div>

                   {/* Member List */}
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 mb-1">
                        <span>Members</span>
                        <span>Status</span>
                      </div>
                      
                      {/* Self (User) */}
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg">
                         <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">ME</div>
                           <span className="font-medium text-slate-900 dark:text-white">You</span>
                         </div>
                         <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">PAID</span>
                      </div>

                      {/* Shared Members */}
                      {sharedMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg group">
                          <div className="flex items-center space-x-3">
                             {member.avatarUrl ? (
                               <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full" />
                             ) : (
                               <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">{member.name.charAt(0)}</div>
                             )}
                             <div>
                                <p className="font-medium text-slate-900 dark:text-white text-sm">{member.name}</p>
                                <p className="text-[10px] text-slate-400">{member.email || 'No email'}</p>
                             </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => toggleMemberStatus(member.id)}
                              className={`text-xs font-bold px-2 py-1 rounded-full border transition-colors ${
                                member.status === 'PAID' 
                                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50' 
                                  : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                              }`}
                            >
                              {member.status}
                            </button>
                            <button onClick={() => handleRemoveMember(member.id)} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/50 rounded transition-colors opacity-0 group-hover:opacity-100">
                               <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Member Input */}
                      {isAddingMember ? (
                         <div className="flex items-center p-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 rounded-lg animate-fade-in">
                            <input 
                              type="text" 
                              autoFocus
                              placeholder="Enter name..."
                              className="flex-1 text-sm outline-none px-2 bg-transparent text-slate-900 dark:text-white placeholder-slate-400"
                              value={newMemberName}
                              onChange={(e) => setNewMemberName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                            />
                            <button onClick={handleAddMember} className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                              <Check size={14} />
                            </button>
                            <button onClick={() => setIsAddingMember(false)} className="p-1 text-slate-400 hover:text-slate-600 ml-1">
                              <X size={14} />
                            </button>
                         </div>
                      ) : (
                         <button 
                           onClick={() => setIsAddingMember(true)}
                           className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 text-sm hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center"
                         >
                           <Plus size={16} className="mr-1" /> Add Member
                         </button>
                      )}
                   </div>

                   {/* Payment Actions */}
                   <div className="grid grid-cols-2 gap-3 mt-4">
                      <button 
                        onClick={handleRequestRepayment}
                        className="py-2.5 bg-[#008CFF] text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center justify-center shadow-sm"
                      >
                        Venmo Request
                      </button>
                      <button 
                        onClick={handleRequestRepayment} // Reuse logic for demo
                        className="py-2.5 bg-[#003087] text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center justify-center shadow-sm"
                      >
                        PayPal Request
                      </button>
                   </div>
                   
                   {sharedMembers.some(m => m.status === 'PENDING') && (
                     <div className="flex items-start text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg mt-2">
                        <AlertCircle size={14} className="mr-1.5 mt-0.5 shrink-0" />
                        <span>{sharedMembers.filter(m => m.status === 'PENDING').length} member(s) still owe you ${(sharedMembers.filter(m => m.status === 'PENDING').length * splitAmount).toFixed(2)}.</span>
                     </div>
                   )}

                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-4 pb-8 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <button 
              onClick={handleCancelClick}
              className="w-full py-3.5 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-700 transition-all flex justify-center items-center"
            >
              Cancel Subscription
            </button>
            <button className="w-full py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Pause Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
    
    {showCancelModal && renderCancelModal()}
    </>
  );
};