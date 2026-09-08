import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../shared/Icon";
import { Brand, Spinner } from "../shared/ui";
import { submitEndorsementInquiry, type EndorsementInquiryInput } from "./endorsementService";

const businessCategories = [
  "Accommodation & Stays",
  "Food & Restaurants",
  "Cafes & Bakeries",
  "Tours & Experiences",
  "Transport & Cabs",
  "Heritage & Museums",
  "Shopping & Handicrafts",
  "Adventure & Sports",
  "Wellness & Spas",
  "Other"
];

const businessScales = [
  "Micro · < ₹5L/yr",
  "Small · ₹5L–₹25L/yr",
  "Mid · ₹25L–₹1Cr/yr",
  "Large · > ₹1Cr/yr"
];

type FormState = {
  businessName: string;
  category: string;
  location: string;
  contactPerson: string;
  contactNumber: string;
  description: string;
  scaleRange: string;
  webLink: string;
  promotionGoal: string;
  additionalInfo: string;
};

const emptyForm: FormState = {
  businessName: "",
  category: "",
  location: "",
  contactPerson: "",
  contactNumber: "",
  description: "",
  scaleRange: "",
  webLink: "",
  promotionGoal: "",
  additionalInfo: ""
};

const inputClass = "input";
const textareaClass = "input min-h-[7.5rem] resize-y";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-accent-red">
      <Icon name="alert" className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

