import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";
import { getHelper, type TravelHelper, type HelperPost } from "./travelHelperApi";

/* ─── Post Detail Modal ─── */
function PostDetail({ post, onClose }: { post: HelperPost; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-high rounded-xl max-w-lg w-full overflow-hidden shadow-panel helper-card-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={post.imageUrl} alt={post.destination} className="w-full aspect-square object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 text-white grid place-items-center hover:bg-black/60 transition-colors"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-ink-faint">
            <Icon name="map-pin" className="h-3 w-3" />
            <span className="font-medium text-ink-soft">{post.destination}</span>
            <span>·</span>
            <span>{new Date(post.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{post.caption}</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-accent-red">
            <Icon name="heart" className="h-3.5 w-3.5 fill-current" />
            <span className="font-medium">{post.likes.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Helper Profile Page (Instagram scrollable) ─── */
export default function HelperProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [helper, setHelper] = useState<TravelHelper | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedPost, setSelectedPost] = useState<HelperPost | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    getHelper(id)
      .then((res) => setHelper(res.helper))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-24 text-ink-faint">
          <Spinner className="h-5 w-5" />
        </div>
      </AppShell>
    );
  }

  if (notFound || !helper) {
    return (
      <AppShell>
        <div className="py-24 text-center page-fade">
          <Icon name="compass" className="mx-auto h-10 w-10 text-ink-faint" />
          <p className="mt-4 text-sm text-ink-soft">Helper not found.</p>
          <button onClick={() => navigate("/helpers")} className="btn btn-outline mt-4 text-xs">
            <Icon name="arrow-left" className="h-3.5 w-3.5" />
            Back to helpers
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {selectedPost && (
        <PostDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      <div className="page-fade">
        {/* ─── Sticky Top Bar ─── */}
        <div className="ig-topbar">
          <button onClick={() => navigate("/helpers")} className="btn btn-ghost !p-2 !rounded-full">
            <Icon name="arrow-left" className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-base font-bold truncate">{helper.name}</h1>
            {helper.isVerified && (
              <Icon name="shield-check" className="h-4 w-4 shrink-0 text-accent-green fill-accent-green-soft" />
            )}
          </div>
        </div>

        {/* ─── Profile Header ─── */}
        <div className="ig-profile-header">
          <div className="ig-avatar-wrap">
            <div className="helper-avatar-ring">
              <img src={helper.avatarUrl} alt={helper.name} className="helper-avatar-img" />
            </div>
          </div>
          <div className="ig-stats">
            <div className="ig-stat">
              <span className="ig-stat-num">{helper.posts.length}</span>
              <span className="ig-stat-label">posts</span>
            </div>
            <div className="ig-stat">
              <span className="ig-stat-num">{helper.reviewCount}</span>
              <span className="ig-stat-label">reviews</span>
            </div>
            <div className="ig-stat">
              <span className="ig-stat-num ig-stat-rating">
                <Icon name="star" className="h-3 w-3 fill-current text-accent-amber" />
                {helper.rating.toFixed(1)}
              </span>
              <span className="ig-stat-label">rating</span>
            </div>
          </div>
        </div>

        {/* ─── Name & Bio ─── */}
        <div className="ig-bio-section">
          <p className="ig-name">{helper.name}</p>
          <p className="ig-category">{helper.region} · {helper.location}</p>
          <p className="ig-bio-text">{helper.bio}</p>
          {helper.socialLinks.website && (
            <a
              href={helper.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="ig-link"
            >
              <Icon name="globe" className="h-3 w-3" />
              {helper.socialLinks.website.replace("https://", "")}
            </a>
          )}
        </div>

        {/* ─── Raise Alert Button ─── */}
        <div className="ig-actions">
          <button
            className="btn btn-accent ig-btn-primary"
            disabled={!helper.available}
            onClick={() => navigate("/helpers/alert")}
          >
            <Icon name="alert" className="h-3.5 w-3.5" />
            {helper.available ? "Raise Alert" : "Unavailable"}
          </button>
          <button className="btn btn-outline ig-btn-secondary" disabled={!helper.available}>
            <Icon name="compass" className="h-3.5 w-3.5" />
            Contact
          </button>
          <button className="btn btn-outline ig-btn-icon">
            <Icon name="external" className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* ─── Nearby Badge ─── */}
        <div className="ig-nearby">
          <Icon name="navigation" className="h-4 w-4 text-accent-green shrink-0" />
          <div className="text-xs">
            <span className="text-ink-soft">Lives near </span>
            <span className="font-semibold text-accent-green">{helper.nearbyDestination}</span>
            <span className="text-ink-faint"> · {helper.distanceKm} km</span>
          </div>
        </div>

        {/* ─── Highlights Row ─── */}
        <div className="ig-highlights">
          <div className="ig-highlight">
            <div className="ig-highlight-ring">
              <Icon name="rupee" className="h-5 w-5 text-accent-green" />
            </div>
            <span className="ig-highlight-label">{helper.priceRange.split("–")[0].trim()}</span>
          </div>
          <div className="ig-highlight">
            <div className="ig-highlight-ring">
              <Icon name="clock" className="h-5 w-5 text-accent-amber" />
            </div>
            <span className="ig-highlight-label">{helper.yearsActive}yr exp</span>
          </div>
          <div className="ig-highlight">
            <div className="ig-highlight-ring">
              <Icon name="globe" className="h-5 w-5 text-ink-soft" />
            </div>
            <span className="ig-highlight-label">{helper.languages[0]}</span>
          </div>
          {helper.socialLinks.instagram && (
            <a href={helper.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="ig-highlight">
              <div className="ig-highlight-ring">
                <Icon name="instagram" className="h-5 w-5 text-accent-red" />
              </div>
              <span className="ig-highlight-label">Instagram</span>
            </a>
          )}
          {helper.socialLinks.website && (
            <a href={helper.socialLinks.website} target="_blank" rel="noopener noreferrer" className="ig-highlight">
              <div className="ig-highlight-ring">
                <Icon name="globe" className="h-5 w-5 text-accent-green" />
              </div>
              <span className="ig-highlight-label">Website</span>
            </a>
          )}
        </div>

        {/* ─── Info Cards (inline, scrollable) ─── */}
        <div className="ig-info-cards">
          <div className="ig-info-card">
            <Icon name="shield" className="h-4 w-4 text-accent-green shrink-0" />
            <div>
              <p className="ig-info-title">Specialities</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {helper.speciality.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="ig-info-card">
            <Icon name="globe" className="h-4 w-4 text-ink-faint shrink-0" />
            <div>
              <p className="ig-info-title">Languages</p>
              <p className="ig-info-text">{helper.languages.join(", ")}</p>
            </div>
          </div>
          <div className="ig-info-card">
            <Icon name="clock" className="h-4 w-4 text-accent-amber shrink-0" />
            <div>
              <p className="ig-info-title">Experience</p>
              <p className="ig-info-text">{helper.experience}</p>
            </div>
          </div>
          <div className="ig-info-card">
            <Icon name="rupee" className="h-4 w-4 text-accent-green shrink-0" />
            <div>
              <p className="ig-info-title">Pricing</p>
              <p className="ig-info-text">{helper.priceRange}</p>
            </div>
          </div>
        </div>

        {/* ─── Posts Grid Header ─── */}
        <div className="ig-tab-bar">
          <button className="ig-tab ig-tab--active">
            <Icon name="dashboard" className="h-4 w-4" />
            Posts
          </button>
          <button className="ig-tab ig-tab--muted">
            <Icon name="pin" className="h-4 w-4" />
            Destinations
          </button>
        </div>

        {/* ─── Posts Grid ─── */}
        <div className="ig-posts-grid">
          {helper.posts.map((post) => (
            <div key={post.id} className="ig-post-item" onClick={() => setSelectedPost(post)}>
              <img src={post.imageUrl} alt={post.destination} loading="lazy" />
              <div className="ig-post-hover">
                <span>
                  <Icon name="heart" className="h-3.5 w-3.5 fill-current" />
                  {post.likes.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
