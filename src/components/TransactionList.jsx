import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Search,
  ReceiptText,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useBanking } from "../context/BankingContext";

function TransactionList({
  limit = 5,
  compact = false,
}) {
  const { transactions } = useBanking();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filter === "income") {
      result = result.filter(
        (transaction) =>
          transaction.type === "income"
      );
    }

    if (filter === "expense") {
      result = result.filter(
        (transaction) =>
          transaction.type === "expense"
      );
    }

    if (search.trim()) {
      const query =
        search.toLowerCase().trim();

      result = result.filter((transaction) =>
        [
          transaction.name,
          transaction.category,
          transaction.date,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query)
          )
      );
    }

    return compact
      ? result.slice(0, limit)
      : result;
  }, [
    transactions,
    search,
    filter,
    compact,
    limit,
  ]);

  const formatAmount = (amount) => {
    return Number(amount).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    );
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section
      className={`w-full rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${
        compact ? "p-5" : "p-5 sm:p-6"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Transactions
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Track your latest account activity
          </p>
        </div>

        {!compact && (
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-56 sm:flex-none">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search transactions..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      {!compact && (
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            {
              id: "all",
              label: "All",
            },
            {
              id: "income",
              label: "Income",
            },
            {
              id: "expense",
              label: "Expenses",
            },
          ].map((item) => {
            const active =
              filter === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setFilter(item.id)
                }
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Transactions */}
      <div className="mt-4">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTransactions.map(
              (transaction) => {
                const isIncome =
                  transaction.type ===
                  "income";

                return (
                  <div
                    key={transaction.id}
                    className="group flex items-center gap-3 py-3.5 transition-colors first:pt-2 last:pb-2 hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}
                    >
                      {transaction.icon ===
                        "salary" ||
                      transaction.icon ===
                        "freelance" ? (
                        <ArrowDownLeft
                          size={18}
                        />
                      ) : transaction.icon ===
                        "transfer" ? (
                        <ArrowUpRight
                          size={18}
                        />
                      ) : (
                        getInitials(
                          transaction.name
                        ) || (
                          <ReceiptText
                            size={17}
                          />
                        )
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {transaction.name}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-slate-400 dark:text-slate-500">
                        {transaction.category}
                        {" • "}
                        {transaction.date}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${
                            isIncome
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-800 dark:text-slate-100"
                          }`}
                        >
                          {isIncome
                            ? "+"
                            : "-"}
                          ₹
                          {formatAmount(
                            transaction.amount
                          )}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                          {isIncome
                            ? "Credit"
                            : "Debit"}
                        </p>
                      </div>

                      {!compact && (
                        <ChevronRight
                          size={15}
                          className="text-slate-300 transition-transform duration-200 group-hover:translate-x-1 dark:text-slate-600"
                        />
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <ReceiptText size={21} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-white">
              No transactions found
            </h3>

            <p className="mt-1 max-w-xs text-xs text-slate-400">
              Try changing your search or
              transaction filter.
            </p>

            {!compact &&
              (search || filter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  Clear Filters
                </button>
              )}
          </div>
        )}
      </div>

      {/* Compact footer */}
      {compact &&
        transactions.length > limit && (
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent(
                  "navigate-transactions"
                )
              );
            }}
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-slate-800 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
          >
            View All Transactions
            <ChevronRight size={14} />
          </button>
        )}
    </section>
  );
}

export default TransactionList;