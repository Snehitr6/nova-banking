import { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useBanking } from "../context/BankingContext";

const monthlyData = [
  { month: "Apr", income: 72000, expense: 38200 },
  { month: "May", income: 84500, expense: 42100 },
  { month: "Jun", income: 78000, expense: 39600 },
  { month: "Jul", income: 92000, expense: 46800 },
  { month: "Aug", income: 88000, expense: 44200 },
  { month: "Sep", income: 98400, expense: 38900 },
];

const categoryData = [
  { name: "Shopping", value: 12480 },
  { name: "Food", value: 8640 },
  { name: "Bills", value: 6380 },
  { name: "Travel", value: 4920 },
  { name: "Entertainment", value: 3180 },
];

const formatAmount = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

function getCategoryIcon(name) {
  const icons = {
    Shopping: "🛍️",
    Food: "🍔",
    Bills: "💡",
    Travel: "✈️",
    Entertainment: "🎬",
  };

  return icons[name] || "💳";
}

export default function SpendingChart() {
  const { transactions } = useBanking();

  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("6 months");
  const [hoveredBar, setHoveredBar] = useState(null);

  const currentMonth = monthlyData[monthlyData.length - 1];

  const totalExpense = useMemo(() => {
    const transactionExpenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );

    return transactionExpenses || currentMonth.expense;
  }, [transactions]);

  const totalIncome = useMemo(() => {
    const transactionIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );

    return transactionIncome || currentMonth.income;
  }, [transactions]);

  const savings = Math.max(totalIncome - totalExpense, 0);

  const maxValue = Math.max(
    ...monthlyData.flatMap((item) => [
      item.income,
      item.expense,
    ])
  );

  const spendingPercentage =
    totalIncome > 0
      ? Math.min(
          Math.round((totalExpense / totalIncome) * 100),
          100
        )
      : 0;

  const visibleData =
    period === "3 months"
      ? monthlyData.slice(-3)
      : monthlyData;

  return (
    <section className="w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <BarChart3 size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Spending Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track your income and expenses
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                activeTab === "overview"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Overview
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                activeTab === "categories"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Categories
            </button>
          </div>

          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
          </select>
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* Summary cards */}
          <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Income
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <TrendingUp size={16} />
                </div>
              </div>

              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {formatAmount(totalIncome)}
              </p>

              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                Money received
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Spending
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                  <TrendingDown size={16} />
                </div>
              </div>

              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {formatAmount(totalExpense)}
              </p>

              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                {spendingPercentage}% of income
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Available Savings
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Wallet size={16} />
                </div>
              </div>

              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {formatAmount(savings)}
              </p>

              <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                After expenses
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-5 flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Income
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Expenses
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-[260px] w-full">
            {/* Grid lines */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8">
              {[0, 1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className="border-t border-dashed border-slate-200 dark:border-slate-800"
                />
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-between gap-2 pb-8 pt-4">
              {visibleData.map((item) => {
                const incomeHeight =
                  (item.income / maxValue) * 100;

                const expenseHeight =
                  (item.expense / maxValue) * 100;

                const isHovered =
                  hoveredBar === item.month;

                return (
                  <div
                    key={item.month}
                    className="group relative flex h-full flex-1 items-end justify-center gap-1 sm:gap-2"
                    onMouseEnter={() =>
                      setHoveredBar(item.month)
                    }
                    onMouseLeave={() =>
                      setHoveredBar(null)
                    }
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-[calc(100%-8px)] left-1/2 z-20 w-[145px] -translate-x-1/2 rounded-xl bg-slate-900 p-3 text-white shadow-xl dark:bg-white dark:text-slate-900">
                        <p className="mb-2 text-xs font-semibold">
                          {item.month} 2026
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 dark:text-slate-500">
                            Income
                          </span>
                          <span className="font-semibold">
                            {formatAmount(item.income)}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="text-slate-300 dark:text-slate-500">
                            Expenses
                          </span>
                          <span className="font-semibold">
                            {formatAmount(item.expense)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Income bar */}
                    <div
                      className="w-[18px] max-w-[30px] rounded-t-lg bg-indigo-500 transition-all duration-500 group-hover:bg-indigo-600 sm:w-6"
                      style={{
                        height: `${incomeHeight}%`,
                        minHeight: "8px",
                      }}
                    />

                    {/* Expense bar */}
                    <div
                      className="w-[18px] max-w-[30px] rounded-t-lg bg-rose-400 transition-all duration-500 group-hover:bg-rose-500 sm:w-6"
                      style={{
                        height: `${expenseHeight}%`,
                        minHeight: "8px",
                      }}
                    />

                    {/* Month */}
                    <span className="absolute -bottom-1 translate-y-full text-[11px] font-medium text-slate-400 dark:text-slate-500 sm:text-xs">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Categories */
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Donut-style visual */}
          <div className="flex min-h-[290px] items-center justify-center">
            <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-[conic-gradient(#6366f1_0deg_132deg,#f43f5e_132deg_224deg,#f59e0b_224deg_289deg,#14b8a6_289deg_342deg,#8b5cf6_342deg_360deg)] shadow-lg">
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Spending
                </span>

                <span className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                  {formatAmount(totalExpense)}
                </span>
              </div>
            </div>
          </div>

          {/* Category list */}
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm dark:bg-slate-700">
                  {getCategoryIcon(category.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {category.name}
                    </span>

                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatAmount(category.value)}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                      style={{
                        width: `${Math.max(
                          15,
                          100 - index * 17
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom insight */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-500/10 dark:bg-indigo-500/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <TrendingDown size={15} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Keep your spending on track
            </p>

            <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
              You are currently using {spendingPercentage}% of
              your recorded income.
            </p>
          </div>
        </div>

        <span className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400">
          {formatAmount(savings)} saved
        </span>
      </div>
    </section>
  );
}