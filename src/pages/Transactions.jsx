import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

import { useBanking } from "../context/BankingContext";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN"
  )}`;
}

function Transactions() {
  const {
    transactions,
    showToast,
  } = useBanking();

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  const [showFilters, setShowFilters] =
    useState(false);

  const [dateFilter, setDateFilter] =
    useState("All time");

  /*
   * ------------------------------------------------
   * DATE FILTER
   * ------------------------------------------------
   */

  const matchesDateFilter = (transaction) => {
    if (dateFilter === "All time") {
      return true;
    }

    const date =
      String(transaction.date || "")
        .toLowerCase();

    /*
     * Current dashboard data uses:
     * Today
     * Yesterday
     * Sep 2026
     *
     * Therefore these values are treated as
     * current-month activity.
     */

    if (dateFilter === "This month") {
      return (
        date.includes("today") ||
        date.includes("yesterday") ||
        date.includes("sep 2026")
      );
    }

    /*
     * Recent activity:
     *
     * Today + Yesterday are considered recent.
     * The remaining dated records are excluded.
     */

    if (dateFilter === "Recent") {
      return (
        date.includes("today") ||
        date.includes("yesterday")
      );
    }

    return true;
  };

  /*
   * ------------------------------------------------
   * FILTERED TRANSACTIONS
   * ------------------------------------------------
   */

  const filteredTransactions = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return transactions.filter(
      (transaction) => {
        const transactionName =
          String(
            transaction.name || ""
          ).toLowerCase();

        const transactionCategory =
          String(
            transaction.category || ""
          ).toLowerCase();

        const matchesSearch =
          !query ||
          transactionName.includes(
            query
          ) ||
          transactionCategory.includes(
            query
          );

        const matchesType =
          filter === "All" ||
          (filter === "Income" &&
            transaction.type ===
              "income") ||
          (filter === "Expenses" &&
            transaction.type ===
              "expense");

        const matchesDate =
          matchesDateFilter(
            transaction
          );

        return (
          matchesSearch &&
          matchesType &&
          matchesDate
        );
      }
    );
  }, [
    transactions,
    search,
    filter,
    dateFilter,
  ]);

  /*
   * ------------------------------------------------
   * SUMMARY
   * ------------------------------------------------
   */

  const totalIncome = transactions
    .filter(
      (item) =>
        item.type === "income"
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  const totalExpenses = transactions
    .filter(
      (item) =>
        item.type === "expense"
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  const transactionCount =
    filteredTransactions.length;

  /*
   * ------------------------------------------------
   * DOWNLOAD
   * ------------------------------------------------
   */

  const handleDownload = () => {
    /*
     * Create a real CSV statement instead of
     * simply pretending to download something.
     */

    if (!transactions.length) {
      showToast(
        "There are no transactions to export",
        "info"
      );

      return;
    }

    const headers = [
      "Transaction",
      "Category",
      "Date",
      "Type",
      "Amount",
    ];

    const rows = transactions.map(
      (transaction) => [
        transaction.name,
        transaction.category,
        transaction.date,
        transaction.type ===
        "income"
          ? "Credit"
          : "Debit",
        transaction.amount,
      ]
    );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const text =
              String(value ?? "");

            return `"${text.replace(
              /"/g,
              '""'
            )}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "novabank-statement.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showToast(
      "Statement downloaded successfully",
      "success"
    );
  };

  /*
   * ------------------------------------------------
   * TRANSACTION MODAL
   * ------------------------------------------------
   */

  const handleTransaction = (
    transaction
  ) => {
    setSelectedTransaction(
      transaction
    );
  };

  /*
   * ------------------------------------------------
   * CLEAR SEARCH
   * ------------------------------------------------
   */

  const clearSearch = () => {
    setSearch("");
  };

  /*
   * ------------------------------------------------
   * CLEAR ALL FILTERS
   * ------------------------------------------------
   */

  const clearAllFilters = () => {
    setSearch("");
    setFilter("All");
    setDateFilter("All time");
  };

  /*
   * ------------------------------------------------
   * DATE FILTER
   * ------------------------------------------------
   */

  const cycleDateFilter = () => {
    const options = [
      "All time",
      "This month",
      "Recent",
    ];

    const currentIndex =
      options.indexOf(dateFilter);

    const nextIndex =
      (currentIndex + 1) %
      options.length;

    const nextValue =
      options[nextIndex];

    setDateFilter(nextValue);

    showToast(
      `Date filter: ${nextValue}`,
      "info"
    );
  };

  return (
    <div className="page-container transactions-page">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="dashboard-welcome transactions-heading">
        <div>
          <span className="page-eyebrow">
            ACCOUNT ACTIVITY
          </span>

          <h1>
            Transaction{" "}
            <span>history</span>
          </h1>

          <p>
            Review your payments,
            transfers, deposits and
            account activity.
          </p>
        </div>

        <button
          type="button"
          className="transactions-download"
          onClick={handleDownload}
        >
          <Download size={15} />

          Download statement
        </button>
      </div>

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <section className="transaction-summary-grid">
        {/* TOTAL */}

        <div className="transaction-summary-card">
          <div className="transaction-summary-icon total">
            <FileText size={18} />
          </div>

          <div>
            <span>
              TOTAL TRANSACTIONS
            </span>

            <strong>
              {transactions.length}
            </strong>

            <small>
              All account activity
            </small>
          </div>
        </div>

        {/* INCOME */}

        <div className="transaction-summary-card">
          <div className="transaction-summary-icon income">
            <ArrowDownLeft
              size={18}
            />
          </div>

          <div>
            <span>
              TOTAL INCOME
            </span>

            <strong>
              {formatCurrency(
                totalIncome
              )}
            </strong>

            <small>
              Money received
            </small>
          </div>
        </div>

        {/* EXPENSE */}

        <div className="transaction-summary-card">
          <div className="transaction-summary-icon expense">
            <ArrowUpRight
              size={18}
            />
          </div>

          <div>
            <span>
              TOTAL SPENDING
            </span>

            <strong>
              {formatCurrency(
                totalExpenses
              )}
            </strong>

            <small>
              Money spent
            </small>
          </div>
        </div>

        {/* NET */}

        <div className="transaction-summary-card">
          <div className="transaction-summary-icon balance">
            <CheckCircle2
              size={18}
            />
          </div>

          <div>
            <span>
              NET MOVEMENT
            </span>

            <strong>
              {formatCurrency(
                totalIncome -
                  totalExpenses
              )}
            </strong>

            <small>
              Income minus spending
            </small>
          </div>
        </div>
      </section>

      {/* ==========================================
          MAIN TRANSACTION PANEL
      ========================================== */}

      <section className="dashboard-panel transactions-panel">
        {/* TOOLBAR */}

        <div className="transactions-toolbar">
          <div>
            <span className="section-eyebrow">
              STATEMENT
            </span>

            <h2>
              All transactions
            </h2>
          </div>

          <div className="transaction-toolbar-actions">
            <button
              type="button"
              className={`transaction-filter-button ${
                showFilters
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setShowFilters(
                  (value) => !value
                )
              }
            >
              <SlidersHorizontal
                size={15}
              />

              Filters
            </button>

            <button
              type="button"
              className="transaction-export-button"
              onClick={
                handleDownload
              }
            >
              <Download size={15} />

              Export
            </button>
          </div>
        </div>

        {/* ========================================
            SEARCH + FILTERS
        ======================================== */}

        <div className="transactions-controls">
          {/* SEARCH */}

          <div className="transaction-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {search && (
              <button
                type="button"
                onClick={
                  clearSearch
                }
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* TYPE */}

          <div className="transaction-type-tabs">
            {[
              "All",
              "Income",
              "Expenses",
            ].map((item) => (
              <button
                type="button"
                key={item}
                className={
                  filter === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(item)
                }
              >
                {item}
              </button>
            ))}
          </div>

          {/* DATE */}

          <button
            type="button"
            className="transaction-date-button"
            onClick={
              cycleDateFilter
            }
            title="Change date filter"
          >
            <CalendarDays
              size={15}
            />

            <span>
              {dateFilter}
            </span>

            <ChevronDown
              size={13}
            />
          </button>
        </div>

        {/* ========================================
            ADVANCED FILTERS
        ======================================== */}

        {showFilters && (
          <div className="advanced-filter-panel">
            <div className="advanced-filter-heading">
              <div>
                <Filter size={15} />

                <strong>
                  Filter transactions
                </strong>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    false
                  )
                }
                aria-label="Close filters"
              >
                <X size={14} />
              </button>
            </div>

            <div className="advanced-filter-grid">
              {/* ALL */}

              <button
                type="button"
                className={`advanced-filter-option ${
                  filter === "All"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setFilter("All")
                }
              >
                <span>
                  Transaction type
                </span>

                <strong>
                  All transactions
                </strong>
              </button>

              {/* INCOME */}

              <button
                type="button"
                className={`advanced-filter-option ${
                  filter === "Income"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setFilter("Income")
                }
              >
                <span>
                  Incoming money
                </span>

                <strong>
                  Income only
                </strong>
              </button>

              {/* EXPENSE */}

              <button
                type="button"
                className={`advanced-filter-option ${
                  filter === "Expenses"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setFilter(
                    "Expenses"
                  )
                }
              >
                <span>
                  Outgoing money
                </span>

                <strong>
                  Expenses only
                </strong>
              </button>

              {/* MONTH */}

              <button
                type="button"
                className={`advanced-filter-option ${
                  dateFilter ===
                  "This month"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setDateFilter(
                    "This month"
                  )
                }
              >
                <span>
                  Date range
                </span>

                <strong>
                  This month
                </strong>
              </button>

              {/* RECENT */}

              <button
                type="button"
                className={`advanced-filter-option ${
                  dateFilter ===
                  "Recent"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setDateFilter(
                    "Recent"
                  )
                }
              >
                <span>
                  Recent activity
                </span>

                <strong>
                  Today & yesterday
                </strong>
              </button>

              {/* RESET */}

              <button
                type="button"
                className="advanced-filter-option reset"
                onClick={
                  clearAllFilters
                }
              >
                <span>
                  Reset
                </span>

                <strong>
                  Clear all filters
                </strong>
              </button>
            </div>
          </div>
        )}

        {/* ========================================
            RESULTS HEADER
        ======================================== */}

        <div className="transactions-results-header">
          <span>
            Showing{" "}
            <strong>
              {transactionCount}
            </strong>{" "}
            transaction
            {transactionCount !== 1
              ? "s"
              : ""}
          </span>

          {(search ||
            filter !== "All" ||
            dateFilter !==
              "All time") && (
            <button
              type="button"
              onClick={
                clearAllFilters
              }
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ========================================
            TRANSACTION TABLE
        ======================================== */}

        <div className="statement-table">
          <div className="statement-table-head">
            <span>
              TRANSACTION
            </span>

            <span>
              CATEGORY
            </span>

            <span>
              DATE
            </span>

            <span>
              AMOUNT
            </span>

            <span />
          </div>

          <div className="statement-table-body">
            {filteredTransactions.length >
            0 ? (
              filteredTransactions.map(
                (transaction) => (
                  <button
                    type="button"
                    className="statement-row"
                    key={
                      transaction.id
                    }
                    onClick={() =>
                      handleTransaction(
                        transaction
                      )
                    }
                  >
                    {/* TRANSACTION */}

                    <span className="statement-transaction">
                      <span
                        className={`statement-icon ${
                          transaction.type ===
                          "income"
                            ? "income"
                            : "expense"
                        }`}
                      >
                        {transaction.type ===
                        "income" ? (
                          <ArrowDownLeft
                            size={15}
                          />
                        ) : (
                          <ArrowUpRight
                            size={15}
                          />
                        )}
                      </span>

                      <span>
                        <strong>
                          {
                            transaction.name
                          }
                        </strong>

                        <small>
                          Transaction ID #
                          {String(
                            transaction.id
                          ).slice(-6)}
                        </small>
                      </span>
                    </span>

                    {/* CATEGORY */}

                    <span className="statement-category">
                      {
                        transaction.category
                      }
                    </span>

                    {/* DATE */}

                    <span className="statement-date">
                      {
                        transaction.date
                      }
                    </span>

                    {/* AMOUNT */}

                    <span
                      className={`statement-amount ${
                        transaction.type ===
                        "income"
                          ? "income"
                          : "expense"
                      }`}
                    >
                      {transaction.type ===
                      "income"
                        ? "+"
                        : "-"}

                      {formatCurrency(
                        transaction.amount
                      )}
                    </span>

                    {/* ARROW */}

                    <span className="statement-arrow">
                      <ChevronRight
                        size={15}
                      />
                    </span>
                  </button>
                )
              )
            ) : (
              <div className="transactions-empty">
                <div className="transactions-empty-icon">
                  <Search size={20} />
                </div>

                <h3>
                  No transactions found
                </h3>

                <p>
                  Try changing your
                  search or transaction
                  filters.
                </p>

                <button
                  type="button"
                  onClick={
                    clearAllFilters
                  }
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================
            FOOTER
        ======================================== */}

        <div className="statement-footer">
          <div>
            <CheckCircle2
              size={14}
            />

            <span>
              Your transactions are
              securely protected.
            </span>
          </div>

          <span>
            Updated just now
          </span>
        </div>
      </section>

      {/* ==========================================
          INFORMATION CARDS
      ========================================== */}

      <section className="transaction-info-grid">
        {/* SECURITY */}

        <div className="dashboard-panel transaction-info-card">
          <div className="transaction-info-icon">
            <ShieldCheck
              size={18}
            />
          </div>

          <div>
            <span className="section-eyebrow">
              SECURE BANKING
            </span>

            <h3>
              Every transaction is
              protected
            </h3>

            <p>
              Keep your account secure by
              never sharing your OTP, PIN,
              password or card details
              with anyone.
            </p>
          </div>
        </div>

        {/* STATEMENT */}

        <div className="dashboard-panel transaction-info-card">
          <div className="transaction-info-icon">
            <FileText size={18} />
          </div>

          <div>
            <span className="section-eyebrow">
              STATEMENTS
            </span>

            <h3>
              Need a complete
              statement?
            </h3>

            <p>
              Download your account
              statement for records,
              applications and financial
              planning.
            </p>

            <button
              type="button"
              onClick={
                handleDownload
              }
            >
              Download statement

              <ArrowRight
                size={14}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          TRANSACTION MODAL
      ========================================== */}

      {selectedTransaction && (
        <div
          className="transaction-modal-overlay"
          onClick={() =>
            setSelectedTransaction(
              null
            )
          }
          role="presentation"
        >
          <div
            className="transaction-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
            aria-label="Transaction details"
          >
            {/* HEADER */}

            <div className="transaction-modal-header">
              <div>
                <span className="section-eyebrow">
                  TRANSACTION DETAILS
                </span>

                <h2>
                  {
                    selectedTransaction.name
                  }
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTransaction(
                    null
                  )
                }
                className="transaction-modal-close"
                aria-label="Close transaction details"
              >
                <X size={17} />
              </button>
            </div>

            {/* AMOUNT */}

            <div
              className={`transaction-modal-amount ${
                selectedTransaction.type ===
                "income"
                  ? "income"
                  : "expense"
              }`}
            >
              <span>
                {selectedTransaction.type ===
                "income"
                  ? "Money received"
                  : "Money spent"}
              </span>

              <strong>
                {selectedTransaction.type ===
                "income"
                  ? "+"
                  : "-"}

                {formatCurrency(
                  selectedTransaction.amount
                )}
              </strong>
            </div>

            {/* DETAILS */}

            <div className="transaction-detail-list">
              <div>
                <span>
                  Transaction type
                </span>

                <strong>
                  {selectedTransaction.type ===
                  "income"
                    ? "Credit"
                    : "Debit"}
                </strong>
              </div>

              <div>
                <span>
                  Category
                </span>

                <strong>
                  {
                    selectedTransaction.category
                  }
                </strong>
              </div>

              <div>
                <span>
                  Date
                </span>

                <strong>
                  {
                    selectedTransaction.date
                  }
                </strong>
              </div>

              <div>
                <span>
                  Transaction ID
                </span>

                <strong>
                  #
                  {String(
                    selectedTransaction.id
                  ).slice(-8)}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong className="transaction-status">
                  <CheckCircle2
                    size={14}
                  />

                  Completed
                </strong>
              </div>
            </div>

            {/* SECURITY */}

            <div className="transaction-modal-security">
              <ShieldCheck
                size={15}
              />

              <span>
                This transaction was
                processed securely by
                NovaBank.
              </span>
            </div>

            {/* DONE */}

            <button
              type="button"
              className="transaction-modal-done"
              onClick={() =>
                setSelectedTransaction(
                  null
                )
              }
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;