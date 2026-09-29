import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Landmark,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";

import { useState } from "react";
import { useBanking } from "../context/BankingContext";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function Accounts() {
  const { balance, showToast } = useBanking();

  const [showBalances, setShowBalances] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const accounts = [
    {
      id: 1,
      name: "Primary Savings Account",
      type: "Savings Account",
      number: "4582",
      balance: balance,
      available: balance,
      interest: "3.00% p.a.",
      status: "Active",
      primary: true,
      icon: Wallet,
    },
    {
      id: 2,
      name: "Emergency Fund",
      type: "Savings Account",
      number: "7821",
      balance: 75000,
      available: 75000,
      interest: "3.00% p.a.",
      status: "Active",
      primary: false,
      icon: Landmark,
    },
    {
      id: 3,
      name: "Salary Account",
      type: "Salary Account",
      number: "2196",
      balance: 48650,
      available: 48650,
      interest: "3.00% p.a.",
      status: "Active",
      primary: false,
      icon: Building2,
    },
  ];

  const totalBalance = accounts.reduce(
    (sum, account) => sum + Number(account.balance),
    0
  );

  const handleCopy = (number) => {
    navigator.clipboard?.writeText(`XXXX XXXX ${number}`);

    showToast(
      `Account number ending ${number} copied`,
      "success"
    );
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
  };

  const closeDetails = () => {
    setSelectedAccount(null);
  };

  return (
    <div className="page-container accounts-page">
      {/* PAGE HEADER */}
      <div className="dashboard-welcome accounts-heading">
        <div>
          <span className="page-eyebrow">
            BANKING & ACCOUNTS
          </span>

          <h1>
            Your <span>accounts</span>
          </h1>

          <p>
            Manage your bank accounts, balances and account
            details from one place.
          </p>
        </div>

        <button
          type="button"
          className="accounts-add-button"
          onClick={() =>
            showToast(
              "New account application started",
              "info"
            )
          }
        >
          <Plus size={16} />
          Open new account
        </button>
      </div>

      {/* TOTAL BALANCE */}
      <section className="accounts-overview">
        <div className="accounts-total-card">
          <div className="accounts-total-glow" />

          <div className="accounts-total-top">
            <div>
              <span className="accounts-total-label">
                TOTAL BALANCE
              </span>

              <div className="accounts-total-value">
                {showBalances
                  ? formatCurrency(totalBalance)
                  : "₹ •••••••"}
              </div>

              <button
                type="button"
                className="accounts-balance-toggle"
                onClick={() =>
                  setShowBalances((value) => !value)
                }
              >
                {showBalances ? (
                  <Eye size={14} />
                ) : (
                  <EyeOff size={14} />
                )}

                {showBalances
                  ? "Hide balances"
                  : "Show balances"}
              </button>
            </div>

            <div className="accounts-total-icon">
              <Landmark size={22} />
            </div>
          </div>

          <div className="accounts-total-bottom">
            <div>
              <span>Active accounts</span>
              <strong>{accounts.length}</strong>
            </div>

            <div>
              <span>Primary account</span>
              <strong>•••• 4582</strong>
            </div>

            <div>
              <span>Banking status</span>
              <strong>
                <CheckCircle2 size={13} />
                Active
              </strong>
            </div>
          </div>
        </div>

        <div className="accounts-overview-side">
          <div className="account-stat-box">
            <span>AVAILABLE BALANCE</span>
            <strong>
              {showBalances
                ? formatCurrency(totalBalance)
                : "₹ •••••••"}
            </strong>
            <small>
              Across all active accounts
            </small>
          </div>

          <div className="account-stat-box">
            <span>MONTHLY INTEREST</span>
            <strong>3.00%</strong>
            <small>
              Applicable savings rate
            </small>
          </div>
        </div>
      </section>

      {/* ACCOUNT LIST */}
      <section className="accounts-section">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">
              YOUR ACCOUNTS
            </span>

            <h2>All accounts</h2>
          </div>

          <button
            type="button"
            className="panel-action"
            onClick={() =>
              showToast(
                "Account opening options are ready",
                "info"
              )
            }
          >
            Explore accounts
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="accounts-list">
          {accounts.map((account) => {
            const Icon = account.icon;

            return (
              <article
                className={`account-large-card ${
                  account.primary ? "primary-account" : ""
                }`}
                key={account.id}
              >
                <div className="account-card-top">
                  <div className="account-card-identity">
                    <div className="account-card-icon">
                      <Icon size={19} />
                    </div>

                    <div>
                      <div className="account-card-name-row">
                        <h3>{account.name}</h3>

                        {account.primary && (
                          <span className="primary-badge">
                            Primary
                          </span>
                        )}
                      </div>

                      <span className="account-card-type">
                        {account.type}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="account-more-button"
                    onClick={() =>
                      showToast(
                        `${account.name} options`,
                        "info"
                      )
                    }
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="account-card-middle">
                  <div className="account-number-block">
                    <span>ACCOUNT NUMBER</span>

                    <div>
                      <strong>
                        XXXX XXXX {account.number}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(account.number)
                        }
                        aria-label="Copy account number"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="account-balance-block">
                    <span>AVAILABLE BALANCE</span>

                    <strong>
                      {showBalances
                        ? formatCurrency(
                            account.available
                          )
                        : "₹ ••••••"}
                    </strong>
                  </div>
                </div>

                <div className="account-card-footer">
                  <div className="account-meta">
                    <span>
                      <ShieldCheck size={13} />
                      {account.status}
                    </span>

                    <span>
                      Interest {account.interest}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="account-view-button"
                    onClick={() =>
                      handleAccountClick(account)
                    }
                  >
                    View account
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ACCOUNT ACTIONS */}
      <section className="dashboard-panel account-actions-panel">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">
              ACCOUNT SERVICES
            </span>

            <h2>Manage your banking</h2>
          </div>
        </div>

        <div className="account-actions-grid">
          <button
            type="button"
            className="account-action-card"
            onClick={() =>
              showToast(
                "Money transfer opened",
                "info"
              )
            }
          >
            <span className="account-action-icon transfer">
              <ArrowUpRight size={18} />
            </span>

            <span>
              <strong>Transfer money</strong>
              <small>
                Send money to another account
              </small>
            </span>

            <ChevronRight size={15} />
          </button>

          <button
            type="button"
            className="account-action-card"
            onClick={() =>
              showToast(
                "UPI payment service opened",
                "info"
              )
            }
          >
            <span className="account-action-icon upi">
              <Smartphone size={18} />
            </span>

            <span>
              <strong>UPI payments</strong>
              <small>
                Pay securely using UPI
              </small>
            </span>

            <ChevronRight size={15} />
          </button>

          <button
            type="button"
            className="account-action-card"
            onClick={() =>
              showToast(
                "Cards section opened",
                "info"
              )
            }
          >
            <span className="account-action-icon card">
              <CreditCard size={18} />
            </span>

            <span>
              <strong>Manage cards</strong>
              <small>
                View and control your cards
              </small>
            </span>

            <ChevronRight size={15} />
          </button>

          <button
            type="button"
            className="account-action-card"
            onClick={() =>
              showToast(
                "Statement download started",
                "success"
              )
            }
          >
            <span className="account-action-icon statement">
              <ArrowDownLeft size={18} />
            </span>

            <span>
              <strong>Download statement</strong>
              <small>
                Get your account statement
              </small>
            </span>

            <ChevronRight size={15} />
          </button>
        </div>
      </section>

      {/* OPEN ACCOUNT PRODUCTS */}
      <section className="accounts-products-section">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">
              DISCOVER
            </span>

            <h2>Open a new account</h2>
          </div>

          <span className="products-note">
            Choose an account that fits your needs
          </span>
        </div>

        <div className="account-product-grid">
          <button
            type="button"
            className="account-product-card"
            onClick={() =>
              showToast(
                "Savings Account application opened",
                "info"
              )
            }
          >
            <div className="account-product-icon">
              <Wallet size={20} />
            </div>

            <span className="account-product-tag">
              EVERYDAY BANKING
            </span>

            <h3>Savings Account</h3>

            <p>
              A flexible account for everyday spending,
              saving and digital banking.
            </p>

            <span className="account-product-link">
              Learn more
              <ArrowRight size={14} />
            </span>
          </button>

          <button
            type="button"
            className="account-product-card"
            onClick={() =>
              showToast(
                "Salary Account application opened",
                "info"
              )
            }
          >
            <div className="account-product-icon salary">
              <Building2 size={20} />
            </div>

            <span className="account-product-tag">
              FOR WORKING PROFESSIONALS
            </span>

            <h3>Salary Account</h3>

            <p>
              Convenient salary banking with seamless
              digital payments and account services.
            </p>

            <span className="account-product-link">
              Learn more
              <ArrowRight size={14} />
            </span>
          </button>

          <button
            type="button"
            className="account-product-card"
            onClick={() =>
              showToast(
                "Fixed Deposit application opened",
                "info"
              )
            }
          >
            <div className="account-product-icon deposit">
              <Landmark size={20} />
            </div>

            <span className="account-product-tag">
              SAVINGS & INVESTMENTS
            </span>

            <h3>Fixed Deposit</h3>

            <p>
              Lock in your savings for a chosen period
              and earn interest on your deposit.
            </p>

            <span className="account-product-link">
              Learn more
              <ArrowRight size={14} />
            </span>
          </button>
        </div>
      </section>

      {/* SECURITY NOTICE */}
      <section className="accounts-security">
        <div className="accounts-security-icon">
          <ShieldCheck size={20} />
        </div>

        <div>
          <strong>
            Your account information is protected
          </strong>

          <span>
            NovaBank uses secure authentication and
            encrypted banking sessions to help protect
            your account.
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            showToast(
              "Security settings opened",
              "info"
            )
          }
        >
          Security settings
          <ChevronRight size={14} />
        </button>
      </section>

      {/* ACCOUNT DETAILS MODAL */}
      {selectedAccount && (
        <div
          className="account-modal-overlay"
          onClick={closeDetails}
        >
          <div
            className="account-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="account-modal-header">
              <div>
                <span className="section-eyebrow">
                  ACCOUNT DETAILS
                </span>

                <h2>{selectedAccount.name}</h2>
              </div>

              <button
                type="button"
                className="account-modal-close"
                onClick={closeDetails}
              >
                ×
              </button>
            </div>

            <div className="account-modal-balance">
              <span>AVAILABLE BALANCE</span>

              <strong>
                {showBalances
                  ? formatCurrency(
                      selectedAccount.available
                    )
                  : "₹ ••••••"}
              </strong>
            </div>

            <div className="account-detail-rows">
              <div>
                <span>Account type</span>
                <strong>
                  {selectedAccount.type}
                </strong>
              </div>

              <div>
                <span>Account number</span>
                <strong>
                  XXXX XXXX{" "}
                  {selectedAccount.number}
                </strong>
              </div>

              <div>
                <span>Interest rate</span>
                <strong>
                  {selectedAccount.interest}
                </strong>
              </div>

              <div>
                <span>Account status</span>
                <strong className="active-status">
                  <CheckCircle2 size={14} />
                  {selectedAccount.status}
                </strong>
              </div>
            </div>

            <div className="account-modal-actions">
              <button
                type="button"
                onClick={() => {
                  showToast(
                    "Transfer service opened",
                    "info"
                  );
                  closeDetails();
                }}
              >
                <ArrowUpRight size={15} />
                Transfer
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    selectedAccount.number
                  )
                }
              >
                <Copy size={15} />
                Copy number
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accounts;