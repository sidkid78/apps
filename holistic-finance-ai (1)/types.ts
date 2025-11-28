export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'credit' | 'debit';
}

export type AssetClass = 'equity' | 'bonds' | 'cash' | 'crypto' | 'real_estate';

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'loan' | 'credit';
  balance: number;
  institution: string;
  assetClass?: AssetClass; // For simulation purposes
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  costBasisPerShare: number;
  currentPrice: number;
  accountId: string;
}

export interface TargetAllocation {
  allocation: Record<AssetClass, number>;
}

export interface RiskProfile {
  level: 'conservative' | 'moderate' | 'aggressive';
  equityTarget: number;
  panicScore: number; // 0-10
  lastUpdated: string;
}

export interface TradeInstruction {
  id: string;
  type: 'BUY' | 'SELL';
  assetClass: AssetClass;
  amount: number;
  reason: string;
}

export interface TaxInsight {
  id: string;
  title: string;
  description: string;
  impact: number;
  type: 'deduction' | 'harvesting' | 'contribution';
  status: 'actionable' | 'completed';
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export enum ScenarioType {
  RETIREMENT = 'Retirement',
  HOME_BUYING = 'Home Buying',
  DEBT_PAYOFF = 'Debt Payoff',
}

export interface ScenarioParams {
  monthlySavings: number;
  retirementAge: number;
  annualReturn: number;
  inflationRate: number;
}

export interface PredictionDataPoint {
  year: number;
  age: number;
  Baseline: number;
  Scenario: number;
}

export interface PredictionResult {
  trajectory: PredictionDataPoint[];
  successProbability: number; // 0-100
}

export interface FinancialContext {
  netWorth: number;
  assets: number;
  liabilities: number;
  riskProfile: RiskProfile;
  accountsSummary: { name: string; type: string; balance: number }[];
  recentTransactions: Transaction[]; // Limited list
}

export type SubscriptionStatus = 'active' | 'inactive' | 'past_due';

export interface BillingTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'paid' | 'pending';
}