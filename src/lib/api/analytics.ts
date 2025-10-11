import { apiFetch } from "./base";
import type {
  VisitorAnalyticsResponse,
  VisitorTrackResponse,
} from "@/types/api";

/**
 * Get visitor analytics data
 */
export const getVisitorAnalytics = async (
  days: number = 30
): Promise<VisitorAnalyticsResponse> => {
  return apiFetch(`/admin/analytics/visitors?days=${days}`);
};

/**
 * Track a visitor (public endpoint)
 */
export const trackVisitor = async (
  page: string = "/"
): Promise<VisitorTrackResponse> => {
  const sessionId = getOrCreateSessionId();

  return apiFetch("/track", {
    method: "POST",
    headers: {
      "X-Session-ID": sessionId,
    },
    body: JSON.stringify({
      page,
      timestamp: new Date().toISOString(),
    }),
  });
};

/**
 * Get or create session ID from localStorage
 */
const getOrCreateSessionId = (): string => {
  if (typeof window === "undefined") {
    return "server-session";
  }

  let sessionId = localStorage.getItem("visitor_session_id");
  if (!sessionId) {
    sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    localStorage.setItem("visitor_session_id", sessionId);
  }
  return sessionId;
};
