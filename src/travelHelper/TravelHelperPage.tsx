import { useState, useEffect } from "react";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";
import { listHelpers, searchHelpers, type TravelHelper } from "./travelHelperApi";

const REGIONS = ["All", "Sikkim", "Kerala", "Rajasthan", "Ladakh", "Darjeeling", "Goa"];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-accent-amber">
      <Icon name="star" className="h-3 w-3 fill-current" />
      {rating.toFixed(1)}
    </span>
  );
}

function HelperCard({ helper }: { helper: TravelHelper }) {
  const initials = helper.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <article className="card flex flex-col p-5 transition-all hover:shadow-card-hover">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-green text-canvas text-sm font-semibold">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{helper.name}</h3>
            {!helper.available && (
              <span className="badge bg-accent-amber-soft text-accent-amber text-[0.6rem]">Busy</span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-ink-soft">{helper.region}</p>
        </div>
        <div className="text-right">
          <StarRating rating={helper.rating} />
          <p className="mt-0.5 text-[0.65rem] text-ink-faint">{helper.reviewCount} reviews</p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-ink-soft">{helper.experience}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {helper.speciality.map((s) => (
          <span key={s} className="chip">{s}</span>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {helper.languages.map((l) => (
          <span key={l} className="text-[0.65rem] text-ink-faint">{l}</span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-3">
        <span className="text-xs font-medium text-accent-green">{helper.priceRange}</span>
        <button
          className="btn btn-outline !px-3 !py-1.5 text-xs"
          disabled={!helper.available}
        >
          <Icon name="compass" className="h-3 w-3" />
          {helper.available ? "Contact" : "Unavailable"}
        </button>
      </div>
    </article>
  );
}

export default function TravelHelperPage() {
  const [helpers, setHelpers] = useState<TravelHelper[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState("All");

  useEffect(() => {
    setLoading(true);
    const request =
      activeRegion === "All"
        ? listHelpers()
        : searchHelpers(activeRegion);

    request
      .then((res) => setHelpers(res.helpers))
      .catch(() => setHelpers([]))
      .finally(() => setLoading(false));
  }, [activeRegion]);

  return (
    <AppShell>
      <section>
        <p className="kicker">Travel Helper</p>
        <h1 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">
          Local guides for<br />India's best destinations
        </h1>
        <p className="mt-5 max-w-xl leading-7 text-ink-soft">
          Verified travel helpers and local guides who know the terrain, culture, and hidden gems.
          Connect directly for a more authentic travel experience.
        </p>

        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-1">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`chip shrink-0 transition-colors ${
                activeRegion === region
                  ? "bg-ink text-canvas border-ink"
                  : "hover:bg-surface-high"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-ink-faint">
              <Spinner className="h-4 w-4" />
              <span className="text-sm">Loading helpers...</span>
            </div>
          ) : helpers.length === 0 ? (
            <div className="py-16 text-center">
              <Icon name="compass" className="mx-auto h-8 w-8 text-ink-faint" />
              <p className="mt-4 text-sm text-ink-soft">No helpers found for this region.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {helpers.map((helper) => (
                <HelperCard key={helper.id} helper={helper} />
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
