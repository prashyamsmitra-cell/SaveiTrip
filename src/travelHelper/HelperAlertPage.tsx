import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../shared/Icon";
import { useAuth } from "../auth/AuthContext";
import { Spinner } from "../shared/ui";

type AlertSeverity = "calamity" | "inconvenience";
type AlertCategory = "weather" | "transport" | "accommodation" | "safety" | "other";

export interface Alert {
  id: string;
  userId: string;
  helperId?: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  location: string;
  createdAt: string;
}

export default function HelperAlertPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<AlertSeverity>("inconvenience");
  const [category, setCategory] = useState<AlertCategory>("other");
  const [location, setLocation] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/helpers/alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("saveitrip_token")}`,
        },
        body: JSON.stringify({
          title,
          description,
          severity,
          category,
          location,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message ?? "Failed to raise alert");
      }

      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate("/helpers"), 2000);
    } catch (err: any) {
      setError(err.message ?? "Failed to raise alert. Please try again.");
      setLoading(false);
    }
  }

  if (!user) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas px-6">
        <div className="bg-surface-high rounded-xl p-8 max-w-md w-full text-center">
          <Icon name="check-circle" className="h-12 w-12 text-accent-green mx-auto mb-4" />
          <h2 className="font-display text-2xl leading-tight mb-2">Alert Raised Successfully</h2>
          <p className="text-ink-soft mb-6">Your calamity/inconvenience alert has been submitted and is undergoing validation.</p>
          <button onClick={() => navigate("/helpers")} className="btn btn-primary w-full">
            <Icon name="arrow-left" className="h-3.5 w-3.5 me-2" /> Back to Helpers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-6 py-8">
      <div className="max-w-md mx-auto bg-surface-high rounded-xl p-8">
        <h2 className="font-display text-2xl leading-tight mb-6">Raise Calamity Alert</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-accent-amber/10 text-accent-amber">
            <Icon name="alert" className="h-4 w-4 shrink-0 me-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-2">Alert Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Road blocked, severe weather, accommodation issue"
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the calamity or inconvenience in detail"
              required
              className="textarea"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-2">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                className="select"
              >
                <option value="inconvenience">Inconvenience</option>
                <option value="calamity">Calamity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-soft mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AlertCategory)}
                className="select"
              >
                <option value="other">Other</option>
                <option value="weather">Weather</option>
                <option value="transport">Transport</option>
                <option value="accommodation">Accommodation</option>
                <option value="safety">Safety</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sikkim, Kerala, specific location"
              required
              className="input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-accent w-full">
            {loading ? (
              <>
                <Spinner className="h-4 w-4 me-2" /> Sending alert...
              </>
            ) : (
              "Raise Alert"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}