import { Icon } from "./Icon";

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return <span aria-hidden="true" className={`spinner ${className}`} />;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}

export function Avatar({ name, className = "" }: { name?: string | null; className?: string }) {
  const initials = (name ?? "T")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full bg-accent-green text-[0.8125rem] font-semibold text-canvas ${className}`}
    >
      {initials}
    </span>
  );
}

export function Brand({ className = "", withMark = false }: { className?: string; withMark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-display text-xl tracking-tight ${className}`}>
      {withMark && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-green text-canvas">
          <Icon name="compass" className="h-4 w-4" />
        </span>
      )}
      <span>
        Savei<span className="text-accent-green">Trip</span>
      </span>
    </span>
  );
}
