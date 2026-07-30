import React, { useState } from 'react';
import { AgentStep } from '../types';

interface NegotiationFeedProps {
  agentStep: AgentStep | null;
  sessionId: string | null;
  onSendResponse: (vendorPrice: number, vendorMessage: string) => void;
  loading: boolean;
}

export const NegotiationFeed: React.FC<NegotiationFeedProps> = ({
  agentStep,
  sessionId,
  onSendResponse,
  loading,
}) => {
  const [vendorPrice, setVendorPrice] = useState<string>('');
  const [vendorMessage, setVendorMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(vendorPrice);
    if (isNaN(price)) return;
    onSendResponse(price, vendorMessage);
    setVendorMessage('');
    setVendorPrice('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-800">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-cyan-400">
          AI Procurement Agent Feed
        </h2>
        {sessionId && (
          <span className="text-xs text-slate-400 font-mono">
            Session: {sessionId.slice(0, 8)}...
          </span>
        )}
      </div>

      {!agentStep ? (
        <div className="text-center py-12 text-slate-400">
          <p>No active negotiation session. Start one above to watch the agent negotiate!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status & Deal State Banner */}
          <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                Deal Status
              </span>
              <span
                className={`inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full uppercase ${
                  agentStep.dealStatus === 'accepted'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : agentStep.dealStatus === 'rejected'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {agentStep.dealStatus}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                Confidence Score
              </span>
              <span className="text-lg font-bold text-cyan-400">
                {agentStep.confidenceScore}%
              </span>
            </div>
          </div>

          {/* Agent Pricing & Tactics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Agent Counter-Offer Price
              </span>
              <div className="text-2xl font-black text-white">
                ${agentStep.proposedPrice.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Tactics Deployed (Voss / Carnegie)
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {agentStep.tacticsUsed.map((tactic: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-900 text-cyan-400 text-xs rounded border border-slate-700 font-mono"
                  >
                    {tactic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Reasoning */}
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 font-semibold block mb-1 text-slate-400">
              Strategic Reasoning
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">
              {agentStep.reasoning}
            </p>
          </div>

          {/* Message Sent to Vendor */}
          <div className="bg-cyan-950/30 border border-cyan-800/50 p-4 rounded-lg">
            <span className="text-xs text-cyan-400 font-semibold block mb-1 uppercase tracking-wider">
              Message Sent to Vendor
            </span>
            <p className="text-sm text-slate-100 italic">
              "{agentStep.messageToVendor}"
            </p>
          </div>

          {/* Vendor Counter-Offer Form */}
          {agentStep.dealStatus === 'negotiating' && (
            <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">
                Simulate Vendor Response
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Vendor Price ($)"
                  value={vendorPrice}
                  onChange={(e) => setVendorPrice(e.target.value)}
                  required
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Vendor message/reply..."
                  value={vendorMessage}
                  onChange={(e) => setVendorMessage(e.target.value)}
                  required
                  className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Processing Agent Response...' : 'Send Vendor Counter-Offer'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};