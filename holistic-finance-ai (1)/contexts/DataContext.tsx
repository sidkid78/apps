
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, Transaction, TargetAllocation, RiskProfile, TradeInstruction, TaxInsight, Investment, BillingTransaction } from '../types';
import { mockAccounts, mockTransactions, getNewLinkedAccount, mockTargetAllocation, mockRiskProfile, mockTaxInsights, mockInvestments } from '../services/mockData';
import { calculateNetWorth, checkAndRebalance, analyzeBehavioralRisk, runTaxOptimization, processDividendReinvestment, calculateDailyAUMFee } from '../services/financialEngine';

interface DataContextType {
  accounts: Account[];
  transactions: Transaction[];
  investments: Investment[];
  targetAllocation: TargetAllocation;
  riskProfile: RiskProfile;
  tradeInstructions: TradeInstruction[];
  taxInsights: TaxInsight[];
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  billingHistory: BillingTransaction[];
  linkAccount: (institutionName: string) => Promise<void>;
  runRebalance: () => void;
  runRiskAnalysis: () => void;
  runTaxAnalysis: () => void;
  simulateDividend: () => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [targetAllocation, setTargetAllocation] = useState<TargetAllocation>(mockTargetAllocation);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>(mockRiskProfile);
  const [tradeInstructions, setTradeInstructions] = useState<TradeInstruction[]>([]);
  const [taxInsights, setTaxInsights] = useState<TaxInsight[]>(mockTaxInsights);
  const [billingHistory, setBillingHistory] = useState<BillingTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Derived Financial Health
  const { netWorth, assets, liabilities } = calculateNetWorth(accounts);

  // Generate Mock Billing History using AUM Engine
  useEffect(() => {
    const history: BillingTransaction[] = [];
    const today = new Date();
    const fee = calculateDailyAUMFee(assets); // Calculate fee based on current assets

    // Generate last 3 months of subscription + recent AUM fees
    for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        history.push({
            id: `sub-${i}`,
            date: date.toISOString().split('T')[0],
            amount: 29.99,
            description: 'Holistic AI Premium Subscription',
            status: 'paid'
        });
    }

    // Add today's daily AUM fee accrual (simulated)
    history.push({
        id: 'aum-fee-daily',
        date: today.toISOString().split('T')[0],
        amount: fee,
        description: 'Daily AUM Fee (0.25% annualized)',
        status: 'pending'
    });

    setBillingHistory(history);
  }, [assets]);


  const linkAccount = async (institutionName: string) => {
    setIsLoading(true);
    // Simulate API delay for Plaid exchange and data sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { accounts: newAccounts, transactions: newTx } = getNewLinkedAccount(institutionName);
    
    setAccounts(prev => [...prev, ...newAccounts]);
    setTransactions(prev => [...newTx, ...prev]);
    setIsLoading(false);
  };

  const runRebalance = () => {
      const instructions = checkAndRebalance(accounts, targetAllocation);
      setTradeInstructions(instructions);
  };

  const runRiskAnalysis = () => {
      setIsLoading(true);
      setTimeout(() => {
          const newProfile = analyzeBehavioralRisk(transactions, riskProfile);
          setRiskProfile(newProfile);
          
          // Auto-adjust target based on risk for demo visualization
          setTargetAllocation(prev => ({
              ...prev,
              allocation: {
                  ...prev.allocation,
                  equity: newProfile.equityTarget,
                  bonds: Math.max(0, 0.9 - newProfile.equityTarget) // Simplified adjustment
              }
          }));

          setIsLoading(false);
      }, 1500);
  };

  const runTaxAnalysis = () => {
    setIsLoading(true);
    setTimeout(() => {
      const insights = runTaxOptimization(transactions, investments);
      setTaxInsights(insights);
      setIsLoading(false);
    }, 1200);
  };

  const simulateDividend = () => {
      const newDividend: Transaction = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          description: 'Vanguard ETF Dividend',
          amount: 450.00,
          category: 'Dividend',
          type: 'credit'
      };

      setTransactions(prev => [newDividend, ...prev]);
      
      // Reactive Trigger logic
      const dripInstruction = processDividendReinvestment(newDividend, accounts, targetAllocation);
      if (dripInstruction) {
          setTradeInstructions(prev => [dripInstruction, ...prev]);
      }
  };

  // Re-run rebalance whenever accounts or target changes
  useEffect(() => {
      runRebalance();
      // Also update tax analysis when data changes
      runTaxAnalysis();
  }, [accounts, targetAllocation, investments]);

  return (
    <DataContext.Provider value={{ 
        accounts, 
        transactions, 
        investments,
        linkAccount, 
        isLoading,
        targetAllocation,
        riskProfile,
        tradeInstructions,
        taxInsights,
        netWorth,
        totalAssets: assets,
        totalLiabilities: liabilities,
        billingHistory,
        runRebalance,
        runRiskAnalysis,
        runTaxAnalysis,
        simulateDividend
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};