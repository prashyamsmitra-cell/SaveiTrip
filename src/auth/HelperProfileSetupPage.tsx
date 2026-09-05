import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "./authApi";
import { useAuth } from "./AuthContext";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { Avatar, Spinner } from "../shared/ui";

export default function HelperProfileSetupPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const { user: updatedUser } = await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        phone: phone.trim(),
        ...(avatarUrl.trim() ? { avatarUrl: avatarUrl.trim() } : {})
      });
      updateUser(updatedUser);
      navigate("/helper/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  const previewName = username.trim() || user?.name || "your profile";

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
              <p className="mt-1 text-sm text-ink-soft">Make your local expertise easy to trust.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
