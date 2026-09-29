import {
  useEffect,
  useState,
} from "react";

import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Cards from "./pages/Cards";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";

import { useBanking } from "./context/BankingContext";

function App() {
  const [activePage, setActivePage] =
    useState("Dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [pageTransition, setPageTransition] =
    useState(false);

  const [displayPage, setDisplayPage] =
    useState("Dashboard");

  const { toast } = useBanking();

  /* =========================================================
     PAGE NAVIGATION
  ========================================================= */

  const navigateTo = (page) => {
    if (!page) {
      return;
    }

    if (page === activePage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    /* Start exit animation */
    setPageTransition(true);

    /*
      Wait for the exit animation before replacing
      the page content.
    */
    window.setTimeout(() => {
      setActivePage(page);
      setDisplayPage(page);

      window.scrollTo({
        top: 0,
        behavior: "instant",
      });

      /*
        Allow the new page to animate in.
      */
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setPageTransition(false);
        });
      });
    }, 220);
  };

  /* =========================================================
     KEEP DISPLAY PAGE IN SYNC
  ========================================================= */

  useEffect(() => {
    setDisplayPage(activePage);
  }, [activePage]);

  /* =========================================================
     GLOBAL NAVIGATION EVENTS
  ========================================================= */

  useEffect(() => {
    const events = {
      "navigate-dashboard": "Dashboard",
      "navigate-accounts": "Accounts",
      "navigate-transactions":
        "Transactions",
      "navigate-cards": "Cards",
      "navigate-payments": "Payments",
      "navigate-settings": "Settings",
      "navigate-analytics": "Analytics",
    };

    const handlers = {};

    Object.entries(events).forEach(
      ([eventName, page]) => {
        const handler = () => {
          navigateTo(page);
        };

        handlers[eventName] = handler;

        window.addEventListener(
          eventName,
          handler
        );
      }
    );

    return () => {
      Object.entries(handlers).forEach(
        ([eventName, handler]) => {
          window.removeEventListener(
            eventName,
            handler
          );
        }
      );
    };
  }, [activePage]);

  /* =========================================================
     ESCAPE — MOBILE SIDEBAR
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        window.innerWidth <= 900
      ) {
        setSidebarOpen(false);
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
     PAGE CONTENT
  ========================================================= */

  const renderPage = () => {
    switch (displayPage) {
      case "Dashboard":
        return <Dashboard />;

      case "Accounts":
        return <Accounts />;

      case "Transactions":
        return <Transactions />;

      case "Cards":
        return <Cards />;

      case "Payments":
        return <Payments />;

      case "Settings":
        return <Settings />;

      case "Analytics":
        return (
          <div className="page-container analytics-page">
            <div className="dashboard-welcome">
              <div>
                <span className="page-eyebrow">
                  FINANCIAL INSIGHTS
                </span>

                <h1>
                  Financial{" "}
                  <span>Analytics</span>
                </h1>

                <p>
                  Detailed insights into your
                  spending, income and savings.
                </p>
              </div>
            </div>

            <div className="analytics-dashboard">
              <div className="dashboard-panel analytics-placeholder">
                <div className="analytics-placeholder-icon">
                  <span>✦</span>
                </div>

                <span className="section-eyebrow">
                  COMING SOON
                </span>

                <h2>
                  Advanced analytics
                </h2>

                <p>
                  Your detailed financial analytics
                  workspace is being prepared. Soon
                  you will be able to monitor spending
                  patterns, savings, income and
                  financial trends here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigateTo("Dashboard")
                  }
                >
                  Back to Dashboard
                </button>
              </div>

              <div className="analytics-preview-grid">
                <div className="dashboard-panel analytics-preview-card">
                  <span>
                    MONTHLY SPENDING
                  </span>

                  <strong>
                    ₹24,680
                  </strong>

                  <div className="analytics-bars">
                    {[
                      42,
                      58,
                      48,
                      72,
                      54,
                      66,
                      45,
                    ].map(
                      (
                        height,
                        index
                      ) => (
                        <span
                          key={index}
                          style={{
                            height:
                              `${height}%`,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="dashboard-panel analytics-preview-card">
                  <span>
                    SAVINGS RATE
                  </span>

                  <strong>
                    31.4%
                  </strong>

                  <div className="analytics-ring">
                    <span>
                      31%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        activePage={activePage}
        setActivePage={navigateTo}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div
        className={`main-area ${
          sidebarOpen
            ? "sidebar-expanded"
            : "sidebar-collapsed"
        }`}
      >
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setActivePage={navigateTo}
        />

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main
          className={`dashboard-main ${
            pageTransition
              ? "page-is-transitioning"
              : "page-is-ready"
          }`}
        >
          <div
            key={displayPage}
            className={`page-transition-wrapper ${
              pageTransition
                ? "page-transition-exit"
                : "page-transition-enter"
            }`}
          >
            {renderPage()}
          </div>
        </main>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      <MobileNav
        activePage={activePage}
        setActivePage={navigateTo}
      />

      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast && (
        <div
          className={`toast toast-${toast.type}`}
          role="status"
        >
          <div className="toast-check">
            {toast.type === "info"
              ? "i"
              : toast.type === "error"
              ? "!"
              : "✓"}
          </div>

          <div className="toast-copy">
            <strong>
              {toast.type === "info"
                ? "NovaBank"
                : toast.type === "error"
                ? "Action required"
                : "Success"}
            </strong>

            <span>
              {toast.message}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent(
                  "keydown",
                  {
                    key: "Escape",
                  }
                )
              );
            }}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;