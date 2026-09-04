import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/helpers/${helper.id}`)}
      className="card group cursor-pointer flex flex-col p-0 overflow-hidden transition-all hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={helper.avatarUrl}
          alt={helper.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white drop-shadow-sm">{helper.name}</h3>
            {helper.isVerified && (
              <Icon name="shield-check" className="h-3.5 w-3.5 text-accent-green fill-accent-green-soft" />
            )}
          </div>
          <StarRating rating={helper.rating} />
        </div>
        {!helper.available && (
          <span className="absolute top-3 right-3 badge bg-accent-amber text-white text-[0.6rem]">Busy</span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-1.5 text-xs text-ink-soft">
          <Icon name="map-pin" className="h-3 w-3 shrink-0 text-ink-faint" />
          <span>{helper.location}</span>
          <span className="text-ink-faint">·</span>
          <span className="text-accent-green text-[0.65rem] font-medium">
            {helper.distanceKm} km away
          </span>
        </div>

        <p className="mt-2 text-xs leading-5 text-ink-soft line-clamp-2">{helper.bio}</p>

        <div className="mt-2.5 flex flex-wrap gap-1">
          {helper.speciality.slice(0, 3).map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-line/60">
          <span className="text-xs font-medium text-accent-green">{helper.priceRange}</span>
          <span className="btn btn-outline !px-3 !py-1.5 text-xs group-hover:bg-ink group-hover:text-canvas group-hover:border-ink transition-colors">
            <Icon name="compass" className="h-3 w-3" />
            View Profile
          </span>
        </div>
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
              {helpers.map((helper, i) => (
                <div key={helper.id} className="helper-card-enter" style={{ animationDelay: `${i * 60}ms` }}>
                  <HelperCard helper={helper} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
