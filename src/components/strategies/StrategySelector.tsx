"use client";

import { useEffect, useReducer, useRef } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import {
  STRATEGIES,
  COMPARISON_ROWS,
  StrategyCard,
  StrategyKind,
  StrategyPreference,
  getStrategy,
  loadStoredPreference,
  saveStoredPreference,
} from "@/lib/strategies";
import { apiRequest, ApiRequestError } from "@/lib/api-client";
import { formatApyRange } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";

// ─── Types ────────────────────────────────────────────────────────────────────

type SaveStatus = "idle" | "saving" | "success" | "error";

interface State {
  current: StrategyKind | null;
  pending: StrategyKind | null; // strategy awaiting confirmation
  saveStatus: SaveStatus;
  errorMessage: string | null;
  loadingInitial: boolean;
}

type Action =
  | { type: "LOAD_SUCCESS"; strategy: StrategyKind | null }
  | { type: "REQUEST_CHANGE"; strategy: StrategyKind }
  | { type: "CANCEL_CHANGE" }
  | { type: "SAVE_START" }
  | { type: "SAVE_SUCCESS"; strategy: StrategyKind }
  | { type: "SAVE_ERROR"; message: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD_SUCCESS":
      return { ...state, current: action.strategy, loadingInitial: false };
    case "REQUEST_CHANGE":
      return { ...state, pending: action.strategy, saveStatus: "idle", errorMessage: null };
    case "CANCEL_CHANGE":
      return { ...state, pending: null, saveStatus: "idle", errorMessage: null };
    case "SAVE_START":
      return { ...state, saveStatus: "saving", errorMessage: null };
    case "SAVE_SUCCESS":
      return {
        ...state,
        current: action.strategy,
        pending: null,
        saveStatus: "success",
        errorMessage: null,
      };
    case "SAVE_ERROR":
      return { ...state, saveStatus: "error", errorMessage: action.message };
  }
}

const INITIAL_STATE: State = {
  current: null,
  pending: null,
  saveStatus: "idle",
  errorMessage: null,
  loadingInitial: true,
};

// ─── Design-spec risk badge ───────────────────────────────────────────────────
// Conservative → accent (sky-400)
// Balanced     → warning (amber-500)
// Growth       → danger (red-500)

function riskBadgeClass(tier: StrategyCard["riskTier"]): string {
  switch (tier) {
    case "low":
      return "bg-sky-400/15 text-sky-400 border border-sky-400/30";
    case "medium":
      return "bg-amber-500/15 text-amber-500 border border-amber-500/30";
    case "high":
      return "bg-red-500/15 text-red-500 border border-red-500/30";
  }
}

function strategyIcon(kind: StrategyKind) {
  switch (kind) {
    case "conservative":
      return <ShieldCheck size={22} aria-hidden />;
    case "balanced":
      return <TrendingUp size={22} aria-hidden />;
    case "growth":
      return <Zap size={22} aria-hidden />;
  }
}

function iconContainerClass(kind: StrategyKind): string {
  switch (kind) {
    case "conservative":
      return "text-sky-400 bg-sky-400/10";
    case "balanced":
      return "text-amber-400 bg-amber-400/10";
    case "growth":
      return "text-red-400 bg-red-400/10";
  }
}

// ─── Strategy card ────────────────────────────────────────────────────────────

interface StrategyCardProps {
  strategy: StrategyCard;
  isSelected: boolean;
  onSelect: (kind: StrategyKind) => void;
  saving: boolean;
}

