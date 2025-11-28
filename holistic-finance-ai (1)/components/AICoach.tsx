import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Message, FinancialContext } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { useData } from '../contexts/DataContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AICoach: React.FC = () => {
  const { netWorth, totalAssets, totalLiabilities, riskProfile, accounts, transactions } = useData();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello. I am your dedicated Financial Coach. I've analyzed your portfolio and see you have some surplus cash flow this month. How can I help you optimize it?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare Context for RAG
    const context: FinancialContext = {
        netWorth,
        assets: totalAssets,
        liabilities: totalLiabilities,
        riskProfile,
        accountsSummary: accounts.map(a => ({ name: a.name, type: a.type, balance: a.balance })),
        recentTransactions: transactions.slice(0, 5) // Send last 5 for context
    };

    // Call the Gemini Service with Context
    const responseText = await sendMessageToGemini(messages, input, context);

    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          AI Financial Coach
        </h1>
        <p className="text-slate-500">Your personalized, 24/7 expert financial planner.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden shadow-lg border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
           <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
                <Bot className="h-6 w-6 text-purple-600" />
             </div>
             <div>
                <h3 className="font-semibold text-slate-900">Holistic AI</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                   <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                   Online & Ready
                </p>
             </div>
           </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  msg.role === 'model' ? 'bg-purple-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {msg.role === 'model' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm overflow-hidden ${
                  msg.role === 'model'
                    ? 'bg-white border border-slate-200 text-slate-800'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {msg.role === 'model' ? (
                    <div className="prose prose-sm prose-slate max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                )}
                
                <div className={`text-[10px] mt-2 opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
               <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                 <Bot className="h-5 w-5" />
               </div>
               <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                 <div className="flex items-center gap-2 text-slate-500 text-sm">
                   <Loader2 className="h-4 w-4 animate-spin" />
                   Thinking...
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 bg-white border-t border-slate-200">
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your finances, taxes, or goals..."
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-3 pl-5 pr-12 text-sm focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-purple-600 p-2 text-white hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[10px] text-slate-400">
               AI can make mistakes. Please verify critical financial information.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AICoach;