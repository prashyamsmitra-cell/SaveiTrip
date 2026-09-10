import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { listMyInquiries } from "./api/inquiries";
import { listMyBusinesses } from "./api/admin";
import { listNotifications } from "./api/notifications";
import { listHelperEndorsementsByBusiness } from "./api/endorsements";
import type {
  BusinessProfile,
  EndorsementInquiry,
  HelperEndorsement,
  NotificationDelivery
} from "./endorsementTypes";
import InquiryCard from "./components/InquiryCard";
import NotificationList from "./components/NotificationList";
import { EmptyState, ErrorState, LoadingState, PageHeader } from "./components/StateViews";
import { HelperEndorsementStatusBadge } from "./components/StatusBadge";
import { formatLocation } from "./components/format";

export default function BusinessPromotionPage() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [inquiries, setInquiries] = useState<EndorsementInquiry[]>([]);
  const [helperEndorsements, setHelperEndorsements] = useState<HelperEndorsement[]>([]);
  const [notifications, setNotifications] = useState<NotificationDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const biz = await listMyBusinesses();
      setBusinesses(biz.businesses);
      const [inq, ntf] = await Promise.all([
        listMyInquiries(),
        listNotifications()
      ]);
      setInquiries(inq.inquiries);
      setNotifications(ntf.notifications);
      const primary = biz.businesses[0];
      if (primary) {
        const he = await listHelperEndorsementsByBusiness(primary.id);
        setHelperEndorsements(he.endorsements);
      } else {
        setHelperEndorsements([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your business workspace.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeInquiryCount = inquiries.filter((i) =>
    ["SUBMITTED", "UNDER_REVIEW", "ADDITIONAL_INFORMATION_REQUIRED", "INSPECTION_REQUIRED"].includes(i.status)
  ).length;
  const activeCount = inquiries.filter((i) => ["VERIFIED", "ACTIVE"].includes(i.status)).length;
  const unread = notifications.filter((n) => !n.readAt).length;

  return (
    <AppShell>
      <section className="page-fade">
        <PageHeader
          kicker="Business workspace"
          title="Promote your business."
          description="Manage your endorsement, track the review pipeline, and stay on top of helper activity."
          action={
            <Link to="/business/inquiry/new" className="btn btn-primary">
              <Icon name="zap" className="h-4 w-4" />
              New inquiry
            </Link>
          }
        />

        {loading ? (
          <div className="mt-8">
            <LoadingState rows={4} />
          </div>
        ) : error ? (
          <div className="mt-8">
            <ErrorState message={error} onRetry={load} />
          </div>
        ) : (
          <>
            {/* Profile status */}
            <div className="mt-8 card p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-green-soft text-accent-green">
                    <Icon name="shield-check" className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm text-ink-faint">Signed in as</p>
                    <h2 className="font-display text-2xl leading-tight">
                      {businesses.length > 0 ? businesses[0]!.name : user?.name}
                    </h2>
                    <p className="mt-1 text-sm text-ink-soft">
                      {businesses.length > 0
                        ? `${businesses[0]!.category} · ${formatLocation(businesses[0]!.location)}`
                        : "No business profile yet — create one to start inquiries."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {businesses.length === 0 ? (
                    <Link to="/business/profile" className="btn btn-accent">
                      Create business profile
                    </Link>
                  ) : (
                    <Link to="/business/profile" className="btn btn-outline">
                      Manage profile
                    </Link>
                  )}
                  <Link to="/business/inquiry/new" className="btn btn-outline">
                    Start inquiry
                  </Link>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric
                label="My businesses"
                value={String(businesses.length)}
                icon="users"
              />
              <Metric label="All inquiries" value={String(inquiries.length)} icon="message-circle" />
              <Metric label="Pending review" value={String(activeInquiryCount)} icon="clock" />
              <Metric label="Active endorsements" value={String(activeCount)} icon="shield-check" />
            </div>

            {/* Helper endorsements received */}
            {helperEndorsements.length > 0 && (
              <div className="mt-6 card p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-xl">Helper endorsements</h2>
                  <HelperEndorsementStatusBadge status={helperEndorsements[helperEndorsements.length - 1]!.status} />
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  Travel helpers have endorsed your business. Helpers submitted {helperEndorsements.length}{" "}
                  endorsement{helperEndorsements.length > 1 ? "s" : ""} for this profile.
                </p>
              </div>
            )}

            {/* Inquiries */}
            <div className="mt-10">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="kicker">Endorsement inquiries</p>
                  <h2 className="font-display mt-2 text-3xl">Your review pipeline</h2>
                </div>
                <Link to="/business/inquiry/new" className="text-sm font-medium text-accent-green hover:underline">
                  New inquiry
                </Link>
              </div>

              {inquiries.length === 0 ? (
                <div className="mt-6">
                  <EmptyState
                    icon="star"
                    title="No inquiries yet"
                    message="Start your first endorsement inquiry to get on the map for travelers and helpers."
                  >
                    <Link to="/business/inquiry/new" className="btn btn-primary">
                      Create inquiry
                    </Link>
                  </EmptyState>
                </div>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {inquiries.map((inquiry) => (
                    <InquiryCard
                      key={inquiry.id}
                      inquiry={inquiry}
                      detailPath={`/business/inquiry/${inquiry.id}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="card p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-xl">Notifications</h2>
                  {unread > 0 && (
                    <span className="badge bg-accent-green text-canvas">{unread} unread</span>
                  )}
                </div>
                <div className="mt-4">
                  <NotificationList notifications={notifications.slice(0, 6)} />
                </div>
              </div>

              <div className="card p-6">
                <p className="kicker">Helper coverage</p>
                <h2 className="font-display mt-2 text-xl">Your helper network</h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  Helpers in your area discover and review local businesses. Their verified
                  endorsements feed the coverage score shown to travelers.
                </p>
                <div className="mt-5 space-y-3">
                  <Link to="/business/profile" className="btn btn-outline w-full justify-center">
                    <Icon name="users" className="h-4 w-4" />
                    Manage your business profile
                  </Link>
                  <Link to="/helper/endorsements" className="btn btn-outline w-full justify-center">
                    <Icon name="star" className="h-4 w-4" />
                    View helper opportunities
                  </Link>
                </div>
              </div>
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
  icon: "users" | "message-circle" | "clock" | "shield-check";
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