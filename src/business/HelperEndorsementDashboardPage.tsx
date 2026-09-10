import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";
import { listOpportunities } from "./api/opportunities";
import {
  listMyHelperEndorsements,
  submitHelperEndorsement,
  withdrawHelperEndorsement
} from "./api/endorsements";
import { listPublicBusinesses } from "./api/coverage";
import type {
  EndorsementOpportunity,
  HelperEndorsement,
  LocationProfile,
  PublicBusiness
} from "./endorsementTypes";
import { ErrorState, EmptyState, LoadingState } from "./components/StateViews";
import { HelperEndorsementStatusBadge } from "./components/StatusBadge";
import { formatLocation, timeAgo } from "./components/format";

const EMPTY_LOCATION: LocationProfile = { city: "", state: "", region: "" };

export default function HelperEndorsementDashboardPage() {
  const [opportunities, setOpportunities] = useState<EndorsementOpportunity[]>([]);
  const [endorsements, setEndorsements] = useState<HelperEndorsement[]>([]);
  const [businesses, setBusinesses] = useState<PublicBusiness[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Endorsement form state
  const [businessId, setBusinessId] = useState("");
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState<LocationProfile>(EMPTY_LOCATION);
  const [evidenceRefs, setEvidenceRefs] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const [opps, mine, pub] = await Promise.all([
        listOpportunities(),
        listMyHelperEndorsements(),
        listPublicBusinesses()
      ]);
      setOpportunities(opps.opportunities);
      setEndorsements(mine.endorsements);
      setBusinesses(pub.businesses);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your endorsement workspace.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const businessNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const b of businesses) map.set(b.id, b.name);
    return map;
  }, [businesses]);

  const openCount = opportunities.filter((o) => o.status === "OPEN").length;

  async function handleSelectBusiness(id: string) {
    setBusinessId(id);
    const biz = businesses.find((b) => b.id === id);
    if (biz) {
      setCategory(biz.category);
      setLocation(biz.location);
    }
  }

  async function handleSubmitEndorsement(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!businessId) {
      setFormError("Select a business to endorse.");
      return;
    }
    if (!reason.trim()) {
      setFormError("Add a reason for your endorsement.");
      return;
    }
    setSubmitting(true);
    try {
      const refs = evidenceRefs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await submitHelperEndorsement({
        businessId,
        reason: reason.trim(),
        location,
        category: category.trim() || "General",
        evidenceRefs: refs.length > 0 ? refs : undefined
      });
      setFormSuccess("Endorsement submitted for review.");
      setReason("");
      setBusinessId("");
      setCategory("");
      setLocation(EMPTY_LOCATION);
      setEvidenceRefs("");
      const mine = await listMyHelperEndorsements();
      setEndorsements(mine.endorsements);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to submit endorsement.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleWithdraw(endorsementId: string) {
    setBusyId(endorsementId);
    setError("");
    try {
      await withdrawHelperEndorsement(endorsementId);
      const mine = await listMyHelperEndorsements();
      setEndorsements(mine.endorsements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not withdraw the endorsement.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AppShell>
      <section className="page-fade">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
                </span>
                Helper network
              </span>
            </p>
            <h1 className="font-display mt-4 text-4xl leading-[1.05] md:text-5xl">
              Endorse trusted local businesses.
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-ink-soft">
              Travelers rely on helpers like you. Submit an endorsement for a business you have
              personally experienced on the ground — the review team verifies every entry.
            </p>
          </div>
          <button onClick={() => load()} disabled={loading} className="btn btn-ghost self-start md:self-auto">
            {loading ? <Spinner className="h-4 w-4" /> : <Icon name="refresh" className="h-4 w-4" />}
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6">
            <ErrorState message={error} onRetry={() => load()} />
          </div>
        )}

        {loading ? (
          <div className="mt-10">
            <LoadingState rows={4} />
          </div>
        ) : (
          <>
            {/* Submit endorsement */}
            <div className="mt-10 grid gap-8 lg:grid-cols-5">
              <div className="card p-6 md:p-8 lg:col-span-3">
                <p className="kicker">New endorsement</p>
                <h2 className="font-display mt-2 text-2xl">Recommend a business</h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  Choose a business you have personally used, add why it deserves a traveler-facing
                  endorsement, and submit it to the review queue.
                </p>

                <form onSubmit={handleSubmitEndorsement} className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="biz" className="field-label">
                      Business
                    </label>
                    <select
                      id="biz"
                      value={businessId}
                      onChange={(e) => handleSelectBusiness(e.target.value)}
                      className="input"
                    >
                      <option value="">Select a business…</option>
                      {businesses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} — {formatLocation(b.location)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label htmlFor="cat" className="field-label">
                        Category
                      </label>
                      <input
                        id="cat"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input"
                        placeholder="Trekking gear"
                      />
                    </div>
                    <div>
                      <label htmlFor="rcity" className="field-label">
                        City
                      </label>
                      <input
                        id="rcity"
                        value={location.city}
                        onChange={(e) => setLocation({ ...location, city: e.target.value })}
                        className="input"
                        placeholder="Manali"
                      />
                    </div>
                    <div>
                      <label htmlFor="rstate" className="field-label">
                        State
                      </label>
                      <input
                        id="rstate"
                        value={location.state}
                        onChange={(e) => setLocation({ ...location, state: e.target.value })}
                        className="input"
                        placeholder="Himachal Pradesh"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reason" className="field-label">
                      Why should travelers trust this business?
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={4}
                      className="input resize-y"
                      placeholder="Share what you experienced — quality, reliability, fair pricing, safety…"
                    />
                  </div>

                  <div>
                    <label htmlFor="refs" className="field-label">
                      Evidence references (optional, comma separated)
                    </label>
                    <input
                      id="refs"
                      value={evidenceRefs}
                      onChange={(e) => setEvidenceRefs(e.target.value)}
                      className="input"
                      placeholder="booking ref, receipt link, photo ref…"
                    />
                  </div>

                  {formError && (
                    <div className="alert-error">
                      <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}
                  {formSuccess && (
                    <div className="rounded-xl border border-accent-green/25 bg-accent-green-soft px-4 py-3 text-sm text-accent-green">
                      {formSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-accent justify-center"
                  >
                    {submitting ? (
                      <>
                        <Spinner /> Submitting…
                      </>
                    ) : (
                      <>
                        <Icon name="shield-check" className="h-4 w-4" />
                        Submit endorsement
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* My endorsements */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-xl">Your endorsements</h2>
                  <span className="badge bg-canvas-alt text-ink-soft">{endorsements.length}</span>
                </div>
                {endorsements.length === 0 ? (
                  <div className="mt-4">
                    <EmptyState
                      icon="star"
                      title="Nothing yet"
                      message="Endorsements you submit will appear here with their review status."
                    />
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {endorsements.map((e) => (
                      <article key={e.id} className="card p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-display text-lg leading-snug">
                              {businessNameById.get(e.businessId) ?? "Business"}
                            </h3>
                            <p className="mt-1 text-xs text-ink-soft">
                              {e.category} · {formatLocation(e.location)}
                            </p>
                          </div>
                          <HelperEndorsementStatusBadge status={e.status} />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-ink-soft">{e.reason}</p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                          <span className="inline-flex items-center gap-1.5 text-xs text-ink-faint">
                            <Icon name="clock" className="h-3.5 w-3.5" />
                            {timeAgo(e.createdAt)}
                          </span>
                          {e.status === "SUBMITTED" && (
                            <button
                              onClick={() => handleWithdraw(e.id)}
                              disabled={busyId === e.id}
                              className="btn btn-ghost px-3! py-1.5! text-xs text-accent-red hover:text-accent-red!"
                            >
                              {busyId === e.id ? <Spinner className="h-3.5 w-3.5" /> : "Withdraw"}
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Opportunities board (business claims these) */}
            <div className="mt-14">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="kicker">Endorsement opportunities</p>
                  <h2 className="font-display mt-2 text-3xl">What admins are seeking</h2>
                </div>
                <span className="badge bg-accent-green-soft text-accent-green">{openCount} open</span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">
                Admins publish opportunities for coverage in specific areas. Businesses claim these —
                helpers stay in the loop on what the network is building toward.
              </p>

              {opportunities.length === 0 ? (
                <div className="mt-6">
                  <EmptyState
                    icon="star"
                    title="No opportunities right now"
                    message="When an admin publishes an endorsement opportunity it will show up here."
                  />
                </div>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {opportunities.map((o) => (
                    <article key={o.id} className="card flex h-full flex-col p-6">
                      <div className="flex items-start justify-between gap-3">
                        <span className="chip">{o.category}</span>
                        <span className="badge bg-canvas-alt text-ink-soft">
                          {o.status}
                        </span>
                      </div>
                      <h3 className="font-display mt-4 text-2xl leading-tight">{o.title}</h3>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="pin" className="h-3.5 w-3.5 text-ink-faint" />
                          {formatLocation(o.location)}
                        </span>
                        {o.expiresAt && (
                          <span className="inline-flex items-center gap-1.5">
                            <Icon name="clock" className="h-3.5 w-3.5 text-ink-faint" />
                            Ends {timeAgo(o.expiresAt)}
                          </span>
                        )}
                      </div>
                      <p className="mt-4 text-sm leading-6 text-ink-soft">{o.description}</p>
                      <div className="mt-auto pt-5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-ink-faint">
                          <Icon name="users" className="h-3.5 w-3.5" />
                          Claimed by businesses via the normal endorsement pipeline
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}