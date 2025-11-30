import type { LeadInfo, Note, Suggestion } from "./types";

export const INITIAL_LEAD: LeadInfo = {
  name: "Unknown Lead",
  company: "Not identified",
  email: "-",
  phone: "-",
  score: 0,
  status: "New",
  summary: "Awaiting conversation data...",
};

export const MOCK_NOTES: Note[] = [
  {
    id: "1",
    content:
      "User expressed interest in the Enterprise plan during the last webinar.",
    createdAt: new Date(Date.now() - 86400000),
  },
];

export const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    label: "Schedule a Demo",
    action: "I would like to schedule a product demo.",
  },
  {
    label: "Request Pricing",
    action: "Can you send me the pricing tier details?",
  },
  {
    label: "Tech Support",
    action: "I have a technical implementation question.",
  },
];
