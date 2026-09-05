import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "./authApi";
import { useAuth } from "./AuthContext";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { Avatar, Spinner } from "../shared/ui";
import { getMyHelperProfile, saveMyHelperProfile } from "../travelHelper/travelHelperApi";

export default function HelperProfileSetupPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [avatarZoom, setAvatarZoom] = useState(1);
  const [avatarOffsetX, setAvatarOffsetX] = useState(0);
  const [avatarOffsetY, setAvatarOffsetY] = useState(0);
  const [region, setRegion] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [languages, setLanguages] = useState("");
  const [experience, setExperience] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");
  const [nearbyDestination, setNearbyDestination] = useState("");
  const [yearsActive, setYearsActive] = useState("1");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;

    getMyHelperProfile().then(({ profile }) => {
      if (!profile) return;
      setName(profile.name);
      setBio(profile.bio);
      setPhone(profile.phone);
      setAvatarUrl(profile.avatarUrl);
      setRegion(profile.region);
      setSpeciality(profile.speciality.join(", "));
      setLanguages(profile.languages.join(", "));
      setExperience(profile.experience);
      setPriceRange(profile.priceRange);
      setLocation(profile.location);
      setNearbyDestination(profile.nearbyDestination);
      setYearsActive(String(profile.yearsActive));
      setInstagram(profile.socialLinks.instagram ?? "");
      setWebsite(profile.socialLinks.website ?? "");
      setAvailable(profile.available);
    }).catch(() => undefined);
  }, [user]);

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setAvatarUrl(reader.result);
      setAvatarZoom(1);
      setAvatarOffsetX(0);
      setAvatarOffsetY(0);
    };
    reader.readAsDataURL(file);
  }

  async function createEditedAvatar(source: string) {
    if (!source.startsWith("data:image/")) return source;

    try {
      const image = new Image();
      image.src = source;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Could not process this image."));
      });

      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) return source;

      const coverScale = Math.max(size / image.naturalWidth, size / image.naturalHeight) * avatarZoom;
      const width = image.naturalWidth * coverScale;
      const height = image.naturalHeight * coverScale;
      const x = (size - width) / 2 + avatarOffsetX * size;
      const y = (size - height) / 2 + avatarOffsetY * size;

      context.fillStyle = "#f6f1e7";
      context.fillRect(0, 0, size, size);
      context.drawImage(image, x, y, width, height);
      return canvas.toDataURL("image/jpeg", 0.88);
    } catch {
      return source;
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const editedAvatarUrl = avatarUrl.trim() ? await createEditedAvatar(avatarUrl.trim()) : "";
      const { user: updatedUser } = await updateProfile({
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        phone: phone.trim(),
        ...(editedAvatarUrl ? { avatarUrl: editedAvatarUrl } : {})
      });
      await saveMyHelperProfile({
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        region: region.trim(),
        speciality: speciality.split(",").map((item) => item.trim()).filter(Boolean),
        languages: languages.split(",").map((item) => item.trim()).filter(Boolean),
        experience: experience.trim(),
        phone: phone.trim(),
        priceRange: priceRange.trim(),
        avatarUrl: editedAvatarUrl,
        location: location.trim(),
        nearbyDestination: nearbyDestination.trim(),
        yearsActive: Math.max(0, Number(yearsActive) || 0),
        available,
        socialLinks: {
          ...(instagram.trim() ? { instagram: instagram.trim() } : {}),
          ...(website.trim() ? { website: website.trim() } : {})
        }
      });
      updateUser(updatedUser);
      navigate("/helper/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  const previewName = name.trim() || username.trim() || user?.name || "your profile";

  return (
    <AppShell helperMode>
      <div className="mx-auto max-w-2xl">
        <div className="ig-topbar">
          <Icon name="instagram" className="h-5 w-5" />
          <span className="text-sm font-semibold">Set up your helper profile</span>
        </div>

        <section className="mt-6 rounded-xl border border-line bg-surface px-5 py-6 shadow-card sm:px-8">
          <div className="ig-profile-header border-b border-line/70 pb-5">
            <div className="ig-avatar-wrap">
              {avatarUrl.trim() ? (
                <div className="helper-avatar-ring">
                  <img src={avatarUrl} alt="Profile preview" className="helper-avatar-img" />
                </div>
              ) : (
                <Avatar name={user?.name} className="h-18 w-18 text-xl" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold truncate">{previewName}</p>
              <p className="mt-1 text-sm text-ink-soft">@{username.trim() || "your-travel-name"}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-b border-line/70 pb-5">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleAvatarChange}
              className="sr-only"
            />
            <button type="button" onClick={() => avatarInputRef.current?.click()} className="btn btn-outline text-xs">
              <Icon name="instagram" className="h-4 w-4" />
              Take or choose photo
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => {
                  setAvatarUrl("");
                  setAvatarZoom(1);
                  setAvatarOffsetX(0);
                  setAvatarOffsetY(0);
                }}
                className="btn btn-ghost text-xs"
              >
                Remove photo
              </button>
            )}
          </div>

          {avatarUrl && (
            <div className="mt-5 rounded-xl border border-line bg-canvas-alt/40 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Adjust profile photo</p>
                  <p className="mt-1 text-xs text-ink-soft">Zoom and position the image inside the avatar frame.</p>
                </div>
                <span className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink-faint">Preview</span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-[7rem_1fr] sm:items-center">
                <div className="helper-avatar-ring mx-auto h-24 w-24 overflow-hidden">
                  <img
                    src={avatarUrl}
                    alt="Edited profile preview"
                    className="helper-avatar-img"
                    style={{
                      transform: `translate(${avatarOffsetX * 100}%, ${avatarOffsetY * 100}%) scale(${avatarZoom})`
                    }}
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs text-ink-soft">
                    Zoom
                    <input type="range" min="1" max="2.5" step="0.05" value={avatarZoom} onChange={(event) => setAvatarZoom(Number(event.target.value))} className="mt-1 w-full accent-accent-green" />
                  </label>
                  <label className="block text-xs text-ink-soft">
                    Horizontal position
                    <input type="range" min="-0.25" max="0.25" step="0.01" value={avatarOffsetX} onChange={(event) => setAvatarOffsetX(Number(event.target.value))} className="mt-1 w-full accent-accent-green" />
                  </label>
                  <label className="block text-xs text-ink-soft">
                    Vertical position
                    <input type="range" min="-0.25" max="0.25" step="0.01" value={avatarOffsetY} onChange={(event) => setAvatarOffsetY(Number(event.target.value))} className="mt-1 w-full accent-accent-green" />
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="ig-stats mt-5">
            <div className="ig-stat">
              <span className="ig-stat-num">0</span>
              <span className="ig-stat-label">posts</span>
            </div>
            <div className="ig-stat">
              <span className="ig-stat-num">0</span>
              <span className="ig-stat-label">reviews</span>
            </div>
            <div className="ig-stat">
              <span className="ig-stat-num">New</span>
              <span className="ig-stat-label">rating</span>
            </div>
          </div>

          <div className="ig-bio-section mt-5 border-t border-line/70 pt-5">
            <p className="ig-name">{previewName}</p>
            <p className="ig-category">{region.trim() || "Your region"}{location.trim() ? ` · ${location.trim()}` : ""}</p>
            <p className="ig-bio-text">{bio.trim() || "Your helper bio will appear here."}</p>
          </div>

          <div className="ig-highlights border-b border-line/70 pb-5">
            <div className="ig-highlight">
              <div className="ig-highlight-ring">
                <Icon name="rupee" className="h-5 w-5 text-accent-green" />
              </div>
              <span className="ig-highlight-label">{priceRange.trim() || "Pricing"}</span>
            </div>
            <div className="ig-highlight">
              <div className="ig-highlight-ring">
                <Icon name="clock" className="h-5 w-5 text-accent-amber" />
              </div>
              <span className="ig-highlight-label">{yearsActive || "0"}yr exp</span>
            </div>
            <div className="ig-highlight">
              <div className="ig-highlight-ring">
                <Icon name="globe" className="h-5 w-5 text-ink-soft" />
              </div>
              <span className="ig-highlight-label">{languages.split(",")[0]?.trim() || "Languages"}</span>
            </div>
          </div>

          <div className="ig-tab-bar mt-5">
            <span className="ig-tab ig-tab--active">
              <Icon name="user" className="h-4 w-4" />
              Edit profile
            </span>
            <span className="ig-tab ig-tab--muted">
              <Icon name="dashboard" className="h-4 w-4" />
              Posts coming soon
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="field-label">Display name</span>
              <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" className="input" />
            </label>
            <label className="block">
              <span className="field-label">Username</span>
              <input
                required
                minLength={2}
                maxLength={30}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="your travel name"
                autoComplete="username"
                className="input"
              />
            </label>
            <label className="block">
              <span className="field-label">Bio</span>
              <textarea
                required
                maxLength={500}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell travelers what you know best and the kind of trips you lead."
                rows={4}
                className="input resize-none"
              />
              <span className="mt-1 block text-right text-xs text-ink-faint">{bio.length}/500</span>
            </label>
            <label className="block">
              <span className="field-label">Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                className="input"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Region</span>
                <input required value={region} onChange={(event) => setRegion(event.target.value)} placeholder="Sikkim, Kerala" className="input" />
              </label>
              <label className="block">
                <span className="field-label">Location</span>
                <input required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Gangtok, Sikkim" className="input" />
              </label>
            </div>
            <label className="block">
              <span className="field-label">Specialities <span className="font-normal text-ink-faint">(comma separated)</span></span>
              <input required value={speciality} onChange={(event) => setSpeciality(event.target.value)} placeholder="Mountain treks, local culture" className="input" />
            </label>
            <label className="block">
              <span className="field-label">Languages <span className="font-normal text-ink-faint">(comma separated)</span></span>
              <input required value={languages} onChange={(event) => setLanguages(event.target.value)} placeholder="English, Hindi" className="input" />
            </label>
            <label className="block">
              <span className="field-label">Experience</span>
              <input required value={experience} onChange={(event) => setExperience(event.target.value)} placeholder="8 years guiding in the Himalayas" className="input" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Price range</span>
                <input required value={priceRange} onChange={(event) => setPriceRange(event.target.value)} placeholder="₹1,500 – ₹3,000/day" className="input" />
              </label>
              <label className="block">
                <span className="field-label">Years active</span>
                <input required min="0" type="number" value={yearsActive} onChange={(event) => setYearsActive(event.target.value)} className="input" />
              </label>
            </div>
            <label className="block">
              <span className="field-label">Nearby destination</span>
              <input required value={nearbyDestination} onChange={(event) => setNearbyDestination(event.target.value)} placeholder="Tsomgo Lake & Nathula Pass" className="input" />
            </label>
            <label className="block">
              <span className="field-label">Profile photo URL <span className="font-normal text-ink-faint">(optional)</span></span>
              <input
                type="url"
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
                placeholder="https://..."
                autoComplete="url"
                className="input"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Instagram URL <span className="font-normal text-ink-faint">(optional)</span></span>
                <input type="url" value={instagram} onChange={(event) => setInstagram(event.target.value)} placeholder="https://instagram.com/..." className="input" />
              </label>
              <label className="block">
                <span className="field-label">Website URL <span className="font-normal text-ink-faint">(optional)</span></span>
                <input type="url" value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://..." className="input" />
              </label>
            </div>
            <label className="flex items-center gap-3 text-sm text-ink-soft">
              <input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} className="h-4 w-4 accent-accent-green" />
              Available for new traveler enquiries
            </label>

            {error && (
              <div className="alert-error" role="alert">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => navigate("/helper/dashboard")} className="btn btn-ghost">
                Do this later
              </button>
              <button disabled={saving} className="btn btn-primary justify-center">
                {saving ? <><Spinner /> Saving profile...</> : "Save profile"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
