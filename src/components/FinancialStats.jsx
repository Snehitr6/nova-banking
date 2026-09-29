import { useMemo } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  ReceiptText,
  WalletCards,
  Target,
} from "lucide-react";
import { useBanking } from "../context/BankingContext";

const formatAmount = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function FinancialStats() {
  const { transactions, balance } = useBanking();

  const stats = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );

    const expenses = transactions
      .filter((item) => item.type === "expense")
      .reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );

    const savings = Math.max(income - expenses, 0);

    const savingsRate =
      income > 0
        ? Math.round((savings / income) * 100)
        : 0;

    const expenseCount = transactions.filter(
      (item) => item.type === "expense"
    ).length;

    const incomeCount = transactions.filter(
      (item) => item.type === "income"
    ).length;

    return {
      income,
      expenses,
      savings,
      savingsRate,
      expenseCount,
      incomeCount,
    };
  }, [transactions]);

  const cards = [
    {
      title: "Total Balance",
      value: balance,
      subtitle: "Available balance",
      icon: WalletCards,
      iconClass:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
      valueClass: "text-slate-900 dark:text-white",
      trend: "Current",
      trendClass:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    },
    {
      title: "Total Income",
      value: stats.income,
      subtitle: `${stats.incomeCount} income transactions`,
      icon: ArrowUpRight,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      valueClass: "text-emerald-600 dark:text-emerald-400",
      trend: "Received",
      trendClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      title: "Total Expenses",
      value: stats.expenses,
      subtitle: `${stats.expenseCount} expense transactions`,
      icon: ArrowDownRight,
      iconClass:
        "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
      valueClass: "text-rose-600 dark:text-rose-400",
      trend: "Spent",
      trendClass:
        "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    },
    {
      title: "Savings",
      value: stats.savings,
      subtitle: `${stats.savingsRate}% savings rate`,
      icon: PiggyBank,
      iconClass:
        "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
      valueClass: "text-violet-600 dark:text-violet-400",
      trend: `${stats.savingsRate}% saved`,
      trendClass:
        "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    },
  ];

  return (
    <section className="w-full">
      {/* Section heading */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Financial Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A quick look at your finances
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 sm:flex">
          <ReceiptText size={15} />
          <span>{transactions.length} transactions</span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              {/* Decorative background */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-50 opacity-80 transition-transform duration-500 group-hover:scale-150 dark:bg-slate-800/50" />

              <div className="relative">
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${card.iconClass}`}
                  >
                    <Icon size={20} />
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${card.trendClass}`}
                  >
                    {card.trend}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>

                  <p
                    className={`mt-1 break-words text-2xl font-bold tracking-tight ${card.valueClass}`}
                  >
                    {formatAmount(card.value)}
                  </p>

                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    {card.subtitle}
                  </p>
                </div>

                {/* Progress / visual line */}
                <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 group-hover:w-full ${
                      index === 0
                        ? "w-[78%] bg-indigo-500"
                        : index === 1
                        ? "w-[72%] bg-emerald-500"
                        : index === 2
                        ? "w-[48%] bg-rose-500"
                        : "w-[64%] bg-violet-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings target */}
      <div className="mt-4 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Target size={19} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Savings Progress
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Keep building your financial safety net
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.savingsRate}%
            </p>

            <p className="text-xs text-slate-400 dark:text-slate-500">
              savings rate
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 transition-all duration-1000"
              style={{
                width: `${Math.min(stats.savingsRate, 100)}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>₹0</span>
            <span>{formatAmount(stats.savings)} saved</span>
          </div>
        </div>
      </div>
    </section>
  );
}