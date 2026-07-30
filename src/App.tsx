import React, { useState } from 'react';
import { AgentStep, NegotiationResponse } from './types';
import { NegotiationFeed } from './components/NegotiationFeed';

const API_BASE = import.meta.env.VITE_API_BASE_URL || const API_BASE = 'https://renter-production-bf69.up.railway.app/api';;

export function App() {
  const [item, setItem] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [agentStep, setAgentStep] = useState<AgentStep | null>(null);
  const [turnCount, setTurnCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/negotiate/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item,
          initialPrice: parseFloat(initialPrice),
          targetPrice: parseFloat(targetPrice),
        }),
      });

      if (!res.ok) throw new Error('Failed to start negotiation session');
      
      const data: NegotiationResponse = await res.json();
      setSessionId(data.sessionId);
      setAgentStep(data.agentStep);
      setTurnCount(data.turnCount);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendResponse = async (vendorPrice: number, vendorMessage: string) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/negotiate/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          vendorPrice,
          vendorMessage,
        }),
      });

      if (!res.ok) throw new Error('Failed to process vendor turn');

      const data: NegotiationResponse = await res.json();
      setAgentStep(data.agentStep);
      setTurnCount(data.turnCount);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Kibanda Bites Lite
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Autonomous B2B Procurement Agent powered by Rust & Gemini
          </p>
        </header>

        {!sessionId ? (
          <div className="bg-slate-900 p-6 rounded-xl shadow-xl border border-slate-800">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">Start New Negotiation</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Item / Service
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100x Ergonomic Office Chairs"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Initial / Opening Price ($)
                  </label>
                  <input
                    type="number"
                    placeholder="250"
                    value={initialPrice}
                    onChange={(e) => setInitialPrice(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Target Price ($)
                  </label>
                  <input
                    type="number"
                    placeholder="180"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Initializing Agent...' : 'Launch Procurement Agent'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}
            <NegotiationFeed
              agentStep={agentStep}
              sessionId={sessionId}
              turnCount={turnCount}
              onSendResponse={handleSendResponse}
              loading={loading}
            />
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setSessionId(null);
                  setAgentStep(null);
                  setTurnCount(0);
                }}
                className="text-xs text-slate-400 hover:text-cyan-400 underline transition-colors cursor-pointer"
              >
                Start a New Negotiation Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;