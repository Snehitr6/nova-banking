import {
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Utensils,
  Zap,
  Send,
  BriefcaseBusiness,
  Tv,
  WalletCards,
  ReceiptText,
  ChevronRight,
} from "lucide-react";

const iconMap = {
  shopping: ShoppingBag,
  food: Utensils,
  electricity: Zap,
  transfer: Send,
  salary: WalletCards,
  freelance: BriefcaseBusiness,
  entertainment: Tv,
};

function TransactionItem({
  transaction,
  onClick,
}) {
  if (!transaction) {
    return null;
  }

  const isIncome =
    transaction.type === "income";

  const Icon =
    iconMap[transaction.icon] ||
    ReceiptText;

  const amount = Number(
    transaction.amount || 0
  ).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

  return (
    <button
      type="button"
      onClick={() => {
        if (onClick) {
          onClick(transaction);
        }
      }}
      className="transaction-animation group flex w-full items-center gap-3 border-b border-slate-100 px-1 py-3.5 text-left transition-all duration-200 last:border-b-0 hover:translate-x-1 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
    >
      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isIncome
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
        }`}
      >
        <Icon size={17} />
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <strong className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {transaction.name}
          </strong>
        </div>

        <span className="mt-1 block truncate text-[11px] text-slate-400 dark:text-slate-500">
          {transaction.category}
          {" • "}
          {transaction.date}
        </span>
      </div>

      {/* Amount */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="text-right">
          <div
            className={`flex items-center justify-end gap-1 text-sm font-bold ${
              isIncome
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-800 dark:text-slate-100"
            }`}
          >
            <span>
              {isIncome ? "+" : "-"}₹
              {amount}
            </span>
          </div>

          <span className="mt-1 block text-[10px] text-slate-400 dark:text-slate-500">
            {isIncome
              ? "Received"
              : "Paid"}
          </span>
        </div>

        {/* Direction */}
        <div
          className={`hidden h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 sm:flex ${
            isIncome
              ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          }`}
        >
          {isIncome ? (
            <ArrowDownLeft size={14} />
          ) : (
            <ArrowUpRight size={14} />
          )}
        </div>

        {onClick && (
          <ChevronRight
            size={15}
            className="text-slate-300 transition-transform duration-200 group-hover:translate-x-1 dark:text-slate-600"
          />
        )}
      </div>
    </button>
  );
}

export default TransactionItem;