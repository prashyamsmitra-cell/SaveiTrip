import { useState, useRef, useEffect, useCallback } from "react";
import {
  listConversations,
  getConversation,
  sendMessage,
  deleteConversation,
  type ConversationSummary,
  type ConversationMessage,
} from "./travelAnalysisApi";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";

const SUGGESTED_PROMPTS = [
  { label: "Plan a trip", icon: "route" as const, text: "Plan a 5-day trip to Sikkim under ₹30,000" },
  { label: "Check safety", icon: "shield" as const, text: "Is Darjeeling safe right now?" },
  { label: "Compare stays", icon: "scale" as const, text: "Find accommodation in Kerala" },
  { label: "Destination info", icon: "compass" as const, text: "Tell me about Ladakh" },
];

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n• /g, "\n<li>")
    .replace(/\n(<li>)/g, "$1")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

function ToolBadge({ name }: { name: string }) {
  const labels: Record<string, string> = {
    search_accommodation: "Searching accommodation",
    get_destination_info: "Looking up destination",
    assess_travel_risk: "Checking travel risk",
    plan_trip: "Planning your trip",
  };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green-soft px-2.5 py-1 text-xs font-medium text-accent-green">
      <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
      {labels[name] ?? name}
    </span>
  );
}

function AssistantMessage({ message }: { message: ConversationMessage }) {
  const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;

  return (
    <div className="group flex gap-3">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-green text-canvas text-xs font-semibold">
        S
      </div>
      <div className="min-w-0 flex-1">
        {hasToolCalls && (
          <div className="mb-2 flex flex-wrap gap-2">
            {message.toolCalls!.map((tc) => (
              <ToolBadge key={tc.id} name={tc.name} />
            ))}
          </div>
        )}
        <div
          className="prose-saveitrip text-sm leading-7 text-ink"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: ConversationMessage }) {
  return (
    <div className="group flex gap-3">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-canvas text-xs font-semibold">
        U
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-7 text-ink">{message.content}</p>
      </div>
    </div>
  );
}

function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-line bg-surface">
      <div className="p-4">
        <button onClick={onNew} className="btn btn-outline w-full justify-center gap-2 text-xs">
          <Icon name="arrow-right" className="h-3.5 w-3.5 rotate-45" />
          New trip
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <p className="kicker mb-2 px-2">Recent</p>
        {conversations.length === 0 ? (
          <p className="px-2 text-xs text-ink-faint">No conversations yet</p>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => onSelect(c.id)}
                  className={`group/item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeId === c.id
                      ? "bg-ink text-canvas"
                      : "text-ink-soft hover:bg-canvas hover:text-ink"
                  }`}
                >
                  <Icon name="compass" className="h-3.5 w-3.5 shrink-0 opacity-50" />
                  <span className="min-w-0 flex-1 truncate">{c.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(c.id);
                    }}
                    className={`ml-1 shrink-0 rounded p-0.5 opacity-0 transition-opacity group-hover/item:opacity-100 ${
                      activeId === c.id ? "hover:bg-canvas/20" : "hover:bg-ink/5"
                    }`}
                    aria-label="Delete conversation"
                  >
                    <Icon name="alert" className="h-3 w-3" />
                  </button>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function WelcomeScreen({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="text-center">
        <p className="kicker">Travel Assistant</p>
        <h2 className="font-display mt-3 text-3xl leading-tight md:text-4xl">
          How can I help with<br />your journey?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink-soft">
          Ask me anything about Indian destinations — trip planning, safety, budgets, stays, and more.
        </p>
      </div>
      <div className="mt-8 grid w-full max-w-lg grid-cols-2 gap-3">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt.label}
            onClick={() => onPrompt(prompt.text)}
            className="card flex items-center gap-3 p-4 text-left transition-all hover:shadow-card-hover"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-canvas text-ink-faint">
              <Icon name={prompt.icon} className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium">{prompt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TravelAssistantPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    listConversations()
      .then((res) => setConversations(res.conversations))
      .catch(() => {})
      .finally(() => setInitialLoading(false));
  }, []);

  const handleNewConversation = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  }, []);

  const handleSelectConversation = useCallback(async (id: string) => {
    setActiveConversationId(id);
    setLoading(true);
    try {
      const res = await getConversation(id);
      setMessages(res.conversation.messages);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteConversation = useCallback(async (id: string) => {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
      }
    } catch {
      // ignore
    }
  }, [activeConversationId]);

  const handleSend = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    setInput("");
    setLoading(true);

    const userMessage: ConversationMessage = {
      id: `temp_${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await sendMessage(activeConversationId ?? "", content);

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => !m.id.startsWith("temp_"));
        return [...withoutTemp, res.message];
      });

      if (!activeConversationId) {
        setActiveConversationId(res.conversationId);
      }

      setConversations((prev) => {
        const exists = prev.find((c) => c.id === res.conversationId);
        if (exists) {
          return prev.map((c) =>
            c.id === res.conversationId
              ? { ...c, title: res.conversationId === activeConversationId ? c.title : content.length > 50 ? content.slice(0, 47) + "..." : content, updatedAt: new Date().toISOString() }
              : c
          );
        }
        return [
          {
            id: res.conversationId,
            title: content.length > 50 ? content.slice(0, 47) + "..." : content,
            messageCount: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    } catch {
      setMessages((prev) => prev.filter((m) => !m.id.startsWith("temp_")));
    } finally {
      setLoading(false);
    }
  }, [input, loading, activeConversationId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {messages.length === 0 && !loading ? (
          <WelcomeScreen onPrompt={handleSend} />
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-2xl space-y-6">
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <UserMessage key={msg.id} message={msg} />
                ) : (
                  <AssistantMessage key={msg.id} message={msg} />
                )
              )}
              {loading && (
                <div className="flex gap-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-green text-canvas text-xs font-semibold">
                    S
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-faint">
                    <Spinner className="h-3.5 w-3.5" />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <div className="border-t border-line bg-surface px-6 py-4">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-end gap-3 rounded-xl border border-line bg-surface-high p-3 shadow-sm focus-within:border-ink/30 focus-within:shadow-md transition-shadow">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your trip..."
                rows={1}
                className="min-h-[2.5rem] flex-1 resize-none border-0 bg-transparent p-0 text-sm leading-6 text-ink placeholder:text-ink-faint focus:outline-none focus:ring-0"
                style={{ maxHeight: "120px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 120) + "px";
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="btn btn-primary !rounded-lg !p-2.5"
                aria-label="Send message"
              >
                <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[0.7rem] text-ink-faint">
              SaveiTrip Travel Assistant — Built for India's destinations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
