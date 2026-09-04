const API_URL = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "saveitrip_token";
const USER_KEY = "saveitrip_user";

function handleUnauthorized() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

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

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error("Your session has expired. Please log in again.");
  }

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

export type StreamHandlers = {
  onToken: (delta: string) => void;
  onFallback: () => void;
};

export async function sendMessageStreaming(
  conversationId: string,
  content: string,
  handlers: StreamHandlers
): Promise<{ conversationId: string; messageId: string; fallback: boolean }> {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}/api/assistant/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ conversationId, content }),
  });

  if (response.status === 401) {
    handleUnauthorized();
    handlers.onFallback();
    return { conversationId: "", messageId: "", fallback: true };
  }

  if (!response.ok || !response.body) {
    handlers.onFallback();
    return { conversationId: "", messageId: "", fallback: true };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let streamConversationId = "";
  let messageId = "";
  let fallback = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const line = event.trim();
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload) continue;
        try {
          const data = JSON.parse(payload);
          if (data.type === "token") {
            handlers.onToken(data.delta);
          } else if (data.type === "fallback") {
            fallback = true;
            handlers.onFallback();
          } else if (data.type === "done") {
            streamConversationId = data.conversationId ?? "";
            messageId = data.messageId ?? "";
            fallback = data.fallback ?? fallback;
          }
        } catch {
          // ignore malformed chunk
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return { conversationId: streamConversationId, messageId, fallback };
}

export async function deleteConversation(id: string) {
  return authedRequest<void>(`/api/assistant/conversations/${id}`, {
    method: "DELETE",
  });
}