function StrategyCardView({
  strategy,
  isSelected,
  onSelect,
  saving,
}: StrategyCardProps) {
  // Spec: selected state → border-2 primary + background tint
  const cardClass = isSelected
    ? "border-2 border-sky-500 bg-sky-500/8 shadow-lg shadow-sky-500/10"
    : "border border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5";

  return (
    <article
      className={`relative flex flex-col rounded-2xl p-6 transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 focus-within:ring-offset-transparent ${cardClass}`}
      aria-label={`${strategy.title} strategy${isSelected ? " (current)" : ""}`}
    >
      {isSelected && (
        <span className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-sky-500/20 px-2 py-0.5 text-xs font-semibold text-sky-400">
          <CheckCircle2 size={11} aria-hidden />
          Current
        </span>
      )}

      {/* Icon */}
      <div
        className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconContainerClass(strategy.kind)}`}
      >
        {strategyIcon(strategy.kind)}
      </div>

      {/* Title + APY */}
      <div className="mb-3">
        <h2 className="text-lg font-bold text-slate-100">{strategy.title}</h2>
        <p className="mt-0.5 text-2xl font-extrabold text-slate-50 tabular-nums">
          {/* Issue 468: locale-aware APY range with 2–4 dp precision. */}
          {formatApyRange(strategy.apyMin, strategy.apyMax)}
          <span className="ml-1 text-sm font-medium text-slate-500">APY</span>
        </p>
      </div>

      {/* Risk badge — Spec: Conservative=accent, Balanced=warning, Growth=danger */}
      <span
        className={`mb-4 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskBadgeClass(strategy.riskTier)}`}
      >
        {strategy.riskLabel}
      </span>

      {/* Description ≤ 140 chars */}
      <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-400">
        {strategy.description}
      </p>

      {/* Primary action */}
      <button
        type="button"
        onClick={() => onSelect(strategy.kind)}
        disabled={isSelected || saving}
        aria-pressed={isSelected}
        className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed ${
          isSelected
            ? "bg-sky-500/20 text-sky-400 cursor-default"
            : "bg-sky-500 text-white hover:bg-sky-400 shadow-lg shadow-sky-500/20 disabled:opacity-50"
        }`}
      >
        {isSelected ? "Active strategy" : strategy.primaryAction}
      </button>
    </article>
  );
}

// ─── Confirmation modal ───────────────────────────────────────────────────────

interface ConfirmModalProps {
  from: StrategyKind | null;
  to: StrategyKind;
  saveStatus: SaveStatus;
  errorMessage: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  from,
  to,
  saveStatus,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const toStrategy = getStrategy(to);
  const fromStrategy = from ? getStrategy(from) : null;
  const saving = saveStatus === "saving";

  // Trap focus and handle Escape
  useEffect(() => {
    confirmRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !saving) onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel, saving]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={saving ? undefined : onCancel}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          aria-label="Cancel"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500"
        >
          <X size={16} aria-hidden />
        </button>

        {/* Icon */}
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
          <AlertTriangle size={22} aria-hidden />
        </div>

        <h2 id="confirm-modal-title" className="mb-1 text-base font-bold text-slate-100">
          Confirm strategy change
        </h2>

        {/* From → To */}
        <p className="mb-4 text-sm text-slate-400">
          {fromStrategy ? (
            <>
              Switching from{" "}
              <span className="font-semibold text-slate-200">{fromStrategy.title}</span> to{" "}
              <span className="font-semibold text-slate-200">{toStrategy.title}</span>.
            </>
          ) : (
            <>
              Setting your strategy to{" "}
              <span className="font-semibold text-slate-200">{toStrategy.title}</span>.
            </>
          )}
        </p>

