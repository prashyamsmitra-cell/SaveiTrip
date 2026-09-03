const API_URL = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "saveitrip_token";

async function authedRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? "Request failed");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type ConversationSummary = {
  id: string;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ConversationMessage = {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  toolCalls?: Array<{
    id: string;
    name: string;
    arguments: Record<string, unknown>;
  }>;
  toolResult?: {
    toolCallId: string;
    toolName: string;
    result: unknown;
    isError?: boolean;
  };
  createdAt: string;
};

export type Conversation = {
  id: string;
  userId: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
};

export type ChatResponse = {
  conversationId: string;
  message: ConversationMessage;
  toolResults?: Array<{
    toolCallId: string;
    toolName: string;
    result: unknown;
    isError?: boolean;
  }>;
};

export async function listConversations() {
  return authedRequest<{ conversations: ConversationSummary[] }>("/api/assistant/conversations");
}

export async function getConversation(id: string) {
  return authedRequest<{ conversation: Conversation }>(`/api/assistant/conversations/${id}`);
}

export async function sendMessage(conversationId: string, content: string) {
  return authedRequest<ChatResponse>("/api/assistant/chat", {
    method: "POST",
    body: JSON.stringify({ conversationId, content }),
  });
}

export async function deleteConversation(id: string) {
  return authedRequest<void>(`/api/assistant/conversations/${id}`, {
    method: "DELETE",
  });
}
