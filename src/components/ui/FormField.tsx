"use client";

import { ReactNode } from "react";
import { FieldError } from "./FormErrors";
import { joinDescribedBy } from "@/lib/form-validation";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}

/**
 * Shared form field wrapper that unifies label, hint, error, and aria-describedby
 * wiring across the application. Reduces duplication in form implementations.
 */
export function FormField({
  id,
  label,
  error,
  hint,
  children,
  required = false,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedById = joinDescribedBy(hintId, errorId);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300"
      >
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
      <div data-aria-describedby={describedById}>{children}</div>
      {hint && (
        <p id={hintId} className="mt-2 text-sm text-slate-500">
          {hint}
        </p>
      )}
      {errorId && <FieldError id={errorId} message={error} />}
    </div>
  );
}
