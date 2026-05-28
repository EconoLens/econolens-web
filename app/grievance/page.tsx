/**
 * /grievance — Public legal grievance submission form
 * Required by India IT Rules 2021 (Intermediary Guidelines & Digital Media Ethics Code)
 * Grievances must be acknowledged within 24h and resolved within 15 days.
 */
"use client";

import { useState } from "react";

const GRIEVANCE_TYPES = [
  { value: "copyright_infringement", label: "Copyright Infringement" },
  { value: "defamation", label: "Defamation" },
  { value: "privacy_violation", label: "Privacy Violation" },
  { value: "illegal_content", label: "Illegal Content" },
  { value: "financial_advice_violation", label: "Financial Advice Violation" },
  { value: "other", label: "Other" },
] as const;

type FormState = "idle" | "submitting" | "success" | "error";

export default function GrievancePage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [grievanceId, setGrievanceId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [charCount, setCharCount] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/grievance/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Submission failed. Please try again.");
      }

      setGrievanceId(data.grievanceId);
      setFormState("success");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Grievance Received
          </h1>
          <p className="text-gray-600 mb-4">
            Your grievance has been registered. Reference ID:{" "}
            <span className="font-mono font-semibold text-gray-900">
              {grievanceId}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            You will receive an acknowledgement email within 24 hours. We are
            required by law to respond within 15 days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Submit a Grievance
          </h1>
          <p className="text-gray-600">
            EconoLens is committed to addressing legal grievances as required
            under the{" "}
            <strong>Information Technology (Intermediary Guidelines and
            Digital Media Ethics Code) Rules, 2021</strong>. All grievances are
            acknowledged within 24 hours and resolved within 15 days.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={200}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your full legal name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Acknowledgement and resolution communications will be sent here.
            </p>
          </div>

          {/* Grievance Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Grievance Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select grievance type</option>
              {GRIEVANCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content URL */}
          <div>
            <label
              htmlFor="content_url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content URL
            </label>
            <input
              id="content_url"
              name="content_url"
              type="url"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://econolens.com/article/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              The specific EconoLens page or article your grievance relates to.
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              maxLength={2000}
              onChange={(e) => setCharCount(e.target.value.length)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Please describe your grievance in detail. Include specific content you believe is problematic and why."
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {charCount} / 2000 characters
            </p>
          </div>

          {/* Evidence Upload */}
          <div>
            <label
              htmlFor="evidence"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Supporting Evidence{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="evidence"
              name="evidence"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              PDF or image files only. Max 10 MB.
            </p>
          </div>

          {/* Error message */}
          {formState === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={formState === "submitting"}
            className="w-full bg-gray-900 text-white rounded-lg py-3 px-4 text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {formState === "submitting" ? "Submitting…" : "Submit Grievance"}
          </button>

          {/* Legal notice */}
          <p className="text-xs text-gray-400 text-center">
            By submitting this form you confirm the information provided is
            accurate. False grievances may be subject to legal action.
          </p>
        </form>
      </div>
    </div>
  );
}
