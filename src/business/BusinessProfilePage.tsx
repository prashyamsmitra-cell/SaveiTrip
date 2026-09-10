import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthContext";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";
import {
  createBusinessProfile,
  listMyBusinesses,
  updateBusiness
} from "./api/admin";
import type {
  BusinessProfile,
  CreateBusinessInput,
  LocationProfile
} from "./endorsementTypes";
import { ErrorState, LoadingState, PageHeader } from "./components/StateViews";
import { formatLocation } from "./components/format";

const inputClass = "input";
const textareaClass = "input min-h-[7.5rem] resize-y";

type FormState = {
  name: string;
  category: string;
  description: string;
  city: string;
  state: string;
  region: string;
  landmark: string;
  services: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  establishedYear: string;
};

function businessToForm(business: BusinessProfile): FormState {
  return {
    name: business.name,
    category: business.category,
    description: business.description,
    city: business.location.city,
    state: business.location.state,
    region: business.location.region,
    landmark: business.location.landmark ?? "",
    services: business.services.join(", "),
    contactEmail: business.contactEmail ?? "",
    contactPhone: business.contactPhone ?? "",
    websiteUrl: business.websiteUrl ?? "",
    establishedYear: business.establishedYear ? String(business.establishedYear) : ""
  };
}

const emptyForm: FormState = {
  name: "",
  category: "",
  description: "",
  city: "",
  state: "",
  region: "",
  landmark: "",
  services: "",
  contactEmail: "",
  contactPhone: "",
  websiteUrl: "",
  establishedYear: ""
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-accent-red">
      <Icon name="alert" className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

export default function BusinessProfilePage() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [selected, setSelected] = useState<BusinessProfile | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { businesses: list } = await listMyBusinesses();
      setBusinesses(list);
      if (list.length > 0) {
        setSelected(list[0]!);
        setForm(businessToForm(list[0]!));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load business profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function selectBusiness(id: string) {
    const business = businesses.find((b) => b.id === id);
    if (business) {
      setSelected(business);
      setForm(businessToForm(business));
      setEditing(false);
      setSuccess("");
      setErrors({});
    }
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSuccess("");
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Business name is required.";
    if (!form.category.trim()) next.category = "Category is required.";
    if (!form.description.trim()) next.description = "Describe the business.";
    else if (form.description.trim().length < 10) next.description = "At least 10 characters.";
    if (!form.region.trim()) next.region = "Region is required.";
    if (!form.city.trim()) next.city = "City is required.";
    if (!form.state.trim()) next.state = "State is required.";
    const services = form.services.split(",").map((s) => s.trim()).filter(Boolean);
    if (services.length === 0) next.services = "Add at least one service.";
    if (form.establishedYear && (Number(form.establishedYear) < 1700 || Number(form.establishedYear) > 2100)) {
      next.establishedYear = "Enter a valid year.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setError("");
    setSaving(true);
    setSuccess("");
    try {
      const location: LocationProfile = {
        region: form.region.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        landmark: form.landmark.trim() || undefined
      };
      const services = form.services.split(",").map((s) => s.trim()).filter(Boolean);
      const base: CreateBusinessInput = {
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        location,
        services,
        contactEmail: form.contactEmail.trim() || undefined,
        contactPhone: form.contactPhone.trim() || undefined,
        websiteUrl: form.websiteUrl.trim() || undefined,
        establishedYear: form.establishedYear ? Number(form.establishedYear) : undefined
      };
      if (selected && !editing) {
        const { business } = await updateBusiness(selected.id, base);
        setSelected(business);
        setForm(businessToForm(business));
        setBusinesses((prev) => prev.map((b) => (b.id === business.id ? business : b)));
      } else {
        const { business } = await createBusinessProfile(base);
        setSelected(business);
        setForm(businessToForm(business));
        setBusinesses((prev) => [...prev, business]);
      }
      setEditing(false);
      setSuccess("Business profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save business profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <section className="page-fade">
        <PageHeader
          kicker="Business profile"
          title="Your business on SaveiTrip."
          description="Create or update the business profile used across your endorsement inquiries."
        />

        {loading ? (
          <div className="mt-8">
            <LoadingState rows={3} />
          </div>
        ) : error && businesses.length === 0 ? (
          <div className="mt-8">
            <ErrorState message={error} onRetry={load} />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
            <aside>
              <div className="card p-5">
                <p className="kicker">Your businesses</p>
                {businesses.length === 0 && (
                  <p className="mt-3 text-sm text-ink-soft">
                    No business profile yet. Create one below to get started.
                  </p>
                )}
                <ul className="mt-3 space-y-2">
                  {businesses.map((b) => (
                    <li key={b.id}>
                      <button
                        onClick={() => selectBusiness(b.id)}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                          selected?.id === b.id
                            ? "border-ink bg-ink text-canvas"
                            : "border-line bg-surface-high hover:border-ink"
                        }`}
                      >
                        <p className="text-sm font-semibold">{b.name}</p>
                        <p className={`mt-0.5 text-xs ${selected?.id === b.id ? "text-canvas/70" : "text-ink-faint"}`}>
                          {b.category} · {formatLocation(b.location)}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <form onSubmit={handleSubmit} noValidate className="card p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl">
                  {selected ? selected.name : "Create business profile"}
                </h2>
                {selected && !editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="btn btn-outline"
                  >
                    <Icon name="trend" className="h-4 w-4" />
                    Edit profile
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="b-name">Business name</label>
                    <input
                      id="b-name"
                      disabled={Boolean(selected) && !editing}
                      className={inputClass}
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="e.g. Annapurna Family Kitchen"
                    />
                    <FieldError message={errors.name} />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="b-cat">Category</label>
                    <input
                      id="b-cat"
                      disabled={Boolean(selected) && !editing}
                      className={inputClass}
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                      placeholder="e.g. Food & Restaurants"
                    />
                    <FieldError message={errors.category} />
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="b-desc">Description</label>
                  <textarea
                    id="b-desc"
                    disabled={Boolean(selected) && !editing}
                    className={textareaClass}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="What does your business do and what makes it special?"
                  />
                  <FieldError message={errors.description} />
                </div>

                <fieldset disabled={Boolean(selected) && !editing}>
                  <legend className="field-label">Location</legend>
                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <label className="field-label" htmlFor="b-region">Region</label>
                      <input id="b-region" className={inputClass} value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="Sikkim" />
                      <FieldError message={errors.region} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="b-city">City</label>
                      <input id="b-city" className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Gangtok" />
                      <FieldError message={errors.city} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="b-state">State</label>
                      <input id="b-state" className={inputClass} value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="Sikkim" />
                      <FieldError message={errors.state} />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="field-label" htmlFor="b-landmark">Landmark <span className="font-normal text-ink-faint">(optional)</span></label>
                    <input id="b-landmark" className={inputClass} value={form.landmark} onChange={(e) => set("landmark", e.target.value)} placeholder="Near MG Marg" />
                  </div>
                </fieldset>

                <div>
                  <label className="field-label" htmlFor="b-services">Services <span className="font-normal text-ink-faint">(comma separated)</span></label>
                  <input
                    id="b-services"
                    disabled={Boolean(selected) && !editing}
                    className={inputClass}
                    value={form.services}
                    onChange={(e) => set("services", e.target.value)}
                    placeholder="Local cuisine, Home delivery, Family dining"
                  />
                  <FieldError message={errors.services} />
                </div>

                <fieldset disabled={Boolean(selected) && !editing}>
                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <label className="field-label" htmlFor="b-email">Contact email</label>
                      <input id="b-email" type="email" className={inputClass} value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="contact@business.com" />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="b-phone">Contact phone</label>
                      <input id="b-phone" type="tel" className={inputClass} value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="b-year">Established year</label>
                      <input id="b-year" type="number" className={inputClass} value={form.establishedYear} onChange={(e) => set("establishedYear", e.target.value)} placeholder="2015" min={1700} max={2100} />
                      <FieldError message={errors.establishedYear} />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="field-label" htmlFor="b-web">Website URL</label>
                    <input id="b-web" type="url" className={inputClass} value={form.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="https://..." />
                  </div>
                </fieldset>

                {error && (
                  <div className="alert-error" role="alert">
                    <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && !editing && (
                  <div className="flex items-center gap-2 rounded-xl border border-accent-green/25 bg-accent-green-soft px-4 py-3 text-sm font-medium text-accent-green" role="status">
                    <Icon name="check" className="h-4 w-4" />
                    {success}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {(!selected || editing) && (
                    <button type="submit" disabled={saving} className="btn btn-primary justify-center">
                      {saving ? (
                        <>
                          <Spinner /> Saving...
                        </>
                      ) : (
                        <>
                          <Icon name="shield-check" className="h-4 w-4" />
                          {selected ? "Update profile" : "Create profile"}
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-xs text-ink-faint">
                    Signed in as {user?.email}
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}
      </section>
    </AppShell>
  );
}