import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../shared/AppShell";
import { Icon } from "../shared/Icon";
import { Spinner } from "../shared/ui";
import {
  addInternalNote,
  activateInquiry,
  approveInquiry,
  rejectInquiry,
  requestAdditionalInformation,
  requireInspection,
  reviewEvidence,
  revokeInquiry,
  startInquiryReview
} from "./api/admin";
import { getAdminInquiryDetail } from "./api/inquiries";
import {
  startHelperEndorsementReview,
  reviewHelperEndorsement
} from "./api/endorsements";
import type {
  Evidence,
  HelperEndorsement,
  InquiryDetail
} from "./endorsementTypes";
import { ErrorState, LoadingState, PageHeader } from "./components/StateViews";
import {
  EndorsementStatusBadge,
  EvidenceStatusBadge,
  HelperEndorsementStatusBadge,
  InspectionResultBadge,
  InspectionStatusBadge,
  SponsorshipStatusBadge,
  VerificationLevelBadge
} from "./components/StatusBadge";
import { formatDate, formatLocation, timeAgo, titleCase } from "./components/format";

export default function AdminInquiryDetailPage() {
  const { inquiryId } = useParams<{ inquiryId: string }>();
  const [detail, setDetail] = useState<InquiryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Action input state
  const [note, setNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [infoNote, setInfoNote] = useState("");
  const [inspectionNote, setInspectionNote] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

  const load = useCallback(async () => {
    if (!inquiryId) return;
    setError("");
    setLoading(true);
    try {
      const d = await getAdminInquiryDetail(inquiryId);
      setDetail(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inquiry detail.");
    } finally {
      setLoading(false);
    }
  }, [inquiryId]);

  useEffect(() => { load(); }, [load]);

  async function runAction(action: () => Promise<unknown>) {
    setBusy(true);
    setActionMessage("");
    try {
      await action();
      await load();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <AppShell><section className="page-fade"><LoadingState rows={6} /></section></AppShell>;
  if (error || !detail) return <AppShell><section className="page-fade"><ErrorState message={error || "Inquiry not found."} onRetry={load} /></section></AppShell>;

  const { inquiry, classification, verificationPolicy, arrangements, inspections, evidence, helperEndorsements } = detail;

  return (
    <AppShell>
      <section className="page-fade">
        <nav className="mb-6 text-sm text-ink-soft">
          <Link to="/admin/endorsements" className="hover:underline">Console</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{inquiryId}</span>
        </nav>

        <PageHeader
          kicker="Admin review"
          title={`${inquiry.category} endorsement inquiry`}
          action={
            <span className="inline-flex items-center gap-3">
              <EndorsementStatusBadge status={inquiry.status} />
              <VerificationLevelBadge level={inquiry.verificationLevel} />
            </span>
          }
        />

        {actionMessage && (
          <div className="mt-4 alert-error">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {/* Main review panel */}
          <div className="space-y-6 xl:col-span-2">
            {/* Core info */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl">{inquiry.category} endorsement</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="pin" className="h-3.5 w-3.5" />
                      {formatLocation(inquiry.location)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="clock" className="h-3.5 w-3.5" />
                      {timeAgo(inquiry.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-ink-soft">{inquiry.summary}</p>
              {inquiry.supportingInfo.length > 0 && (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="field-label">Supporting info</p>
                  <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                    {inquiry.supportingInfo.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Verification policy */}
            {verificationPolicy && (
              <div className="card p-6">
                <h3 className="font-display text-lg">Verification policy</h3>
                <p className="mt-2 text-sm text-ink-soft">{verificationPolicy.description}</p>
                {verificationPolicy.inspectionRequired && (
                  <span className="mt-3 inline-flex items-center gap-1.5 badge bg-accent-amber-soft text-accent-amber">
                    <Icon name="alert" className="h-3 w-3" />
                    Inspection required
                  </span>
                )}
              </div>
            )}

            {/* Evidence */}
            <div className="card p-6">
              <h3 className="font-display text-lg">Evidence</h3>
              {evidence.length === 0 ? (
                <p className="mt-3 text-sm text-ink-soft">No evidence submitted yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {evidence.map((ev) => (
                    <EvidenceRow key={ev.id} evidence={ev} reload={load} />
                  ))}
                </div>
              )}
            </div>

            {/* Helper endorsements */}
            <div className="card p-6">
              <h3 className="font-display text-lg">Helper endorsements</h3>
              {helperEndorsements.length === 0 ? (
                <p className="mt-3 text-sm text-ink-soft">No helper endorsements for this business yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {helperEndorsements.map((he) => (
                    <HelperEndorsementRow key={he.id} endorsement={he} reload={load} busy={busy} />
                  ))}
                </div>
              )}
            </div>

            {/* Inspections */}
            {inspections.length > 0 && (
              <div className="card p-6">
                <h3 className="font-display text-lg">Inspections</h3>
                <div className="mt-4 space-y-3">
                  {inspections.map((ins) => (
                    <article key={ins.id} className="rounded-xl border border-line p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <InspectionStatusBadge status={ins.status} />
                        <InspectionResultBadge result={ins.result} />
                        {ins.assignedToName && (
                          <span className="text-xs text-ink-soft">Assigned: {ins.assignedToName}</span>
                        )}
                        <span className="text-xs text-ink-faint">{timeAgo(ins.createdAt)}</span>
                      </div>
                      {ins.report && <p className="mt-2 text-sm text-ink-soft">{ins.report}</p>}
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Sponsorship arrangements */}
            {arrangements.length > 0 && (
              <div className="card p-6">
                <h3 className="font-display text-lg">Sponsorships</h3>
                <div className="mt-4 space-y-3">
                  {arrangements.map((arr) => (
                    <article key={arr.id} className="rounded-xl border border-line p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <SponsorshipStatusBadge status={arr.sponsorshipStatus ?? "PENDING"} />
                        <span className="text-xs text-ink-soft">{titleCase(arr.commercialMode.replace(/_/g, " ").toLowerCase())}</span>
                        {arr.sponsorshipStartDate && <span className="text-xs text-ink-faint">Started {formatDate(arr.sponsorshipStartDate)}</span>}
                      </div>
                      {arr.sponsorshipReason && <p className="mt-2 text-sm text-ink-soft">{arr.sponsorshipReason}</p>}
                      {arr.reviewComment && <p className="mt-1 text-xs text-ink-faint">Review: {arr.reviewComment}</p>}
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar actions */}
          <div className="space-y-6">
            {/* Lifecycle actions */}
            <div className="card p-6">
              <h3 className="font-display text-lg">Review actions</h3>
              <p className="mt-2 text-xs text-ink-soft">
                Actions respect the endorsement FSM. Invalid transitions are hidden.
              </p>
              <div className="mt-5 space-y-3">
                {(inquiry.status === "SUBMITTED" || inquiry.status === "UNDER_REVIEW") && (
                  <button
                    onClick={() => runAction(() => startInquiryReview(inquiryId!))}
                    disabled={busy}
                    className="btn btn-primary w-full justify-center"
                  >
                    {busy ? <Spinner /> : <Icon name="scale" className="h-4 w-4" />}
                    Start review
                  </button>
                )}

                {["UNDER_REVIEW", "ADDITIONAL_INFORMATION_REQUIRED"].includes(inquiry.status) && (
                  <>
                    <button
                      onClick={() => setShowInfoForm(!showInfoForm)}
                      className="btn btn-outline w-full justify-center"
                    >
                      <Icon name="message-circle" className="h-4 w-4" />
                      Request information
                    </button>
                    {showInfoForm && (
                      <form onSubmit={(e) => { e.preventDefault(); runAction(() => requestAdditionalInformation(inquiryId!, infoNote)); setInfoNote(""); setShowInfoForm(false); }} className="space-y-3">
                        <textarea value={infoNote} onChange={(e) => setInfoNote(e.target.value)} rows={3} className="input resize-y" placeholder="What additional information is needed?" />
                        <button type="submit" disabled={busy || !infoNote.trim()} className="btn btn-primary w-full justify-center text-sm">
                          {busy ? <Spinner /> : "Send request"}
                        </button>
                      </form>
                    )}
                  </>
                )}

                {["SUBMITTED", "UNDER_REVIEW", "INSPECTION_REQUIRED", "ADDITIONAL_INFORMATION_REQUIRED"].includes(inquiry.status) && (
                  <>
                    <button
                      onClick={() => setShowInspectionForm(!showInspectionForm)}
                      className="btn btn-outline w-full justify-center"
                    >
                      <Icon name="shield" className="h-4 w-4" />
                      Require inspection
                    </button>
                    {showInspectionForm && (
                      <form onSubmit={(e) => { e.preventDefault(); runAction(() => requireInspection(inquiryId!, { note: inspectionNote || undefined })); setInspectionNote(""); setShowInspectionForm(false); }} className="space-y-3">
                        <textarea value={inspectionNote} onChange={(e) => setInspectionNote(e.target.value)} rows={3} className="input resize-y" placeholder="Inspection notes (optional)" />
                        <button type="submit" disabled={busy} className="btn btn-primary w-full justify-center text-sm">
                          {busy ? <Spinner /> : "Request inspection"}
                        </button>
                      </form>
                    )}
                  </>
                )}

                {["UNDER_REVIEW", "INSPECTION_REQUIRED"].includes(inquiry.status) && (
                  <button
                    onClick={() => runAction(() => approveInquiry(inquiryId!, {}))}
                    disabled={busy}
                    className="btn btn-accent w-full justify-center"
                  >
                    {busy ? <Spinner /> : <Icon name="check" className="h-4 w-4" />}
                    Approve
                  </button>
                )}

                {["SUBMITTED", "UNDER_REVIEW", "ADDITIONAL_INFORMATION_REQUIRED", "INSPECTION_REQUIRED"].includes(inquiry.status) && (
                  <>
                    <button
                      onClick={() => setShowRejectForm(!showRejectForm)}
                      className="btn btn-outline w-full justify-center border-accent-red/40 text-accent-red hover:border-accent-red hover:bg-accent-red-soft"
                    >
                      Reject
                    </button>
                    {showRejectForm && (
                      <form onSubmit={(e) => { e.preventDefault(); if (rejectReason.trim()) runAction(() => rejectInquiry(inquiryId!, rejectReason.trim())); setRejectReason(""); setShowRejectForm(false); }} className="space-y-3">
                        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} className="input resize-y" placeholder="Reason for rejection" />
                        <button type="submit" disabled={busy || !rejectReason.trim()} className="btn w-full justify-center border-accent-red/40 text-accent-red hover:border-accent-red hover:bg-accent-red-soft">
                          {busy ? <Spinner /> : "Confirm reject"}
                        </button>
                      </form>
                    )}
                  </>
                )}

                {inquiry.status === "VERIFIED" && (
                  <button
                    onClick={() => runAction(() => activateInquiry(inquiryId!, {}))}
                    disabled={busy}
                    className="btn btn-accent w-full justify-center"
                  >
                    {busy ? <Spinner /> : <Icon name="shield-check" className="h-4 w-4" />}
                    Activate
                  </button>
                )}

                {["VERIFIED", "ACTIVE"].includes(inquiry.status) && (
                  <>
                    <button
                      onClick={() => setShowRejectForm(!showRejectForm)}
                      className="btn btn-outline w-full justify-center border-accent-red/40 text-accent-red hover:border-accent-red hover:bg-accent-red-soft"
                    >
                      Revoke
                    </button>
                    {showRejectForm && (
                      <form onSubmit={(e) => { e.preventDefault(); if (rejectReason.trim()) runAction(() => revokeInquiry(inquiryId!, rejectReason.trim())); setRejectReason(""); setShowRejectForm(false); }} className="space-y-3">
                        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} className="input resize-y" placeholder="Reason for revocation" />
                        <button type="submit" disabled={busy || !rejectReason.trim()} className="btn w-full justify-center border-accent-red/40 text-accent-red hover:border-accent-red hover:bg-accent-red-soft">
                          {busy ? <Spinner /> : "Confirm revoke"}
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Internal note */}
            <div className="card p-6">
              <h3 className="font-display text-lg">Internal note</h3>
              <form onSubmit={(e: FormEvent) => { e.preventDefault(); if (note.trim()) runAction(() => addInternalNote(inquiryId!, note.trim())); setNote(""); }} className="mt-4 space-y-3">
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="input resize-y" placeholder="Add a private note for other reviewers…" />
                <button type="submit" disabled={busy || !note.trim()} className="btn btn-outline w-full justify-center text-sm">
                  {busy ? <Spinner /> : "Add note"}
                </button>
              </form>
              {inquiry.internalNotes.length > 0 && (
                <div className="mt-4 space-y-3 border-t border-line pt-4">
                  {inquiry.internalNotes.map((n) => (
                    <div key={n.id}>
                      <p className="text-xs text-ink-faint">{n.authorName} · {timeAgo(n.createdAt)}</p>
                      <p className="mt-1 text-sm text-ink-soft">{n.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Classification */}
            {classification && (
              <div className="card p-6">
                <h3 className="font-display text-lg">Classification</h3>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-2"><dt className="text-ink-faint">Type</dt><dd>{classification.endorsementType}</dd></div>
                  <div className="flex justify-between gap-2"><dt className="text-ink-faint">Traveler relevance</dt><dd>{(classification.travelerRelevance * 100).toFixed(0)}%</dd></div>
                  <div className="flex justify-between gap-2"><dt className="text-ink-faint">Confidence</dt><dd>{(classification.confidence * 100).toFixed(0)}%</dd></div>
                </dl>
                {classification.riskIndicators.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {classification.riskIndicators.map((r, i) => (
                      <span key={i} className={`badge ${r.severity === "HIGH" || r.severity === "SEVERE" ? "bg-accent-red-soft text-accent-red" : "bg-accent-amber-soft text-accent-amber"}`}>
                        {r.kind}: {r.severity}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-3 text-xs text-ink-faint">{classification.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function EvidenceRow({ evidence, reload }: { evidence: Evidence; reload: () => void }) {
  const [busy, setBusy] = useState(false);

  async function handleReview(decision: "APPROVED" | "REJECTED") {
    setBusy(true);
    try {
      await reviewEvidence(evidence.id, decision);
      await reload();
    } catch {
      // non-fatal
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-xl border border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-sm">{evidence.title}</span>
          <EvidenceStatusBadge status={evidence.status} />
          <span className="text-xs text-ink-faint">{evidence.kind}</span>
        </div>
        {evidence.status === "PENDING_REVIEW" && (
          <div className="flex gap-2">
            <button
              onClick={() => handleReview("APPROVED")}
              disabled={busy}
              className="btn btn-ghost px-3! py-1.5! text-xs text-accent-green hover:text-accent-green!"
            >
              {busy ? <Spinner className="h-3 w-3" /> : "Approve"}
            </button>
            <button
              onClick={() => handleReview("REJECTED")}
              disabled={busy}
              className="btn btn-ghost px-3! py-1.5! text-xs text-accent-red hover:text-accent-red!"
            >
              Reject
            </button>
          </div>
        )}
      </div>
      {evidence.reference && (
        <p className="mt-2 break-all text-xs text-ink-faint">{evidence.reference}</p>
      )}
    </article>
  );
}

function HelperEndorsementRow({
  endorsement,
  reload,
  busy
}: {
  endorsement: HelperEndorsement;
  reload: () => void;
  busy: boolean;
}) {
  const [actionBusy, setActionBusy] = useState(false);

  async function handleReview(decision: "VERIFIED" | "REJECTED") {
    setActionBusy(true);
    try {
      if (endorsement.status === "SUBMITTED") {
        await startHelperEndorsementReview(endorsement.id);
      }
      await reviewHelperEndorsement(endorsement.id, decision);
      await reload();
    } catch {
      // non-fatal
    } finally {
      setActionBusy(false);
    }
  }

  return (
    <article className="rounded-xl border border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-sm">{endorsement.helperName}</span>
            <HelperEndorsementStatusBadge status={endorsement.status} />
          </div>
          <p className="mt-1 text-sm text-ink-soft">{endorsement.reason}</p>
          <p className="mt-1 text-xs text-ink-faint">{endorsement.category} · {formatLocation(endorsement.location)} · {timeAgo(endorsement.createdAt)}</p>
        </div>
        {["SUBMITTED", "UNDER_REVIEW"].includes(endorsement.status) && (
          <div className="flex gap-2">
            <button
              onClick={() => handleReview("VERIFIED")}
              disabled={actionBusy || busy}
              className="btn btn-ghost px-3! py-1.5! text-xs text-accent-green hover:text-accent-green!"
            >
              {actionBusy ? <Spinner className="h-3 w-3" /> : "Verify"}
            </button>
            <button
              onClick={() => handleReview("REJECTED")}
              disabled={actionBusy || busy}
              className="btn btn-ghost px-3! py-1.5! text-xs text-accent-red hover:text-accent-red!"
            >
              Reject
            </button>
          </div>
        )}
      </div>
      {endorsement.evidenceRefs.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {endorsement.evidenceRefs.map((ref, i) => (
            <span key={i} className="rounded-lg bg-canvas-alt px-2 py-0.5 text-[0.65rem] text-ink-faint">{ref}</span>
          ))}
        </div>
      )}
    </article>
  );
}