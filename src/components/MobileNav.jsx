import {
  BarChart3,
  CreditCard,
  Home,
  Landmark,
  MoreHorizontal,
  Receipt,
  Settings,
  Smartphone,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

function MobileNav({
  activePage,
  setActivePage,
}) {
  const [moreOpen, setMoreOpen] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(() => {
      if (
        typeof window === "undefined"
      ) {
        return false;
      }

      return window.innerWidth <= 700;
    });

  /* =========================================================
     DETECT REAL MOBILE WIDTH
  ========================================================= */

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth <= 700;

      setIsMobile(mobile);

      if (!mobile) {
        setMoreOpen(false);
      }
    };

    checkMobile();

    window.addEventListener(
      "resize",
      checkMobile
    );

    return () => {
      window.removeEventListener(
        "resize",
        checkMobile
      );
    };
  }, []);

  /* =========================================================
     ESCAPE
  ========================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMoreOpen(false);
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
  }, []);

  /* =========================================================
     BODY SCROLL LOCK WHEN MORE MENU IS OPEN
  ========================================================= */

  useEffect(() => {
    if (moreOpen && isMobile) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [moreOpen, isMobile]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const primaryNavigation = [
    {
      id: "Dashboard",
      label: "Home",
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
  ];

  const moreNavigation = [
    {
      id: "Transactions",
      label: "Transactions",
      icon: Receipt,
    },
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
  ];

  const handleNavigation = (page) => {
    setMoreOpen(false);

    setActivePage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     IMPORTANT
     
     DO NOT RENDER MOBILE NAV AT ALL ON DESKTOP.
     This is stronger than CSS display:none.
  ========================================================= */

  if (!isMobile) {
    return null;
  }

  /* =========================================================
     MOBILE NAV
  ========================================================= */

  return (
    <>
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      {moreOpen && (
        <button
          type="button"
          className="mobile-nav-backdrop"
          onClick={() =>
            setMoreOpen(false)
          }
          aria-label="Close more menu"
        />
      )}

      {/* =====================================================
          MORE SHEET
      ===================================================== */}

      {moreOpen && (
        <div className="mobile-more-sheet">
          <div className="mobile-more-handle" />

          <div className="mobile-more-header">
            <div>
              <span>
                NOVABANK
              </span>

              <h3>
                More services
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                setMoreOpen(false)
              }
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mobile-more-grid">
            {moreNavigation.map(
              (item) => {
                const Icon = item.icon;

                const active =
                  activePage === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      active
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleNavigation(
                        item.id
                      )
                    }
                  >
                    <span>
                      <Icon size={19} />
                    </span>

                    <strong>
                      {item.label}
                    </strong>
                  </button>
                );
              }
            )}
          </div>

          <div className="mobile-more-security">
            <span className="mobile-security-icon">
              ✓
            </span>

            <div>
              <strong>
                Secure banking
              </strong>

              <small>
                Your session is protected
              </small>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          BOTTOM NAVIGATION
      ===================================================== */}

      <nav
        className="mobile-bottom-navigation"
        aria-label="Mobile navigation"
      >
        <div className="mobile-bottom-nav-inner">
          {primaryNavigation.map(
            (item) => {
              const Icon = item.icon;

              const active =
                activePage === item.id;

              return (
                <button
                  type="button"
                  key={item.id}
                  className={
                    active
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleNavigation(
                      item.id
                    )
                  }
                >
                  <span className="mobile-nav-icon">
                    <Icon size={19} />
                  </span>

                  <span className="mobile-nav-label">
                    {item.label}
                  </span>
                </button>
              );
            }
          )}

          {/* MORE */}
          <button
            type="button"
            className={
              moreOpen ||
              moreNavigation.some(
                (item) =>
                  item.id ===
                  activePage
              )
                ? "active"
                : ""
            }
            onClick={() =>
              setMoreOpen(
                (current) =>
                  !current
              )
            }
            aria-label="More navigation"
          >
            <span className="mobile-nav-icon">
              {moreOpen ? (
                <X size={19} />
              ) : (
                <MoreHorizontal
                  size={20}
                />
              )}
            </span>

            <span className="mobile-nav-label">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default MobileNav;