import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface IntentInputProps {
  onStart: (item: string, initialPrice: number, targetPrice: number) => void;
  isLoading: boolean;
}

export const IntentInput: React.FC<IntentInputProps> = ({ onStart, isLoading }) => {
  const [item, setItem] = useState("500 boxes of premium coffee cups");
  const [initialPrice, setInitialPrice] = useState(2500);
  const [targetPrice, setTargetPrice] = useState(1900);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(item, Number(initialPrice), Number(targetPrice));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-semibold text-white">Initialize Autonomous Procurement</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            Procurement Intent
          </label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
            placeholder="e.g. 500 units of office chairs"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Vendor List Price ($)
            </label>
            <input
              type="number"
              value={initialPrice}
              onChange={(e) => setInitialPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Target Budget ($)
            </label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {isLoading ? "Deploying Agent..." : "Deploy Negotiation Agent"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};