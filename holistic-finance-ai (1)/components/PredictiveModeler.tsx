
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ScenarioParams, PredictionResult } from '../types';
import { Sliders, RefreshCw, Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { runPredictiveScenario, calculateMonthlyCashFlow } from '../services/financialEngine';
import { useData } from '../contexts/DataContext';

const PredictiveModeler: React.FC = () => {
  const { transactions, netWorth, accounts } = useData();

  const [params, setParams] = useState<ScenarioParams>({
    monthlySavings: 2000,
    retirementAge: 65,
    annualReturn: 7,
    inflationRate: 3,
  });

  const [currentAge] = useState(35);
  // Estimate current liquid savings (excluding debts)
  const [currentSavings, setCurrentSavings] = useState(250000);
  const [baselineSavings, setBaselineSavings] = useState(0);
  
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize data from context
  useEffect(() => {
      // Calculate real current savings (Assets like investments/cash)
      const liquidAssets = accounts
        .filter(a => ['savings', 'checking', 'investment', 'crypto'].includes(a.type))
        .reduce((sum, a) => sum + a.balance, 0);
      setCurrentSavings(liquidAssets);

      // Calculate real baseline cashflow from transactions
      const realCashFlow = calculateMonthlyCashFlow(transactions);
      setBaselineSavings(realCashFlow);
      
      // Update params default if not set by user interaction yet? 
      // For now, we keep the slider independent, but show the baseline in the chart.
  }, [accounts, transactions]);

  // Debounced simulation trigger
  const runSimulation = useCallback(async () => {
    if (baselineSavings === 0 && transactions.length === 0) return; // Wait for data init

    setIsSimulating(true);
    try {
      const data = await runPredictiveScenario(params, currentAge, currentSavings, baselineSavings);
      setResult(data);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsSimulating(false);
    }
  }, [params, currentAge, currentSavings, baselineSavings, transactions.length]);

  // Initial Run when dependencies settle
  useEffect(() => {
    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baselineSavings, currentSavings]); // Run once baseline is calculated

  // Use Effect to debounce inputs if we want auto-update
  useEffect(() => {
    const timer = setTimeout(() => {
        runSimulation();
    }, 600); // 600ms debounce
    return () => clearTimeout(timer);
  }, [params, runSimulation]);

  const handleParamChange = (key: keyof ScenarioParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const getProbabilityColor = (prob: number) => {
      if (prob >= 85) return 'text-green-600 bg-green-100';
      if (prob >= 60) return 'text-yellow-600 bg-yellow-100';
      return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Predictive Planning</h1>
        <p className="text-slate-500">Vertex AI-powered forecasting to visualize your financial future.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="h-5 w-5" />
              Scenario Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500">Current Baseline Savings</p>
                <p className="text-lg font-bold text-slate-900">${baselineSavings.toLocaleString()}/mo</p>
                <p className="text-[10px] text-slate-400">Calculated from transaction history</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Proposed Monthly Savings ($)
              </label>
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="100"
                value={params.monthlySavings} 
                onChange={(e) => handleParamChange('monthlySavings', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>$0</span>
                <span className="font-bold text-blue-600">${params.monthlySavings}</span>
                <span>$10k</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Target Retirement Age
              </label>
              <input 
                type="range" 
                min="50" 
                max="75" 
                step="1"
                value={params.retirementAge} 
                onChange={(e) => handleParamChange('retirementAge', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>50</span>
                <span className="font-bold text-blue-600">{params.retirementAge}</span>
                <span>75</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Est. Annual Return (%)
              </label>
              <input 
                type="range" 
                min="2" 
                max="12" 
                step="0.5"
                value={params.annualReturn} 
                onChange={(e) => handleParamChange('annualReturn', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>2%</span>
                <span className="font-bold text-blue-600">{params.annualReturn}%</span>
                <span>12%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Inflation Rate (%)
              </label>
              <input 
                type="range" 
                min="1" 
                max="8" 
                step="0.1"
                value={params.inflationRate} 
                onChange={(e) => handleParamChange('inflationRate', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1%</span>
                <span className="font-bold text-blue-600">{params.inflationRate}%</span>
                <span>8%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                 {isSimulating ? (
                     <div className="flex items-center justify-center gap-2 text-sm text-blue-600 animate-pulse">
                         <Loader2 className="h-4 w-4 animate-spin" />
                         Running Monte Carlo Simulation...
                     </div>
                 ) : (
                     <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                         <RefreshCw className="h-3 w-3" />
                         Results up to date
                     </div>
                 )}
            </div>
          </CardContent>
        </Card>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Probability Score Card */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-6 flex flex-col justify-center h-full">
                        <span className="text-sm font-medium text-slate-500">Success Probability</span>
                        <div className="flex items-end gap-2 mt-1">
                            {result ? (
                                <>
                                    <span className={`text-4xl font-bold px-2 py-0.5 rounded-lg ${getProbabilityColor(result.successProbability)}`}>
                                        {result.successProbability}%
                                    </span>
                                    <span className="text-sm text-slate-400 mb-1">chance of success</span>
                                </>
                            ) : (
                                <div className="h-10 w-24 bg-slate-100 rounded animate-pulse" />
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Based on 500 Monte Carlo iterations
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="p-6 flex items-start gap-3">
                        <TrendingUp className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-blue-900 text-sm">AI Insight</h4>
                            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                {params.monthlySavings > baselineSavings ? (
                                    <>Increasing your savings to <strong>${params.monthlySavings}</strong> (+${params.monthlySavings - baselineSavings}) significantly improves your long-term outlook.</>
                                ) : (
                                    <>Your scenario proposes saving less than your current baseline. This may lower your success probability.</>
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Wealth Trajectory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full relative">
                  {isSimulating && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                      </div>
                  )}
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result?.trajectory || []} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -10 }} stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                         formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line type="monotone" dataKey="Baseline" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" name={`Baseline ($${baselineSavings}/mo)`} />
                      <Line type="monotone" dataKey="Scenario" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name={`Scenario ($${params.monthlySavings}/mo)`} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default PredictiveModeler;
