import type { NotificationDelivery } from "../endorsementTypes";
import { Icon } from "../../shared/Icon";
import { timeAgo, titleCase } from "./format";
import type { IconName } from "../../shared/Icon";

const typeIcon: Partial<Record<NotificationDelivery["type"], IconName>> = {
  INQUIRY_SUBMITTED: "message-circle",
  CLAIM_SUBMITTED: "zap",
  REVIEW_STARTED: "shield",
  ADDITIONAL_INFORMATION_REQUESTED: "alert",
  ADDITIONAL_INFORMATION_SUBMITTED: "message-circle",
  INSPECTION_REQUESTED: "pin",
  INSPECTION_COMPLETED: "shield-check",
  HELPER_ENDORSEMENT_SUBMITTED: "users",
  HELPER_ENDORSEMENT_REVIEWED: "shield-check",
  ENDORSEMENT_VERIFIED: "shield-check",
  ENDORSEMENT_ACTIVATED: "check",
  ENDORSEMENT_REJECTED: "x",
  ENDORSEMENT_EXPIRED: "clock",
  ENDORSEMENT_REVOKED: "x",
  SPONSORSHIP_REVIEWED: "trend",
  SPONSORSHIP_ACTIVE: "trend",
  SPONSORSHIP_ENDED: "trend",
  CLASSIFICATION_UPDATED: "star"
};

export default function NotificationList({
  notifications,
  onMarkRead
}: {
  notifications: NotificationDelivery[];
  onMarkRead?: (id: string) => void;
}) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-canvas-alt text-ink-faint">
          <Icon name="clock" className="h-5 w-5" />
        </span>
        <p className="mt-4 text-sm font-medium text-ink">No notifications yet</p>
        <p className="mt-1 text-xs text-ink-soft">
          Updates about your endorsements will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line/70">
      {notifications.map((n) => {
        const unread = !n.readAt;
        return (
          <li
            key={n.id}
            className={`flex items-start gap-3 py-3.5 ${unread ? "" : "opacity-65"}`}
          >
            <span
              className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                unread
                  ? "bg-accent-green-soft text-accent-green"
                  : "bg-canvas-alt text-ink-faint"
              }`}
            >
              <Icon name={typeIcon[n.type] ?? "shield"} className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-6 text-ink">{n.message}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
                <span>{titleCase(n.type)}</span>
                <span>{timeAgo(n.createdAt)}</span>
                <span className="capitalize">{n.entityType.replace("_", " ")}</span>
              </p>
            </div>
            {unread && onMarkRead && (
              <button
                onClick={() => onMarkRead(n.id)}
                className="btn btn-ghost shrink-0 px-2.5! py-1! text-xs"
              >
                Mark read
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}