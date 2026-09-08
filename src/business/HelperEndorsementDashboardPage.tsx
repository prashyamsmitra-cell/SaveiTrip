import { useCallback, useEffect, useState } from "react";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { Skeleton, Spinner } from "../shared/ui";
import {
  listEndorsementOpportunities,
  setEndorsementOpportunityStatus
} from "./endorsementService";
import type { EndorsementOpportunity, EndorsementStatus } from "./endorsementTypes";

const statusMeta: Record<
  EndorsementStatus,
  { label: string; badge: string; dot: string }
> = {
  available: {
    label: "Available",
    badge: "bg-accent-green-soft text-accent-green",
    dot: "bg-accent-green"
  },
  claimed: {
    label: "Claimed",
    badge: "bg-accent-amber-soft text-accent-amber",
    dot: "bg-accent-amber"
  },
  "under-review": {
    label: "Under Review",
    badge: "bg-accent-amber-soft text-accent-amber",
    dot: "bg-accent-amber"
  },
  endorsed: {
    label: "Endorsed",
    badge: "bg-accent-green text-canvas",
    dot: "bg-accent-green"
  },
  "not-endorsed": {
    label: "Not Endorsed",
    badge: "bg-accent-red-soft text-accent-red",
    dot: "bg-accent-red"
  }
};

const filters: { key: EndorsementStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "available", label: "Available" },
  { key: "claimed", label: "Claimed" },
  { key: "under-review", label: "Under Review" },
  { key: "endorsed", label: "Endorsed" },
  { key: "not-endorsed", label: "Not Endorsed" }
];

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function HelperEndorsementDashboardPage() {
  const [opportunities, setOpportunities] = useState<EndorsementOpportunity[]>([]);
  const [filter, setFilter] = useState<EndorsementStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setError("");
      setLoading(true);
    }
    try {
      const result = await listEndorsementOpportunities();
      setOpportunities(result.opportunities);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load opportunities.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function transitionTo(id: string, status: EndorsementStatus) {
    setBusyId(id);
    setError("");
    try {
      await setEndorsementOpportunityStatus(id, status);
      await load(true);
    } catch (changeError) {
      setError(
        changeError instanceof Error ? changeError.message : "Action failed. Please try again."
      );
    } finally {
      setBusyId(null);
    }
  }

  const filtered =
    filter === "all" ? opportunities : opportunities.filter((item) => item.status === filter);

  const countFor = (key: EndorsementStatus | "all") =>
    key === "all" ? opportunities.length : opportunities.filter((item) => item.status === key).length;

  return (
    <AppShell helperMode>
      <section className="page-fade">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
                </span>
                Live endorsement opportunities
              </span>
            </p>
            <h1 className="font-display mt-4 text-4xl leading-[1.05] md:text-5xl">
              Local businesses near you.
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-ink-soft">
              Businesses have asked for on-ground review. Claims you can make within your coverage
              area surface here first.
            </p>
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="btn btn-ghost self-start md:self-auto"
          >
            {refreshing ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Icon name="refresh" className="h-4 w-4" />
            )}
            Refresh feed
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {filters.map((option) => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === option.key
                  ? "border-ink bg-ink text-canvas"
                  : "border-line bg-surface-high text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {option.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold leading-none ${
                  filter === option.key
                    ? "bg-canvas/20 text-canvas"
                    : "bg-canvas-alt text-ink-faint"
                }`}
              >
                {countFor(option.key)}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-accent-red/25 bg-accent-red-soft p-4">
            <div className="alert-error border-0 bg-transparent p-0">
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => load()} className="btn btn-outline shrink-0 px-3! py-1.5! text-xs">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 flex min-h-[16rem] flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-canvas-alt text-ink-faint">
              <Icon name="star" className="h-6 w-6" />
            </span>
            <h2 className="font-display mt-5 text-xl">
              {opportunities.length === 0
                ? "No opportunities right now"
                : "Nothing here yet"}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">
              {opportunities.length === 0
                ? "New business endorsements will appear here as they are received. Check back soon."
                : "No businesses match this status. Try another filter to keep browsing the board."}
            </p>
            {opportunities.length > 0 && (
              <button onClick={() => setFilter("all")} className="btn btn-outline mt-6">
                Show all opportunities
              </button>
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const meta = statusMeta[item.status];
              const busy = busyId === item.id;
              return (
                <article
                  key={item.id}
                  className={`card flex h-full flex-col p-6 transition-transform ${
                    item.status === "available"
                      ? "border-accent-green/30 ring-1 ring-accent-green/10"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="chip">{item.category}</span>
                    <span className={`badge ${meta.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                  </div>

                  <h2 className="font-display mt-4 text-2xl leading-tight">
                    {item.businessName}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="pin" className="h-3.5 w-3.5 text-ink-faint" />
                      {item.location}
                    </span>
                    <span className="badge bg-canvas-alt text-ink-soft">
                      {item.distanceKm.toFixed(1)} km from you
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-faint">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="trend" className="h-3.5 w-3.5" />
                      {item.scale}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="clock" className="h-3.5 w-3.5" />
                      {timeAgo(item.postedAt)}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-ink-soft">{item.summary}</p>

                  <div className="mt-auto pt-6">
                    {item.status === "available" && (
                      <button
                        onClick={() => transitionTo(item.id, "claimed")}
                        disabled={busy}
                        className="btn btn-accent w-full justify-center"
                      >
                        {busy ? (
                          <>
                            <Spinner /> Claiming...
                          </>
                        ) : (
                          <>
                            <Icon name="zap" className="h-4 w-4" />
                            Claim opportunity
                          </>
                        )}
                      </button>
                    )}

                    {item.status === "claimed" && (
                      <button
                        onClick={() => transitionTo(item.id, "under-review")}
                        disabled={busy}
                        className="btn btn-primary w-full justify-center"
                      >
                        {busy ? (
                          <>
                            <Spinner /> Updating...
                          </>
                        ) : (
                          "Start inspection & review"
                        )}
                      </button>
                    )}

                    {item.status === "under-review" && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => transitionTo(item.id, "endorsed")}
                          disabled={busy}
                          className="btn btn-accent justify-center"
                        >
                          {busy ? (
                            <Spinner />
                          ) : (
                            <>
                              <Icon name="check" className="h-4 w-4" />
                              Endorse
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => transitionTo(item.id, "not-endorsed")}
                          disabled={busy}
                          className="btn btn-outline justify-center text-accent-red! hover:border-accent-red hover:bg-accent-red-soft"
                        >
                          Not endorsed
                        </button>
                      </div>
                    )}

                    {item.status === "endorsed" && (
                      <button
                        disabled
                        className="btn w-full cursor-default justify-center bg-accent-green-soft text-accent-green"
                      >
                        <Icon name="shield-check" className="h-4 w-4" />
                        Endorsement published
                      </button>
                    )}

                    {item.status === "not-endorsed" && (
                      <button
                        disabled
                        className="btn w-full cursor-default justify-center bg-accent-red-soft text-accent-red"
                      >
                        <Icon name="x" className="h-4 w-4" />
                        Closed — not endorsed
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}