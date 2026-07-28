import axios from "axios";
import { NegotiationResponse } from "../types";

// Reads from Vercel env variable in production, falls back to localhost in dev
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_BASE_URL = `${BASE_URL}/api`;

export async function startNegotiation(
  item: string,
  initialPrice: number,
  targetPrice: number
): Promise {
  const response = await axios.post(`${API_BASE_URL}/negotiate/start`, {
    item,
    initialPrice,
    targetPrice,
  });
  return response.data;
}

export async function nextNegotiationTurn(sessionId: string): Promise {
  const response = await axios.post(`${API_BASE_URL}/${sessionId}/turn`);
  return response.data;
}