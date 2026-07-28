export interface AgentStep {
  reasoning: string;
  tacticsUsed: string[];
  messageToVendor: string;
  proposedPrice: number;
  dealStatus: "negotiating" | "accepted" | "rejected";
  confidenceScore: number;
}

export interface VendorResponse {
  vendorMessage: string;
  vendorPrice: number;
}

export interface NegotiationResponse {
  sessionId: string;
  turnCount: number;
  agentStep: AgentStep;
  vendorResponse: VendorResponse;
  dealStatus: "negotiating" | "accepted" | "rejected";
  history?: Array<{ sender: "agent" | "vendor"; message: string; price: number }>;
  finalPrice?: number;
}