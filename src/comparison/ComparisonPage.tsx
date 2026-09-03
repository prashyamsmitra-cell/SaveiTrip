import { useState } from "react";
import ServiceDetail from "../shared/ServiceDetail";
import { services, getService } from "../shared/services";
import { Icon } from "../shared/Icon";
import { Skeleton, Spinner } from "../shared/ui";
import { searchOffers, unlockAllResults, type ComparisonSearchResult, type TravelQuery } from "./comparisonApi";

const service = getService("comparison")!;

const inr = (value: number) =>
  `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function formatPrice(value: number, currency: string): string {
  if (currency === "INR") return inr(value);
  return `${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })} ${currency}`;
}

function daysAgoLabel(iso: string): string {
  const diffMinutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  return `${Math.round(diffMinutes / 60)} hr ago`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ComparisonPage() {
  const [destination, setDestination] = useState("Goa");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [adults, setAdults] = useState(2);
  const [result, setResult] = useState<ComparisonSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!dateFrom || !dateTo || !destination.trim()) {
      setError("Please fill in destination, check-in, and check-out dates.");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const query: TravelQuery = {
        destination: destination.trim(),
        dateFrom,
        dateTo,
        adults
      };
      const data = await searchOffers(query);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function handleViewDeal(redirectUrl: string) {
    if (!redirectUrl) {
      setError("No provider link available for this offer.");
      return;
    }
    window.open(redirectUrl, "_blank", "noopener,noreferrer");
  }

  async function handleSeeMore() {
    if (!result) return;
    try {
      const unlockData = await unlockAllResults();
      window.location.href = unlockData.redirectUrl || "/payment/required";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlock results");
    }
  }

  const cheapestId = result?.cheapest?.id;

  return (
    <ServiceDetail service={service}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="kicker">Live provider comparison</p>
          <h2 className="font-display mt-2 text-2xl leading-tight">Compare accommodation prices.</h2>
        </div>
        {!searched && (
          <span className="badge hidden border border-line bg-canvas text-ink-soft sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" aria-hidden="true" />
            Live data
          </span>
        )}
      </div>

      <form onSubmit={handleSearch} className="mt-6 rounded-lg border border-line bg-canvas p-5 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <Icon name="pin" className="h-3.5 w-3.5 text-ink-faint" /> Destination
            </span>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Goa, Manali"
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <Icon name="users" className="h-3.5 w-3.5 text-ink-faint" /> Adults
            </span>
            <input
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <Icon name="calendar" className="h-3.5 w-3.5 text-ink-faint" /> Check-in
            </span>
            <input
              type="date"
              min={today()}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <Icon name="calendar" className="h-3.5 w-3.5 text-ink-faint" /> Check-out
            </span>
            <input
              type="date"
              min={dateFrom || today()}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? (
              <>
                <Spinner /> Searching...
              </>
            ) : (
              <>
                <Icon name="search" className="h-4 w-4" /> Compare prices
              </>
            )}
          </button>
          {!searched && (
            <p className="text-xs text-ink-faint">Live across Booking.com, Airbnb, Vrbo &amp; Google Hotels</p>
          )}
        </div>
      </form>

      {error && (
        <div className="alert-error mt-5" role="alert">
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="mt-8 space-y-4" aria-busy="true" aria-label="Loading search results">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-72" />
          <div className="flex flex-wrap items-center gap-2.5">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="card !shadow-none p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-52" />
                  <Skeleton className="h-3 w-64" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-14" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-24" />
                </div>
              </div>
              <Skeleton className="mt-4 h-9 w-36" />
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl">
                {result.results.length} offer{result.results.length === 1 ? "" : "s"} ·{" "}
                {result.query.destination}
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                {result.query.dateFrom} → {result.query.dateTo} · {result.query.adults} adult{result.query.adults === 1 ? "" : "s"}
              </p>
            </div>
            <p className="text-xs text-ink-faint">Prices last checked {daysAgoLabel(result.lastChecked)}</p>
          </div>

          {result.cheapest && (
            <div className="mt-5 flex items-center gap-4 rounded-lg border border-accent-green/25 bg-accent-green-soft px-5 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-green text-white shadow-sm">
                <Icon name="rupee" className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-accent-green">
                  Best value — {result.cheapest.provider} at{" "}
                  {formatPrice(result.cheapest.price, result.cheapest.currency)}
                </p>
                <p className="mt-0.5 text-xs text-accent-green/70">
                  Lowest total price across all providers offering {result.query.destination}.
                </p>
              </div>
            </div>
          )}

          {result.results.length === 0 && (
            <div className="mt-8 rounded-lg border border-dashed border-line bg-canvas px-6 py-12 text-center">
              <Icon name="search" className="mx-auto h-8 w-8 text-ink-faint" />
              <p className="mt-3 font-display text-xl">No offers found</p>
              <p className="mt-1.5 text-sm text-ink-soft">
                Try a different destination or shift your travel dates.
              </p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {result.results.map((offer) => {
              const isCheapest = offer.id === cheapestId;
              return (
                <div
                  key={offer.id}
                  className={`card !rounded-lg p-0 ${
                    isCheapest ? "ring-1 ring-accent-green" : ""
                  }`}
                >
                  <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-start md:grid-cols-[160px_1fr_180px]">
                    {offer.imageUrl ? (
                      <img
                        src={offer.imageUrl}
                        alt={offer.property}
                        className="h-32 w-full rounded-md object-cover sm:h-28 md:h-32 md:w-full"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center rounded-md bg-canvas-alt sm:h-28 md:h-32 md:w-full">
                        <Icon name="basecamp" className="h-8 w-8 text-ink-faint/50" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isCheapest && (
                          <span className="badge bg-accent-green-soft text-accent-green">
                            <Icon name="check" className="h-3 w-3" /> Best value
                          </span>
                        )}
                        <span className="badge border border-line bg-canvas text-ink-soft">{offer.provider}</span>
                        {offer.rating != null && (
                          <span className="badge bg-accent-amber-soft text-accent-amber">
                            <Icon name="star" className="h-3 w-3 fill-current stroke-none" /> {offer.rating}
                          </span>
                        )}
                      </div>
                      <p className="font-display mt-2 text-xl">{offer.property}</p>
                      <p className="mt-1 text-xs text-ink-faint">
                        {offer.nights != null && `${offer.nights} night${offer.nights === 1 ? "" : "s"}`}
                        {offer.propertyType != null && ` · ${offer.propertyType}`}
                        {offer.bedrooms != null && ` · ${offer.bedrooms} bed${offer.bedrooms === 1 ? "" : "s"}`}
                        {offer.location?.country != null && ` · ${offer.location.country}`}
                      </p>
                      {offer.amenities && offer.amenities.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {offer.amenities.slice(0, 5).map((item) => (
                            <span key={item} className="chip">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end">
                      <div className="text-right">
                        <p className="text-[0.68rem] font-medium uppercase tracking-wide text-ink-faint">
                          {offer.nights != null
                            ? `${offer.nights} night${offer.nights === 1 ? "" : "s"} total`
                            : "Total"}
                        </p>
                        <p className="font-display mt-0.5 text-3xl leading-none">
                          {formatPrice(offer.price, offer.currency)}
                        </p>
                        {offer.nights != null && offer.nightlyPrice != null && (
                          <p className="mt-1 text-xs text-ink-faint">
                            {formatPrice(offer.nightlyPrice, offer.currency)} / night
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleViewDeal(offer.redirectUrl)}
                        className="btn btn-accent mt-2 w-full justify-center sm:w-auto"
                      >
                        View deal
                        <Icon name="external" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {result.allResults && result.results.length > 0 && (
              <button onClick={handleSeeMore} className="btn btn-outline w-full justify-center">
                See more offers
                <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {!searched && !loading && (
        <div className="mt-8 rounded-lg border border-dashed border-line bg-canvas/50 px-6 py-10 text-center">
          <Icon name="compass" className="mx-auto h-8 w-8 text-ink-faint/60" />
          <p className="mt-3 font-display text-lg">Start comparing</p>
          <p className="mt-1.5 text-sm text-ink-soft">
            Enter a destination and travel dates to compare live offers across multiple providers.
          </p>
        </div>
      )}
    </ServiceDetail>
  );
}
