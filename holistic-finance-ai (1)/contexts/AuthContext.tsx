import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { User, Session } from '@supabase/supabase-js';
import { SubscriptionStatus } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  premiumStatus: SubscriptionStatus;
  signIn: () => void;
  signOut: () => Promise<void>;
  upgradeSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [premiumStatus, setPremiumStatus] = useState<SubscriptionStatus>('inactive');

  useEffect(() => {
    if (!isSupabaseConfigured()) {
       // Demo mode: Do not attempt to connect to Supabase if keys are missing
       setLoading(false);
       return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
      if (!isSupabaseConfigured()) {
          // Demo Login
          setUser({ id: 'demo-user', email: 'demo@holisticfinance.ai' } as User);
          // Demo default status
          setPremiumStatus('inactive');
          return;
      }
      // Trigger Supabase OAuth or Email flow here
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setPremiumStatus('inactive');
  };

  const upgradeSubscription = async () => {
      setLoading(true);
      // Simulate Stripe Checkout delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPremiumStatus('active');
      setLoading(false);
  };

  const value = {
    session,
    user,
    loading,
    premiumStatus,
    signIn,
    signOut,
    upgradeSubscription
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};