import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";
import { createInquiry } from "./api/inquiries";
import { listMyBusinesses } from "./api/admin";
import type { BusinessProfile, CommercialMode, LocationProfile } from "./endorsementTypes";
import { ErrorState, PageHeader } from "./components/StateViews";

const inputClass = "input";
const textareaClass = "input min-h-[7.5rem] resize-y";

type FormState = {
  businessId: string;
  category: string;
  summary: string;
  city: string;
  region: string;
  state: string;
  landingSpot: string;
  supportingInfo: string;
  requestedCommercialMode: "" | CommercialMode;
};

const emptyForm: FormState = {
  businessId: "",
  category: "",
  summary: "",
  city: "",
  region: "",
  state: "",
  landingSpot: "",
  supportingInfo: "",
  requestedCommercialMode: ""
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

export default function BusinessInquiryNewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const load = useCallback(async () => {
    try {
      const { businesses: list } = await listMyBusinesses();
      setBusinesses(list);
      if (list.length === 1) {
        const b = list[0]!;
        setForm((prev) => ({
          ...prev,
          businessId: b.id,
          category: b.category,
          city: b.location.city,
          region: b.location.region,
          state: b.location.state
        }));
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

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleBusinessSelect(id: string) {
    const business = businesses.find((b) => b.id === id);
    setForm((prev) => ({
      ...prev,
      businessId: id,
      category: business?.category ?? prev.category,
      city: business?.location.city ?? prev.city,
      region: business?.location.region ?? prev.region,
      state: business?.location.state ?? prev.state
    }));
    setErrors((prev) => ({ ...prev, businessId: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.businessId) next.businessId = "Select the business you are applying for.";
    if (!form.category.trim()) next.category = "Category is required.";
    else if (form.category.trim().length < 2) next.category = "Category is too short.";
    if (!form.region.trim()) next.region = "Region is required.";
    if (!form.city.trim()) next.city = "City is required.";
    if (!form.state.trim()) next.state = "State is required.";
    if (!form.summary.trim()) next.summary = "Summarize the endorsement you are applying for.";
    else if (form.summary.trim().length < 10) next.summary = "At least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setError("");
    setSaving(true);
    try {
      const location: LocationProfile = {
        city: form.city.trim(),
        state: form.state.trim(),
        region: form.region.trim(),
        landmark: form.landingSpot.trim() || undefined
      };
      const { inquiry } = await createInquiry({
        businessId: form.businessId,
        category: form.category.trim(),
        location,
        summary: form.summary.trim(),
        supportingInfo:
          form.supportingInfo
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean) || undefined,
        requestedCommercialMode:
          form.requestedCommercialMode === "" ? undefined : form.requestedCommercialMode
      });
      navigate(`/business/inquiry/${inquiry.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create inquiry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <section className="page-fade">
        <PageHeader
          kicker="New endorsement inquiry"
          title="Apply for a business endorsement."
          description="Describe what you want reviewed and promoted. Drafts can be edited before submission."
          action={
            <Link to="/business/promote" className="btn btn-outline">
              <Icon name="arrow-left" className="h-4 w-4" />
              Back to dashboard
            </Link>
          }
        />

        {loading ? (
          <p className="btn-ghost mt-8 inline-flex items-center gap-2 text-sm text-ink-soft">
            <Spinner className="h-4 w-4" /> Loading...
          </p>
        ) : businesses.length === 0 ? (
          <div className="mt-8">
            <ErrorState
              title="No business profile yet"
              message="Create a business profile before starting an endorsement inquiry."
            />
            <div className="mt-4">
              <Link to="/business/profile" className="btn btn-primary">
                Create business profile
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="card mt-8 p-6 md:p-8">
            <div className="space-y-5">
              <div>
                <label className="field-label" htmlFor="i-business">Business</label>
                <select
                  id="i-business"
                  className={inputClass}
                  value={form.businessId}
                  onChange={(e) => handleBusinessSelect(e.target.value)}
                >
                  <option value="">Select a business</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.businessId} />
              </div>

              <div>
                <label className="field-label" htmlFor="i-category">Category</label>
                <input
                  id="i-category"
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="e.g. Food & Restaurants"
                />
                <FieldError message={errors.category} />
              </div>

              <div>
                <label className="field-label" htmlFor="i-summary">Summary</label>
                <textarea
                  id="i-summary"
                  className={textareaClass}
                  value={form.summary}
                  onChange={(e) => set("summary", e.target.value)}
                  placeholder="What should the review team evaluate? Mention highlights, services, and why travelers should know about it."
                />
                <FieldError message={errors.summary} />
              </div>

              <fieldset>
                <legend className="field-label">Location</legend>
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="field-label" htmlFor="i-region">Region</label>
                    <input id="i-region" className={inputClass} value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="Sikkim" />
                    <FieldError message={errors.region} />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="i-city">City</label>
                    <input id="i-city" className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Gangtok" />
                    <FieldError message={errors.city} />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="i-state">State</label>
                    <input id="i-state" className={inputClass} value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="Sikkim" />
                    <FieldError message={errors.state} />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="field-label" htmlFor="i-landmark">Landmark <span className="font-normal text-ink-faint">(optional)</span></label>
                  <input id="i-landmark" className={inputClass} value={form.landingSpot} onChange={(e) => set("landingSpot", e.target.value)} placeholder="Near MG Marg" />
                </div>
              </fieldset>

              <div>
                <label className="field-label" htmlFor="i-support">Supporting information <span className="font-normal text-ink-faint">(one per line, optional)</span></label>
                <textarea
                  id="i-support"
                  className={`${textareaClass} min-h-[5rem]`}
                  value={form.supportingInfo}
                  onChange={(e) => set("supportingInfo", e.target.value)}
                  placeholder={"Awards or certifications\nCustomer testimonials\nLicenses"}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="i-mode">Requested promotion mode</label>
                <select
                  id="i-mode"
                  className={inputClass}
                  value={form.requestedCommercialMode}
                  onChange={(e) => set("requestedCommercialMode", e.target.value as FormState["requestedCommercialMode"])}
                >
                  <option value="">Standard</option>
                  <option value="NORMAL_PAID">Normal paid</option>
                  <option value="SAVEITRIP_SPONSORED">SaveiTrip sponsored</option>
                </select>
              </div>

              {error && (
                <div className="alert-error" role="alert">
                  <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" disabled={saving} className="btn btn-primary justify-center">
                  {saving ? (
                    <>
                      <Spinner /> Creating draft...
                    </>
                  ) : (
                    <>
                      Create draft
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </>
                  )}
                </button>
                <span className="text-xs text-ink-faint">
                  Editing {user?.email}
                </span>
              </div>
            </div>
          </form>
        )}
      </section>
    </AppShell>
  );
}