import type { HelperCoverage } from "../endorsementTypes";
import { Icon } from "../../shared/Icon";
import { timeAgo } from "./format";

export default function CoverageCard({ coverage }: { coverage: HelperCoverage }) {
  const pct = Math.max(0, Math.min(100, Math.round(coverage.coverageScore)));

  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="kicker">Coverage area</p>
          <h3 className="font-display mt-1.5 text-xl leading-tight">{coverage.area}</h3>
          {coverage.category && (
            <span className="chip mt-2">{coverage.category}</span>
          )}
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-green-soft text-accent-green">
          <Icon name="map-pin" className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-canvas-alt">
          <div
            className="h-full rounded-full bg-accent-green transition-[width] duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-ink">{pct}/100</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
        <Stat value={String(coverage.helperCount)} label="Helpers" />
        <Stat value={String(coverage.endorsedBusinesses)} label="Businesses" />
        <Stat value={`${coverage.freshnessDays}d`} label="Freshness" />
      </div>

      {coverage.categoriesCovered.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {coverage.categoriesCovered.slice(0, 6).map((cat) => (
            <span key={cat} className="chip">
              {cat}
            </span>
          ))}
          {coverage.categoriesCovered.length > 6 && (
            <span className="chip">+{coverage.categoriesCovered.length - 6}</span>
          )}
        </div>
      )}

      <p className="mt-auto pt-5 text-xs text-ink-faint">
        Computed {timeAgo(coverage.computedAt)}
      </p>
    </article>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl leading-none">{value}</p>
      <p className="mt-1 text-xs text-ink-soft">{label}</p>
    </div>
  );
}
