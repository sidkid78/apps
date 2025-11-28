import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import TaxHealthGauge from './TaxHealthGauge';
import { useData } from '../contexts/DataContext';

const TaxOptimizer: React.FC = () => {
  const { taxInsights, runTaxAnalysis, isLoading } = useData();

  // Calculate total potential savings
  const totalImpact = taxInsights.reduce((sum, item) => sum + item.impact, 0);
  
  // Dynamic Score Calculation (Simple heuristic)
  const baseScore = 65;
  const impactFactor = Math.min(30, totalImpact / 50); // Cap boost at 30 points
  const calculatedScore = Math.round(baseScore + impactFactor);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tax Optimization Engine</h1>
          <p className="text-slate-500">Real-time strategies to minimize liability and maximize returns.</p>
        </div>
        <button 
           onClick={runTaxAnalysis}
           disabled={isLoading}
           className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
           {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
           Re-Scan Portfolio
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Health Score */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Efficiency Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4">
            <TaxHealthGauge score={calculatedScore} />
            <p className="text-center text-sm text-slate-500 mt-4 px-4">
              You are optimizing approx. <strong>${totalImpact}</strong> in potential tax savings this year.
            </p>
          </CardContent>
        </Card>

        {/* Actionable Insights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actionable Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taxInsights.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p>No tax optimization opportunities found at this time.</p>
                  </div>
              ) : (
                taxInsights.map((insight) => (
                  <div key={insight.id} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      insight.type === 'harvesting' ? 'bg-orange-100 text-orange-600' : 
                      insight.type === 'contribution' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {insight.type === 'harvesting' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          +${insight.impact} Value
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                      <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        Execute Strategy <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
           <CardHeader>
             <CardTitle>Estimated Tax Liability (YTD)</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">Federal Income Tax</span>
                    <span className="font-medium">$12,450.00</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">State Income Tax</span>
                    <span className="font-medium">$4,200.00</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-sm text-slate-600">FICA</span>
                    <span className="font-medium">$5,800.00</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-slate-900">Total Estimated</span>
                    <span className="font-bold text-slate-900">$22,450.00</span>
                </div>
             </div>
           </CardContent>
        </Card>
        <Card>
           <CardHeader>
             <CardTitle>Deduction Tracker</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>401(k) Contribution</span>
                        <span className="text-slate-500">$18,500 / $23,000</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[80%]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>HSA Contribution</span>
                        <span className="text-slate-500">$2,650 / $4,150</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[64%]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Charitable Giving</span>
                        <span className="text-slate-500">$1,200</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[30%]"></div>
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxOptimizer;