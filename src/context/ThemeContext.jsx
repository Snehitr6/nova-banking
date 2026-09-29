import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(
        "novabank-theme"
      );

      if (savedTheme === "dark") {
        return true;
      }

      if (savedTheme === "light") {
        return false;
      }

      if (
        typeof window !== "undefined" &&
        window.matchMedia
      ) {
        return window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
      }
    } catch (error) {
      console.error(
        "Unable to read saved theme:",
        error
      );
    }

    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (darkMode) {
      root.classList.add("dark");
      body.classList.add("dark");

      root.setAttribute(
        "data-theme",
        "dark"
      );

      try {
        localStorage.setItem(
          "novabank-theme",
          "dark"
        );
      } catch (error) {
        console.error(
          "Unable to save dark theme:",
          error
        );
      }
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");

      root.setAttribute(
        "data-theme",
        "light"
      );

      try {
        localStorage.setItem(
          "novabank-theme",
          "light"
        );
      } catch (error) {
        console.error(
          "Unable to save light theme:",
          error
        );
      }
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((currentMode) => !currentMode);
  };

  const setTheme = (theme) => {
    if (theme === "dark") {
      setDarkMode(true);
      return;
    }

    if (theme === "light") {
      setDarkMode(false);
      return;
    }

    if (theme === "system") {
      try {
        const systemDark =
          window.matchMedia &&
          window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;

        setDarkMode(systemDark);
        localStorage.removeItem(
          "novabank-theme"
        );
      } catch (error) {
        console.error(
          "Unable to detect system theme:",
          error
        );
      }
    }
  };

  const value = {
    darkMode,
    setDarkMode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}

export default ThemeContext;