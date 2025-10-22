"use client";

import type React from "react";
import { useState } from "react";
import type { Language } from "@/lib/translations";
import { translations } from "@/lib/translations";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  position?: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (
  formData: {
    name: string;
    email: string;
    company: string;
    position: string;
  },
  t: (typeof translations)["pt"]
): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = t.nameRequired;
  } else if (formData.name.trim().length < 2) {
    errors.name = t.nameMinLength;
  }

  if (!formData.email.trim()) {
    errors.email = t.emailRequired;
  } else if (!validateEmail(formData.email)) {
    errors.email = t.emailInvalid;
  }

  if (!formData.company.trim()) {
    errors.company = t.companyRequired;
  }

  if (!formData.position.trim()) {
    errors.position = t.positionRequired;
  }

  return errors;
};

export default function WaitlistModal({
  isOpen,
  onClose,
  language,
}: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    position: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const validationErrors = validateForm(formData, t);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouchedFields(new Set(["name", "email", "company", "position"]));
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = Math.random() > 0.1;
          if (success) {
            resolve(true);
          } else {
            reject(new Error("Network error"));
          }
        }, 1500);
      });

      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setFormData({ name: "", email: "", company: "", position: "" });
        setIsSubmitted(false);
        setErrors({});
        setTouchedFields(new Set());
        onClose();
      }, 2500);
    } catch (_error) {
      setIsSubmitting(false);
      setSubmitError(t.submitError);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields((prev) => new Set(prev).add(name));

    const fieldErrors = validateForm(formData, t);
    if (fieldErrors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name as keyof FormErrors],
      }));
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", company: "", position: "" });
    setErrors({});
    setTouchedFields(new Set());
    setSubmitError("");
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-[#191919] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-md relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Close</title>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            <h2 className="text-2xl font-medium text-white mb-2">
              {t.modalTitle}
            </h2>
            <p className="text-sm text-white/60 mb-6">{t.modalSubtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-light text-white/80 mb-2"
                >
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/40 text-sm font-light focus:outline-none transition-all duration-200 ${
                    touchedFields.has("name") && errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-[#d3ff33]/50"
                  }`}
                  placeholder={t.namePlaceholder}
                />
                {touchedFields.has("name") && errors.name && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <title>Error</title>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-light text-white/80 mb-2"
                >
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/40 text-sm font-light focus:outline-none transition-all duration-200 ${
                    touchedFields.has("email") && errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-[#d3ff33]/50"
                  }`}
                  placeholder={t.emailPlaceholder}
                />
                {touchedFields.has("email") && errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <title>Error</title>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-light text-white/80 mb-2"
                >
                  {t.companyLabel}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/40 text-sm font-light focus:outline-none transition-all duration-200 ${
                    touchedFields.has("company") && errors.company
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-[#d3ff33]/50"
                  }`}
                  placeholder={t.companyPlaceholder}
                />
                {touchedFields.has("company") && errors.company && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <title>Error</title>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.company}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-light text-white/80 mb-2"
                >
                  {t.positionLabel}
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/40 text-sm font-light focus:outline-none transition-all duration-200 ${
                    touchedFields.has("position") && errors.position
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-[#d3ff33]/50"
                  }`}
                  placeholder={t.positionPlaceholder}
                />
                {touchedFields.has("position") && errors.position && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <title>Error</title>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.position}
                  </p>
                )}
              </div>

              {submitError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 mt-0.5"
                  >
                    <title>Error</title>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-red-400 text-xs">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 rounded-lg bg-[#d3ff33] text-[#191919] font-medium text-sm transition-all duration-200 hover:bg-[#a8cc29] disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <title>Loading</title>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isSubmitting ? t.sending : t.sendButton}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#d3ff33]/20 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d3ff33"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Success</title>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              {t.successTitle}
            </h3>
            <p className="text-sm text-white/60">{t.successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
