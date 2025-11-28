
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';
import { SubscriptionDetail } from './components/SubscriptionDetail';
import { ConnectAccount } from './components/ConnectAccount';
import { SubscriptionList } from './components/SubscriptionList';
import { UpgradeModal } from './components/UpgradeModal';
import { Subscription, UserPlan, UserConsent } from './types';
import { MOCK_SUBSCRIPTIONS } from './services/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'connect'>('dashboard');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Monetization State
  const [userPlan, setUserPlan] = useState<UserPlan>('FREE');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Compliance State
  const [userConsent, setUserConsent] = useState<UserConsent>({
    essential: true,
    aiProcessing: false, // Must be opted-in
    sharedData: false,   // Must be opted-in
  });

  // Check system preference on load
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const handleNavigate = (view: 'dashboard' | 'list' | 'connect') => {
    setCurrentView(view);
    setSelectedSubscriptionId(null);
  };

  const handleSelectSubscription = (id: string) => {
    setSelectedSubscriptionId(id);
  };

  const handleCloseDetail = () => {
    setSelectedSubscriptionId(null);
  };

  const handleConnect = (newSubs: Subscription[]) => {
    setSubscriptions(prev => [...prev, ...newSubs]);
    setCurrentView('dashboard');
  };

  const handleConsentUpdate = (consent: UserConsent) => {
    setUserConsent(consent);
  };

  const handleUpgrade = () => {
    setUserPlan('PREMIUM');
    setShowUpgradeModal(false);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Layout 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        userPlan={userPlan}
        onOpenUpgrade={() => setShowUpgradeModal(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      >
        {currentView === 'dashboard' && !selectedSubscriptionId && (
          <Dashboard 
            subscriptions={subscriptions} 
            onSelectSubscription={handleSelectSubscription} 
          />
        )}
        
        {currentView === 'list' && !selectedSubscriptionId && (
          <SubscriptionList 
            subscriptions={subscriptions} 
            onSelectSubscription={handleSelectSubscription} 
          />
        )}

        {currentView === 'connect' && (
          <ConnectAccount 
            onConnect={handleConnect} 
            onConsentUpdate={handleConsentUpdate}
          />
        )}

        {selectedSubscriptionId && (
          <SubscriptionDetail 
            subscription={subscriptions.find(s => s.id === selectedSubscriptionId)!}
            onClose={handleCloseDetail}
            userPlan={userPlan}
            userConsent={userConsent}
            onOpenUpgrade={() => setShowUpgradeModal(true)}
            onUpdateConsent={(key) => setUserConsent(prev => ({ ...prev, [key]: true }))}
          />
        )}

        {showUpgradeModal && (
          <UpgradeModal 
            onClose={() => setShowUpgradeModal(false)}
            onUpgrade={handleUpgrade}
          />
        )}
      </Layout>
    </div>
  );
}