import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";
import {
  addEvidence,
  getInquiry,
  respondToInformationRequest,
  submitInquiry,
  updateInquiry
} from "./api/inquiries";
import { listHelperEndorsementsByBusiness } from "./api/endorsements";
import type {
  AddEvidenceInput,
  EndorsementInquiry,
  EvidenceKind,
  HelperEndorsement,
  LocationProfile
} from "./endorsementTypes";
import { EndorsementStatusBadge, HelperEndorsementStatusBadge } from "./components/StatusBadge";
import { ErrorState } from "./components/StateViews";
import { formatDate, formatLocation, titleCase } from "./components/format";

const inputClass = "input";
const textareaClass = "input min-h-[5rem] resize-y";

const STEP_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  ADDITIONAL_INFORMATION_REQUIRED: "More info needed",
  INSPECTION_REQUIRED: "Inspection required",
  VERIFIED: "Verified",
  ACTIVE: "Active",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
  REVOKED: "Revoked"
};

export default function BusinessInquiryDetailPage() {
  const { inquiryId = "" } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<EndorsementInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [evidenceForm, setEvidenceForm] = useState<{
    kind: "" | EvidenceKind;
    title: string;
    reference: string;
  }>({ kind: "", title: "", reference: "" });
  const [evidenceError, setEvidenceError] = useState("");
  const [helperEndorsements, setHelperEndorsements] = useState<HelperEndorsement[]>([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ category: "", summary: "", city: "", state: "", region: "" });

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError("");
    }
    try {
      const { inquiry: data } = await getInquiry(inquiryId);
      setInquiry(data);
      setDraft({
        category: data.category,
        summary: data.summary,
        city: data.location.city,
        state: data.location.state,
        region: data.location.region
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inquiry.");
    } finally {
      setLoading(false);
    }
  }, [inquiryId]);

  const loadHelperEndorsements = useCallback(async () => {
    if (!inquiry) return;
    try {
      const { endorsements } = await listHelperEndorsementsByBusiness(inquiry.businessId);
      setHelperEndorsements(endorsements);
    } catch {
      setHelperEndorsements([]);
    }
  }, [inquiry]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  useEffect(() => {
    loadHelperEndorsements();
  }, [loadHelperEndorsements]);

  async function runAction(key: string, fn: () => Promise<unknown>) {
    setBusy(key);
    setError("");
    setFeedback("");
    try {
      await fn();
      await load(true);
      setFeedback("Action completed.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusy(null);
    }
  }

  async function handleAddEvidence(event: FormEvent) {
    event.preventDefault();
    if (!inquiry) return;
    if (!evidenceForm.kind || !evidenceForm.title.trim() || !evidenceForm.reference.trim()) {
      setEvidenceError("Kind, title and reference are required.");
      return;
    }
    setEvidenceError("");
    const input: AddEvidenceInput = {
      kind: evidenceForm.kind,
      title: evidenceForm.title.trim(),
      reference: evidenceForm.reference.trim()
    };
    await runAction("evidence", () => addEvidence(inquiry.id, input));
    setEvidenceForm({ kind: "", title: "", reference: "" });
  }

  async function handleSaveDraft(event: FormEvent) {
    event.preventDefault();
    if (!inquiry) return;
    const location: LocationProfile = {
      city: draft.city.trim(),
      state: draft.state.trim(),
      region: draft.region.trim()
    };
    await runAction("draft", () =>
      updateInquiry(inquiry.id, { category: draft.category.trim(), summary: draft.summary.trim(), location })
    );
    setEditing(false);
  }

  if (loading && !inquiry) {
    return (
      <AppShell>
        <section className="page-fade flex items-center gap-2 text-sm text-ink-soft">
          <Spinner className="h-4 w-4" /> Loading inquiry...
        </section>
      </AppShell>
    );
  }

  if (error && !inquiry) {
    return (
      <AppShell>
        <section className="page-fade">
          <ErrorState message={error} onRetry={() => load()} />
        </section>
      </AppShell>
    );
  }

  if (!inquiry) return null;

  const stepIndex = [
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "VERIFIED",
    "ACTIVE"
  ].indexOf(inquiry.status);
  const currentStep = stepIndex >= 0 ? stepIndex : -1;

  return (
    <AppShell>
      <section className="page-fade">
        <Link to="/business/promote" className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink">
          <Icon name="arrow-left" className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="kicker">Endorsement inquiry</p>
            <h1 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">
              {inquiry.category}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <EndorsementStatusBadge status={inquiry.status} />
              <span className="chip">{formatLocation(inquiry.location)}</span>
              <span className="chip">Verification: {titleCase(inquiry.verificationLevel)}</span>
            </div>
          </div>
          <p className="text-xs text-ink-faint">
            Updated {formatDate(inquiry.updatedAt)}
          </p>
        </div>

        {feedback && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-accent-green/25 bg-accent-green-soft px-4 py-3 text-sm font-medium text-accent-green" role="status">
            <Icon name="check" className="h-4 w-4" />
            {feedback}
          </div>
        )}
        {error && (
          <div className="alert-error mt-5" role="alert">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Lifecycle tracker */}
        {currentStep >= 0 ? (
          <div className="mt-8 card p-5 md:p-6">
            <p className="kicker">Lifecycle</p>
            <ol className="mt-4 flex flex-wrap items-center gap-2">
              {["DRAFT", "SUBMITTED", "UNDER_REVIEW", "VERIFIED", "ACTIVE"].map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      i <= currentStep
                        ? "bg-accent-green text-canvas"
                        : "bg-canvas-alt text-ink-faint"
                    }`}
                  >
                    {i === currentStep && <Icon name="check" className="h-3 w-3" />}
                    {STEP_LABELS[step]}
                  </span>
                  {i < 4 && <Icon name="arrow-right" className="h-3 w-3 text-ink-faint" />}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-ink-soft">{describeStatus(inquiry.status)}</p>
          </div>
        ) : (
          <div className="mt-8 card p-5">
            <p className="kicker">Lifecycle</p>
            <p className="mt-2 text-sm text-ink-soft">
              This inquiry is in a terminal or paused state:{" "}
              <span className="font-semibold text-ink">{titleCase(inquiry.status)}</span>.{" "}
              {describeStatus(inquiry.status)}
            </p>
          </div>
        )}

        {/* Business actions */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h2 className="font-display text-xl">Business actions</h2>
            <div className="mt-4 space-y-3">
              {inquiry.status === "DRAFT" && (
                <button
                  onClick={() => runAction("submit", () => submitInquiry(inquiry.id))}
                  disabled={busy === "submit"}
                  className="btn btn-accent w-full justify-center"
                >
                  {busy === "submit" ? <Spinner /> : <Icon name="zap" className="h-4 w-4" />}
                  Submit for review
                </button>
              )}
              {inquiry.status === "ADDITIONAL_INFORMATION_REQUIRED" && (
                <button
                  onClick={() => runAction("respond", () => respondToInformationRequest(inquiry.id))}
                  disabled={busy === "respond"}
                  className="btn btn-accent w-full justify-center"
                >
                  {busy === "respond" ? <Spinner /> : <Icon name="message-circle" className="h-4 w-4" />}
                  Provide additional information
                </button>
              )}
              {["SUBMITTED", "UNDER_REVIEW", "ADDITIONAL_INFORMATION_REQUIRED", "INSPECTION_REQUIRED", "VERIFIED"].includes(
                inquiry.status
              ) && (
                <p className="text-sm text-ink-soft">
                  Your application is with the review team. Check the evidence and notifications for updates.
                </p>
              )}
              {["REJECTED", "REVOKED", "EXPIRED"].includes(inquiry.status) && (
                <button
                  onClick={() => navigate("/business/inquiry/new")}
                  className="btn btn-outline w-full justify-center"
                >
                  Start a new inquiry
                </button>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-display text-xl">Inquiry details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-faint">Category</dt>
                <dd className="font-medium text-ink">{inquiry.category}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-faint">Verification level</dt>
                <dd className="font-medium text-ink">{titleCase(inquiry.verificationLevel)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-faint">Commercial mode</dt>
                <dd className="font-medium text-ink">
                  {inquiry.commercialMode === "SAVEITRIP_SPONSORED" ? "SaveiTrip sponsored" : "Normal paid"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-faint">Submitted</dt>
                <dd className="font-medium text-ink">{formatDate(inquiry.submittedAt)}</dd>
              </div>
              {inquiry.expiryAt && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-faint">Valid until</dt>
                  <dd className="font-medium text-ink">{formatDate(inquiry.expiryAt)}</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 border-t border-line pt-4 text-sm leading-7 text-ink-soft">
              <span className="font-medium text-ink">Summary:</span> {inquiry.summary}
            </p>
          </div>
        </div>

        {/* Draft editing */}
        {inquiry.status === "DRAFT" && (
          <div className="mt-6 card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl">Edit draft</h2>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn btn-outline">
                  <Icon name="trend" className="h-4 w-4" /> Edit
                </button>
              )}
            </div>
            {editing && (
              <form onSubmit={handleSaveDraft} className="mt-4 space-y-4">
                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="field-label" htmlFor="d-cat">Category</label>
                    <input id="d-cat" className={inputClass} value={draft.category} onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))} />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="d-city">City</label>
                    <input id="d-city" className={inputClass} value={draft.city} onChange={(e) => setDraft((p) => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="d-region">Region</label>
                    <input id="d-region" className={inputClass} value={draft.region} onChange={(e) => setDraft((p) => ({ ...p, region: e.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <label className="field-label" htmlFor="d-summary">Summary</label>
                    <textarea id="d-summary" className={textareaClass} value={draft.summary} onChange={(e) => setDraft((p) => ({ ...p, summary: e.target.value }))} />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="d-state">State</label>
                    <input id="d-state" className={inputClass} value={draft.state} onChange={(e) => setDraft((p) => ({ ...p, state: e.target.value }))} />
                  </div>
                </div>
                <button type="submit" disabled={busy === "draft"} className="btn btn-primary justify-center">
                  {busy === "draft" ? <Spinner /> : <Icon name="check" className="h-4 w-4" />}
                  Save changes
                </button>
              </form>
            )}
          </div>
        )}

        {/* Evidence */}
        <div className="mt-6 card p-6">
          <h2 className="font-display text-xl">Evidence</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Upload or reference supporting documents for the review team. Once added,
            evidence is routed to the review pipeline for verification.
          </p>

          <form onSubmit={handleAddEvidence} className="mt-5 border-t border-line pt-5">
            <div className="grid gap-4 md:grid-cols-3">
              <select
                className={inputClass}
                value={evidenceForm.kind}
                onChange={(e) => setEvidenceForm((p) => ({ ...p, kind: e.target.value as EvidenceKind }))}
              >
                <option value="">Kind</option>
                <option value="document">Document</option>
                <option value="image">Image</option>
                <option value="link">Link</option>
                <option value="note">Note</option>
              </select>
              <input
                className={inputClass}
                placeholder="Title"
                value={evidenceForm.title}
                onChange={(e) => setEvidenceForm((p) => ({ ...p, title: e.target.value }))}
              />
              <input
                className={inputClass}
                placeholder="Reference (URL / file id)"
                value={evidenceForm.reference}
                onChange={(e) => setEvidenceForm((p) => ({ ...p, reference: e.target.value }))}
              />
            </div>
            {evidenceError && <p className="mt-2 text-xs text-accent-red">{evidenceError}</p>}
            <button type="submit" disabled={busy === "evidence"} className="btn btn-outline mt-4 justify-center">
              {busy === "evidence" ? <Spinner /> : <Icon name="shield-check" className="h-4 w-4" />}
              Add evidence
            </button>
          </form>
        </div>

        {/* Helper endorsements */}
        {helperEndorsements.length > 0 && (
          <div className="mt-6 card p-6">
            <h2 className="font-display text-xl">Helper endorsements</h2>
            <ul className="mt-4 space-y-3">
              {helperEndorsements.map((he) => (
                <li key={he.id} className="flex items-start justify-between gap-3 border-b border-line/70 pb-3 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-ink">{he.helperName}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">{he.reason}</p>
                  </div>
                  <HelperEndorsementStatusBadge status={he.status} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-xs text-ink-faint">
          Inquiry ID: {inquiry.id}
        </p>
      </section>
    </AppShell>
  );
}

function describeStatus(status: EndorsementInquiry["status"]): string {
  switch (status) {
    case "DRAFT":
      return "This inquiry is a draft. Submit it when you are ready for review.";
    case "SUBMITTED":
      return "Submitted. The review team will pick it up shortly.";
    case "UNDER_REVIEW":
      return "The review team is evaluating the application.";
    case "ADDITIONAL_INFORMATION_REQUIRED":
      return "More information is needed. Respond when ready.";
    case "INSPECTION_REQUIRED":
      return "An on-ground inspection has been scheduled for this inquiry.";
    case "VERIFIED":
      return "Verified! The endorsement can be activated.";
    case "ACTIVE":
      return "Active. This business is visible to travelers.";
    case "REJECTED":
      return "This application was rejected.";
    case "EXPIRED":
      return "This endorsement has expired.";
    case "REVOKED":
      return "This endorsement was revoked.";
    default:
      return "";
  }
}