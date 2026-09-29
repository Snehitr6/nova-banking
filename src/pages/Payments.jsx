import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  History,
  IndianRupee,
  QrCode,
  Receipt,
  Search,
  ShieldCheck,
  Smartphone,
  Wallet,
  Zap,
  X,
} from "lucide-react";

import { useState } from "react";

import { useBanking } from "../context/BankingContext";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN"
  )}`;
}

function Payments() {
  const {
    balance,
    addTransaction,
    showToast,
  } = useBanking();

  const [activeService, setActiveService] =
    useState("upi");

  const [amount, setAmount] =
    useState("");

  const [upiRecipient, setUpiRecipient] =
    useState("");

  const [mobileNumber, setMobileNumber] =
    useState("");

  const [selectedBiller, setSelectedBiller] =
    useState(null);

  const [paymentDone, setPaymentDone] =
    useState(false);

  const [searchBiller, setSearchBiller] =
    useState("");

  const [selectedOperator, setSelectedOperator] =
    useState("Airtel");

  const [operatorOpen, setOperatorOpen] =
    useState(false);

  const [accountDetailsOpen, setAccountDetailsOpen] =
    useState(false);

  const services = [
    {
      id: "upi",
      title: "UPI Transfer",
      subtitle: "Pay instantly",
      icon: Smartphone,
    },
    {
      id: "bills",
      title: "Bill Payments",
      subtitle: "Pay your bills",
      icon: Receipt,
    },
    {
      id: "recharge",
      title: "Mobile Recharge",
      subtitle: "Recharge mobile",
      icon: Zap,
    },
    {
      id: "qr",
      title: "Scan & Pay",
      subtitle: "Pay with QR",
      icon: QrCode,
    },
  ];

  const billers = [
    {
      id: 1,
      name: "Electricity",
      subtitle: "BESCOM",
      icon: "⚡",
      category: "Utilities",
    },
    {
      id: 2,
      name: "Water Bill",
      subtitle: "BWSSB",
      icon: "💧",
      category: "Utilities",
    },
    {
      id: 3,
      name: "Broadband",
      subtitle: "Airtel Xstream",
      icon: "🌐",
      category: "Internet",
    },
    {
      id: 4,
      name: "DTH",
      subtitle: "Tata Play",
      icon: "📺",
      category: "Entertainment",
    },
    {
      id: 5,
      name: "Gas",
      subtitle: "Indane Gas",
      icon: "🔥",
      category: "Utilities",
    },
    {
      id: 6,
      name: "Credit Card",
      subtitle: "Card payment",
      icon: "💳",
      category: "Finance",
    },
  ];

  const operators = [
    {
      name: "Airtel",
      short: "A",
      type: "Prepaid",
    },
    {
      name: "Jio",
      short: "J",
      type: "Prepaid",
    },
    {
      name: "Vi",
      short: "V",
      type: "Prepaid",
    },
    {
      name: "BSNL",
      short: "B",
      type: "Prepaid",
    },
  ];

  const recentPayments = [
    {
      id: 1,
      name: "Electricity Bill",
      category: "BESCOM",
      date: "Sep 27, 2026",
      amount: 1840,
      type: "expense",
      icon: Receipt,
    },
    {
      id: 2,
      name: "Rahul Sharma",
      category: "UPI Transfer",
      date: "Sep 26, 2026",
      amount: 5000,
      type: "expense",
      icon: Smartphone,
    },
    {
      id: 3,
      name: "Mobile Recharge",
      category: "Airtel",
      date: "Sep 22, 2026",
      amount: 599,
      type: "expense",
      icon: Smartphone,
    },
    {
      id: 4,
      name: "Money Added",
      category: "Account Deposit",
      date: "Sep 20, 2026",
      amount: 10000,
      type: "income",
      icon: Wallet,
    },
  ];

  const filteredBillers =
    billers.filter((biller) => {
      const query =
        searchBiller.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return (
        biller.name
          .toLowerCase()
          .includes(query) ||
        biller.subtitle
          .toLowerCase()
          .includes(query) ||
        biller.category
          .toLowerCase()
          .includes(query)
      );
    });

  /*
   * -----------------------------------------------
   * SERVICE CHANGE
   * -----------------------------------------------
   */

  const handleServiceChange = (
    service
  ) => {
    setActiveService(service);

    setPaymentDone(false);

    setAmount("");

    setSelectedBiller(null);
  };

  /*
   * -----------------------------------------------
   * UPI PAYMENT
   * -----------------------------------------------
   */

  const handleUpiPayment = () => {
    const numericAmount =
      Number(amount);

    if (!upiRecipient.trim()) {
      showToast(
        "Enter a UPI ID or mobile number",
        "error"
      );

      return;
    }

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      showToast(
        "Enter a valid payment amount",
        "error"
      );

      return;
    }

    if (numericAmount > balance) {
      showToast(
        "Insufficient account balance",
        "error"
      );

      return;
    }

    addTransaction({
      name: upiRecipient.trim(),
      category: "UPI Transfer",
      amount: numericAmount,
      type: "expense",
      icon: "transfer",
    });

    setPaymentDone(true);

    showToast(
      `${formatCurrency(
        numericAmount
      )} sent successfully`,
      "success"
    );
  };

  /*
   * -----------------------------------------------
   * BILL PAYMENT
   * -----------------------------------------------
   */

  const handleBillPayment = () => {
    if (!selectedBiller) {
      showToast(
        "Select a biller first",
        "error"
      );

      return;
    }

    const numericAmount =
      Number(amount);

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      showToast(
        "Enter a valid bill amount",
        "error"
      );

      return;
    }

    if (numericAmount > balance) {
      showToast(
        "Insufficient account balance",
        "error"
      );

      return;
    }

    addTransaction({
      name: selectedBiller.name,
      category: selectedBiller.subtitle,
      amount: numericAmount,
      type: "expense",
      icon: "electricity",
    });

    setPaymentDone(true);

    showToast(
      `${selectedBiller.name} payment completed`,
      "success"
    );
  };

  /*
   * -----------------------------------------------
   * MOBILE RECHARGE
   * -----------------------------------------------
   */

  const handleRecharge = () => {
    const numericAmount =
      Number(amount);

    if (
      mobileNumber.length !== 10
    ) {
      showToast(
        "Enter a valid 10 digit mobile number",
        "error"
      );

      return;
    }

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      showToast(
        "Enter a recharge amount",
        "error"
      );

      return;
    }

    if (numericAmount > balance) {
      showToast(
        "Insufficient account balance",
        "error"
      );

      return;
    }

    addTransaction({
      name: "Mobile Recharge",
      category: selectedOperator,
      amount: numericAmount,
      type: "expense",
      icon: "transfer",
    });

    setPaymentDone(true);

    showToast(
      `Recharge of ${formatCurrency(
        numericAmount
      )} completed`,
      "success"
    );
  };

  /*
   * -----------------------------------------------
   * QR PAYMENT
   * -----------------------------------------------
   */

  const handleQrPayment = () => {
    showToast(
      "QR scanner is ready",
      "info"
    );
  };

  /*
   * -----------------------------------------------
   * SUBMIT
   * -----------------------------------------------
   */

  const handlePaymentSubmit = () => {
    if (activeService === "upi") {
      handleUpiPayment();
      return;
    }

    if (activeService === "bills") {
      handleBillPayment();
      return;
    }

    if (
      activeService ===
      "recharge"
    ) {
      handleRecharge();
      return;
    }

    if (activeService === "qr") {
      handleQrPayment();
    }
  };

  /*
   * -----------------------------------------------
   * RESET
   * -----------------------------------------------
   */

  const resetPayment = () => {
    setPaymentDone(false);

    setAmount("");

    setUpiRecipient("");

    setMobileNumber("");

    setSelectedBiller(null);
  };

  /*
   * -----------------------------------------------
   * OPERATOR
   * -----------------------------------------------
   */

  const handleOperatorSelect = (
    operator
  ) => {
    setSelectedOperator(
      operator.name
    );

    setOperatorOpen(false);

    showToast(
      `${operator.name} selected`,
      "info"
    );
  };

  /*
   * -----------------------------------------------
   * ACCOUNT DETAILS
   * -----------------------------------------------
   */

  const handleAccountDetails = () => {
    setAccountDetailsOpen(true);
  };

  /*
   * -----------------------------------------------
   * NAVIGATION
   * -----------------------------------------------
   */

  const goToTransactions = () => {
    window.dispatchEvent(
      new CustomEvent(
        "navigate-transactions"
      )
    );
  };

  return (
    <div className="page-container payments-page">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="dashboard-welcome payments-heading">
        <div>
          <span className="page-eyebrow">
            PAYMENTS & TRANSFERS
          </span>

          <h1>
            Payments made{" "}
            <span>simple</span>
          </h1>

          <p>
            Pay bills, send money,
            recharge your mobile and
            manage everyday payments
            securely.
          </p>
        </div>

        <div className="payments-balance-chip">
          <Wallet size={15} />

          <div>
            <span>
              Available balance
            </span>

            <strong>
              {formatCurrency(balance)}
            </strong>
          </div>
        </div>
      </div>

      {/* ==========================================
          PAYMENT SERVICES
      ========================================== */}

      <section className="payment-services-panel">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">
              PAYMENT SERVICES
            </span>

            <h2>
              What would you like
              to do?
            </h2>
          </div>

          <span className="payments-secure-label">
            <CheckCircle2 size={13} />

            Secure payments
          </span>
        </div>

        <div className="payment-services-grid">
          {services.map((service) => {
            const Icon =
              service.icon;

            return (
              <button
                type="button"
                key={service.id}
                className={`payment-service-card ${
                  activeService ===
                  service.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleServiceChange(
                    service.id
                  )
                }
              >
                <span className="payment-service-icon">
                  <Icon size={20} />
                </span>

                <span>
                  <strong>
                    {service.title}
                  </strong>

                  <small>
                    {service.subtitle}
                  </small>
                </span>

                {activeService ===
                  service.id && (
                  <span className="payment-service-check">
                    <Check size={13} />
                  </span>
                )}

                <ChevronRight
                  size={15}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* ==========================================
          WORKSPACE
      ========================================== */}

      <section className="payments-workspace">
        {/* ========================================
            PAYMENT FORM
        ======================================== */}

        <div className="dashboard-panel payment-form-panel">
          <div className="section-title-row">
            <div>
              <span className="section-eyebrow">
                {activeService ===
                  "upi" &&
                  "UPI PAYMENT"}

                {activeService ===
                  "bills" &&
                  "BILL PAYMENT"}

                {activeService ===
                  "recharge" &&
                  "MOBILE RECHARGE"}

                {activeService ===
                  "qr" &&
                  "QR PAYMENT"}
              </span>

              <h2>
                {activeService ===
                  "upi" &&
                  "Send money with UPI"}

                {activeService ===
                  "bills" &&
                  "Pay your bills"}

                {activeService ===
                  "recharge" &&
                  "Recharge your mobile"}

                {activeService ===
                  "qr" &&
                  "Scan & pay"}
              </h2>
            </div>

            <span className="payment-form-secure">
              <ShieldCheck
                size={16}
              />
            </span>
          </div>

          {/* ======================================
              SUCCESS
          ====================================== */}

          {paymentDone ? (
            <div className="payment-success">
              <div className="payment-success-icon">
                <CheckCircle2
                  size={28}
                />
              </div>

              <span className="section-eyebrow">
                PAYMENT COMPLETED
              </span>

              <h3>
                Payment successful
              </h3>

              <p>
                Your payment has been
                successfully recorded
                in your NovaBank
                account.
              </p>

              <div className="payment-success-details">
                <div>
                  <span>
                    Amount
                  </span>

                  <strong>
                    {formatCurrency(
                      amount
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Payment method
                  </span>

                  <strong>
                    {activeService ===
                      "upi" &&
                      "UPI"}

                    {activeService ===
                      "bills" &&
                      "Bill Payment"}

                    {activeService ===
                      "recharge" &&
                      "Mobile Recharge"}

                    {activeService ===
                      "qr" &&
                      "QR Payment"}
                  </strong>
                </div>

                <div>
                  <span>
                    Status
                  </span>

                  <strong className="payment-completed">
                    <CheckCircle2
                      size={13}
                    />

                    Completed
                  </strong>
                </div>
              </div>

              <div className="payment-success-actions">
                <button
                  type="button"
                  className="payment-new-button"
                  onClick={
                    resetPayment
                  }
                >
                  Make another payment

                  <ArrowRight
                    size={14}
                  />
                </button>

                <button
                  type="button"
                  className="payment-history-button"
                  onClick={
                    goToTransactions
                  }
                >
                  View transactions

                  <ChevronRight
                    size={14}
                  />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ==================================
                  UPI
              ================================== */}

              {activeService ===
                "upi" && (
                <div className="payment-form">
                  <div className="payment-recipient-box">
                    <div className="payment-field-icon">
                      <Smartphone
                        size={17}
                      />
                    </div>

                    <div className="payment-field">
                      <label>
                        UPI ID or mobile
                        number
                      </label>

                      <input
                        type="text"
                        placeholder="example@upi"
                        value={
                          upiRecipient
                        }
                        onChange={(
                          event
                        ) =>
                          setUpiRecipient(
                            event.target
                              .value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="payment-amount-box">
                    <span>
                      <IndianRupee
                        size={14}
                      />
                    </span>

                    <div>
                      <label>
                        Amount
                      </label>

                      <input
                        type="number"
                        min="1"
                        placeholder="0"
                        value={amount}
                        onChange={(
                          event
                        ) =>
                          setAmount(
                            event.target
                              .value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="quick-amounts">
                    {[
                      500,
                      1000,
                      2000,
                      5000,
                    ].map(
                      (value) => (
                        <button
                          type="button"
                          key={value}
                          onClick={() =>
                            setAmount(
                              String(
                                value
                              )
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

                  <div className="payment-account-source">
                    <div>
                      <Wallet
                        size={15}
                      />

                      <span>
                        <small>
                          PAY FROM
                        </small>

                        <strong>
                          Primary
                          Savings
                          ···· 4582
                        </strong>
                      </span>
                    </div>

                    <CheckCircle2
                      size={15}
                    />
                  </div>
                </div>
              )}

              {/* ==================================
                  BILLS
              ================================== */}

              {activeService ===
                "bills" && (
                <div className="payment-form">
                  <div className="biller-search">
                    <Search
                      size={16}
                    />

                    <input
                      type="text"
                      placeholder="Search billers..."
                      value={
                        searchBiller
                      }
                      onChange={(
                        event
                      ) =>
                        setSearchBiller(
                          event.target
                            .value
                        )
                      }
                    />

                    {searchBiller && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearchBiller(
                            ""
                          )
                        }
                        aria-label="Clear biller search"
                      >
                        <X
                          size={14}
                        />
                      </button>
                    )}
                  </div>

                  <div className="biller-grid">
                    {filteredBillers.length >
                    0 ? (
                      filteredBillers.map(
                        (biller) => (
                          <button
                            type="button"
                            key={
                              biller.id
                            }
                            className={`biller-card ${
                              selectedBiller?.id ===
                              biller.id
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedBiller(
                                biller
                              )
                            }
                          >
                            <span className="biller-icon">
                              {
                                biller.icon
                              }
                            </span>

                            <span>
                              <strong>
                                {
                                  biller.name
                                }
                              </strong>

                              <small>
                                {
                                  biller.subtitle
                                }
                              </small>
                            </span>

                            {selectedBiller?.id ===
                              biller.id && (
                              <CheckCircle2
                                size={
                                  14
                                }
                              />
                            )}
                          </button>
                        )
                      )
                    ) : (
                      <div className="payment-empty-billers">
                        <Search
                          size={18}
                        />

                        <strong>
                          No billers found
                        </strong>

                        <span>
                          Try another
                          search.
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedBiller && (
                    <div className="selected-biller-box">
                      <div>
                        <span>
                          SELECTED
                          BILLER
                        </span>

                        <strong>
                          {
                            selectedBiller.name
                          }
                        </strong>
                      </div>

                      <span>
                        {
                          selectedBiller.subtitle
                        }
                      </span>
                    </div>
                  )}

                  <div className="payment-amount-box">
                    <span>
                      <IndianRupee
                        size={14}
                      />
                    </span>

                    <div>
                      <label>
                        Bill amount
                      </label>

                      <input
                        type="number"
                        min="1"
                        placeholder="0"
                        value={amount}
                        onChange={(
                          event
                        ) =>
                          setAmount(
                            event.target
                              .value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================
                  RECHARGE
              ================================== */}

              {activeService ===
                "recharge" && (
                <div className="payment-form">
                  <div className="payment-recipient-box">
                    <div className="payment-field-icon">
                      <Smartphone
                        size={17}
                      />
                    </div>

                    <div className="payment-field">
                      <label>
                        Mobile number
                      </label>

                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength="10"
                        placeholder="Enter 10 digit number"
                        value={
                          mobileNumber
                        }
                        onChange={(
                          event
                        ) =>
                          setMobileNumber(
                            event.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="recharge-operator">
                    <div>
                      <span className="operator-logo">
                        {operators.find(
                          (operator) =>
                            operator.name ===
                            selectedOperator
                        )?.short ||
                          "A"}
                      </span>

                      <span>
                        <strong>
                          {
                            selectedOperator
                          }
                        </strong>

                        <small>
                          Prepaid
                        </small>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setOperatorOpen(
                          true
                        )
                      }
                    >
                      Change

                      <ChevronRight
                        size={13}
                      />
                    </button>
                  </div>

                  <div className="recharge-plans">
                    <span className="plans-label">
                      POPULAR PLANS
                    </span>

                    <div>
                      {[
                        {
                          amount: 299,
                          validity:
                            "28 days",
                        },
                        {
                          amount: 599,
                          validity:
                            "56 days",
                        },
                        {
                          amount: 719,
                          validity:
                            "84 days",
                        },
                      ].map(
                        (plan) => (
                          <button
                            type="button"
                            key={
                              plan.amount
                            }
                            onClick={() =>
                              setAmount(
                                String(
                                  plan.amount
                                )
                              )
                            }
                          >
                            <strong>
                              ₹
                              {
                                plan.amount
                              }
                            </strong>

                            <small>
                              {
                                plan.validity
                              }
                            </small>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="payment-amount-box">
                    <span>
                      <IndianRupee
                        size={14}
                      />
                    </span>

                    <div>
                      <label>
                        Recharge amount
                      </label>

                      <input
                        type="number"
                        min="1"
                        placeholder="0"
                        value={amount}
                        onChange={(
                          event
                        ) =>
                          setAmount(
                            event.target
                              .value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================
                  QR
              ================================== */}

              {activeService ===
                "qr" && (
                <div className="qr-payment-area">
                  <div className="qr-visual">
                    <QrCode
                      size={82}
                    />
                  </div>

                  <span className="section-eyebrow">
                    SCAN & PAY
                  </span>

                  <h3>
                    Pay using a QR
                    code
                  </h3>

                  <p>
                    Scan a merchant QR
                    code and make a
                    secure payment
                    directly from your
                    NovaBank account.
                  </p>

                  <button
                    type="button"
                    className="qr-scan-button"
                    onClick={
                      handleQrPayment
                    }
                  >
                    <QrCode
                      size={17}
                    />

                    Open QR scanner
                  </button>

                  <span className="qr-security">
                    <ShieldCheck
                      size={16}
                    />

                    Secure UPI payment
                  </span>
                </div>
              )}

              {activeService !==
                "qr" && (
                <button
                  type="button"
                  className="payment-submit-button"
                  onClick={
                    handlePaymentSubmit
                  }
                >
                  Continue to payment

                  <ArrowRight
                    size={15}
                  />
                </button>
              )}
            </>
          )}
        </div>

        {/* ========================================
            RIGHT COLUMN
        ======================================== */}

        <div className="payment-side-column">
          {/* ACCOUNT */}

          <div className="dashboard-panel payment-wallet-card">
            <div className="payment-wallet-top">
              <div>
                <span>
                  AVAILABLE BALANCE
                </span>

                <strong>
                  {formatCurrency(
                    balance
                  )}
                </strong>
              </div>

              <div className="payment-wallet-icon">
                <Wallet size={18} />
              </div>
            </div>

            <div className="payment-wallet-account">
              <span>
                PRIMARY SAVINGS
                ACCOUNT
              </span>

              <strong>
                XXXX XXXX 4582
              </strong>
            </div>

            <button
              type="button"
              onClick={
                handleAccountDetails
              }
            >
              Account details

              <ChevronRight
                size={14}
              />
            </button>
          </div>

          {/* SAVED RECIPIENTS */}

          <div className="dashboard-panel saved-payment-panel">
            <div className="section-title-row">
              <div>
                <span className="section-eyebrow">
                  SAVED
                </span>

                <h2>
                  Recent recipients
                </h2>
              </div>

              <History size={16} />
            </div>

            <button
              type="button"
              className="saved-recipient"
              onClick={() => {
                setActiveService(
                  "upi"
                );

                setPaymentDone(
                  false
                );

                setUpiRecipient(
                  "rahul@okaxis"
                );
              }}
            >
              <span className="recipient-avatar">
                RS
              </span>

              <span>
                <strong>
                  Rahul Sharma
                </strong>

                <small>
                  rahul@okaxis
                </small>
              </span>

              <ChevronRight
                size={14}
              />
            </button>

            <button
              type="button"
              className="saved-recipient"
              onClick={() => {
                setActiveService(
                  "upi"
                );

                setPaymentDone(
                  false
                );

                setUpiRecipient(
                  "priya@oksbi"
                );
              }}
            >
              <span className="recipient-avatar purple">
                PS
              </span>

              <span>
                <strong>
                  Priya Sharma
                </strong>

                <small>
                  priya@oksbi
                </small>
              </span>

              <ChevronRight
                size={14}
              />
            </button>

            <button
              type="button"
              className="saved-recipient"
              onClick={() => {
                setActiveService(
                  "upi"
                );

                setPaymentDone(
                  false
                );

                setUpiRecipient(
                  "amit@okhdfc"
                );
              }}
            >
              <span className="recipient-avatar green">
                AK
              </span>

              <span>
                <strong>
                  Amit Kumar
                </strong>

                <small>
                  amit@okhdfc
                </small>
              </span>

              <ChevronRight
                size={14}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          RECENT PAYMENTS
      ========================================== */}

      <section className="dashboard-panel payments-history-panel">
        <div className="section-title-row">
          <div>
            <span className="section-eyebrow">
              PAYMENT HISTORY
            </span>

            <h2>
              Recent payments
            </h2>
          </div>

          <button
            type="button"
            className="panel-action"
            onClick={
              goToTransactions
            }
          >
            View all

            <ChevronRight
              size={13}
            />
          </button>
        </div>

        <div className="payments-history-list">
          {recentPayments.map(
            (payment) => {
              const Icon =
                payment.icon;

              return (
                <button
                  type="button"
                  className="payment-history-row"
                  key={payment.id}
                  onClick={() => {
                    showToast(
                      `${payment.name} · ${formatCurrency(
                        payment.amount
                      )}`,
                      "info"
                    );
                  }}
                >
                  <span
                    className={`payment-history-icon ${
                      payment.type ===
                      "income"
                        ? "income"
                        : "expense"
                    }`}
                  >
                    <Icon
                      size={16}
                    />
                  </span>

                  <span className="payment-history-copy">
                    <strong>
                      {payment.name}
                    </strong>

                    <small>
                      {
                        payment.category
                      }{" "}
                      ·{" "}
                      {
                        payment.date
                      }
                    </small>
                  </span>

                  <span
                    className={`payment-history-amount ${
                      payment.type ===
                      "income"
                        ? "income"
                        : "expense"
                    }`}
                  >
                    {payment.type ===
                    "income"
                      ? "+"
                      : "-"}

                    {formatCurrency(
                      payment.amount
                    )}
                  </span>

                  <ChevronRight
                    size={14}
                  />
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* ==========================================
          SECURITY
      ========================================== */}

      <section className="payments-security-banner">
        <div className="payments-security-icon">
          <ShieldCheck
            size={16}
          />
        </div>

        <div>
          <strong>
            Your payments are
            protected
          </strong>

          <span>
            NovaBank uses secure
            authentication for digital
            payments. Never share your
            OTP, UPI PIN or password
            with anyone.
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            showToast(
              "Never share OTP, UPI PIN or password with anyone",
              "info"
            )
          }
        >
          Security tips

          <ChevronRight
            size={14}
          />
        </button>
      </section>

      {/* ==========================================
          OPERATOR MODAL
      ========================================== */}

      {operatorOpen && (
        <div
          className="transaction-modal-overlay"
          onClick={() =>
            setOperatorOpen(
              false
            )
          }
        >
          <div
            className="transaction-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
            aria-label="Select mobile operator"
          >
            <div className="transaction-modal-header">
              <div>
                <span className="section-eyebrow">
                  MOBILE RECHARGE
                </span>

                <h2>
                  Select operator
                </h2>
              </div>

              <button
                type="button"
                className="transaction-modal-close"
                onClick={() =>
                  setOperatorOpen(
                    false
                  )
                }
                aria-label="Close operator selection"
              >
                <X size={17} />
              </button>
            </div>

            <div className="operator-selection-list">
              {operators.map(
                (operator) => (
                  <button
                    type="button"
                    key={
                      operator.name
                    }
                    className={`operator-selection-item ${
                      selectedOperator ===
                      operator.name
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleOperatorSelect(
                        operator
                      )
                    }
                  >
                    <span className="operator-logo">
                      {
                        operator.short
                      }
                    </span>

                    <span>
                      <strong>
                        {
                          operator.name
                        }
                      </strong>

                      <small>
                        {
                          operator.type
                        }
                      </small>
                    </span>

                    {selectedOperator ===
                      operator.name && (
                      <CheckCircle2
                        size={17}
                      />
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          ACCOUNT DETAILS MODAL
      ========================================== */}

      {accountDetailsOpen && (
        <div
          className="transaction-modal-overlay"
          onClick={() =>
            setAccountDetailsOpen(
              false
            )
          }
        >
          <div
            className="transaction-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
            aria-label="Account details"
          >
            <div className="transaction-modal-header">
              <div>
                <span className="section-eyebrow">
                  BANK ACCOUNT
                </span>

                <h2>
                  Primary Savings
                </h2>
              </div>

              <button
                type="button"
                className="transaction-modal-close"
                onClick={() =>
                  setAccountDetailsOpen(
                    false
                  )
                }
                aria-label="Close account details"
              >
                <X size={17} />
              </button>
            </div>

            <div className="transaction-detail-list">
              <div>
                <span>
                  Account number
                </span>

                <strong>
                  XXXX XXXX 4582
                </strong>
              </div>

              <div>
                <span>
                  Account type
                </span>

                <strong>
                  Savings Account
                </strong>
              </div>

              <div>
                <span>
                  Available balance
                </span>

                <strong>
                  {formatCurrency(
                    balance
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Account status
                </span>

                <strong className="transaction-status">
                  <CheckCircle2
                    size={14}
                  />

                  Active
                </strong>
              </div>
            </div>

            <div className="transaction-modal-security">
              <ShieldCheck
                size={15}
              />

              <span>
                Your account information
                is protected by NovaBank
                security controls.
              </span>
            </div>

            <button
              type="button"
              className="transaction-modal-done"
              onClick={() =>
                setAccountDetailsOpen(
                  false
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

export default Payments;