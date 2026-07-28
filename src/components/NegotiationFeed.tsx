import React, { useEffect, useRef } from "react";
import { AgentStep, VendorResponse } from "../types";
import { Bot, UserCheck, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";

interface NegotiationFeedProps {
  turnCount: number;
  agentStep: AgentStep | null;
  vendorResponse: VendorResponse | null;
  isLoading: boolean;
  onNextTurn: () => void;
  dealStatus: string;
}

export const NegotiationFeed: React.FC<NegotiationFeedProps> = ({
  turnCount,
  agentStep,
  vendorResponse,
  isLoading,
  onNextTurn,
  dealStatus,
}) => {
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Smoothly scroll to the bottom whenever new turn data arrives
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentStep, vendorResponse, isLoading]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-[500px]">
      {/* Feed Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Live Agent Terminal (Turn {turnCount})</h2>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
          Status: <span className="text-indigo-400 uppercase font-semibold">{dealStatus}</span>
        </span>
      </div>

      {/* Main Stream Window */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {!vendorResponse && !agentStep && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
            <Bot className="w-10 h-10 mb-2 opacity-30 animate-pulse" />
            <p>Deploy the agent to start negotiation...</p>
          </div>
        )}

        {vendorResponse && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs text-amber-400 mb-1 font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              Vendor Response (Quote: ${vendorResponse.vendorPrice})
            </div>
            <p className="text-sm text-slate-300">{vendorResponse.vendorMessage}</p>
          </div>
        )}

        {agentStep && (
          <div className="bg-slate-950 border border-indigo-950/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                <UserCheck className="w-3.5 h-3.5" />
                AI Procurement Reasoning
              </div>
              <span className="text-xs text-slate-400">Confidence: {agentStep.confidenceScore}%</span>
            </div>
            <p className="text-xs text-slate-400 italic bg-slate-900/50 p-2 rounded border border-slate-800">
              "{agentStep.reasoning}"
            </p>
            <div className="flex flex-wrap gap-1.5">
              {agentStep.tacticsUsed.map((tactic, idx) => (
                <span key={idx} className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/50">
                  {tactic}
                </span>
              ))}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Proposed Counter-Offer (${agentStep.proposedPrice}):
              </span>
              <p className="text-sm text-white bg-slate-900 p-3 rounded border border-slate-800">
                {agentStep.messageToVendor}
              </p>
            </div>
          </div>
        )}

        <div ref={feedEndRef} />
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800 mt-4">
        {dealStatus === "negotiating" && (
          <button
            onClick={onNextTurn}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition text-sm disabled:opacity-50"
          >
            {isLoading ? "Processing Turn..." : "Advance Negotiation Turn"}
          </button>
        )}

        {dealStatus === "accepted" && (
          <div className="flex items-center justify-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 p-2.5 rounded-lg text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Deal Closed Successfully!
          </div>
        )}

        {dealStatus === "rejected" && (
          <div className="flex items-center justify-center gap-2 text-rose-400 bg-rose-950/50 border border-rose-800/50 p-2.5 rounded-lg text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Negotiation Ended Without Agreement
          </div>
        )}
      </div>
    </div>
  );
};