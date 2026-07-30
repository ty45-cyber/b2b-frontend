export interface AgentStep {
  reasoning: string;
  confidenceScore: number;
  tacticsUsed: string[];
  proposedPrice: number;
  messageToVendor: string;
  dealStatus: "negotiating" | "accepted" | "rejected";
}

export interface VendorResponse {
  vendorPrice?: number;
  vendorMessage?: string;
}

export interface NegotiationResponse {
  sessionId: string;
  turnCount: number;
  agentStep: AgentStep;
  vendorResponse?: VendorResponse;
  dealStatus?: string;
}