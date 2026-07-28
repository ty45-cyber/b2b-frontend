import axios from "axios";
import { NegotiationResponse } from "../types";

const API_BASE_URL = "http://localhost:5000/api";

export async function startNegotiation(
  item: string,
  initialPrice: number,
  targetPrice: number
): Promise<NegotiationResponse> {
  const response = await axios.post(`${API_BASE_URL}/negotiate/start`, {
    item,
    initialPrice,
    targetPrice,
  });
  return response.data;
}

export async function nextNegotiationTurn(sessionId: string): Promise<NegotiationResponse> {
  const response = await axios.post(`${API_BASE_URL}/negotiate/${sessionId}/turn`);
  return response.data;
}