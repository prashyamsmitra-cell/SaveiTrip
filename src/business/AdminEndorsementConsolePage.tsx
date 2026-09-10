import { useCallback, useEffect, useState } from "react";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";
import { getDashboard, listAdminInquiries } from "./api/admin";
import { listAdminHelperEndorsements } from "./api/endorsements";
import { listSponsorships } from "./api/sponsorship";
import type {
  AdminDashboard,
  CommercialArrangement,
  EndorsementInquiry,
  EndorsementStatus,
  HelperEndorsement
} from "./endorsementTypes";
import { ErrorState, LoadingState } from "./components/StateViews";
import {
  HelperEndorsementStatusBadge,
  SponsorshipStatusBadge
} from "./components/StatusBadge";
import { formatLocation, timeAgo, titleCase } from "./components/format";
import InquiryCard from "./components/InquiryCard";
import AuditTimeline from "./components/AuditTimeline";

type Tab = "inquiries" | "helpers" | "sponsorships" | "audit";

const TABS: { key: Tab; label: string; icon: "message-circle" | "users" | "rupee" | "clock" }[] = [
  { key: "inquiries", label: "Inquiries", icon: "message-circle" },
  { key: "helpers", label: "Helper endorsements", icon: "users" },
  { key: "sponsorships", label: "Sponsorships", icon: "rupee" },
  { key: "audit", label: "Audit log", icon: "clock" }
];

