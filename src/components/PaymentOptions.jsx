import {
  Smartphone,
  Receipt,
  Wifi,
  QrCode,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useState } from "react";
import { useBanking } from "../context/BankingContext";

function PaymentOptions({
  onPaymentSelect,
}) {
  const { showToast } = useBanking();

  const [selected, setSelected] =
    useState(null);

  const options = [
    {
      id: "upi",
      title: "UPI Payment",
      description: "Send money instantly",
      icon: Smartphone,
      color:
        "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10",
    },
    {
      id: "bills",
      title: "Pay Bills",
      description: "Electricity, water & more",
      icon: Receipt,
      color:
        "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10",
    },
    {
      id: "recharge",
      title: "Mobile Recharge",
      description: "Recharge your number",
      icon: Wifi,
      color:
        "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-500/10",
    },
    {
      id: "scan",
      title: "Scan & Pay",
      description: "Pay using QR code",
      icon: QrCode,
      color:
        "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10",
    },
  ];

  const handleSelect = (option) => {
    setSelected(option.id);

    if (onPaymentSelect) {
      onPaymentSelect(option);
      return;
    }

    showToast(
      `${option.title} selected`,
      "info"
    );

    window.setTimeout(() => {
      setSelected(null);
    }, 700);
  };

  return (
    <section className="w-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Quick Payments
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Choose a payment method
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <ArrowRight size={17} />
        </div>
      </div>

      {/* Options */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {options.map((option) => {
          const Icon = option.icon;

          const isSelected =
            selected === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                handleSelect(option)
              }
              className={`group flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 active:scale-[0.98] ${
                isSelected
                  ? "border-indigo-300 bg-indigo-50 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-500/10"
                  : "border-slate-200 bg-slate-50/70 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${option.color}`}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <strong className="block truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                  {option.title}
                </strong>

                <span className="mt-1 block truncate text-[10px] text-slate-400 dark:text-slate-500">
                  {option.description}
                </span>
              </div>

              <ArrowRight
                size={14}
                className="shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 dark:text-slate-600"
              />
            </button>
          );
        })}
      </div>

      {/* Security */}
      <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <ShieldCheck size={16} />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            Secure payments
          </p>

          <p className="mt-0.5 truncate text-[10px] text-slate-400 dark:text-slate-500">
            Your transactions are protected
            with bank-grade security.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PaymentOptions;