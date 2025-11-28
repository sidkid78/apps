
import { Account, Transaction, TargetAllocation, RiskProfile, TradeInstruction, AssetClass, ScenarioParams, PredictionResult, PredictionDataPoint, TaxInsight, Investment } from '../types';

/**
 * Calculates real-time Net Worth, Assets, and Liabilities
 */
export const calculateNetWorth = (accounts: Account[]) => {
  const assets = accounts
    .filter(a => ['checking', 'savings', 'investment', 'crypto', 'real_estate'].includes(a.type))
    .reduce((sum, a) => sum + a.balance, 0);
  
  const liabilities = accounts
    .filter(a => ['loan', 'credit', 'mortgage'].includes(a.type))
    .reduce((sum, a) => sum + a.balance, 0);

  return {
    netWorth: assets - liabilities,
    assets,
    liabilities
  };
};

/**
 * Calculates the average monthly cash flow (Income - Expenses) based on transactions.
 * For the demo, we assume the transaction list represents a monthly snapshot if dates are close,
 * or we calculate the net total.
 */
export const calculateMonthlyCashFlow = (transactions: Transaction[]): number => {
    // 1. Identify Income
    const income = transactions
        .filter(t => t.type === 'credit' || t.category === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

    // 2. Identify Expenses (exclude internal transfers if we had logic for it)
    const expenses = transactions
        .filter(t => t.type === 'debit' && t.category !== 'Transfer')
        .reduce((sum, t) => sum + t.amount, 0);

    // For this demo with limited mock data, we assume the net result is the monthly capacity.
    // In a real app, this would average over 3-6 months.
    return Math.max(0, income - expenses);
};

/**
 * Checks portfolio against target allocation and generates trade instructions.
 * Constants: 3% threshold, $50 min trade.
 */
export const checkAndRebalance = (
    accounts: Account[], 
    target: TargetAllocation
): TradeInstruction[] => {
    const instructions: TradeInstruction[] = [];
    const threshold = 0.03; // 3%
    const minTrade = 50;

    // 1. Calculate current holdings by asset class
    // Simple heuristic for demo: map account types to asset classes
    const currentHoldings: Record<AssetClass, number> = {
        equity: 0, bonds: 0, cash: 0, crypto: 0, real_estate: 0
    };

    let totalPortfolioValue = 0;

    accounts.forEach(acc => {
        // Exclude liabilities
        if (['loan', 'credit', 'mortgage'].includes(acc.type)) return;

        totalPortfolioValue += acc.balance;

        if (acc.assetClass) {
            currentHoldings[acc.assetClass] = (currentHoldings[acc.assetClass] || 0) + acc.balance;
        } else {
            // Heuristic mapping
            if (acc.type === 'checking' || acc.type === 'savings') {
                currentHoldings.cash += acc.balance;
            } else if (acc.type === 'investment') {
                if (acc.name.toLowerCase().includes('bond')) {
                    currentHoldings.bonds += acc.balance;
                } else {
                    currentHoldings.equity += acc.balance;
                }
            }
        }
    });

    // 2. Compare against target
    (Object.keys(target.allocation) as AssetClass[]).forEach(assetClass => {
        const targetPct = target.allocation[assetClass] || 0;
        const currentVal = currentHoldings[assetClass];
        const targetVal = totalPortfolioValue * targetPct;
        const deviation = targetVal - currentVal;
        const deviationPct = Math.abs(deviation) / (totalPortfolioValue || 1);

        if (deviationPct > threshold && Math.abs(deviation) > minTrade) {
             instructions.push({
                 id: Math.random().toString(36).substr(2, 9),
                 type: deviation > 0 ? 'BUY' : 'SELL',
                 assetClass: assetClass,
                 amount: Math.abs(deviation),
                 reason: `Drift: ${(deviationPct * 100).toFixed(1)}%`
             });
        }
    });

    return instructions;
};

/**
 * Dividend Reinvestment Processing (DRIP)
 * Reactive Logic: When a dividend/income arrives, immediately target the most underweight asset.
 */
export const processDividendReinvestment = (
    newTransaction: Transaction,
    accounts: Account[],
    target: TargetAllocation
): TradeInstruction | null => {
    // 1. Verify it's an income event
    if (newTransaction.type !== 'credit' || !['Income', 'Dividend', 'Interest'].includes(newTransaction.category)) {
        return null;
    }

    // 2. Calculate current allocation state
    const currentHoldings: Record<AssetClass, number> = {
        equity: 0, bonds: 0, cash: 0, crypto: 0, real_estate: 0
    };
    let totalPortfolioValue = 0;

    accounts.forEach(acc => {
        if (['loan', 'credit', 'mortgage'].includes(acc.type)) return;
        totalPortfolioValue += acc.balance;
        if (acc.assetClass) {
            currentHoldings[acc.assetClass] = (currentHoldings[acc.assetClass] || 0) + acc.balance;
        } else if (acc.type === 'checking' || acc.type === 'savings') {
            currentHoldings.cash += acc.balance;
        } else if (acc.type === 'investment') {
             if (acc.name.toLowerCase().includes('bond')) currentHoldings.bonds += acc.balance;
             else currentHoldings.equity += acc.balance;
        }
    });

    // 3. Find most underweight asset
    let maxUnderweightAmount = -Infinity;
    let targetAsset: AssetClass | null = null;

    (Object.keys(target.allocation) as AssetClass[]).forEach(assetClass => {
        const targetPct = target.allocation[assetClass] || 0;
        const currentVal = currentHoldings[assetClass];
        const targetVal = totalPortfolioValue * targetPct;
        const deviation = targetVal - currentVal; // Positive means underweight (we need to buy)

        if (deviation > maxUnderweightAmount && deviation > 0) {
            maxUnderweightAmount = deviation;
            targetAsset = assetClass;
        }
    });

    // 4. Generate Buy Order
    if (targetAsset) {
        return {
            id: `drip-${Math.random().toString(36).substr(2, 5)}`,
            type: 'BUY',
            assetClass: targetAsset,
            amount: newTransaction.amount,
            reason: 'DRIP: Auto-Reinvest'
        };
    }

    return null;
};

/**
 * Behavioral Risk Adjustment
 * Adjusts equity target based on panic selling behavior during volatility.
 */
export const analyzeBehavioralRisk = (
    transactions: Transaction[], 
    currentProfile: RiskProfile
): RiskProfile => {
    // Simulation logic:
    // In a real app, this would query market data for volatility periods.
    // Here we simulate a check for "panic selling" (large withdrawals from investments).
    
    let panicScore = currentProfile.panicScore;
    
    // Random fluctuation for demo purposes to show the engine working
    const randomChange = Math.random() > 0.5 ? 1 : -1;
    panicScore = Math.max(0, Math.min(10, panicScore + randomChange));

    // Calculate Adjustment
    // Score 0-2: No adjustment
    // Score 3-5: -5% Equity
    // Score 6-8: -10% Equity
    // Score 9-10: -15% Equity
    
    let adjustment = 0;
    if (panicScore > 8) adjustment = 0.15;
    else if (panicScore > 5) adjustment = 0.10;
    else if (panicScore > 2) adjustment = 0.05;

    const baseEquityTarget = 0.70; // Assuming 70/30 base for moderate
    const newEquityTarget = baseEquityTarget - adjustment;
    
    let newLevel: 'conservative' | 'moderate' | 'aggressive' = currentProfile.level;
    if (newEquityTarget < 0.5) newLevel = 'conservative';
    else if (newEquityTarget > 0.75) newLevel = 'aggressive';
    else newLevel = 'moderate';

    return {
        ...currentProfile,
        panicScore,
        equityTarget: Number(newEquityTarget.toFixed(2)),
        level: newLevel,
        lastUpdated: new Date().toISOString()
    };
};

/**
 * Predictive ML Pipeline Simulation (Vertex AI Proxy)
 */
export const runPredictiveScenario = async (
    params: ScenarioParams,
    currentAge: number,
    currentSavings: number,
    baselineMonthlySavings: number
): Promise<PredictionResult> => {
    // Simulate network latency to Vertex AI
    await new Promise(resolve => setTimeout(resolve, 800));

    const yearsToProject = params.retirementAge - currentAge + 25; // Project 25 years past retirement
    const trajectory: PredictionDataPoint[] = [];

    // Constants for Baseline
    const BASELINE_RETURN = 0.05; // 5% nominal
    const BASELINE_INFLATION = 0.03; // 3%
    const BASELINE_REAL_RETURN = (1 + BASELINE_RETURN) / (1 + BASELINE_INFLATION) - 1;

    // Scenario Real Return Calculation
    const SCENARIO_REAL_RETURN = (1 + (params.annualReturn / 100)) / (1 + (params.inflationRate / 100)) - 1;

    let baselineBalance = currentSavings;
    let scenarioBalance = currentSavings;

    for (let i = 0; i <= yearsToProject; i++) {
        const year = new Date().getFullYear() + i;
        const age = currentAge + i;

        // --- Baseline Projection ---
        if (age < 65) {
            baselineBalance = baselineBalance * (1 + BASELINE_REAL_RETURN) + (baselineMonthlySavings * 12);
        } else {
            baselineBalance = baselineBalance * (1 + BASELINE_REAL_RETURN) - (baselineBalance * 0.04);
        }

        // --- Scenario Projection ---
        if (age < params.retirementAge) {
            scenarioBalance = scenarioBalance * (1 + SCENARIO_REAL_RETURN) + (params.monthlySavings * 12);
        } else {
            scenarioBalance = scenarioBalance * (1 + SCENARIO_REAL_RETURN) - (scenarioBalance * 0.04);
        }

        trajectory.push({
            year,
            age,
            Baseline: Math.round(baselineBalance),
            Scenario: Math.round(scenarioBalance)
        });
    }

    // Monte Carlo Simulation
    const ITERATIONS = 500;
    const VOLATILITY = 0.12; 
    let successCount = 0;

    for (let i = 0; i < ITERATIONS; i++) {
        let simBalance = currentSavings;
        let success = true;

        for (let j = 0; j <= yearsToProject; j++) {
            const age = currentAge + j;
            
            // Box-Muller transform for Normal Distribution
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            const randomReturn = SCENARIO_REAL_RETURN + (VOLATILITY * z);

            if (age < params.retirementAge) {
                simBalance = simBalance * (1 + randomReturn) + (params.monthlySavings * 12);
            } else {
                simBalance = simBalance * (1 + randomReturn) - (simBalance * 0.04);
            }

            if (simBalance < 0) {
                success = false;
                break;
            }
        }
        if (success) successCount++;
    }

    const successProbability = Math.round((successCount / ITERATIONS) * 100);

    return {
        trajectory,
        successProbability
    };
};

/**
 * Proactive Tax Optimization Engine
 * Runs rule-based checks for Deduction Maximization and Tax-Loss Harvesting
 */
export const runTaxOptimization = (
    transactions: Transaction[], 
    investments: Investment[]
): TaxInsight[] => {
    const insights: TaxInsight[] = [];
    const taxRate = 0.24; // Assume 24% marginal tax bracket

    // 1. Deduction Maximizer
    // Rule: Identify 'Transport', 'Supplies' containing specific keywords
    const businessKeywords = ['uber', 'lyft', 'office', 'staples', 'fedex', 'wework'];
    const potentialDeductions = transactions.filter(t => 
        t.type === 'debit' && 
        businessKeywords.some(kw => t.description.toLowerCase().includes(kw))
    );

    if (potentialDeductions.length > 0) {
        const totalDeductionAmount = potentialDeductions.reduce((sum, t) => sum + t.amount, 0);
        const estimatedTaxSavings = totalDeductionAmount * taxRate;
        
        insights.push({
            id: 'tax-deduct-1',
            title: 'Business Expense Categorization',
            description: `${potentialDeductions.length} transactions (Uber, Office Depot, etc.) flagged as potential business deductions.`,
            impact: Math.round(estimatedTaxSavings),
            type: 'deduction',
            status: 'actionable'
        });
    }

    // 2. Tax-Loss Harvesting (TLH) Scanner
    // Rule: Find investments where currentPrice < costBasis
    const harvestingOpportunities = investments.filter(inv => 
        inv.currentPrice < inv.costBasisPerShare
    );

    if (harvestingOpportunities.length > 0) {
        let totalUnrealizedLoss = 0;
        const lossSymbols = [] as string[];

        harvestingOpportunities.forEach(inv => {
            const loss = (inv.costBasisPerShare - inv.currentPrice) * inv.shares;
            totalUnrealizedLoss += loss;
            lossSymbols.push(inv.symbol);
        });

        // Cap loss offset at $3000 against income (simplified rule) + capital gains offset
        // For demo, just show raw tax value of the loss
        const taxValue = totalUnrealizedLoss * taxRate;

        if (totalUnrealizedLoss > 500) { // Threshold to suggest action
            insights.push({
                id: 'tax-tlh-1',
                title: 'Tax-Loss Harvesting Opportunity',
                description: `Unrealized losses of $${totalUnrealizedLoss.toLocaleString()} detected in ${lossSymbols.join(', ')}. Sell to offset gains.`,
                impact: Math.round(taxValue),
                type: 'harvesting',
                status: 'actionable'
            });
        }
    }

    // 3. Static/Recurring Checks (HSA/IRA) - In a real app, this compares YTD contributions vs Limits
    // We'll leave one static reminder for completeness
    insights.push({
        id: 'tax-contrib-1',
        title: 'Maximize HSA Contribution',
        description: 'You are $1,500 short of the annual HSA contribution limit ($4,150).',
        impact: 360, // $1500 * 0.24
        type: 'contribution',
        status: 'actionable'
    });

    return insights;
};

/**
 * Calculates daily AUM fee (0.25% annually)
 */
export const calculateDailyAUMFee = (totalAssets: number): number => {
    // 0.25% annual fee / 365 days
    const annualRate = 0.0025;
    const dailyFee = (totalAssets * annualRate) / 365;
    return Number(dailyFee.toFixed(2));
};
