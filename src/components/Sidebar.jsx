import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  Landmark,
  LogOut,
  MoreHorizontal,
  Settings,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useBanking } from "../context/BankingContext";

function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}) {
  const { showToast } = useBanking();

  const [showMore, setShowMore] =
    useState(false);

  /*
   * ------------------------------------------------
   * NAVIGATION
   * ------------------------------------------------
   */

  const navigation = [
    {
      label: "MAIN MENU",
      items: [
        {
          id: "Dashboard",
          label: "Dashboard",
          icon: Home,
        },
        {
          id: "Accounts",
          label: "Accounts",
          icon: Landmark,
        },
        {
          id: "Payments",
          label: "Payments",
          icon: Smartphone,
        },
        {
          id: "Cards",
          label: "Cards",
          icon: CreditCard,
        },
        {
          id: "Transactions",
          label: "Transactions",
          icon: FileText,
        },
      ],
    },
    {
      label: "MANAGE",
      items: [
        {
          id: "Analytics",
          label: "Analytics",
          icon: BarChart3,
        },
        {
          id: "Settings",
          label: "Settings",
          icon: Settings,
        },
      ],
    },
  ];

  /*
   * ------------------------------------------------
   * PAGE NAVIGATION
   * ------------------------------------------------
   */

  const handleNavigation = (page) => {
    setActivePage(page);

    /*
     * Close "More" after navigating.
     */
    setShowMore(false);

    /*
     * On smaller screens, close the sidebar
     * after selecting a page.
     */
    if (window.innerWidth <= 1100) {
      setSidebarOpen(false);
    }

    /*
     * Scroll to top.
     */
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * ------------------------------------------------
   * MORE MENU
   * ------------------------------------------------
   */

  const handleMoreToggle = () => {
    if (!sidebarOpen) {
      setSidebarOpen(true);

      /*
       * Open More after the sidebar animation.
       */
      window.setTimeout(() => {
        setShowMore(true);
      }, 180);

      return;
    }

    setShowMore((value) => !value);
  };

  /*
   * ------------------------------------------------
   * NOTIFICATIONS
   * ------------------------------------------------
   */

  const handleNotifications = () => {
    setShowMore(false);

    /*
     * Header contains the actual notifications
     * panel, so tell the user where to access it.
     */
    showToast(
      "Open the notification bell in the top bar",
      "info"
    );
  };

  /*
   * ------------------------------------------------
   * HELP
   * ------------------------------------------------
   */

  const handleHelp = () => {
    setShowMore(false);

    showToast(
      "Help & Support is ready to assist you",
      "info"
    );
  };

  /*
   * ------------------------------------------------
   * SECURITY
   * ------------------------------------------------
   */

  const handleSecurity = () => {
    setShowMore(false);

    /*
     * Security controls are available inside
     * Settings.
     */
    handleNavigation("Settings");

    window.setTimeout(() => {
      showToast(
        "Security settings opened",
        "info"
      );
    }, 220);
  };

  /*
   * ------------------------------------------------
   * SIGN OUT
   * ------------------------------------------------
   */

  const handleLogout = () => {
    setShowMore(false);

    showToast(
      "You have been securely signed out",
      "success"
    );

    /*
     * Keep the banking dashboard available after
     * the toast instead of using browser alert().
     */
    window.setTimeout(() => {
      handleNavigation("Dashboard");
    }, 500);
  };

  /*
   * ------------------------------------------------
   * RESPONSIVE SIDEBAR
   * ------------------------------------------------
   */

  useEffect(() => {
    const handleResize = () => {
      /*
       * Close the mobile sidebar when switching
       * back to desktop.
       */
      if (window.innerWidth > 1100) {
        setShowMore(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /*
   * ------------------------------------------------
   * ESCAPE KEY
   * ------------------------------------------------
   */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      setShowMore(false);

      if (window.innerWidth <= 1100) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [setSidebarOpen]);

  /*
   * ------------------------------------------------
   * BODY SCROLL LOCK ON MOBILE
   * ------------------------------------------------
   */

  useEffect(() => {
    const isMobile =
      window.innerWidth <= 1100;

    if (isMobile && sidebarOpen) {
      document.body.classList.add(
        "sidebar-open"
      );
    } else {
      document.body.classList.remove(
        "sidebar-open"
      );
    }

    return () => {
      document.body.classList.remove(
        "sidebar-open"
      );
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`bank-sidebar ${
          sidebarOpen
            ? "open"
            : "collapsed"
        }`}
      >
        {/* ========================================
            BRAND
        ======================================== */}

        <div className="sidebar-brand">
          <button
            type="button"
            className="sidebar-logo"
            onClick={() =>
              handleNavigation(
                "Dashboard"
              )
            }
            aria-label="Go to dashboard"
            title="NovaBank Dashboard"
          >
            <span>N</span>
          </button>

          {sidebarOpen && (
            <div className="sidebar-brand-copy">
              <strong>
                NovaBank
              </strong>

              <span>
                PERSONAL BANKING
              </span>
            </div>
          )}
        </div>

        {/* ========================================
            MOBILE CLOSE
        ======================================== */}

        <button
          type="button"
          className="sidebar-mobile-close"
          onClick={() => {
            setShowMore(false);
            setSidebarOpen(false);
          }}
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <X size={18} />
        </button>

        {/* ========================================
            ACCOUNT STATUS
        ======================================== */}

        {sidebarOpen && (
          <div className="sidebar-account-status">
            <div className="sidebar-account-status-icon">
              <ShieldCheck
                size={14}
              />
            </div>

            <div>
              <span>
                ACCOUNT STATUS
              </span>

              <strong>
                Active & secure
              </strong>
            </div>

            <span className="status-dot" />
          </div>
        )}

        {/* ========================================
            NAVIGATION
        ======================================== */}

        <nav
          className="sidebar-navigation"
          aria-label="Main navigation"
        >
          {navigation.map((group) => (
            <div
              className="sidebar-nav-group"
              key={group.label}
            >
              {sidebarOpen && (
                <span className="sidebar-nav-label">
                  {group.label}
                </span>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;

                const active =
                  activePage === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`sidebar-nav-item ${
                      active
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleNavigation(
                        item.id
                      )
                    }
                    title={
                      !sidebarOpen
                        ? item.label
                        : undefined
                    }
                    aria-current={
                      active
                        ? "page"
                        : undefined
                    }
                  >
                    <span className="sidebar-nav-icon">
                      <Icon size={18} />
                    </span>

                    {sidebarOpen && (
                      <>
                        <span className="sidebar-nav-copy">
                          {item.label}
                        </span>

                        {active && (
                          <span className="sidebar-active-indicator" />
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ========================================
            MORE
        ======================================== */}

        <div className="sidebar-more-wrapper">
          <button
            type="button"
            className={`sidebar-nav-item ${
              showMore
                ? "active"
                : ""
            }`}
            onClick={
              handleMoreToggle
            }
            title={
              !sidebarOpen
                ? "More"
                : undefined
            }
            aria-expanded={showMore}
          >
            <span className="sidebar-nav-icon">
              <MoreHorizontal
                size={18}
              />
            </span>

            {sidebarOpen && (
              <>
                <span className="sidebar-nav-copy">
                  More
                </span>

                <ChevronRight
                  size={14}
                  className={`sidebar-more-chevron ${
                    showMore
                      ? "rotated"
                      : ""
                  }`}
                />
              </>
            )}
          </button>

          {showMore &&
            sidebarOpen && (
              <div className="sidebar-more-menu">
                {/* NOTIFICATIONS */}

                <button
                  type="button"
                  onClick={
                    handleNotifications
                  }
                >
                  <Bell size={15} />

                  <span>
                    Notifications
                  </span>
                </button>

                {/* HELP */}

                <button
                  type="button"
                  onClick={
                    handleHelp
                  }
                >
                  <HelpCircle
                    size={15}
                  />

                  <span>
                    Help & Support
                  </span>
                </button>

                {/* SECURITY */}

                <button
                  type="button"
                  onClick={
                    handleSecurity
                  }
                >
                  <ShieldCheck
                    size={15}
                  />

                  <span>
                    Security Center
                  </span>
                </button>
              </div>
            )}
        </div>

        {/* ========================================
            SIDEBAR BOTTOM
        ======================================== */}

        <div className="sidebar-bottom">
          {/* HELP CARD */}

          {sidebarOpen && (
            <div className="sidebar-help-card">
              <div className="sidebar-help-icon">
                <HelpCircle
                  size={15}
                />
              </div>

              <div>
                <strong>
                  Need help?
                </strong>

                <span>
                  Our support team is
                  here for you.
                </span>
              </div>

              <button
                type="button"
                onClick={
                  handleHelp
                }
                aria-label="Open help and support"
                title="Help & Support"
              >
                <ChevronRight
                  size={13}
                />
              </button>
            </div>
          )}

          {/* SIGN OUT */}

          <button
            type="button"
            className="sidebar-logout"
            onClick={
              handleLogout
            }
            title={
              !sidebarOpen
                ? "Sign out"
                : undefined
            }
          >
            <LogOut size={17} />

            {sidebarOpen && (
              <span>
                Sign out
              </span>
            )}
          </button>

          {/* COLLAPSE */}

          <button
            type="button"
            className="sidebar-collapse-button"
            onClick={() => {
              setShowMore(false);

              setSidebarOpen(
                (value) =>
                  !value
              );
            }}
            aria-label={
              sidebarOpen
                ? "Collapse sidebar"
                : "Expand sidebar"
            }
            title={
              sidebarOpen
                ? "Collapse sidebar"
                : "Expand sidebar"
            }
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft
                  size={15}
                />

                <span>
                  Collapse
                </span>
              </>
            ) : (
              <ChevronRight
                size={16}
              />
            )}
          </button>
        </div>

        {/* ========================================
            USER PROFILE
        ======================================== */}

        {sidebarOpen && (
          <button
            type="button"
            className="sidebar-user"
            onClick={() =>
              handleNavigation(
                "Settings"
              )
            }
            title="Open profile settings"
          >
            <span className="sidebar-user-avatar">
              SK
            </span>

            <span className="sidebar-user-copy">
              <strong>
                Snehit
              </strong>

              <small>
                Personal Banking
              </small>
            </span>

            <ChevronRight
              size={14}
            />
          </button>
        )}
      </aside>

      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={() => {
            setShowMore(false);
            setSidebarOpen(false);
          }}
          aria-label="Close navigation"
          title="Close navigation"
        />
      )}
    </>
  );
}

export default Sidebar;