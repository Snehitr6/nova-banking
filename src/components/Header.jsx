import {
  Bell,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  User,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useBanking } from "../context/BankingContext";

function Header({
  sidebarOpen,
  setSidebarOpen,
  setActivePage,
}) {
  const { showToast } = useBanking();

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchValue, setSearchValue] =
    useState("");

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        title: "Payment successful",
        text: "Your electricity bill payment was completed.",
        time: "12 min ago",
        type: "payment",
        unread: true,
      },
      {
        id: 2,
        title: "New login detected",
        text: "A new login was detected from Chrome.",
        time: "1 hour ago",
        type: "security",
        unread: true,
      },
      {
        id: 3,
        title: "Card payment",
        text: "₹2,499 was spent at Amazon.",
        time: "3 hours ago",
        type: "card",
        unread: false,
      },
    ]);

  const headerRef = useRef(null);

  const searchResults = [
    {
      label: "Dashboard",
      description: "Account overview",
      page: "Dashboard",
    },
    {
      label: "Accounts",
      description: "Manage your accounts",
      page: "Accounts",
    },
    {
      label: "Payments",
      description: "UPI, bills & recharge",
      page: "Payments",
    },
    {
      label: "Cards",
      description: "Manage your cards",
      page: "Cards",
    },
    {
      label: "Transactions",
      description: "View account activity",
      page: "Transactions",
    },
    {
      label: "Analytics",
      description: "Financial insights",
      page: "Analytics",
    },
    {
      label: "Settings",
      description: "Profile & security",
      page: "Settings",
    },
  ];

  const query = searchValue
    .trim()
    .toLowerCase();

  const filteredResults = searchResults.filter(
    (result) => {
      if (!query) {
        return false;
      }

      return (
        result.label
          .toLowerCase()
          .includes(query) ||
        result.description
          .toLowerCase()
          .includes(query)
      );
    }
  );

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  /* =========================================================
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================================================
     KEYBOARD SHORTCUTS
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
        return;
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        setSearchOpen(true);

        window.setTimeout(() => {
          document
            .querySelector(
              ".header-search-input"
            )
            ?.focus();
        }, 50);
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

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const navigate = (page) => {
    setActivePage(page);

    setSearchOpen(false);
    setSearchValue("");
    setNotificationOpen(false);
    setProfileOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchSubmit = (page) => {
    navigate(page);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      if (filteredResults.length > 0) {
        handleSearchSubmit(
          filteredResults[0].page
        );
      }
    }
  };

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const handleNotificationClick = (
    notification
  ) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              unread: false,
            }
          : item
      )
    );

    showToast(
      notification.title,
      "info"
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      }))
    );

    showToast(
      "All notifications marked as read",
      "success"
    );
  };

  const handleViewNotifications = () => {
    setNotificationOpen(false);

    showToast(
      "You are viewing all recent notifications",
      "info"
    );
  };

  /* =========================================================
     PROFILE
  ========================================================= */

  const handleProfile = () => {
    navigate("Settings");
  };

  const handleHelp = () => {
    setProfileOpen(false);

    showToast(
      "Help & Support is ready",
      "info"
    );
  };

  const handleSignOut = () => {
    setProfileOpen(false);

    showToast(
      "Signed out successfully",
      "success"
    );

    window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("navigate-dashboard")
      );
    }, 250);
  };

  return (
    <header
      className="bank-header"
      ref={headerRef}
    >
      {/* =====================================================
          LEFT
      ===================================================== */}

      <div className="header-left">
        {/* Mobile menu */}
        <button
          type="button"
          className="header-menu-button"
          onClick={() =>
            setSidebarOpen(
              (value) => !value
            )
          }
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? (
            <X size={19} />
          ) : (
            <Menu size={19} />
          )}
        </button>

        {/* Desktop sidebar toggle */}
        <button
          type="button"
          className="header-sidebar-toggle"
          onClick={() =>
            setSidebarOpen(
              (value) => !value
            )
          }
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        <button
          type="button"
          className="header-page-context"
          onClick={() => navigate("Dashboard")}
        >
          <span>PERSONAL BANKING</span>

          <strong>
            Secure banking dashboard
          </strong>
        </button>
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="header-center">
        <div
          className={`header-search ${
            searchOpen ? "expanded" : ""
          }`}
        >
          <Search size={16} />

          <input
            className="header-search-input"
            type="text"
            placeholder="Search banking services..."
            value={searchValue}
            onFocus={() =>
              setSearchOpen(true)
            }
            onChange={(event) =>
              setSearchValue(
                event.target.value
              )
            }
            onKeyDown={handleSearchKeyDown}
          />

          {searchValue && (
            <button
              type="button"
              className="header-search-clear"
              onClick={() => {
                setSearchValue("");

                document
                  .querySelector(
                    ".header-search-input"
                  )
                  ?.focus();
              }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {!searchValue && (
            <kbd>Ctrl K</kbd>
          )}

          {searchOpen &&
            searchValue && (
              <div className="header-search-results">
                {filteredResults.length > 0 ? (
                  <>
                    <div className="header-search-results-heading">
                      <span>
                        SEARCH RESULTS
                      </span>

                      <span>
                        {filteredResults.length}
                      </span>
                    </div>

                    {filteredResults.map(
                      (result) => (
                        <button
                          type="button"
                          key={result.page}
                          onClick={() =>
                            handleSearchSubmit(
                              result.page
                            )
                          }
                        >
                          <span className="search-result-icon">
                            <Search size={14} />
                          </span>

                          <span>
                            <strong>
                              {result.label}
                            </strong>

                            <small>
                              {
                                result.description
                              }
                            </small>
                          </span>

                          <ChevronRight
                            size={14}
                          />
                        </button>
                      )
                    )}
                  </>
                ) : (
                  <div className="header-search-empty">
                    <Search size={18} />

                    <strong>
                      No results found
                    </strong>

                    <span>
                      Try Dashboard, Accounts,
                      Payments, Cards or
                      Transactions.
                    </span>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>

      {/* =====================================================
          RIGHT
      ===================================================== */}

      <div className="header-right">
        {/* Secure session */}
        <div className="header-secure-session">
          <ShieldCheck size={14} />

          <span>
            Secure session
          </span>
        </div>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <div className="header-action-wrapper">
          <button
            type="button"
            className={`header-icon-button ${
              notificationOpen
                ? "active"
                : ""
            }`}
            onClick={() => {
              setNotificationOpen(
                (value) => !value
              );

              setProfileOpen(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={18} />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="header-dropdown notification-dropdown">
              <div className="dropdown-header">
                <div>
                  <span>
                    NOTIFICATIONS
                  </span>

                  <h3>
                    Recent activity
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={
                    handleMarkAllRead
                  }
                  disabled={
                    unreadCount === 0
                  }
                >
                  {unreadCount === 0
                    ? "All read"
                    : "Mark all read"}
                </button>
              </div>

              <div className="notification-list">
                {notifications.map(
                  (notification) => (
                    <button
                      type="button"
                      className={`notification-item ${
                        notification.unread
                          ? "unread"
                          : ""
                      }`}
                      key={
                        notification.id
                      }
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                    >
                      <span
                        className={`notification-icon ${notification.type}`}
                      >
                        {notification.type ===
                          "security" && (
                          <ShieldCheck
                            size={15}
                          />
                        )}

                        {notification.type ===
                          "payment" && (
                          <Smartphone
                            size={15}
                          />
                        )}

                        {notification.type ===
                          "card" && (
                          <CreditCardIcon />
                        )}
                      </span>

                      <span className="notification-copy">
                        <strong>
                          {
                            notification.title
                          }
                        </strong>

                        <small>
                          {
                            notification.text
                          }
                        </small>

                        <em>
                          {
                            notification.time
                          }
                        </em>
                      </span>

                      {notification.unread && (
                        <span className="notification-unread-dot" />
                      )}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                className="dropdown-footer-button"
                onClick={
                  handleViewNotifications
                }
              >
                View all notifications

                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            PROFILE
        ================================================= */}

        <div className="header-profile-wrapper">
          <button
            type="button"
            className={`header-profile ${
              profileOpen ? "active" : ""
            }`}
            onClick={() => {
              setProfileOpen(
                (value) => !value
              );

              setNotificationOpen(false);
            }}
          >
            <span className="header-profile-avatar">
              SK
            </span>

            <span className="header-profile-copy">
              <strong>Snehit</strong>

              <small>
                Personal Banking
              </small>
            </span>

            <ChevronDown
              size={14}
              className={
                profileOpen
                  ? "profile-chevron-open"
                  : ""
              }
            />
          </button>

          {profileOpen && (
            <div className="header-dropdown profile-dropdown">
              {/* Profile */}
              <div className="profile-dropdown-header">
                <span className="header-profile-avatar large">
                  SK
                </span>

                <div>
                  <strong>
                    Snehit Kumar
                  </strong>

                  <span>
                    snehit@example.com
                  </span>
                </div>
              </div>

              {/* Security */}
              <div className="profile-dropdown-status">
                <ShieldCheck size={14} />

                <span>
                  <strong>
                    Account protected
                  </strong>

                  <small>
                    Secure banking session
                  </small>
                </span>

                <span className="profile-status-dot" />
              </div>

              {/* Links */}
              <div className="profile-dropdown-links">
                <button
                  type="button"
                  onClick={handleProfile}
                >
                  <User size={15} />

                  Profile

                  <ChevronRight
                    size={13}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("Settings")
                  }
                >
                  <Settings size={15} />

                  Settings

                  <ChevronRight
                    size={13}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleHelp}
                >
                  <HelpCircle size={15} />

                  Help & Support

                  <ChevronRight
                    size={13}
                  />
                </button>
              </div>

              {/* Sign out */}
              <button
                type="button"
                className="profile-logout"
                onClick={handleSignOut}
              >
                <LogOut size={15} />

                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   CARD ICON
========================================================= */

function CreditCardIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        width="20"
        height="14"
        x="2"
        y="5"
        rx="2"
      />

      <line
        x1="2"
        x2="22"
        y1="10"
        y2="10"
      />
    </svg>
  );
}

export default Header;