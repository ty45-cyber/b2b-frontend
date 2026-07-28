
import { IntentInput } from "./components/IntentInput";
import { NegotiationFeed } from "./components/NegotiationFeed";
import { DealCard } from "./components/DealCard";
import { startNegotiation, nextNegotiationTurn } from "./services/api";
import { AgentStep, VendorResponse } from "./types";
import { Cpu } from "lucide-react";

export function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [turnCount, setTurnCount] = useState(1);
  const [initialPrice, setInitialPrice] = useState(0);
  const [agentStep, setAgentStep] = useState<AgentStep | null>(null);
  const [vendorResponse, setVendorResponse] = useState<VendorResponse | null>(null);
  const [dealStatus, setDealStatus] = useState<string>("idle");
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async (item: string, initPrice: number, targetPrice: number) => {
    setIsLoading(true);
    setInitialPrice(initPrice);
    try {
      const res = await startNegotiation(item, initPrice, targetPrice);
      setSessionId(res.sessionId);
      setTurnCount(res.turnCount);
      setAgentStep(res.agentStep);
      setVendorResponse(res.vendorResponse);
      setDealStatus(res.dealStatus);
    } catch (err) {
      console.error("Failed to start negotiation", err);
      alert("Error connecting to backend server. Make sure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextTurn = async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const res = await nextNegotiationTurn(sessionId);
      setTurnCount(res.turnCount);
      setAgentStep(res.agentStep);
      setVendorResponse(res.vendorResponse);
      setDealStatus(res.dealStatus);
    } catch (err) {
      console.error("Failed to advance turn", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-wide">B2B Autonomous Negotiator</h1>
            <p className="text-xs text-slate-400">AI Designathon @ MERGE 2026 Entry</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <IntentInput onStart={handleStart} isLoading={isLoading} />
          </div>
          <div className="md:col-span-2">
            {sessionId ? (
              <NegotiationFeed
                turnCount={turnCount}
                agentStep={agentStep}
                vendorResponse={vendorResponse}
                isLoading={isLoading}
                onNextTurn={handleNextTurn}
                dealStatus={dealStatus}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center h-[500px] text-slate-500">
                <Cpu className="w-12 h-12 mb-3 stroke-1" />
                <p className="text-sm">Configure your procurement intent on the left to initialize the AI agent.</p>
              </div>
            )}
          </div>
        </div>
        <DealCard
          initialPrice={initialPrice}
          finalPrice={agentStep?.proposedPrice || 0}
          dealStatus={dealStatus}
        />
      </main>
    </div>
  );
}

export default App;