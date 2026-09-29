import {
  useEffect,
  useRef,
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

  const [displayPage, setDisplayPage] =
    useState("Dashboard");

  /*
    Desktop:
    sidebar open

    Mobile:
    sidebar closed
  */
  const [sidebarOpen, setSidebarOpen] =
    useState(() => {
      if (
        typeof window ===
        "undefined"
      ) {
        return true;
      }

      return window.innerWidth > 700;
    });

  const [pageTransition, setPageTransition] =
    useState(false);

  const navigationTimer =
    useRef(null);

  const { toast } = useBanking();

  /* =========================================================
     PAGE NAVIGATION
  ========================================================= */

  const navigateTo = (page) => {
    if (!page) {
      return;
    }

    /*
      Same page
    */
    if (page === activePage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      /*
        Always close mobile sidebar
        when selecting a page.
      */
      if (
        window.innerWidth <= 700
      ) {
        setSidebarOpen(false);
      }

      return;
    }

    /*
      Clear previous navigation timer
      to prevent multiple rapid transitions.
    */
    if (
      navigationTimer.current
    ) {
      window.clearTimeout(
        navigationTimer.current
      );
    }

    /*
      Close sidebar on mobile.
    */
    if (
      window.innerWidth <= 700
    ) {
      setSidebarOpen(false);
    }

    /*
      Start exit animation.
    */
    setPageTransition(true);

    navigationTimer.current =
      window.setTimeout(() => {
        setActivePage(page);
        setDisplayPage(page);

        window.scrollTo({
          top: 0,
          behavior: "instant",
        });

        /*
          Allow browser to paint
          new page before entrance.
        */
        window.requestAnimationFrame(
          () => {
            window.requestAnimationFrame(
              () => {
                setPageTransition(
                  false
                );
              }
            );
          }
        );
      }, 180);
  };

  /* =========================================================
     CLEAN NAVIGATION TIMER
  ========================================================= */

  useEffect(() => {
    return () => {
      if (
        navigationTimer.current
      ) {
        window.clearTimeout(
          navigationTimer.current
        );
      }
    };
  }, []);

  /* =========================================================
     GLOBAL PAGE EVENTS
  ========================================================= */

  useEffect(() => {
    const navigationEvents = {
      "navigate-dashboard":
        "Dashboard",

      "navigate-accounts":
        "Accounts",

      "navigate-transactions":
        "Transactions",

      "navigate-cards":
        "Cards",

      "navigate-payments":
        "Payments",

      "navigate-settings":
        "Settings",

      "navigate-analytics":
        "Analytics",
    };

    const handlers = [];

    Object.entries(
      navigationEvents
    ).forEach(
      ([eventName, page]) => {
        const handler = () => {
          navigateTo(page);
        };

        window.addEventListener(
          eventName,
          handler
        );

        handlers.push([
          eventName,
          handler,
        ]);
      }
    );

    return () => {
      handlers.forEach(
        ([
          eventName,
          handler,
        ]) => {
          window.removeEventListener(
            eventName,
            handler
          );
        }
      );
    };
  }, [activePage]);

  /* =========================================================
     RESPONSIVE SIDEBAR
  ========================================================= */

  useEffect(() => {
    const handleResize = () => {
      /*
        Mobile
      */
      if (
        window.innerWidth <= 700
      ) {
        setSidebarOpen(false);

        return;
      }

      /*
        Desktop
      */
      setSidebarOpen(true);
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

  /* =========================================================
     ESCAPE
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        /*
          Close mobile sidebar.
        */
        if (
          window.innerWidth <= 700
        ) {
          setSidebarOpen(false);
        }
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
     PAGE RENDER
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

            {/* PAGE HEADER */}

            <div className="dashboard-welcome">
              <div>
                <span className="page-eyebrow">
                  FINANCIAL INSIGHTS
                </span>

                <h1>
                  Financial{" "}
                  <span>
                    Analytics
                  </span>
                </h1>

                <p>
                  Detailed insights into
                  your spending, income
                  and savings.
                </p>
              </div>
            </div>

            {/* ANALYTICS */}

            <div className="analytics-dashboard">

              {/* MAIN CARD */}

              <div className="dashboard-panel analytics-placeholder">

                <div className="analytics-placeholder-icon">
                  <span>
                    ✦
                  </span>
                </div>

                <span className="section-eyebrow">
                  FINANCIAL INSIGHTS
                </span>

                <h2>
                  Advanced analytics
                </h2>

                <p>
                  Monitor your spending
                  patterns, savings,
                  income and financial
                  trends from one place.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      "Dashboard"
                    )
                  }
                >
                  Back to Dashboard
                </button>
              </div>

              {/* PREVIEW */}

              <div className="analytics-preview-grid">

                {/* SPENDING */}

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

                {/* SAVINGS */}

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

  /* =========================================================
     APP
  ========================================================= */

  return (
    <div className="app-shell">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar
        activePage={
          activePage
        }
        setActivePage={
          navigateTo
        }
        sidebarOpen={
          sidebarOpen
        }
        setSidebarOpen={
          setSidebarOpen
        }
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

        {/* HEADER */}

        <Header
          sidebarOpen={
            sidebarOpen
          }
          setSidebarOpen={
            setSidebarOpen
          }
          setActivePage={
            navigateTo
          }
        />

        {/* PAGE */}

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
          MOBILE NAV
      ===================================================== */}

      <MobileNav
        activePage={
          activePage
        }
        setActivePage={
          navigateTo
        }
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
            {toast.type ===
            "info"
              ? "i"
              : toast.type ===
                "error"
              ? "!"
              : "✓"}
          </div>

          <div className="toast-copy">
            <strong>
              {toast.type ===
              "info"
                ? "NovaBank"
                : toast.type ===
                  "error"
                ? "Action required"
                : "Success"}
            </strong>

            <span>
              {toast.message}
            </span>
          </div>

          <button
            type="button"
            aria-label="Close notification"
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent(
                  "keydown",
                  {
                    key: "Escape",
                  }
                )
              )
            }
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
