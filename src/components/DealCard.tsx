import React from "react";
import { CheckCircle2, TrendingDown } from "lucide-react";

interface DealCardProps {
  initialPrice: number;
  finalPrice: number;
  dealStatus: string;
}

export const DealCard: React.FC<DealCardProps> = ({ initialPrice, finalPrice, dealStatus }) => {
  const savings = initialPrice - finalPrice;
  const savingsPercent = initialPrice > 0 ? Math.round((savings / initialPrice) * 100) : 0;

  if (dealStatus !== "accepted") return null;

  return (
    <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-6 text-center space-y-3">
      <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto text-emerald-400">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-white">Deal Successfully Secured!</h3>
      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block">Original Quote</span>
          <span className="text-base font-semibold text-white">${initialPrice}</span>
        </div>
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block">Final Negotiated</span>
          <span className="text-base font-semibold text-emerald-400">${finalPrice}</span>
        </div>
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Saved</span>
          <span className="text-base font-semibold text-indigo-400 flex items-center justify-center gap-1">
            <TrendingDown className="w-4 h-4" /> ${savings} ({savingsPercent}%)
          </span>
        </div>
      </div>
    </div>
  );
};