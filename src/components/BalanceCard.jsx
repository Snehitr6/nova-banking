import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Plus,
  ShieldCheck,
} from "lucide-react";

import { useBanking } from "../context/BankingContext";

function BalanceCard() {
  const { balance, addMoney, showToast } = useBanking();

  const [showBalance, setShowBalance] = useState(true);
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    let animationFrame;
    const startValue = displayBalance;
    const endValue = balance;
    const duration = 600;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(
        elapsed / duration,
        1
      );

      const easeOut =
        1 - Math.pow(1 - progress, 3);

      const currentValue =
        startValue +
        (endValue - startValue) * easeOut;

      setDisplayBalance(currentValue);

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      }
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [balance]);

  const formatCurrency = (value) => {
    return Number(value).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    );
  };

  const handleAddMoney = (event) => {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      showToast(
        "Please enter a valid amount",
        "error"
      );
      return;
    }

    const success = addMoney(numericAmount);

    if (success) {
      setAmount("");
      setShowAddMoney(false);
    }
  };

  const quickAmount = (value) => {
    setAmount(String(value));
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-5 text-white shadow-xl shadow-slate-900/10 sm:p-6 lg:p-7">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="pointer-events-none absolute right-8 top-8 h-24 w-24 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute right-14 top-14 h-12 w-12 rounded-full border border-white/10" />

        <div className="relative z-10">
          {/* Top */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                <Wallet
                  size={21}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-300">
                  Available Balance
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Primary account
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowBalance(
                  (current) => !current
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
              aria-label={
                showBalance
                  ? "Hide balance"
                  : "Show balance"
              }
            >
              {showBalance ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          </div>

          {/* Balance */}
          <div className="mt-7">
            <div className="flex flex-wrap items-end gap-2">
              <span className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px]">
                {showBalance
                  ? `₹${formatCurrency(
                      displayBalance
                    )}`
                  : "₹ ••••••"}
              </span>

              {showBalance && (
                <span className="mb-1 text-sm text-slate-400">
                  INR
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                <ArrowUpRight size={13} />
                +8.4%
              </span>

              <span className="text-xs text-slate-400">
                from last month
              </span>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck
                size={15}
                className="text-emerald-400"
              />

              <span>
                Your money is protected
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowAddMoney(true)
              }
              className="group flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0"
            >
              <Plus
                size={17}
                className="transition-transform duration-200 group-hover:rotate-90"
              />

              Add Money
            </button>
          </div>
        </div>
      </section>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setShowAddMoney(false);
            }
          }}
        >
          <div className="w-full max-w-md animate-[scaleIn_0.2s_ease-out] rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Add Money
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add funds to your primary
                  account.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddMoney(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleAddMoney}
              className="mt-6"
            >
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value
                    )
                  }
                  placeholder="Enter amount"
                  autoFocus
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-10 pr-4 text-lg font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Quick amounts */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[1000, 5000, 10000].map(
                  (value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        quickAmount(value)
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                    >
                      ₹
                      {value.toLocaleString(
                        "en-IN"
                      )}
                    </button>
                  )
                )}
              </div>

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99]"
              >
                <ArrowDownLeft
                  size={18}
                />

                Add to Account
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BalanceCard;