import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Building2,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Landmark,
  Plus,
  Receipt,
  Send,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useBanking } from "../context/BankingContext";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN"
  )}`;
}

export default function Dashboard() {
  const {
    balance,
    transactions,
    contacts,
    selectedContact,
    selectContact,
    sendMoney,
    addMoney,
    showToast,
  } = useBanking();

  const [showBalance, setShowBalance] =
    useState(true);

  const [amount, setAmount] = useState("");

  const [activeQuickAction, setActiveQuickAction] =
    useState(null);

  const [showAddMoney, setShowAddMoney] =
    useState(false);

  const [addMoneyAmount, setAddMoneyAmount] =
    useState("");

  const [showProducts, setShowProducts] =
    useState(false);

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const totalIncome = useMemo(() => {
    return transactions
      .filter((item) => item.type === "income")
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      );
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((item) => item.type === "expense")
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      );
  }, [transactions]);

  const savings = Math.max(
    totalIncome - totalExpenses,
    0
  );

  const recentTransactions =
    transactions.slice(0, 5);

  /* =====================================================
     QUICK ACTIONS
  ===================================================== */

  const quickActions = [
    {
      id: "transfer",
      title: "Transfer",
      subtitle: "Send money",
      icon: Send,
    },
    {
      id: "upi",
      title: "UPI",
      subtitle: "Pay instantly",
      icon: Smartphone,
    },
    {
      id: "bills",
      title: "Pay Bills",
      subtitle: "Utilities & more",
      icon: Receipt,
    },
    {
      id: "deposit",
      title: "Add Money",
      subtitle: "Fund account",
      icon: Plus,
    },
    {
      id: "cards",
      title: "Cards",
      subtitle: "Manage cards",
      icon: CreditCard,
    },
    {
      id: "statement",
      title: "Statement",
      subtitle: "View activity",
      icon: FileText,
    },
  ];

  /* =====================================================
     ACCOUNTS
  ===================================================== */

  const accounts = [
    {
      name: "Primary Savings",
      type: "Savings Account",
      number: "•••• 4582",
      amount: balance,
      icon: Wallet,
    },
    {
      name: "Emergency Fund",
      type: "Savings Account",
      number: "•••• 7821",
      amount: 75000,
      icon: Landmark,
    },
  ];

  /* =====================================================
     QUICK ACTION HANDLER
  ===================================================== */

  const handleQuickAction = (action) => {
    setActiveQuickAction(action);

    if (action === "deposit") {
      setShowAddMoney(true);
      return;
    }

    if (action === "statement") {
      window.dispatchEvent(
        new CustomEvent(
          "navigate-transactions"
        )
      );
      return;
    }

    if (action === "cards") {
      window.dispatchEvent(
        new CustomEvent("navigate-cards")
      );
      return;
    }

    if (action === "bills") {
      window.dispatchEvent(
        new CustomEvent("navigate-payments")
      );
      return;
    }

    if (action === "upi") {
      window.dispatchEvent(
        new CustomEvent("navigate-payments")
      );
      return;
    }

    if (action === "transfer") {
      document
        .getElementById("quick-transfer")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }
  };

  /* =====================================================
     ADD MONEY
  ===================================================== */

  const handleAddMoney = () => {
    const value = Number(addMoneyAmount);

    if (!value || value <= 0) {
      showToast(
        "Enter a valid amount",
        "error"
      );
      return;
    }

    const success = addMoney(value);

    if (success !== false) {
      setAddMoneyAmount("");
      setShowAddMoney(false);
    }
  };

  /* =====================================================
     TRANSFER
  ===================================================== */

  const handleTransfer = () => {
    if (!selectedContact) {
      showToast(
        "Select a recipient first",
        "error"
      );
      return;
    }

    if (!amount || Number(amount) <= 0) {
      showToast(
        "Enter a valid transfer amount",
        "error"
      );
      return;
    }

    const success = sendMoney({
      recipient: selectedContact.name,
      amount,
    });

    if (success) {
      setAmount("");
    }
  };

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const navigate = (eventName) => {
    window.dispatchEvent(
      new CustomEvent(eventName)
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="page-container banking-dashboard">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="dashboard-welcome">
        <div>
          <span className="page-eyebrow">
            PERSONAL BANKING
          </span>

          <h1>
            Good morning,{" "}
            <span>Snehit</span>
          </h1>

          <p>
            Here’s your financial overview for
            today.
          </p>
        </div>

        <div className="dashboard-date">
          <span>ACCOUNT STATUS</span>

          <strong>
            <ShieldCheck size={13} />
            Active & secure
          </strong>
        </div>
      </div>

      {/* =================================================
          BALANCE + ACCOUNTS
      ================================================= */}

      <section className="dashboard-grid">
        {/* Balance */}
        <div className="balance-card">
          <div className="balance-card-background" />

          <div className="balance-card-top">
            <div>
              <span className="balance-label">
                TOTAL AVAILABLE BALANCE
              </span>

              <h2>
                {showBalance
                  ? formatCurrency(balance)
                  : "₹ ••••••"}
              </h2>

              <button
                type="button"
                className="balance-eye"
                onClick={() =>
                  setShowBalance(
                    (current) => !current
                  )
                }
              >
                {showBalance ? (
                  <Eye size={13} />
                ) : (
                  <EyeOff size={13} />
                )}

                {showBalance
                  ? "Hide balance"
                  : "Show balance"}
              </button>
            </div>

            <div className="balance-account-chip">
              <Building2 size={14} />
              <span>Savings</span>
            </div>
          </div>

          <div className="balance-card-middle">
            <span>PRIMARY ACCOUNT</span>

            <strong>
              Savings Account · •••• 4582
            </strong>
          </div>

          <div className="balance-card-actions">
            <button
              type="button"
              onClick={() =>
                handleQuickAction(
                  "deposit"
                )
              }
            >
              <Plus size={13} />
              Add Money
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickAction(
                  "transfer"
                )
              }
            >
              <ArrowUpRight size={13} />
              Transfer
            </button>
          </div>
        </div>

        {/* Accounts */}
        <div className="dashboard-panel account-summary-card">
          <div className="section-title-row">
            <div>
              <span className="section-eyebrow">
                YOUR MONEY
              </span>

              <h2>Accounts</h2>
            </div>

            <button
              type="button"
              className="panel-action"
              onClick={() =>
                navigate(
                  "navigate-accounts"
                )
              }
            >
              View all
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="account-summary-list">
            {accounts.map((account) => {
              const Icon = account.icon;

              return (
                <button
                  type="button"
                  className="account-summary-item"
                  key={account.number}
                  onClick={() =>
                    showToast(
                      `${account.name} selected`,
                      "info"
                    )
                  }
                >
                  <div className="account-summary-icon">
                    <Icon size={16} />
                  </div>

                  <div className="account-summary-info">
                    <strong>
                      {account.name}
                    </strong>

                    <span>
                      {account.type} ·{" "}
                      {account.number}
                    </span>
                  </div>

                  <div className="account-summary-balance">
                    <strong>
                      {formatCurrency(
                        account.amount
                      )}
                    </strong>

                    <ChevronRight size={13} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="account-summary-footer">
            <div>
              <span>Total Savings</span>
              <strong>
                {formatCurrency(
                  balance + 75000
                )}
              </strong>
            </div>

            <ShieldCheck size={15} />
          </div>
        </div>
      </section>

      {/* =================================================
          QUICK SERVICES
      ================================================= */}

      <section className="dashboard-panel quick-services-panel">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">
              BANKING SERVICES
            </span>

            <h2>Quick services</h2>
          </div>

          <div className="services-secure">
            <ShieldCheck size={13} />
            Secure banking
          </div>
        </div>

        <div className="quick-services-grid">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                type="button"
                key={action.id}
                className={`quick-service ${
                  activeQuickAction ===
                  action.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleQuickAction(
                    action.id
                  )
                }
              >
                <span className="quick-service-icon">
                  <Icon size={16} />
                </span>

                <span className="quick-service-copy">
                  <strong>
                    {action.title}
                  </strong>

                  <small>
                    {action.subtitle}
                  </small>
                </span>

                <ChevronRight
                  size={13}
                  className="quick-service-arrow"
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* =================================================
          MAIN DASHBOARD
      ================================================= */}

      <section className="main-dashboard-grid">
        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div className="dashboard-left-column">
          {/* Spending */}
          <section className="dashboard-panel spending-section">
            <div className="section-title-row">
              <div>
                <span className="section-eyebrow">
                  MONEY MOVEMENT
                </span>

                <h2>
                  Spending overview
                </h2>
              </div>

              <button
                type="button"
                className="period-selector"
                onClick={() =>
                  showToast(
                    "This month view selected",
                    "info"
                  )
                }
              >
                This month
                <ChevronRight size={12} />
              </button>
            </div>

            <div className="spending-overview-row">
              <div>
                <span>Total spent</span>

                <strong>
                  {formatCurrency(
                    totalExpenses
                  )}
                </strong>

                <small>
                  Across your recent
                  transactions
                </small>
              </div>

              <div className="spending-income">
                <span>
                  <ArrowDownLeft size={12} />
                  Income
                </span>

                <strong>
                  {formatCurrency(
                    totalIncome
                  )}
                </strong>
              </div>
            </div>

            <div className="banking-mini-chart">
              {[
                42,
                58,
                47,
                76,
                54,
                68,
                49,
              ].map(
                (height, index) => (
                  <div
                    className="mini-chart-column"
                    key={index}
                  >
                    <div
                      className="mini-chart-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    <span>
                      {
                        [
                          "M",
                          "T",
                          "W",
                          "T",
                          "F",
                          "S",
                          "S",
                        ][index]
                      }
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="spending-bottom-summary">
              <div>
                <span>Income</span>
                <strong className="income">
                  {formatCurrency(
                    totalIncome
                  )}
                </strong>
              </div>

              <div>
                <span>Expenses</span>
                <strong className="expense">
                  {formatCurrency(
                    totalExpenses
                  )}
                </strong>
              </div>

              <div>
                <span>Saved</span>
                <strong>
                  {formatCurrency(
                    savings
                  )}
                </strong>
              </div>
            </div>
          </section>

          {/* Transactions */}
          <section className="dashboard-panel transaction-section">
            <div className="section-title-row">
              <div>
                <span className="section-eyebrow">
                  ACCOUNT ACTIVITY
                </span>

                <h2>
                  Recent transactions
                </h2>
              </div>

              <button
                type="button"
                className="panel-action"
                onClick={() =>
                  navigate(
                    "navigate-transactions"
                  )
                }
              >
                View statement
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="bank-transaction-list">
              {recentTransactions.length >
              0 ? (
                recentTransactions.map(
                  (transaction) => (
                    <button
                      type="button"
                      className="bank-transaction"
                      key={
                        transaction.id
                      }
                      onClick={() =>
                        showToast(
                          `${transaction.name}: ${formatCurrency(
                            transaction.amount
                          )}`,
                          "info"
                        )
                      }
                    >
                      <span
                        className={`bank-transaction-icon ${
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

                      <span className="bank-transaction-main">
                        <strong>
                          {
                            transaction.name
                          }
                        </strong>

                        <small>
                          {
                            transaction.category
                          }{" "}
                          ·{" "}
                          {
                            transaction.date
                          }
                        </small>
                      </span>

                      <span
                        className={`bank-transaction-amount ${
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

                      <ChevronRight
                        size={14}
                      />
                    </button>
                  )
                )
              ) : (
                <div className="dashboard-empty-state">
                  No transactions yet.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <div className="dashboard-right-column">
          {/* Quick Transfer */}
          <section
            id="quick-transfer"
            className="dashboard-panel quick-transfer-panel"
          >
            <div className="section-title-row">
              <div>
                <span className="section-eyebrow">
                  MONEY TRANSFER
                </span>

                <h2>Send money</h2>
              </div>

              <Send size={17} />
            </div>

            <p className="transfer-helper">
              Choose a saved recipient and
              enter the amount you want to
              transfer.
            </p>

            <div className="contact-list">
              {contacts.map((contact) => (
                <button
                  type="button"
                  className={`contact-item ${
                    selectedContact?.id ===
                    contact.id
                      ? "selected"
                      : ""
                  }`}
                  key={contact.id}
                  onClick={() =>
                    selectContact(
                      contact
                    )
                  }
                >
                  <span className="contact-avatar">
                    {contact.initials}
                  </span>

                  <span>
                    {contact.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="transfer-selected">
              <span>Recipient</span>

              <strong>
                {selectedContact
                  ? selectedContact.name
                  : "Select a recipient"}
              </strong>
            </div>

            <div className="transfer-input">
              <span>₹</span>

              <input
                type="number"
                min="1"
                max={balance}
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
                placeholder="Enter amount"
              />
            </div>

            <div className="quick-transfer-amounts">
              {[500, 1000, 5000].map(
                (value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() =>
                      setAmount(
                        String(value)
                      )
                    }
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
              type="button"
              className="transfer-submit"
              onClick={handleTransfer}
            >
              Continue transfer
              <ArrowRight size={14} />
            </button>

            <div className="transfer-security">
              <ShieldCheck size={14} />

              <span>
                Transfers are protected
                with secure authentication.
              </span>
            </div>
          </section>

          {/* Banking Products */}
          <section className="dashboard-panel banking-products">
            <div className="section-title-row">
              <div>
                <span className="section-eyebrow">
                  EXPLORE
                </span>

                <h2>
                  Banking products
                </h2>
              </div>

              <button
                type="button"
                className="panel-action"
                onClick={() =>
                  setShowProducts(
                    (current) => !current
                  )
                }
              >
                {showProducts
                  ? "Hide"
                  : "Explore"}
                <ChevronRight
                  size={13}
                  className={
                    showProducts
                      ? "rotate-90"
                      : ""
                  }
                />
              </button>
            </div>

            <div className="products-list">
              <button
                type="button"
                className="product-link"
                onClick={() =>
                  showToast(
                    "Fixed Deposit section selected",
                    "info"
                  )
                }
              >
                <span className="product-link-icon deposit">
                  <Banknote size={16} />
                </span>

                <span>
                  <strong>
                    Fixed Deposits
                  </strong>

                  <small>
                    Grow your savings
                  </small>
                </span>

                <ChevronRight
                  size={14}
                />
              </button>

              <button
                type="button"
                className="product-link"
                onClick={() =>
                  showToast(
                    "Loan products selected",
                    "info"
                  )
                }
              >
                <span className="product-link-icon loan">
                  <Building2 size={16} />
                </span>

                <span>
                  <strong>Loans</strong>

                  <small>
                    Personal & financial
                    needs
                  </small>
                </span>

                <ChevronRight
                  size={14}
                />
              </button>

              <button
                type="button"
                className="product-link"
                onClick={() =>
                  showToast(
                    "Investment products selected",
                    "info"
                  )
                }
              >
                <span className="product-link-icon investment">
                  <ArrowUpRight
                    size={16}
                  />
                </span>

                <span>
                  <strong>
                    Investments
                  </strong>

                  <small>
                    Build your portfolio
                  </small>
                </span>

                <ChevronRight
                  size={14}
                />
              </button>

              {showProducts && (
                <div className="product-extra">
                  <ShieldCheck size={14} />

                  <span>
                    Explore financial products
                    from your banking
                    workspace.
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Security */}
          <section className="dashboard-security-card">
            <div className="dashboard-security-icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <strong>
                Your banking is protected
              </strong>

              <p>
                Never share your PIN, OTP or
                password with anyone.
              </p>
            </div>
          </section>
        </div>
      </section>

      {/* =================================================
          ADD MONEY MODAL
      ================================================= */}

      {showAddMoney && (
        <div
          className="dashboard-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowAddMoney(false);
            }
          }}
        >
          <div className="dashboard-modal">
            <div className="dashboard-modal-header">
              <div>
                <span>
                  ACCOUNT FUNDING
                </span>

                <h3>
                  Add money
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddMoney(false)
                }
              >
                ×
              </button>
            </div>

            <p>
              Enter the amount you want to
              add to your primary account.
            </p>

            <div className="dashboard-amount-input">
              <span>₹</span>

              <input
                type="number"
                min="1"
                value={addMoneyAmount}
                onChange={(event) =>
                  setAddMoneyAmount(
                    event.target.value
                  )
                }
                placeholder="0"
                autoFocus
              />
            </div>

            <div className="dashboard-quick-amounts">
              {[1000, 5000, 10000].map(
                (value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() =>
                      setAddMoneyAmount(
                        String(value)
                      )
                    }
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
              type="button"
              className="dashboard-modal-primary"
              onClick={handleAddMoney}
            >
              Add money
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}