import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Search,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { useBanking } from "../context/BankingContext";

const formatAmount = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function QuickTransfer() {
  const {
    contacts,
    selectedContact,
    selectContact,
    sendMoney,
    balance,
    showToast,
  } = useBanking();

  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [showAllContacts, setShowAllContacts] =
    useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredContacts = contacts.filter((contact) =>
    contact.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const visibleContacts = showAllContacts
    ? filteredContacts
    : filteredContacts.slice(0, 4);

  const numericAmount = Number(amount);

  const canContinue =
    selectedContact &&
    numericAmount > 0 &&
    numericAmount <= balance;

  useEffect(() => {
    if (!selectedContact) {
      setAmount("");
      setShowConfirm(false);
      setSuccess(false);
    }
  }, [selectedContact]);

  const handleContactSelect = (contact) => {
    selectContact(contact);
    setSuccess(false);
    setShowConfirm(false);
  };

  const handleContinue = () => {
    if (!selectedContact) {
      showToast("Please select a recipient", "error");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      showToast("Enter a valid amount", "error");
      return;
    }

    if (numericAmount > balance) {
      showToast("Insufficient account balance", "error");
      return;
    }

    setShowConfirm(true);
  };

  const handleSend = () => {
    const sent = sendMoney({
      recipient: selectedContact.name,
      amount: numericAmount,
    });

    if (sent) {
      setSuccess(true);
      setShowConfirm(false);
      setAmount("");
    }
  };

  const closeSuccess = () => {
    setSuccess(false);
    selectContact(null);
  };

  return (
    <>
      <section className="w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Send size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Quick Transfer
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Send money to your contacts
              </p>
            </div>
          </div>

          <div className="hidden rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:block">
            Balance: {formatAmount(balance)}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search contact..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Contacts */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Choose recipient
            </p>

            {contacts.length > 4 && (
              <button
                type="button"
                onClick={() =>
                  setShowAllContacts((current) => !current)
                }
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400"
              >
                {showAllContacts ? "Show less" : "View all"}
                <ChevronRight
                  size={14}
                  className={
                    showAllContacts
                      ? "rotate-90 transition-transform"
                      : "transition-transform"
                  }
                />
              </button>
            )}
          </div>

          {visibleContacts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {visibleContacts.map((contact) => {
                const active =
                  selectedContact?.id === contact.id;

                return (
                  <button
                    type="button"
                    key={contact.id}
                    onClick={() =>
                      handleContactSelect(contact)
                    }
                    className={`group relative rounded-2xl border p-3 text-center transition-all duration-200 ${
                      active
                        ? "border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-400 dark:bg-indigo-500/10"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500/40"
                    }`}
                  >
                    {/* Selected indicator */}
                    {active && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}

                    <div
                      className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-transform duration-200 group-hover:scale-105 ${
                        active
                          ? "bg-indigo-600 text-white dark:bg-indigo-500"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {contact.initials}
                    </div>

                    <p
                      className={`mt-2 truncate text-xs font-semibold ${
                        active
                          ? "text-indigo-700 dark:text-indigo-300"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {contact.name}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center dark:border-slate-700">
              <UserRound
                size={24}
                className="mx-auto text-slate-300 dark:text-slate-600"
              />

              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                No contacts found
              </p>
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Enter amount
          </label>

          <div
            className={`flex h-14 items-center rounded-2xl border bg-slate-50 px-4 transition-all duration-200 dark:bg-slate-800 ${
              amount
                ? "border-indigo-400 ring-2 ring-indigo-500/10"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <span className="mr-2 text-lg font-bold text-slate-400">
              ₹
            </span>

            <input
              type="number"
              min="1"
              max={balance}
              value={amount}
              onChange={(event) => {
                const value = event.target.value;

                if (value === "" || Number(value) >= 0) {
                  setAmount(value);
                  setSuccess(false);
                }
              }}
              placeholder="0"
              className="w-full bg-transparent text-xl font-bold text-slate-900 outline-none placeholder:text-slate-300 dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {[500, 1000, 5000, 10000].map(
              (quickAmount) => (
                <button
                  type="button"
                  key={quickAmount}
                  disabled={quickAmount > balance}
                  onClick={() =>
                    setAmount(String(quickAmount))
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                >
                  ₹{quickAmount.toLocaleString("en-IN")}
                </button>
              )
            )}
          </div>
        </div>

        {/* Continue */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
        >
          <span>Continue</span>

          <ArrowRight
            size={17}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </section>

      {/* Confirmation Modal */}
      {showConfirm && selectedContact && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowConfirm(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Transfer
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Review the transfer details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <X size={17} />
              </button>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white dark:bg-indigo-500">
                  {selectedContact.initials}
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Sending to
                  </p>

                  <p className="font-bold text-slate-900 dark:text-white">
                    {selectedContact.name}
                  </p>
                </div>
              </div>

              <div className="my-5 h-px bg-slate-200 dark:bg-slate-700" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Transfer amount
                </span>

                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatAmount(numericAmount)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Remaining balance
                </span>

                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {formatAmount(balance - numericAmount)}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSend}
                className="h-11 rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Send Money
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && selectedContact && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[30px] border border-slate-200 bg-white p-7 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Check size={30} strokeWidth={2.5} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Transfer Successful
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {formatAmount(numericAmount)} has been sent
              successfully to {selectedContact.name}.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  New balance
                </span>

                <span className="font-bold text-slate-900 dark:text-white">
                  {formatAmount(balance)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeSuccess}
              className="mt-5 h-11 w-full rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}