        {/* Risk/APY summary */}
        <div className="mb-5 rounded-xl border border-white/8 bg-white/3 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">APY range</span>
            <span className="font-semibold text-slate-200 tabular-nums">
              {formatApyRange(toStrategy.apyMin, toStrategy.apyMax)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Risk level</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${riskBadgeClass(toStrategy.riskTier)}`}
            >
              {toStrategy.riskLabel}
            </span>
          </div>
        </div>

        <p className="mb-5 text-xs text-slate-500">
          Active positions will be rebalanced on the next scheduled cycle. This
          change does not trigger an immediate on-chain transaction.
        </p>

        {/* Error */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400"
          >
            {errorMessage}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 rounded-lg border border-white/15 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:border-white/30 transition-colors disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 shadow-lg shadow-sky-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Confirm change"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Comparison table ─────────────────────────────────────────────────────────

function ComparisonTable({ current }: { current: StrategyKind | null }) {
  const highlight = (kind: StrategyKind) =>
    kind === current ? "bg-sky-500/8 font-semibold text-slate-100" : "text-slate-400";

  return (
    <section aria-label="Strategy comparison">
      <h2 className="mb-3 text-base font-semibold text-slate-200">
        Strategy comparison
      </h2>

      {/* Spec: mobile horizontally scrollable; sticky header on desktop */}
      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full min-w-[480px] text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-900 border-b border-white/8">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[140px]"
              >
                Feature
              </th>
              {STRATEGIES.map((s) => (
                <th
                  key={s.kind}
                  scope="col"
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                    s.kind === current
                      ? "text-sky-400"
                      : "text-slate-500"
                  }`}
                >
                  {s.title}
                  {s.kind === current && (
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-sky-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400 normal-case tracking-normal">
                      active
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={row.feature} className={i % 2 === 1 ? "bg-white/2" : ""}>
                <td className="px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap">
                  {row.feature}
                </td>
                <td className={`px-4 py-3 text-center text-sm ${highlight("conservative")}`}>
                  {row.conservative}
                </td>
                <td className={`px-4 py-3 text-center text-sm ${highlight("balanced")}`}>
                  {row.balanced}
                </td>
                <td className={`px-4 py-3 text-center text-sm ${highlight("growth")}`}>
                  {row.growth}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Success toast ────────────────────────────────────────────────────────────

function SuccessBanner({ strategy }: { strategy: StrategyKind }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
    >
      <CheckCircle2 size={16} className="shrink-0" aria-hidden />
      <span>
        Strategy updated to{" "}
        <span className="font-semibold">{getStrategy(strategy).title}</span>. Rebalancing
        will apply on the next scheduled cycle.
      </span>
    </div>
  );
}

// ─── Skeleton cards ───────────────────────────────────────────────────────────

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-white/8 bg-white/3 p-6 space-y-4"
        >
          <span className="block h-11 w-11 rounded-xl bg-white/5" />
          <div className="space-y-2">
            <span className="block h-4 w-24 rounded bg-white/5" />
            <span className="block h-8 w-16 rounded bg-white/5" />
          </div>
          <span className="block h-5 w-20 rounded-full bg-white/5" />
          <div className="space-y-1.5">
            <span className="block h-3 w-full rounded bg-white/5" />
            <span className="block h-3 w-full rounded bg-white/5" />
            <span className="block h-3 w-3/4 rounded bg-white/5" />
          </div>
          <span className="block h-10 w-full rounded-lg bg-white/5" />
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StrategySelector() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Load preference on mount — client localStorage first, then API
  useEffect(() => {
    const stored = loadStoredPreference();
    if (stored) {
      dispatch({ type: "LOAD_SUCCESS", strategy: stored });
      return;
    }

    apiRequest<StrategyPreference>("/api/strategy", { timeoutMs: 8000 })
      .then((data) => {
        dispatch({ type: "LOAD_SUCCESS", strategy: data.strategy });
      })
      .catch(() => {
        dispatch({ type: "LOAD_SUCCESS", strategy: null });
      });
  }, []);

  function handleSelect(kind: StrategyKind) {
    if (kind === state.current) return;
    dispatch({ type: "REQUEST_CHANGE", strategy: kind });
  }

  function handleCancel() {
    dispatch({ type: "CANCEL_CHANGE" });
  }

  async function handleConfirm() {
    if (!state.pending) return;
    const strategy = state.pending;

    dispatch({ type: "SAVE_START" });

    try {
      await apiRequest<StrategyPreference>("/api/strategy", {
        method: "PUT",
        body: { strategy },
        timeoutMs: 8000,
      });

      saveStoredPreference(strategy);
      dispatch({ type: "SAVE_SUCCESS", strategy });
    } catch (err: unknown) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : "Failed to save strategy. Please try again.";
      dispatch({ type: "SAVE_ERROR", message });
    }
  }

  const { current, pending, saveStatus, errorMessage, loadingInitial } = state;

  return (
    <main className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-1">
            Settings
          </p>
          <h1 className="text-2xl font-bold text-slate-100">Choose your strategy</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Select the risk/APY profile that matches your goals. Your active positions
            will rebalance on the next scheduled cycle.
          </p>
        </div>

        {/* Success banner */}
        {saveStatus === "success" && current && (
          <div className="mb-6">
            <SuccessBanner strategy={current} />
          </div>
        )}

        {/* Strategy cards — Spec: 3 cards with equal visual weight */}
        <section aria-label="Strategy options" className="mb-10">
          {loadingInitial ? (
            <SkeletonCards />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STRATEGIES.map((strategy) => (
                <StrategyCardView
                  key={strategy.kind}
                  strategy={strategy}
                  isSelected={strategy.kind === current}
                  onSelect={handleSelect}
                  saving={saveStatus === "saving"}
                />
              ))}
            </div>
          )}
        </section>

        {/* Comparison table */}
        <div className="mb-10">
          <ComparisonTable current={current} />
        </div>

        {/* Dashboard link */}
        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-500">
              ← Back to portfolio
            </Button>
          </Link>
        </div>
      </div>

      {/* Confirmation modal */}
      {pending && (
        <ConfirmModal
          from={current}
          to={pending}
          saveStatus={saveStatus}
          errorMessage={errorMessage}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </main>
  );
}
