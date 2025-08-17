"use client";
import React, { useEffect, useRef } from "react";

export type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "Please confirm your action.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  tone = "default",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        onCancel();
      }
      if (e.key === "Tab" && open && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter(el => !el.hasAttribute("disabled"));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!active) return;
        if (!dialogRef.current.contains(active)) {
          first.focus();
          e.preventDefault();
        } else if (!e.shiftKey && active === last) {
          first.focus();
          e.preventDefault();
        } else if (e.shiftKey && active === first) {
          last.focus();
          e.preventDefault();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => firstBtnRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-100 transition-opacity duration-200"
            onClick={onCancel}
          />

          {/* Modal */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cm-title"
            aria-describedby="cm-desc"
            className="relative z-10 w-full max-w-md transform rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all duration-200 ease-out scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="cm-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            <div id="cm-desc" className="mt-2 text-sm text-slate-600">
              {typeof message === "string" ? <p>{message}</p> : message}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                ref={firstBtnRef}
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors ${
                  tone === "danger"
                    ? "bg-primary hover:bg-primary"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}