import {
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Snowflake,
  Copy,
} from "lucide-react";

import { useState } from "react";
import { useBanking } from "../context/BankingContext";

function BankCard({
  card = {
    name: "NovaBank Platinum",
    type: "Debit Card",
    number: "4582 7812 3491 4582",
    expiry: "09/29",
    cvv: "482",
    holder: "SNEHIT",
    network: "VISA",
  },
}) {
  const {
    cardFrozen,
    freezeCard,
    showToast,
  } = useBanking();

  const [showNumber, setShowNumber] =
    useState(false);

  const [showCvv, setShowCvv] =
    useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          card.number.replace(/\s/g, "")
        );

        showToast(
          "Card number copied securely",
          "success"
        );
      } else {
        showToast(
          "Copy is not available in this browser",
          "error"
        );
      }
    } catch {
      showToast(
        "Unable to copy card number",
        "error"
      );
    }
  };

  const maskedNumber =
    card.number
      .split(" ")
      .map((part, index) =>
        index < 3 ? "••••" : part
      )
      .join(" ");

  return (
    <div className="w-full">
      {/* Card */}
      <div
        className={`group relative min-h-[220px] w-full overflow-hidden rounded-[26px] p-6 text-white shadow-xl transition-all duration-500 sm:min-h-[250px] sm:p-7 ${
          cardFrozen
            ? "bg-slate-700"
            : "bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700"
        }`}
      >
        {/* Background effects */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />

        <div className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="pointer-events-none absolute right-8 top-8 h-20 w-20 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute right-12 top-12 h-12 w-12 rounded-full border border-white/10" />

        {/* Frozen overlay */}
        {cardFrozen && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/30 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <Snowflake size={16} />
              Card Frozen
            </div>
          </div>
        )}

        <div className="relative z-10">
          {/* Top */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-sm font-bold backdrop-blur-md">
                  N
                </div>

                <span className="text-base font-bold tracking-tight">
                  NovaBank
                </span>
              </div>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
                {card.type}
              </p>
            </div>

            <div className="text-right">
              <span className="text-lg font-black italic tracking-tight">
                {card.network}
              </span>
            </div>
          </div>

          {/* Chip */}
          <div className="mt-7">
            <div className="relative h-9 w-12 overflow-hidden rounded-md border border-yellow-200/30 bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500 shadow-sm">
              <span className="absolute left-1/2 top-0 h-full w-px bg-yellow-700/30" />
              <span className="absolute left-0 top-1/2 h-px w-full bg-yellow-700/30" />
              <span className="absolute left-2 top-1 h-7 w-8 rounded-md border border-yellow-700/20" />
            </div>
          </div>

          {/* Number */}
          <div className="mt-5 flex items-center gap-2">
            <p className="font-mono text-lg font-semibold tracking-[0.12em] sm:text-xl">
              {showNumber
                ? card.number
                : maskedNumber}
            </p>

            <button
              type="button"
              onClick={() =>
                setShowNumber(
                  (current) => !current
                )
              }
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label={
                showNumber
                  ? "Hide card number"
                  : "Show card number"
              }
            >
              {showNumber ? (
                <EyeOff size={15} />
              ) : (
                <Eye size={15} />
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="Copy card number"
            >
              <Copy size={14} />
            </button>
          </div>

          {/* Bottom */}
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/50">
                Card Holder
              </p>

              <p className="mt-1 text-xs font-bold tracking-[0.12em]">
                {card.holder}
              </p>
            </div>

            <div>
              <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/50">
                Valid Thru
              </p>

              <p className="mt-1 text-xs font-bold">
                {card.expiry}
              </p>
            </div>

            <div>
              <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/50">
                CVV
              </p>

              <p className="mt-1 flex items-center gap-1 text-xs font-bold">
                {showCvv
                  ? card.cvv
                  : "•••"}

                <button
                  type="button"
                  onClick={() =>
                    setShowCvv(
                      (current) => !current
                    )
                  }
                  className="ml-1 text-white/60 hover:text-white"
                  aria-label={
                    showCvv
                      ? "Hide CVV"
                      : "Show CVV"
                  }
                >
                  {showCvv ? (
                    <EyeOff size={12} />
                  ) : (
                    <Eye size={12} />
                  )}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card controls */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={freezeCard}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
            cardFrozen
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
          }`}
        >
          {cardFrozen ? (
            <>
              <ShieldCheck size={17} />
              Unlock Card
            </>
          ) : (
            <>
              <Lock size={17} />
              Freeze Card
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
        >
          <Copy size={17} />
          Copy Number
        </button>
      </div>
    </div>
  );
}

export default BankCard;