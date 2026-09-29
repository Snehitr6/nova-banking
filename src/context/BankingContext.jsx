import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const BankingContext = createContext(null);

export function BankingProvider({ children }) {
  const [balance, setBalance] = useState(264520);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: "Salary Credit",
      category: "Income",
      date: "Today, 09:42 AM",
      amount: 86400,
      type: "income",
      icon: "salary",
    },
    {
      id: 2,
      name: "Amazon",
      category: "Shopping",
      date: "Today, 02:18 PM",
      amount: 2499,
      type: "expense",
      icon: "shopping",
    },
    {
      id: 3,
      name: "Swiggy",
      category: "Food & Dining",
      date: "Yesterday, 08:32 PM",
      amount: 685,
      type: "expense",
      icon: "food",
    },
    {
      id: 4,
      name: "Electricity Bill",
      category: "Utilities",
      date: "Sep 27, 2026",
      amount: 1840,
      type: "expense",
      icon: "electricity",
    },
    {
      id: 5,
      name: "Rahul Sharma",
      category: "Transfer",
      date: "Sep 26, 2026",
      amount: 5000,
      type: "expense",
      icon: "transfer",
    },
    {
      id: 6,
      name: "Freelance Payment",
      category: "Income",
      date: "Sep 25, 2026",
      amount: 12000,
      type: "income",
      icon: "freelance",
    },
    {
      id: 7,
      name: "Netflix",
      category: "Entertainment",
      date: "Sep 24, 2026",
      amount: 649,
      type: "expense",
      icon: "entertainment",
    },
    {
      id: 8,
      name: "Flipkart",
      category: "Shopping",
      date: "Sep 23, 2026",
      amount: 3299,
      type: "expense",
      icon: "shopping",
    },
  ]);

  const [toast, setToast] = useState(null);

  const [cardFrozen, setCardFrozen] =
    useState(false);

  const [selectedContact, setSelectedContact] =
    useState(null);

  const [contacts] = useState([
    {
      id: 1,
      name: "Rahul",
      initials: "RS",
    },
    {
      id: 2,
      name: "Priya",
      initials: "PS",
    },
    {
      id: 3,
      name: "Amit",
      initials: "AK",
    },
    {
      id: 4,
      name: "Neha",
      initials: "NP",
    },
    {
      id: 5,
      name: "Arjun",
      initials: "AS",
    },
  ]);

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const addTransaction = ({
    name,
    category,
    amount,
    type = "expense",
    icon = "transfer",
  }) => {
    const newTransaction = {
      id: Date.now(),
      name,
      category,
      date: "Just now",
      amount: Number(amount),
      type,
      icon,
    };

    setTransactions((current) => [
      newTransaction,
      ...current,
    ]);

    if (type === "expense") {
      setBalance(
        (current) =>
          current - Number(amount)
      );
    } else {
      setBalance(
        (current) =>
          current + Number(amount)
      );
    }

    return newTransaction;
  };

  const sendMoney = ({
    recipient,
    amount,
  }) => {
    const numericAmount = Number(amount);

    if (!recipient) {
      showToast(
        "Please select a recipient",
        "error"
      );
      return false;
    }

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      showToast(
        "Enter a valid amount",
        "error"
      );
      return false;
    }

    if (numericAmount > balance) {
      showToast(
        "Insufficient account balance",
        "error"
      );
      return false;
    }

    addTransaction({
      name: recipient,
      category: "Transfer",
      amount: numericAmount,
      type: "expense",
      icon: "transfer",
    });

    showToast(
      `₹${numericAmount.toLocaleString(
        "en-IN"
      )} sent successfully`
    );

    return true;
  };

  const addMoney = (amount) => {
    const numericAmount = Number(amount);

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      showToast(
        "Enter a valid amount",
        "error"
      );
      return false;
    }

    addTransaction({
      name: "Money Added",
      category: "Deposit",
      amount: numericAmount,
      type: "income",
      icon: "salary",
    });

    showToast(
      `₹${numericAmount.toLocaleString(
        "en-IN"
      )} added successfully`
    );

    return true;
  };

  const freezeCard = () => {
    setCardFrozen((current) => !current);

    showToast(
      cardFrozen
        ? "Your card has been unlocked"
        : "Your card has been temporarily locked",
      "info"
    );
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape"
      ) {
        setToast(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  const value = {
    balance,
    setBalance,

    transactions,
    setTransactions,

    contacts,

    selectedContact,
    setSelectedContact,
    selectContact,

    cardFrozen,
    setCardFrozen,
    freezeCard,

    toast,
    showToast,

    addTransaction,
    sendMoney,
    addMoney,
  };

  return (
    <BankingContext.Provider value={value}>
      {children}
    </BankingContext.Provider>
  );
}

export function useBanking() {
  const context =
    useContext(BankingContext);

  if (!context) {
    throw new Error(
      "useBanking must be used inside BankingProvider"
    );
  }

  return context;
}

export default BankingContext;