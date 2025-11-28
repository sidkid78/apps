import { Account, Transaction, TaxInsight, TargetAllocation, RiskProfile, Investment } from '../types';

export const mockAccounts: Account[] = [
  { id: '1', name: 'Primary Checking', type: 'checking', balance: 12450.50, institution: 'Chase' },
  { id: '2', name: 'High Yield Savings', type: 'savings', balance: 45000.00, institution: 'Ally' },
  { id: '3', name: 'Brokerage Account', type: 'investment', balance: 128500.75, institution: 'Vanguard', assetClass: 'equity' },
  { id: '4', name: '401(k)', type: 'investment', balance: 85000.00, institution: 'Fidelity', assetClass: 'equity' },
  { id: '4b', name: 'Bond Fund', type: 'investment', balance: 42000.00, institution: 'Vanguard', assetClass: 'bonds' },
  { id: '5', name: 'Visa Signature', type: 'credit', balance: 1250.00, institution: 'Chase' },
  { id: '6', name: 'Auto Loan', type: 'loan', balance: 15400.00, institution: 'Toyota Financial' },
];

export const mockInvestments: Investment[] = [
  { id: 'inv1', symbol: 'VTI', name: 'Vanguard Total Stock Market', shares: 450, costBasisPerShare: 210.00, currentPrice: 225.50, accountId: '3' },
  { id: 'inv2', symbol: 'VXUS', name: 'Vanguard Total Intl Stock', shares: 200, costBasisPerShare: 58.00, currentPrice: 54.20, accountId: '3' }, // Loss position
  { id: 'inv3', symbol: 'BND', name: 'Vanguard Total Bond Market', shares: 500, costBasisPerShare: 72.00, currentPrice: 72.50, accountId: '4b' },
  { id: 'inv4', symbol: 'ARKK', name: 'ARK Innovation ETF', shares: 100, costBasisPerShare: 45.00, currentPrice: 38.00, accountId: '3' }, // Loss position
];

export const mockTransactions: Transaction[] = [
  { id: 't1', date: '2023-10-25', description: 'Whole Foods Market', amount: 145.20, category: 'Groceries', type: 'debit' },
  { id: 't2', date: '2023-10-24', description: 'Uber Technologies', amount: 24.50, category: 'Transport', type: 'debit' },
  { id: 't3', date: '2023-10-24', description: 'Tech Corp Payroll', amount: 4200.00, category: 'Income', type: 'credit' },
  { id: 't4', date: '2023-10-23', description: 'Electric Utility', amount: 120.00, category: 'Utilities', type: 'debit' },
  { id: 't5', date: '2023-10-22', description: 'Starbucks', amount: 8.50, category: 'Dining', type: 'debit' },
  { id: 't6', date: '2023-10-21', description: 'Lyft Ride', amount: 18.20, category: 'Transport', type: 'debit' },
  { id: 't7', date: '2023-10-20', description: 'Office Depot', amount: 142.50, category: 'Shopping', type: 'debit' },
];

export const mockTaxInsights: TaxInsight[] = [
  { id: 'tx1', title: 'Tax-Loss Harvesting Opportunity', description: 'You have unrealized losses of $1,200 in your Tech ETF that can offset gains.', impact: 320, type: 'harvesting', status: 'actionable' },
  { id: 'tx2', title: 'Maximize HSA Contribution', description: 'You are $1,500 short of the annual HSA contribution limit.', impact: 450, type: 'contribution', status: 'actionable' },
  { id: 'tx3', title: 'Business Expense Categorization', description: '3 transactions from "Uber" flagged as potential business deductions.', impact: 85, type: 'deduction', status: 'actionable' },
];

export const mockTargetAllocation: TargetAllocation = {
    allocation: {
        equity: 0.60,
        bonds: 0.30,
        cash: 0.10,
        crypto: 0.0,
        real_estate: 0.0
    }
};

export const mockRiskProfile: RiskProfile = {
    level: 'moderate',
    equityTarget: 0.60,
    panicScore: 2,
    lastUpdated: new Date().toISOString()
};

export const generateNetWorthHistory = () => {
  const data = [];
  let balance = 180000;
  for (let i = 0; i < 12; i++) {
    balance += Math.random() * 5000 - 1000;
    data.push({
      month: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
      amount: Math.round(balance),
    });
  }
  return data;
};

// Simulation helper for Plaid Link
export const getNewLinkedAccount = (institutionName: string): { accounts: Account[], transactions: Transaction[] } => {
    const accountId = Math.random().toString(36).substr(2, 9);
    
    const newAccounts: Account[] = [
        { 
            id: accountId, 
            name: `${institutionName} Checking`, 
            type: 'checking', 
            balance: Math.floor(Math.random() * 5000) + 1000, 
            institution: institutionName,
            assetClass: 'cash'
        },
        { 
            id: accountId + '_sav', 
            name: `${institutionName} Savings`, 
            type: 'savings', 
            balance: Math.floor(Math.random() * 15000) + 5000, 
            institution: institutionName,
            assetClass: 'cash'
        }
    ];

    const newTransactions: Transaction[] = [
        { id: Math.random().toString(), date: '2023-10-28', description: 'Opening Deposit', amount: 500.00, category: 'Transfer', type: 'credit' },
        { id: Math.random().toString(), date: '2023-10-27', description: 'Netflix Subscription', amount: 15.99, category: 'Subscription', type: 'debit' }
    ];

    return { accounts: newAccounts, transactions: newTransactions };
};