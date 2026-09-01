import { useState } from "react";
import ServiceDetail from "../shared/ServiceDetail";
import { services } from "../shared/services";
import { searchOffers, unlockAllResults, type ComparisonSearchResult, type TravelQuery } from "./comparisonApi";

const service = services[0];

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
  const [unlocked, setUnlocked] = useState(false);

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
        adults,
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
      // Redirect to payment page - in production this would integrate with Stripe
      window.location.href = unlockData.redirectUrl || "/payment/required";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlock results");
    }
  }

  const cheapestId = result?.cheapest?.id;

  return (
    <ServiceDetail service={service}>
      <p className="text-sm text-ink-faint">Compare live accommodation prices across providers</p>

      <form onSubmit={handleSearch} className="mt-6 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs text-ink-faint">Destination</span>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Goa, Bali"
              className="mt-1 w-full rounded-sm border border-line bg-canvas px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs text-ink-faint">Adults</span>
            <input
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
              className="mt-1 w-full rounded-sm border border-line bg-canvas px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs text-ink-faint">Check-in</span>
            <input
              type="date"
              min={today()}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mt-1 w-full rounded-sm border border-line bg-canvas px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs text-ink-faint">Check-out</span>
            <input
              type="date"
              min={dateFrom || today()}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mt-1 w-full rounded-sm border border-line bg-canvas px-3 py-2 text-sm"
            />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-sm bg-ink px-5 py-2 text-sm text-canvas transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Compare prices"}
          </button>
        </div>
      </form>

      {error && <p className="mt-5 text-sm text-red-500">{error}</p>}

      {loading && <p className="mt-8 text-sm text-ink-soft">Fetching live prices from providers...</p>}

      {result && !loading && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">
              {result.results.length} offer{result.results.length === 1 ? "" : "s"} ·{" "}
              {result.query.destination}
            </h2>
            <p className="text-xs text-ink-faint">
              Prices last checked: {daysAgoLabel(result.lastChecked)}
            </p>
          </div>

          {result.cheapest && (
            <div className="mt-4 rounded-sm bg-accent-green-soft p-4">
              <p className="text-sm font-medium text-accent-green">
                Cheapest option — {result.cheapest.provider} at{" "}
                {formatPrice(result.cheapest.price, result.cheapest.currency)}
              </p>
            </div>
          )}

          {result.results.length === 0 && (
            <p className="mt-6 text-sm text-ink-soft">
              No offers found for this search yet. Try a different destination or dates.
            </p>
          )}

          <div className="mt-5 space-y-3">
            {result.results.map((offer) => {
              const isCheapest = offer.id === cheapestId;
              return (
                <div
                  key={offer.id}
                  className={`rounded-sm border bg-canvas p-5 ${
                    isCheapest ? "border-accent-green" : "border-line"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {isCheapest && (
                          <span className="rounded-sm bg-accent-green-soft px-2 py-0.5 text-xs font-medium text-accent-green">
                            ★ Cheapest
                          </span>
                        )}
                        <span className="rounded-sm bg-surface px-2 py-0.5 text-xs font-medium">
                          {offer.provider}
                        </span>
                      </div>
                      <p className="mt-2 text-lg font-medium">{offer.property}</p>
                      <p className="mt-1 text-xs text-ink-faint">
                        {offer.nights != null && `${offer.nights} night${offer.nights === 1 ? "" : "s"}`}
                        {offer.propertyType != null && ` · ${offer.propertyType}`}
                        {offer.bedrooms != null && ` · ${offer.bedrooms} bed${offer.bedrooms === 1 ? "" : "s"}`}
                        {offer.rating != null && ` · ⭐ ${offer.rating}`}
                        {offer.location?.country != null && ` · ${offer.location.country}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl">
                        {formatPrice(offer.price, offer.currency)}
                      </p>
                      {offer.nights != null && offer.nightlyPrice != null && (
                        <p className="text-xs text-ink-faint">
                          {formatPrice(offer.nightlyPrice, offer.currency)} / night
                        </p>
                      )}
                    </div>
                  </div>

                  {offer.amenities && offer.amenities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {offer.amenities.slice(0, 5).map((item) => (
                        <span
                          key={item}
                          className="rounded-sm bg-surface px-2 py-0.5 text-xs text-ink-soft"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                      onClick={() => handleViewDeal(offer.redirectUrl)}
                      className="rounded-sm bg-accent-green px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      View deal on {offer.provider}
                    </button>
                  </div>
                </div>
              );
            })}

            {result.allResults && result.results.length > 0 && (
              <button
                onClick={handleSeeMore}
                className="rounded-sm bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 w-full"
              >
                See more offers
              </button>
            )}
          </div>
        </div>
      )}

      {!searched && !loading && !unlocked && (
        <p className="mt-8 text-sm text-ink-soft">
          Enter a destination and travel dates to compare live offers across Booking.com, Airbnb,
          Vrbo, and Google Hotels.
        </p>
      )}
    </ServiceDetail>
  );
}