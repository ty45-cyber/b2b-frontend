/// <reference types="vite/client" />
import axios from "axios";
import { NegotiationResponse } from "../types";

// 1. Get raw env variable or default to localhost
const rawUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// 2. Clean the URL so double slashes or double `/api` are impossible
const trimmedUrl = rawUrl.replace(/\/+$/, ""); // removes any trailing slashes
const API_BASE_URL = trimmedUrl.endsWith("/api") ? trimmedUrl : `${trimmedUrl}/api`;

export async function startNegotiation(
  item: string,
  initialPrice: number,
  targetPrice: number
): Promise<NegotiationResponse> {
  // Makes request to `${API_BASE_URL}/negotiate/start`
  const response = await axios.post<NegotiationResponse>(`${API_BASE_URL}/negotiate/start`, {
    item,
    initialPrice,
    targetPrice,
  });
  return response.data;
}

export async function nextNegotiationTurn(sessionId: string): Promise<NegotiationResponse> {
  // Makes request to `${API_BASE_URL}/negotiate/${sessionId}/turn`
  const response = await axios.post<NegotiationResponse>(`${API_BASE_URL}/negotiate/${sessionId}/turn`);
  return response.data;
}