export default function BusinessPromotionPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [inquiryId, setInquiryId] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError("");
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.businessName.trim()) next.businessName = "Business name is required.";
    if (!form.category) next.category = "Choose a business category.";
    if (!form.location.trim()) next.location = "Location is required.";
    if (!form.contactPerson.trim()) next.contactPerson = "Contact person is required.";
    if (!form.contactNumber.trim()) {
      next.contactNumber = "Contact number is required.";
    } else if (!/^\+?[\d\s()-]{7,15}$/.test(form.contactNumber.trim())) {
      next.contactNumber = "Enter a valid phone number.";
    }
    if (!form.description.trim()) {
      next.description = "Describe the business.";
    } else if (form.description.trim().length < 20) {
      next.description = "Add a little more detail (at least 20 characters).";
    }
    if (!form.scaleRange) next.scaleRange = "Rough scale helps match the right helper.";
    if (form.webLink.trim() && !/^https?:\/\/[^\s]+$/.test(form.webLink.trim())) {
      next.webLink = "Enter a valid URL starting with http:// or https://.";
    }
    if (!form.promotionGoal.trim()) {
      next.promotionGoal = "Tell us what you want promoted.";
    } else if (form.promotionGoal.trim().length < 15) {
      next.promotionGoal = "Add a little more detail (at least 15 characters).";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitError("");
    setLoading(true);
    try {
      const input: EndorsementInquiryInput = {
        businessName: form.businessName.trim(),
        category: form.category,
        location: form.location.trim(),
        contactPerson: form.contactPerson.trim(),
        contactNumber: form.contactNumber.trim(),
        description: form.description.trim(),
        scaleRange: form.scaleRange,
        webLink: form.webLink.trim() || undefined,
        promotionGoal: form.promotionGoal.trim(),
        additionalInfo: form.additionalInfo.trim() || undefined
      };
      const result = await submitEndorsementInquiry(input);
      setInquiryId(result.inquiryId);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setForm(emptyForm);
    setErrors({});
    setSubmitError("");
    setInquiryId(null);
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-8">
          <Link to="/" aria-label="SaveiTrip home" className="shrink-0">
            <Brand />
          </Link>
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface-high px-3.5 py-2 text-xs font-medium text-ink-soft shadow-sm transition-colors hover:border-ink hover:text-ink"
          >
            <Icon name="arrow-left" className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      <main id="main-content" className="page-fade">
        <section className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
          <p className="kicker">Local business promotion</p>
          <h1 className="font-display mt-4 text-4xl leading-[1.05] md:text-6xl">
            Put your local business on the map.
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-ink-soft">
            SaveiTrip is building a network of verified local helpers who inspect and recommend
            businesses to travellers headed your way. Share a few details about your business and
            our team will prepare the listing for review.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-2">
              <Icon name="shield-check" className="h-4 w-4 text-accent-green" /> Verified on-ground reviews
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="users" className="h-4 w-4 text-accent-green" /> Matched with nearby travel helpers
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="trend" className="h-4 w-4 text-accent-green" /> No fees to apply
            </span>
          </div>

          <div className="mt-10">
            {inquiryId ? (
              <div className="card mx-auto max-w-xl p-8 text-center md:p-10">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-green-soft text-accent-green">
                  <Icon name="shield-check" className="h-7 w-7" />
                </span>
                <h2 className="font-display mt-6 text-2xl leading-tight">Inquiry received</h2>
                <p className="mt-3 leading-7 text-ink-soft">
                  Your booking reference is{" "}
                  <span className="font-semibold text-ink">{inquiryId}</span>. A SaveiTrip coordinator
                  will review the details and reach out shortly.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button onClick={reset} className="btn btn-primary justify-center">
                    Submit another inquiry
                  </button>
                  <Link to="/" className="btn btn-outline justify-center">
                    <Icon name="arrow-left" className="h-4 w-4" />
                    Back to home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="card p-6 md:p-10">
                <h2 className="font-display text-xl">Business details</h2>
                <div className="mt-6 space-y-5">
                  <div>
                    <label className="field-label" htmlFor="business-name">
                      Business name
                    </label>
                    <input
                      id="business-name"
                      type="text"
                      className={inputClass}
                      value={form.businessName}
                      onChange={(e) => set("businessName", e.target.value)}
                      placeholder="e.g. Annapurna Family Kitchen"
                    />
                    <FieldError message={errors.businessName} />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="field-label" htmlFor="category">
                        Business category / type
                      </label>
                      <select
                        id="category"
                        className={inputClass}
                        value={form.category}
                        onChange={(e) => set("category", e.target.value)}
                      >
                        <option value="">Select a category</option>
                        {businessCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <FieldError message={errors.category} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="location">
                        Location
                      </label>
                      <input
                        id="location"
                        type="text"
                        className={inputClass}
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        placeholder="e.g. Gangtok, Sikkim"
                      />
                      <FieldError message={errors.location} />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="field-label" htmlFor="contact-person">
                        Contact person
                      </label>
                      <input
                        id="contact-person"
                        type="text"
                        className={inputClass}
                        value={form.contactPerson}
                        onChange={(e) => set("contactPerson", e.target.value)}
                        placeholder="Full name"
                      />
                      <FieldError message={errors.contactPerson} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="contact-number">
                        Contact number
                      </label>
                      <input
                        id="contact-number"
                        type="tel"
                        className={inputClass}
                        value={form.contactNumber}
                        onChange={(e) => set("contactNumber", e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                      <FieldError message={errors.contactNumber} />
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="description">
                      Business description
                    </label>
                    <textarea
                      id="description"
                      className={textareaClass}
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="What does your business do, who visits today, and what makes it special?"
                    />
                    <FieldError message={errors.description} />
                  </div>

                  <h3 className="font-display pt-2 text-xl">Endorsement details</h3>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="field-label" htmlFor="scale-range">
                        Approximate business scale / revenue
                      </label>
                      <select
                        id="scale-range"
                        className={inputClass}
                        value={form.scaleRange}
                        onChange={(e) => set("scaleRange", e.target.value)}
                      >
                        <option value="">Select a range</option>
                        {businessScales.map((scale) => (
                          <option key={scale} value={scale}>
                            {scale}
                          </option>
                        ))}
                      </select>
                      <FieldError message={errors.scaleRange} />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="web-link">
                        Website / social link <span className="font-normal text-ink-faint">(optional)</span>
                      </label>
                      <input
                        id="web-link"
                        type="url"
                        className={inputClass}
                        value={form.webLink}
                        onChange={(e) => set("webLink", e.target.value)}
                        placeholder="https://... or instagram handle"
                      />
                      <FieldError message={errors.webLink} />
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="promotion-goal">
                      What would you like promoted?
                    </label>
                    <textarea
                      id="promotion-goal"
                      className={textareaClass}
                      value={form.promotionGoal}
                      onChange={(e) => set("promotionGoal", e.target.value)}
                      placeholder="e.g. a seasonal menu, a homestay room, a trekking route, a new experience"
                    />
                    <FieldError message={errors.promotionGoal} />
                  </div>

                  <div>
                    <label className="field-label" htmlFor="additional-info">
                      Additional information <span className="font-normal text-ink-faint">(optional)</span>
                    </label>
                    <textarea
                      id="additional-info"
                      className={`${textareaClass} min-h-[5.5rem]`}
                      value={form.additionalInfo}
                      onChange={(e) => set("additionalInfo", e.target.value)}
                      placeholder="Anything else the review team should know."
                    />
                  </div>

                  {submitError && (
                    <div className="alert-error" role="alert">
                      <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center md:w-auto">
                    {loading ? (
                      <>
                        <Spinner /> Submitting inquiry...
                      </>
                    ) : (
                      <>
                        Submit inquiry
                        <Icon name="arrow-right" className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-canvas-alt/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-xs text-ink-faint md:px-8">
          <span>SaveiTrip — Local Business Endorsement Program.</span>
          <Link to="/" className="transition-colors hover:text-ink">
            Explore SaveiTrip
          </Link>
        </div>
      </footer>
    </div>
  );
}