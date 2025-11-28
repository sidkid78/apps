import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { CreditCard, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { premiumStatus, upgradeSubscription, loading } = useAuth();
  const { billingHistory } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings & Billing</h1>
        <p className="text-slate-500">Manage your subscription, payment methods, and billing history.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Subscription Plan Card */}
        <Card className={`border-2 ${premiumStatus === 'active' ? 'border-blue-500' : 'border-slate-200'}`}>
          <CardHeader>
             <CardTitle className="flex justify-between items-center">
                <span>Current Plan</span>
                {premiumStatus === 'active' ? (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Active
                    </span>
                ) : (
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Inactive
                    </span>
                )}
             </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                 <h3 className="text-xl font-bold text-slate-900">Holistic AI Premium</h3>
                 <p className="text-sm text-slate-500">Full access to Predictive ML, Tax Engine, and AI Coach.</p>
             </div>
             
             <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-bold">$29.99</span>
                 <span className="text-sm text-slate-500">/month</span>
             </div>

             <div className="space-y-2 pt-2">
                 <div className="flex items-center gap-2 text-sm text-slate-700">
                     <CheckCircle className="h-4 w-4 text-green-500" />
                     <span>Vertex AI Forecasting</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-700">
                     <CheckCircle className="h-4 w-4 text-green-500" />
                     <span>Proactive Tax Optimization</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-700">
                     <CheckCircle className="h-4 w-4 text-green-500" />
                     <span>Unlimited AI Coach Chat</span>
                 </div>
             </div>

             {premiumStatus === 'inactive' ? (
                 <button 
                    onClick={upgradeSubscription}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                 >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Upgrade to Premium
                 </button>
             ) : (
                 <button className="w-full bg-white border border-slate-300 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                    Manage Subscription
                 </button>
             )}
          </CardContent>
        </Card>

        {/* Payment Method Card */}
        <Card>
           <CardHeader>
              <CardTitle>Payment Method</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                      <div className="h-10 w-14 bg-slate-100 rounded flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                          <p className="font-semibold text-slate-900">Visa ending in 4242</p>
                          <p className="text-xs text-slate-500">Expires 12/25</p>
                      </div>
                  </div>
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">Default</span>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  + Add New Payment Method
              </button>
           </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
          <CardHeader>
              <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                          <tr>
                              <th className="px-4 py-3 font-medium">Date</th>
                              <th className="px-4 py-3 font-medium">Description</th>
                              <th className="px-4 py-3 font-medium">Status</th>
                              <th className="px-4 py-3 font-medium text-right">Amount</th>
                          </tr>
                      </thead>
                      <tbody>
                          {billingHistory.length === 0 ? (
                              <tr>
                                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">No billing history available.</td>
                              </tr>
                          ) : (
                              billingHistory.map((item) => (
                                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                                      <td className="px-4 py-3 text-slate-900">{item.date}</td>
                                      <td className="px-4 py-3 text-slate-600">{item.description}</td>
                                      <td className="px-4 py-3">
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                              item.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                          }`}>
                                              {item.status}
                                          </span>
                                      </td>
                                      <td className="px-4 py-3 text-right font-medium text-slate-900">${item.amount.toFixed(2)}</td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>
          </CardContent>
      </Card>
    </div>
  );
};

export default Settings;