import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Snowflake,
  WalletCards,
} from "lucide-react";

import { useState } from "react";
import { useBanking } from "../context/BankingContext";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function Cards() {
  const {
    cardFrozen,
    freezeCard,
    showToast,
  } = useBanking();

  const [showCardNumber, setShowCardNumber] =
    useState(false);

  const [showCvv, setShowCvv] = useState(false);

  const [selectedCard, setSelectedCard] =
    useState("debit");

  const [limit, setLimit] = useState(75000);

  const cards = [
    {
      id: "debit",
      name: "NovaBank Platinum Debit",
      type: "Debit Card",
      number: "4582 7812 3491 4582",
      expiry: "09/29",
      cvv: "482",
      holder: "SNEHIT",
      network: "VISA",
      color: "primary",
    },
    {
      id: "credit",
      name: "NovaBank Rewards Credit",
      type: "Credit Card",
      number: "5298 1145 6723 9041",
      expiry: "11/30",
      cvv: "716",
      holder: "SNEHIT",
      network: "VISA",
      color: "dark",
    },
  ];

  const activeCard =
    cards.find((card) => card.id === selectedCard) ||
    cards[0];

  const cardTransactions = [
    {
      id: 1,
      name: "Amazon",
      category: "Shopping",
      date: "Today, 02:18 PM",
      amount: 2499,
      type: "expense",
    },
    {
      id: 2,
      name: "Swiggy",
      category: "Food & Dining",
      date: "Yesterday, 08:32 PM",
      amount: 685,
      type: "expense",
    },
    {
      id: 3,
      name: "Cashback Reward",
      category: "Rewards",
      date: "Sep 25, 2026",
      amount: 240,
      type: "income",
    },
    {
      id: 4,
      name: "Netflix",
      category: "Entertainment",
      date: "Sep 24, 2026",
      amount: 649,
      type: "expense",
    },
  ];

  const usedLimit = 18450;

  const handleFreeze = () => {
    freezeCard();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(
      activeCard.number.replaceAll(" ", "")
    );

    showToast(
      "Card number copied securely",
      "success"
    );
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
  };

  return (
    <div className="page-container cards-page">
      {/* PAGE HEADER */}
      <div className="dashboard-welcome cards-heading">
        <div>
          <span className="page-eyebrow">
            CARDS & PAYMENTS
          </span>

          <h1>
            Your <span>cards</span>
          </h1>

          <p>
            Manage your debit and credit cards,
            spending limits and security controls.
          </p>
        </div>

        <button
          type="button"
          className="cards-add-button"
          onClick={() =>
            showToast(
              "New card application started",
              "info"
            )
          }
        >
          <Plus size={16} />
          Add new card
        </button>
      </div>

      {/* CARD OVERVIEW */}
      <section className="cards-main-grid">
        {/* CARD PREVIEW */}
        <div className="card-preview-panel">
          <div className="card-preview-header">
            <div>
              <span className="section-eyebrow">
                SELECTED CARD
              </span>

              <h2>{activeCard.name}</h2>
            </div>

            <button
              type="button"
              className="card-more-button"
              onClick={() =>
                showToast(
                  "Card options opened",
                  "info"
                )
              }
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div
            className={`bank-card-visual ${
              activeCard.color
            } ${cardFrozen ? "frozen" : ""}`}
          >
            <div className="bank-card-shine" />

            <div className="bank-card-top">
              <div className="bank-card-brand">
                <span className="bank-card-logo">
                  N
                </span>

                <span>NovaBank</span>
              </div>

              <span className="bank-card-type">
                {activeCard.type}
              </span>
            </div>

            <div className="bank-card-chip">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="bank-card-number">
              {showCardNumber
                ? activeCard.number
                : `•••• •••• •••• ${activeCard.number.slice(
                    -4
                  )}`}
            </div>

            <div className="bank-card-bottom">
              <div>
                <span>CARD HOLDER</span>
                <strong>{activeCard.holder}</strong>
              </div>

              <div>
                <span>VALID THRU</span>
                <strong>{activeCard.expiry}</strong>
              </div>

              <div className="bank-card-network">
                {activeCard.network}
              </div>
            </div>

            {cardFrozen && (
              <div className="card-frozen-overlay">
                <Lock size={18} />
                <strong>Card Frozen</strong>
                <span>
                  Unlock the card to use it
                </span>
              </div>
            )}
          </div>

          <div className="card-visual-actions">
            <button
              type="button"
              onClick={() =>
                setShowCardNumber(
                  (value) => !value
                )
              }
            >
              {showCardNumber ? (
                <EyeOff size={15} />
              ) : (
                <Eye size={15} />
              )}

              {showCardNumber
                ? "Hide number"
                : "Show number"}
            </button>

            <button
              type="button"
              onClick={handleCopy}
            >
              <Copy size={15} />
              Copy number
            </button>
          </div>
        </div>

        {/* CARD DETAILS */}
        <div className="card-details-panel">
          <div className="section-title-row">
            <div>
              <span className="section-eyebrow">
                CARD INFORMATION
              </span>

              <h2>Card details</h2>
            </div>
          </div>

          <div className="card-detail-grid">
            <div>
              <span>Card type</span>
              <strong>{activeCard.type}</strong>
            </div>

            <div>
              <span>Card ending</span>
              <strong>
                •••• {activeCard.number.slice(-4)}
              </strong>
            </div>

            <div>
              <span>Expiry date</span>
              <strong>{activeCard.expiry}</strong>
            </div>

            <div>
              <span>CVV</span>

              <strong className="cvv-value">
                {showCvv
                  ? activeCard.cvv
                  : "•••"}

                <button
                  type="button"
                  onClick={() =>
                    setShowCvv(
                      (value) => !value
                    )
                  }
                >
                  {showCvv ? (
                    <EyeOff size={13} />
                  ) : (
                    <Eye size={13} />
                  )}
                </button>
              </strong>
            </div>
          </div>

          <div
            className={`card-status-box ${
              cardFrozen ? "frozen" : ""
            }`}
          >
            <div>
              <span className="card-status-icon">
                {cardFrozen ? (
                  <Lock size={15} />
                ) : (
                  <CheckCircle2 size={15} />
                )}
              </span>

              <div>
                <strong>
                  {cardFrozen
                    ? "Card is frozen"
                    : "Card is active"}
                </strong>

                <small>
                  {cardFrozen
                    ? "Transactions are temporarily blocked."
                    : "Your card is ready for payments."}
                </small>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFreeze}
            >
              {cardFrozen
                ? "Unfreeze card"
                : "Freeze card"}
            </button>
          </div>

          <div className="card-security-note">
            <ShieldCheck size={15} />

            <span>
              Never share your card number, CVV,
              PIN or OTP with anyone.
            </span>
          </div>
        </div>
      </section>

      {/* CARD SELECTOR */}
      <section className="dashboard-panel card-selector-panel">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">
              YOUR CARDS
            </span>

            <h2>All cards</h2>
          </div>

          <span className="cards-count">
            {cards.length} cards
          </span>
        </div>

        <div className="card-selector-list">
          {cards.map((card) => (
            <button
              type="button"
              key={card.id}
              className={`card-selector-item ${
                selectedCard === card.id
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setSelectedCard(card.id);
                setShowCvv(false);
                setShowCardNumber(false);
              }}
            >
              <span
                className={`mini-bank-card ${card.color}`}
              >
                <span>NovaBank</span>
                <strong>
                  ••••{" "}
                  {card.number.slice(-4)}
                </strong>
              </span>

              <span className="card-selector-copy">
                <strong>{card.name}</strong>
                <small>
                  {card.type} · ••••{" "}
                  {card.number.slice(-4)}
                </small>
              </span>

              {selectedCard === card.id && (
                <span className="card-selector-check">
                  <Check size={14} />
                </span>
              )}

              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </section>

      {/* LIMITS */}
      <section className="cards-limits-grid">
        <div className="dashboard-panel card-limit-panel">
          <div className="section-title-row">
            <div>
              <span className="section-eyebrow">
                SPENDING CONTROL
              </span>

              <h2>Daily card limit</h2>
            </div>

            <WalletCards size={18} />
          </div>

          <div className="limit-value-row">
            <div>
              <span>Current limit</span>

              <strong>
                {formatCurrency(limit)}
              </strong>
            </div>

            <div className="limit-used">
              <span>Used today</span>

              <strong>
                {formatCurrency(usedLimit)}
              </strong>
            </div>
          </div>

          <div className="limit-progress">
            <span
              style={{
                width: `${Math.min(
                  (usedLimit / limit) * 100,
                  100
                )}%`,
              }}
            />
          </div>

          <div className="limit-progress-labels">
            <span>
              {Math.round(
                (usedLimit / limit) * 100
              )}
              % used
            </span>

            <span>
              {formatCurrency(
                Math.max(limit - usedLimit, 0)
              )}{" "}
              remaining
            </span>
          </div>

          <div className="limit-slider-wrapper">
            <div className="limit-slider-heading">
              <span>Adjust daily limit</span>
              <strong>
                {formatCurrency(limit)}
              </strong>
            </div>

            <input
              type="range"
              min="25000"
              max="150000"
              step="5000"
              value={limit}
              onChange={handleLimitChange}
            />

            <div className="limit-range">
              <span>₹25K</span>
              <span>₹1.5L</span>
            </div>
          </div>

          <button
            type="button"
            className="limit-save-button"
            onClick={() =>
              showToast(
                `Daily card limit set to ${formatCurrency(
                  limit
                )}`,
                "success"
              )
            }
          >
            Save limit
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="dashboard-panel card-security-panel">
          <div className="section-title-row">
            <div>
              <span className="section-eyebrow">
                CARD SECURITY
              </span>

              <h2>Security controls</h2>
            </div>
          </div>

          <button
            type="button"
            className="security-control-row"
            onClick={() =>
              showToast(
                "Contactless payments enabled",
                "success"
              )
            }
          >
            <span className="security-control-icon">
              <CreditCard size={16} />
            </span>

            <span>
              <strong>
                Contactless payments
              </strong>
              <small>
                Tap to pay is enabled
              </small>
            </span>

            <span className="security-toggle active">
              <span />
            </span>
          </button>

          <button
            type="button"
            className="security-control-row"
            onClick={() =>
              showToast(
                "Online payments settings opened",
                "info"
              )
            }
          >
            <span className="security-control-icon">
              <ArrowUpRight size={16} />
            </span>

            <span>
              <strong>Online payments</strong>
              <small>
                Internet transactions are enabled
              </small>
            </span>

            <span className="security-toggle active">
              <span />
            </span>
          </button>

          <button
            type="button"
            className="security-control-row"
            onClick={() =>
              showToast(
                "International usage settings opened",
                "info"
              )
            }
          >
            <span className="security-control-icon">
              <ArrowRight size={16} />
            </span>

            <span>
              <strong>
                International usage
              </strong>
              <small>
                Currently disabled
              </small>
            </span>

            <span className="security-toggle">
              <span />
            </span>
          </button>

          <button
            type="button"
            className="security-control-row"
            onClick={handleFreeze}
          >
            <span className="security-control-icon danger">
              <Snowflake size={16} />
            </span>

            <span>
              <strong>
                {cardFrozen
                  ? "Unfreeze card"
                  : "Freeze card"}
              </strong>

              <small>
                Temporarily block all card usage
              </small>
            </span>

            <ChevronRight size={15} />
          </button>
        </div>
      </section>

      {/* CARD TRANSACTIONS */}
      <section className="dashboard-panel card-transactions-panel">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">
              CARD ACTIVITY
            </span>

            <h2>Recent card transactions</h2>
          </div>

          <button
            type="button"
            className="panel-action"
            onClick={() =>
              showToast(
                "Full card statement opened",
                "info"
              )
            }
          >
            View all
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="card-transactions-list">
          {cardTransactions.map(
            (transaction) => (
              <button
                type="button"
                className="card-transaction-row"
                key={transaction.id}
                onClick={() =>
                  showToast(
                    `${transaction.name} · ${formatCurrency(
                      transaction.amount
                    )}`,
                    "info"
                  )
                }
              >
                <span
                  className={`card-transaction-icon ${
                    transaction.type ===
                    "income"
                      ? "income"
                      : "expense"
                  }`}
                >
                  {transaction.type ===
                  "income" ? (
                    <ArrowDownLeft size={15} />
                  ) : (
                    <ArrowUpRight size={15} />
                  )}
                </span>

                <span className="card-transaction-copy">
                  <strong>
                    {transaction.name}
                  </strong>

                  <small>
                    {transaction.category} ·{" "}
                    {transaction.date}
                  </small>
                </span>

                <span
                  className={`card-transaction-amount ${
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

                <ChevronRight size={14} />
              </button>
            )
          )}
        </div>
      </section>

      {/* SECURITY BANNER */}
      <section className="cards-security-banner">
        <div className="cards-security-banner-icon">
          <ShieldCheck size={20} />
        </div>

        <div>
          <strong>
            Keep your card details private
          </strong>

          <span>
            NovaBank will never ask for your PIN,
            CVV, OTP or password over phone,
            email or message.
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            showToast(
              "Card security information opened",
              "info"
            )
          }
        >
          Learn about security
          <ChevronRight size={14} />
        </button>
      </section>
    </div>
  );
}

export default Cards;