import type { ReactNode } from "react";
import { Icon } from "../../shared/Icon";
import { Skeleton, Spinner } from "../../shared/ui";
import type { IconName } from "../../shared/Icon";

export function LoadingState({ rows = 3, label }: { rows?: number; label?: string }) {
  return (
    <div className="space-y-4" role="status" aria-label={label ?? "Loading"}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card space-y-3 p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
  title = "Something went wrong"
}: {
  message: string;
  onRetry?: () => void;
  title?: string;
}) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-accent-red/30 bg-accent-red-soft/40 px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-red-soft text-accent-red">
        <Icon name="alert" className="h-5 w-5" />
      </span>
      <h2 className="font-display mt-4 text-xl">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink-soft">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline mt-6">
          <Icon name="refresh" className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  icon = "star",
  title,
  message,
  children
}: {
  icon?: IconName;
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-canvas-alt text-ink-faint">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h2 className="font-display mt-5 text-xl">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">{message}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

export function InlineSpinner({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
      <Spinner className="h-4 w-4 text-accent-green" />
      {label}
    </span>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
  action
}: {
  kicker: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="kicker">{kicker}</p>
        <h1 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}