export default function AdminEndorsementConsolePage() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [inquiries, setInquiries] = useState<EndorsementInquiry[]>([]);
  const [helpers, setHelpers] = useState<HelperEndorsement[]>([]);
  const [sponsorships, setSponsorships] = useState<CommercialArrangement[]>([]);
  const [tab, setTab] = useState<Tab>("inquiries");
  const [inquiryFilter, setInquiryFilter] = useState<EndorsementStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const [d, i, h, s] = await Promise.all([
        getDashboard(),
        listAdminInquiries(),
        listAdminHelperEndorsements(),
        listSponsorships()
      ]);
      setDashboard(d.dashboard);
      setInquiries(i.inquiries);
      setHelpers(h.endorsements);
      setSponsorships(s.sponsorships);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin console.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredInquiries = inquiryFilter === "all"
    ? inquiries
    : inquiries.filter((i) => i.status === inquiryFilter);

  const statusTabFilters: (EndorsementStatus | "all")[] = [
    "all",
    "SUBMITTED",
    "UNDER_REVIEW",
    "ADDITIONAL_INFORMATION_REQUIRED",
    "INSPECTION_REQUIRED",
    "VERIFIED",
    "ACTIVE",
    "REJECTED"
  ];

  return (
    <AppShell>
      <section className="page-fade">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">Admin</p>
            <h1 className="font-display mt-4 text-4xl leading-[1.05] md:text-5xl">
              Endorsement console.
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-ink-soft">
              Review inquiries, inspect helper endorsements, manage sponsorships, and maintain the
              audit trail.
            </p>
          </div>
          <button onClick={() => load()} disabled={loading} className="btn btn-ghost self-start md:self-auto">
            {loading ? <Spinner className="h-4 w-4" /> : <Icon name="refresh" className="h-4 w-4" />}
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-10"><LoadingState rows={6} /></div>
        ) : error ? (
          <div className="mt-10"><ErrorState message={error} onRetry={load} /></div>
        ) : dashboard && (
          <>
            {/* Dashboard metrics */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Total inquiries" value={String(dashboard.counts.inquiries)} icon="message-circle" />
              <Metric label="Pending review" value={String(dashboard.counts.submitted + dashboard.counts.underReview)} icon="clock" />
              <Metric label="Active endorsements" value={String(dashboard.counts.active)} icon="shield-check" />
              <Metric
                label="Helper endorsements (pending)"
                value={String(dashboard.helperEndorsement.pendingReview)}
                icon="users"
              />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MiniMetric label="Draft" value={dashboard.counts.draft} />
              <MiniMetric label="Inspection needed" value={dashboard.counts.inspectionRequired} />
              <MiniMetric label="Verified" value={dashboard.counts.verified} />
              <MiniMetric label="Rejected" value={dashboard.counts.rejected} />
            </div>

            {/* Sponsorships summary */}
            <div className="mt-8 card flex flex-wrap items-center gap-6 p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-amber-soft text-accent-amber">
                  <Icon name="rupee" className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-2xl">{dashboard.sponsorship.pending}</p>
                  <p className="text-xs text-ink-soft">Sponsorship pending</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-green-soft text-accent-green">
                  <Icon name="rupee" className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-2xl">{dashboard.sponsorship.active}</p>
                  <p className="text-xs text-ink-soft">Sponsorships active</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-10 flex flex-wrap items-center gap-2">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                    tab === t.key
                      ? "border-ink bg-ink text-canvas"
                      : "border-line bg-surface-high text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  <Icon name={t.icon} className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="mt-8">
              {tab === "inquiries" && (
                <>
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {statusTabFilters.map((s) => (
                      <button
                        key={s}
                        onClick={() => setInquiryFilter(s)}
                        className={`rounded-full border px-3 py-1 text-[0.65rem] font-medium transition-colors ${
                          inquiryFilter === s
                            ? "border-ink bg-ink text-canvas"
                            : "border-line text-ink-soft hover:border-ink"
                        }`}
                      >
                        {s === "all" ? "All" : titleCase(s.replace(/_/g, " ").toLowerCase())}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredInquiries.map((inq) => (
                      <InquiryCard
                        key={inq.id}
                        inquiry={inq}
                        detailPath={`/admin/inquiries/${inq.id}`}
                      />
                    ))}
                    {filteredInquiries.length === 0 && (
                      <p className="col-span-full py-10 text-center text-sm text-ink-soft">
                        No inquiries match this filter.
                      </p>
                    )}
                  </div>
                </>
              )}

              {tab === "helpers" && (
                <div className="space-y-4">
                  {helpers.length === 0 ? (
                    <p className="py-10 text-center text-sm text-ink-soft">No helper endorsements yet.</p>
                  ) : (
                    helpers.map((h) => (
                      <article key={h.id} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-display text-lg">{h.helperName}</span>
                            <HelperEndorsementStatusBadge status={h.status} />
                          </div>
                          <p className="mt-1 text-sm text-ink-soft">{h.reason}</p>
                          <p className="mt-1 text-xs text-ink-faint">
                            Business: {h.businessId} · {h.category} · {formatLocation(h.location)} · {timeAgo(h.createdAt)}
                          </p>
                        </div>
                        <span className="text-xs text-ink-faint">Review via inquiry detail</span>
                      </article>
                    ))
                  )}
                </div>
              )}

              {tab === "sponsorships" && (
                <div className="space-y-4">
                  {sponsorships.length === 0 ? (
                    <p className="py-10 text-center text-sm text-ink-soft">No sponsorship arrangements yet.</p>
                  ) : (
                    sponsorships.map((s) => (
                      <article key={s.id} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-display text-lg">{titleCase(s.commercialMode.replace(/_/g, " ").toLowerCase())}</span>
                            <SponsorshipStatusBadge status={s.sponsorshipStatus ?? "PENDING"} />
                          </div>
                          <p className="mt-1 text-sm text-ink-soft">
                            Inquiry: {s.inquiryId} · {timeAgo(s.createdAt)}
                          </p>
                          {s.sponsorshipReason && (
                            <p className="mt-1 text-xs text-ink-faint">{s.sponsorshipReason}</p>
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}

              {tab === "audit" && (
                <AuditTimeline entries={dashboard.recentActivity} />
              )}
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}

function Metric({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon: "message-circle" | "clock" | "users" | "shield-check";
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-canvas-alt text-ink-soft">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-3xl leading-none">{value}</p>
        <p className="mt-1 text-xs text-ink-soft">{label}</p>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="card flex items-baseline gap-2 p-4">
      <span className="font-display text-2xl">{value}</span>
      <span className="text-xs text-ink-soft">{label}</span>
    </div>
  );
}