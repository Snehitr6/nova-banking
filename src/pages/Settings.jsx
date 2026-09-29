import {
  Bell,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Fingerprint,
  Globe,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Moon,
  Pencil,
  Phone,
  ShieldCheck,
  Smartphone,
  Sun,
  User,
  WalletCards,
  X,
  CheckCircle2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useBanking } from "../context/BankingContext";

function Settings() {
  const { showToast } =
    useBanking();

  const [activeSection, setActiveSection] =
    useState("profile");

  const [notifications, setNotifications] =
    useState({
      transactions: true,
      payments: true,
      security: true,
      offers: false,
    });

  const [biometricEnabled, setBiometricEnabled] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(false);

  const [balanceHidden, setBalanceHidden] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showEditProfile, setShowEditProfile] =
    useState(false);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [selectionModal, setSelectionModal] =
    useState(null);

  const [preferences, setPreferences] =
    useState({
      language: "English",
      currency: "INR · ₹",
      dateFormat: "DD MMM YYYY",
    });

  const [profile, setProfile] =
    useState({
      firstName: "Snehit",
      lastName: "Kumar",
      email: "snehit@example.com",
      phone: "+91 98765 43210",
    });

  const [password, setPassword] =
    useState({
      current: "",
      newPassword: "",
      confirm: "",
    });

  const sections = [
    {
      id: "profile",
      title: "Profile",
      subtitle: "Personal information",
      icon: User,
    },
    {
      id: "security",
      title: "Security",
      subtitle: "Password & authentication",
      icon: ShieldCheck,
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Alerts & preferences",
      icon: Bell,
    },
    {
      id: "preferences",
      title: "Preferences",
      subtitle: "App experience",
      icon: Globe,
    },
  ];

  /*
   * -----------------------------------------------
   * ESCAPE KEY
   * -----------------------------------------------
   */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      setShowEditProfile(false);
      setShowLogoutModal(false);
      setSelectionModal(null);
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

  /*
   * -----------------------------------------------
   * PROFILE
   * -----------------------------------------------
   */

  const handleProfileSave = () => {
    if (
      !profile.firstName.trim() ||
      !profile.lastName.trim()
    ) {
      showToast(
        "First name and last name are required",
        "error"
      );

      return;
    }

    if (
      !profile.email.trim() ||
      !profile.email.includes("@")
    ) {
      showToast(
        "Enter a valid email address",
        "error"
      );

      return;
    }

    if (
      profile.phone.replace(/\D/g, "")
        .length < 10
    ) {
      showToast(
        "Enter a valid mobile number",
        "error"
      );

      return;
    }

    setShowEditProfile(false);

    showToast(
      "Profile information updated successfully",
      "success"
    );
  };

  /*
   * -----------------------------------------------
   * PASSWORD
   * -----------------------------------------------
   */

  const handlePasswordUpdate = () => {
    if (!password.current) {
      showToast(
        "Enter your current password",
        "error"
      );

      return;
    }

    if (
      password.newPassword.length < 8
    ) {
      showToast(
        "New password must contain at least 8 characters",
        "error"
      );

      return;
    }

    if (
      password.newPassword !==
      password.confirm
    ) {
      showToast(
        "New passwords do not match",
        "error"
      );

      return;
    }

    setPassword({
      current: "",
      newPassword: "",
      confirm: "",
    });

    setShowPassword(false);

    showToast(
      "Password updated successfully",
      "success"
    );
  };

  /*
   * -----------------------------------------------
   * NOTIFICATIONS
   * -----------------------------------------------
   */

  const handleNotificationChange = (
    key
  ) => {
    setNotifications(
      (current) => ({
        ...current,
        [key]: !current[key],
      })
    );

    showToast(
      "Notification preference updated",
      "success"
    );
  };

  /*
   * -----------------------------------------------
   * BIOMETRIC
   * -----------------------------------------------
   */

  const handleBiometricToggle = () => {
    setBiometricEnabled(
      (current) => !current
    );

    showToast(
      biometricEnabled
        ? "Biometric login disabled"
        : "Biometric login enabled",
      "info"
    );
  };

  /*
   * -----------------------------------------------
   * DARK MODE
   * -----------------------------------------------
   */

  const handleDarkModeToggle = (
    enabled
  ) => {
    setDarkMode(enabled);

    /*
     * The actual theme class is also applied here
     * so the setting immediately affects the UI.
     */
    document.documentElement.classList.toggle(
      "dark",
      enabled
    );

    document.body.classList.toggle(
      "dark-mode",
      enabled
    );

    showToast(
      enabled
        ? "Dark appearance enabled"
        : "Light appearance enabled",
      "info"
    );
  };

  /*
   * -----------------------------------------------
   * BALANCE PRIVACY
   * -----------------------------------------------
   */

  const handleBalancePrivacy = () => {
    setBalanceHidden(
      (current) => !current
    );

    showToast(
      balanceHidden
        ? "Balances are visible by default"
        : "Balances will be hidden by default",
      "success"
    );
  };

  /*
   * -----------------------------------------------
   * SELECT PREFERENCE
   * -----------------------------------------------
   */

  const openPreference = (
    type
  ) => {
    setSelectionModal(type);
  };

  const selectPreference = (
    type,
    value
  ) => {
    setPreferences(
      (current) => ({
        ...current,
        [type]: value,
      })
    );

    setSelectionModal(null);

    showToast(
      `${typeLabel(type)} updated to ${value}`,
      "success"
    );
  };

  const typeLabel = (type) => {
    if (type === "language") {
      return "Language";
    }

    if (type === "currency") {
      return "Currency";
    }

    if (type === "dateFormat") {
      return "Date format";
    }

    return "Preference";
  };

  const preferenceOptions = {
    language: [
      "English",
      "Kannada",
      "Hindi",
    ],
    currency: [
      "INR · ₹",
      "USD · $",
      "EUR · €",
    ],
    dateFormat: [
      "DD MMM YYYY",
      "DD/MM/YYYY",
      "MMM DD, YYYY",
    ],
  };

  /*
   * -----------------------------------------------
   * DEVICE SIGN OUT
   * -----------------------------------------------
   */

  const handleDeviceSignOut = (
    device
  ) => {
    showToast(
      `${device} has been signed out`,
      "success"
    );
  };

  /*
   * -----------------------------------------------
   * FINAL LOGOUT
   * -----------------------------------------------
   */

  const handleLogout = () => {
    setShowLogoutModal(false);

    showToast(
      "You have been securely signed out",
      "success"
    );

    window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent(
          "navigate-dashboard"
        )
      );
    }, 500);
  };

  /*
   * -----------------------------------------------
   * TOGGLE COMPONENT
   * -----------------------------------------------
   */

  const renderToggle = (
    enabled,
    onClick,
    label
  ) => (
    <button
      type="button"
      className={`settings-toggle ${
        enabled ? "active" : ""
      }`}
      onClick={onClick}
      aria-label={label || "Toggle setting"}
      aria-pressed={enabled}
    >
      <span />
    </button>
  );

  return (
    <div className="page-container settings-page">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="dashboard-welcome settings-heading">
        <div>
          <span className="page-eyebrow">
            ACCOUNT SETTINGS
          </span>

          <h1>
            Manage your{" "}
            <span>account</span>
          </h1>

          <p>
            Update your personal information,
            security and banking preferences.
          </p>
        </div>

        <div className="settings-secure-chip">
          <ShieldCheck size={14} />

          <div>
            <span>
              SECURITY STATUS
            </span>

            <strong>
              Protected
            </strong>
          </div>
        </div>
      </div>

      {/* ==========================================
          SETTINGS LAYOUT
      ========================================== */}

      <div className="settings-layout">
        {/* ========================================
            SIDEBAR
        ======================================== */}

        <aside className="settings-sidebar">
          <div className="settings-sidebar-profile">
            <div className="settings-avatar">
              {profile.firstName
                .charAt(0)
                .toUpperCase()}
              {profile.lastName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {profile.firstName}{" "}
                {profile.lastName}
              </strong>

              <span>
                Premium Banking Customer
              </span>
            </div>
          </div>

          <div className="settings-navigation">
            {sections.map(
              (section) => {
                const Icon =
                  section.icon;

                return (
                  <button
                    type="button"
                    key={section.id}
                    className={`settings-nav-item ${
                      activeSection ===
                      section.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveSection(
                        section.id
                      )
                    }
                  >
                    <span className="settings-nav-icon">
                      <Icon size={17} />
                    </span>

                    <span>
                      <strong>
                        {section.title}
                      </strong>

                      <small>
                        {section.subtitle}
                      </small>
                    </span>

                    <ChevronRight
                      size={14}
                    />
                  </button>
                );
              }
            )}
          </div>

          <div className="settings-sidebar-security">
            <ShieldCheck
              size={17}
            />

            <div>
              <strong>
                Secure session
              </strong>

              <span>
                Your banking session is protected.
              </span>
            </div>
          </div>
        </aside>

        {/* ========================================
            CONTENT
        ======================================== */}

        <main className="settings-content">
          {/* ======================================
              PROFILE
          ====================================== */}

          {activeSection ===
            "profile" && (
            <div className="settings-section">
              <div className="settings-section-heading">
                <div>
                  <span className="section-eyebrow">
                    PERSONAL INFORMATION
                  </span>

                  <h2>
                    Profile details
                  </h2>

                  <p>
                    Keep your personal information
                    up to date for a smoother banking
                    experience.
                  </p>
                </div>

                <button
                  type="button"
                  className="settings-edit-button"
                  onClick={() =>
                    setShowEditProfile(
                      true
                    )
                  }
                >
                  <Pencil size={14} />

                  Edit profile
                </button>
              </div>

              <section className="settings-card profile-card">
                <div className="profile-card-header">
                  <div className="large-settings-avatar">
                    {profile.firstName
                      .charAt(0)
                      .toUpperCase()}
                    {profile.lastName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <span className="section-eyebrow">
                      ACCOUNT HOLDER
                    </span>

                    <h3>
                      {profile.firstName}{" "}
                      {profile.lastName}
                    </h3>

                    <p>
                      Personal Banking · Customer
                    </p>
                  </div>

                  <span className="profile-verified">
                    <CheckCircle2
                      size={14}
                    />

                    Verified
                  </span>
                </div>

                <div className="profile-information-grid">
                  <div>
                    <span>
                      FIRST NAME
                    </span>

                    <strong>
                      {profile.firstName}
                    </strong>
                  </div>

                  <div>
                    <span>
                      LAST NAME
                    </span>

                    <strong>
                      {profile.lastName}
                    </strong>
                  </div>

                  <div>
                    <span>
                      EMAIL ADDRESS
                    </span>

                    <strong>
                      <Mail size={14} />

                      {profile.email}
                    </strong>
                  </div>

                  <div>
                    <span>
                      MOBILE NUMBER
                    </span>

                    <strong>
                      <Phone size={14} />

                      {profile.phone}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="settings-card contact-settings-card">
                <div className="settings-card-heading">
                  <div className="settings-card-heading-icon">
                    <Smartphone
                      size={17}
                    />
                  </div>

                  <div>
                    <h3>
                      Contact information
                    </h3>

                    <p>
                      Your verified contact details
                      are used for account alerts and
                      authentication.
                    </p>
                  </div>
                </div>

                <div className="verified-contact-list">
                  <div className="verified-contact">
                    <Mail size={16} />

                    <div>
                      <span>
                        Email address
                      </span>

                      <strong>
                        {profile.email}
                      </strong>
                    </div>

                    <span className="verified-label">
                      <Check size={12} />

                      Verified
                    </span>
                  </div>

                  <div className="verified-contact">
                    <Phone size={16} />

                    <div>
                      <span>
                        Mobile number
                      </span>

                      <strong>
                        {profile.phone}
                      </strong>
                    </div>

                    <span className="verified-label">
                      <Check size={12} />

                      Verified
                    </span>
                  </div>
                </div>
              </section>

              <section className="settings-card account-preferences-card">
                <div className="settings-card-heading">
                  <div className="settings-card-heading-icon">
                    <WalletCards
                      size={17}
                    />
                  </div>

                  <div>
                    <h3>
                      Banking profile
                    </h3>

                    <p>
                      Information about your
                      NovaBank relationship.
                    </p>
                  </div>
                </div>

                <div className="banking-profile-grid">
                  <div>
                    <span>
                      CUSTOMER TYPE
                    </span>

                    <strong>
                      Personal Banking
                    </strong>
                  </div>

                  <div>
                    <span>
                      CUSTOMER SINCE
                    </span>

                    <strong>
                      September 2024
                    </strong>
                  </div>

                  <div>
                    <span>
                      ACCOUNT STATUS
                    </span>

                    <strong className="active-account-status">
                      <CheckCircle2
                        size={14}
                      />

                      Active
                    </strong>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ======================================
              SECURITY
          ====================================== */}

          {activeSection ===
            "security" && (
            <div className="settings-section">
              <div className="settings-section-heading">
                <div>
                  <span className="section-eyebrow">
                    SECURITY
                  </span>

                  <h2>
                    Protect your account
                  </h2>

                  <p>
                    Manage authentication and
                    security controls for your
                    banking account.
                  </p>
                </div>
              </div>

              <section className="settings-card security-status-card">
                <div className="security-status-icon">
                  <ShieldCheck
                    size={22}
                  />
                </div>

                <div>
                  <span className="section-eyebrow">
                    SECURITY STATUS
                  </span>

                  <h3>
                    Your account is protected
                  </h3>

                  <p>
                    Your account uses multiple
                    security controls to protect
                    access and transactions.
                  </p>
                </div>

                <span className="security-status-badge">
                  <Check size={12} />

                  Secure
                </span>
              </section>

              <section className="settings-card">
                <div className="settings-card-heading">
                  <div className="settings-card-heading-icon">
                    <Lock size={17} />
                  </div>

                  <div>
                    <h3>
                      Password & login
                    </h3>

                    <p>
                      Update your password and
                      manage your sign-in security.
                    </p>
                  </div>
                </div>

                <div className="password-form">
                  <div className="settings-input-group">
                    <label>
                      Current password
                    </label>

                    <div className="settings-password-input">
                      <KeyRound
                        size={15}
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          password.current
                        }
                        onChange={(
                          event
                        ) =>
                          setPassword(
                            (current) => ({
                              ...current,
                              current:
                                event.target
                                  .value,
                            })
                          )
                        }
                        placeholder="Enter current password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) =>
                              !value
                          )
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff
                            size={15}
                          />
                        ) : (
                          <Eye
                            size={15}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="settings-input-group">
                    <label>
                      New password
                    </label>

                    <div className="settings-password-input">
                      <KeyRound
                        size={15}
                      />

                      <input
                        type="password"
                        value={
                          password.newPassword
                        }
                        onChange={(
                          event
                        ) =>
                          setPassword(
                            (current) => ({
                              ...current,
                              newPassword:
                                event.target
                                  .value,
                            })
                          )
                        }
                        placeholder="Create a new password"
                      />
                    </div>
                  </div>

                  <div className="settings-input-group">
                    <label>
                      Confirm new password
                    </label>

                    <div className="settings-password-input">
                      <KeyRound
                        size={15}
                      />

                      <input
                        type="password"
                        value={
                          password.confirm
                        }
                        onChange={(
                          event
                        ) =>
                          setPassword(
                            (current) => ({
                              ...current,
                              confirm:
                                event.target
                                  .value,
                            })
                          )
                        }
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="settings-primary-button"
                    onClick={
                      handlePasswordUpdate
                    }
                  >
                    Update password

                    <ChevronRight
                      size={14}
                    />
                  </button>
                </div>
              </section>

              <section className="settings-card">
                <div className="settings-card-heading">
                  <div className="settings-card-heading-icon">
                    <Fingerprint
                      size={17}
                    />
                  </div>

                  <div>
                    <h3>
                      Biometric login
                    </h3>

                    <p>
                      Use fingerprint or face
                      authentication for faster
                      secure login.
                    </p>
                  </div>

                  {renderToggle(
                    biometricEnabled,
                    handleBiometricToggle,
                    "Toggle biometric login"
                  )}
                </div>

                <div className="security-device-row">
                  <div className="security-device-icon">
                    <Fingerprint
                      size={18}
                    />
                  </div>

                  <div>
                    <strong>
                      Biometric authentication
                    </strong>

                    <span>
                      {biometricEnabled
                        ? "Enabled on this device"
                        : "Currently disabled"}
                    </span>
                  </div>

                  <span
                    className={
                      biometricEnabled
                        ? "device-enabled"
                        : "device-disabled"
                    }
                  >
                    {biometricEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>
              </section>

              <section className="settings-card login-activity-card">
                <div className="settings-card-heading">
                  <div className="settings-card-heading-icon">
                    <Smartphone
                      size={17}
                    />
                  </div>

                  <div>
                    <h3>
                      Recent login activity
                    </h3>

                    <p>
                      Review devices that recently
                      accessed your account.
                    </p>
                  </div>
                </div>

                <div className="login-device-list">
                  <div className="login-device">
                    <div className="login-device-icon">
                      <Smartphone
                        size={17}
                      />
                    </div>

                    <div>
                      <strong>
                        Windows · Chrome
                      </strong>

                      <span>
                        Bengaluru, India ·
                        Just now
                      </span>
                    </div>

                    <span className="current-device">
                      Current device
                    </span>
                  </div>

                  <div className="login-device">
                    <div className="login-device-icon">
                      <Smartphone
                        size={17}
                      />
                    </div>

                    <div>
                      <strong>
                        Android device
                      </strong>

                      <span>
                        Bengaluru, India ·
                        Yesterday
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeviceSignOut(
                          "Android device"
                        )
                      }
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ======================================
              NOTIFICATIONS
          ====================================== */}

          {activeSection ===
            "notifications" && (
            <div className="settings-section">
              <div className="settings-section-heading">
                <div>
                  <span className="section-eyebrow">
                    NOTIFICATIONS
                  </span>

                  <h2>
                    Stay informed
                  </h2>

                  <p>
                    Choose which alerts and
                    notifications you want to
                    receive.
                  </p>
                </div>
              </div>

              <section className="settings-card notification-card">
                <div className="settings-card-heading">
                  <div className="settings-card-heading-icon">
                    <Bell size={17} />
                  </div>

                  <div>
                    <h3>
                      Notification preferences
                    </h3>

                    <p>
                      Control alerts for your
                      banking activity.
                    </p>
                  </div>
                </div>

                <div className="settings-option-list">
                  <SettingRow
                    icon={WalletCards}
                    title="Transaction alerts"
                    description="Get notified whenever money is credited or debited."
                    enabled={
                      notifications.transactions
                    }
                    onClick={() =>
                      handleNotificationChange(
                        "transactions"
                      )
                    }
                  />

                  <SettingRow
                    icon={CheckCircle2}
                    title="Payment confirmations"
                    description="Receive confirmations for successful payments."
                    enabled={
                      notifications.payments
                    }
                    onClick={() =>
                      handleNotificationChange(
                        "payments"
                      )
                    }
                  />

                  <SettingRow
                    icon={ShieldCheck}
                    title="Security alerts"
                    description="Important alerts about account and login activity."
                    enabled={
                      notifications.security
                    }
                    onClick={() =>
                      handleNotificationChange(
                        "security"
                      )
                    }
                  />

                  <SettingRow
                    icon={Bell}
                    title="Offers & updates"
                    description="Receive relevant banking offers and product updates."
                    enabled={
                      notifications.offers
                    }
                    onClick={() =>
                      handleNotificationChange(
                        "offers"
                      )
                    }
                  />
                </div>
              </section>

              <section className="settings-card notification-method-card">
                <div className="settings-card-heading">
                  <div className="settings-card-heading-icon">
                    <Mail size={17} />
                  </div>

                  <div>
                    <h3>
                      Notification channels
                    </h3>

                    <p>
                      Your important banking alerts
                      can be delivered through these
                      channels.
                    </p>
                  </div>
                </div>

                <div className="notification-channel-list">
                  <div>
                    <Mail size={16} />

                    <span>
                      <strong>
                        Email notifications
                      </strong>

                      <small>
                        {profile.email}
                      </small>
                    </span>

                    <span className="channel-active">
                      Active
                    </span>
                  </div>

                  <div>
                    <Smartphone
                      size={16}
                    />

                    <span>
                      <strong>
                        Push notifications
                      </strong>

                      <small>
                        This device
                      </small>
                    </span>

                    <span className="channel-active">
                      Active
                    </span>
                  </div>

                  <div>
                    <Phone size={16} />

                    <span>
                      <strong>
                        SMS notifications
                      </strong>

                      <small>
                        {profile.phone}
                      </small>
                    </span>

                    <span className="channel-active">
                      Active
                    </span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ======================================
              PREFERENCES
          ====================================== */}

          {activeSection ===
            "preferences" && (
            <div className="settings-section">
              <div className="settings-section-heading">
                <div>
                  <span className="section-eyebrow">
                    PREFERENCES
                  </span>

                  <h2>
                    Personalize your experience
                  </h2>

                  <p>
                    Customize how NovaBank looks
                    and behaves for you.
                  </p>
                </div>
              </div>

              <section className="settings-card preferences-card">
                <div className="settings-card-heading">
                  <div className="settings-card-heading-icon">
                    <Globe size={17} />
                  </div>

                  <div>
                    <h3>
                      General preferences
                    </h3>

                    <p>
                      Choose your preferred language,
                      currency and experience.
                    </p>
                  </div>
                </div>

                <div className="preference-select-list">
                  <PreferenceRow
                    title="Language"
                    description="Choose your preferred language."
                    value={
                      preferences.language
                    }
                    onClick={() =>
                      openPreference(
                        "language"
                      )
                    }
                  />

                  <PreferenceRow
                    title="Currency"
                    description="Default currency for your account."
                    value={
                      preferences.currency
                    }
                    onClick={() =>
                      openPreference(
                        "currency"
                      )
                    }
                  />

                  <PreferenceRow
                    title="Date format"
                    description="How dates appear in the app."
                    value={
                      preferences.dateFormat
                    }
                    onClick={() =>
                      openPreference(
                        "dateFormat"
                      )
                    }
                  />
                </div>
              </section>

              <section className="settings-card appearance-card">
                <div className="settings-card-heading">
                  <div className="settings-card-heading-icon">
                    {darkMode ? (
                      <Moon size={17} />
                    ) : (
                      <Sun size={17} />
                    )}
                  </div>

                  <div>
                    <h3>
                      Appearance
                    </h3>

                    <p>
                      Choose the visual appearance
                      of your banking dashboard.
                    </p>
                  </div>

                  {renderToggle(
                    darkMode,
                    () =>
                      handleDarkModeToggle(
                        !darkMode
                      ),
                    "Toggle dark mode"
                  )}
                </div>

                <div className="appearance-options">
                  <button
                    type="button"
                    className={
                      !darkMode
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      handleDarkModeToggle(
                        false
                      )
                    }
                  >
                    <div className="light-preview">
                      <Sun size={17} />
                    </div>

                    <span>
                      <strong>
                        Light
                      </strong>

                      <small>
                        Clean & bright
                      </small>
                    </span>

                    {!darkMode && (
                      <Check size={15} />
                    )}
                  </button>

                  <button
                    type="button"
                    className={
                      darkMode
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      handleDarkModeToggle(
                        true
                      )
                    }
                  >
                    <div className="dark-preview">
                      <Moon size={17} />
                    </div>

                    <span>
                      <strong>
                        Dark
                      </strong>

                      <small>
                        Easy on the eyes
                      </small>
                    </span>

                    {darkMode && (
                      <Check size={15} />
                    )}
                  </button>
                </div>
              </section>

              <section className="settings-card privacy-card">
                <div className="settings-card-heading">
                  <div className="settings-card-heading-icon">
                    <Eye size={17} />
                  </div>

                  <div>
                    <h3>
                      Privacy controls
                    </h3>

                    <p>
                      Manage how your financial
                      information is displayed.
                    </p>
                  </div>
                </div>

                <div className="privacy-option">
                  <div>
                    <strong>
                      Hide balances by default
                    </strong>

                    <small>
                      Keep account balances hidden
                      when opening the dashboard.
                    </small>
                  </div>

                  {renderToggle(
                    balanceHidden,
                    handleBalancePrivacy,
                    "Hide balances by default"
                  )}
                </div>
              </section>
            </div>
          )}

          {/* ======================================
              LOGOUT
          ====================================== */}

          <section className="settings-card logout-card">
            <div className="logout-icon">
              <LogOut size={17} />
            </div>

            <div>
              <strong>
                Sign out of NovaBank
              </strong>

              <span>
                End your current secure banking
                session on this device.
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowLogoutModal(
                  true
                )
              }
            >
              Sign out

              <ChevronRight
                size={14}
              />
            </button>
          </section>
        </main>
      </div>

      {/* ==========================================
          EDIT PROFILE MODAL
      ========================================== */}

      {showEditProfile && (
        <div
          className="settings-modal-overlay"
          onClick={() =>
            setShowEditProfile(
              false
            )
          }
        >
          <div
            className="settings-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
            aria-label="Edit profile"
          >
            <div className="settings-modal-header">
              <div>
                <span className="section-eyebrow">
                  PROFILE
                </span>

                <h2>
                  Edit profile
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowEditProfile(
                    false
                  )
                }
                aria-label="Close profile editor"
              >
                <X size={17} />
              </button>
            </div>

            <div className="edit-profile-form">
              <div className="settings-input-row">
                <div className="settings-input-group">
                  <label>
                    First name
                  </label>

                  <input
                    type="text"
                    value={
                      profile.firstName
                    }
                    onChange={(event) =>
                      setProfile(
                        (current) => ({
                          ...current,
                          firstName:
                            event.target
                              .value,
                        })
                      )
                    }
                  />
                </div>

                <div className="settings-input-group">
                  <label>
                    Last name
                  </label>

                  <input
                    type="text"
                    value={
                      profile.lastName
                    }
                    onChange={(event) =>
                      setProfile(
                        (current) => ({
                          ...current,
                          lastName:
                            event.target
                              .value,
                        })
                      )
                    }
                  />
                </div>
              </div>

              <div className="settings-input-group">
                <label>
                  Email address
                </label>

                <div className="settings-modal-input">
                  <Mail size={15} />

                  <input
                    type="email"
                    value={
                      profile.email
                    }
                    onChange={(event) =>
                      setProfile(
                        (current) => ({
                          ...current,
                          email:
                            event.target
                              .value,
                        })
                      )
                    }
                  />
                </div>
              </div>

              <div className="settings-input-group">
                <label>
                  Mobile number
                </label>

                <div className="settings-modal-input">
                  <Phone size={15} />

                  <input
                    type="tel"
                    value={
                      profile.phone
                    }
                    onChange={(event) =>
                      setProfile(
                        (current) => ({
                          ...current,
                          phone:
                            event.target
                              .value,
                        })
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="settings-modal-actions">
              <button
                type="button"
                onClick={() =>
                  setShowEditProfile(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary"
                onClick={
                  handleProfileSave
                }
              >
                Save changes

                <Check size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          LOGOUT MODAL
      ========================================== */}

      {showLogoutModal && (
        <div
          className="settings-modal-overlay"
          onClick={() =>
            setShowLogoutModal(
              false
            )
          }
        >
          <div
            className="logout-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
            aria-label="Confirm sign out"
          >
            <div className="logout-modal-icon">
              <LogOut size={21} />
            </div>

            <h2>
              Sign out?
            </h2>

            <p>
              Are you sure you want to end your
              secure NovaBank session?
            </p>

            <div className="logout-modal-actions">
              <button
                type="button"
                onClick={() =>
                  setShowLogoutModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="danger"
                onClick={
                  handleLogout
                }
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          PREFERENCE MODAL
      ========================================== */}

      {selectionModal && (
        <div
          className="settings-modal-overlay"
          onClick={() =>
            setSelectionModal(null)
          }
        >
          <div
            className="settings-modal preference-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
          >
            <div className="settings-modal-header">
              <div>
                <span className="section-eyebrow">
                  PREFERENCES
                </span>

                <h2>
                  Choose{" "}
                  {typeLabel(
                    selectionModal
                  )}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectionModal(
                    null
                  )
                }
                aria-label="Close preference selector"
              >
                <X size={17} />
              </button>
            </div>

            <div className="preference-modal-options">
              {preferenceOptions[
                selectionModal
              ].map((option) => {
                const selected =
                  preferences[
                    selectionModal
                  ] === option;

                return (
                  <button
                    type="button"
                    key={option}
                    className={
                      selected
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      selectPreference(
                        selectionModal,
                        option
                      )
                    }
                  >
                    <span>
                      {option}
                    </span>

                    {selected && (
                      <Check
                        size={15}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/*
 * ------------------------------------------------
 * SETTING ROW
 * ------------------------------------------------
 */

function SettingRow({
  icon: Icon,
  title,
  description,
  enabled,
  onClick,
}) {
  return (
    <div className="settings-option-row">
      <div className="settings-option-icon">
        <Icon size={16} />
      </div>

      <div className="settings-option-copy">
        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>
      </div>

      <button
        type="button"
        className={`settings-toggle ${
          enabled ? "active" : ""
        }`}
        onClick={onClick}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
      >
        <span />
      </button>
    </div>
  );
}

/*
 * ------------------------------------------------
 * PREFERENCE ROW
 * ------------------------------------------------
 */

function PreferenceRow({
  title,
  description,
  value,
  onClick,
}) {
  return (
    <div className="preference-select-row">
      <div>
        <strong>
          {title}
        </strong>

        <small>
          {description}
        </small>
      </div>

      <button
        type="button"
        onClick={onClick}
      >
        {value}

        <ChevronRight size={14} />
      </button>
    </div>
  );
}

export default Settings;