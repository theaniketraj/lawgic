import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const themes = {
  dark: {
    name: "dark",
    colors: {
      // Background gradients - Deep Navy Legal Theme
      primaryBg:
        "linear-gradient(135deg, #0a192f 0%, #112240 50%, #0a192f 100%)",
      welcomeBg:
        "radial-gradient(ellipse at center, rgba(251, 140, 0, 0.05) 0%, rgba(10, 25, 47, 0.5) 40%, transparent 70%), linear-gradient(135deg, #0a192f 0%, #112240 50%, #0a192f 100%)",
      background: "#0a192f",
      gradient: "linear-gradient(45deg, #fb8c00, #ffd700)",

      // Text colors
      text: "#e6f1ff",
      textPrimary: "#e6f1ff",
      textSecondary: "rgba(230, 241, 255, 0.7)",
      textMuted: "rgba(230, 241, 255, 0.5)",
      textFaded: "rgba(230, 241, 255, 0.3)",

      // Accent colors - Gold/Amber for Premium Feel
      primary: "#fb8c00", // Amber 600
      primaryLight: "rgba(251, 140, 0, 0.1)",
      accent: "linear-gradient(45deg, #fb8c00, #ffa726)",
      accentSolid: "#fb8c00",
      accentSecondary: "#ffa726",
      accentHover: "linear-gradient(45deg, #f57c00, #ff9800)",

      // Message colors
      userMessage: "linear-gradient(135deg, #1a237e 0%, #283593 100%)", // Navy Blue
      userMessageBorder: "rgba(251, 140, 0, 0.3)",
      botMessage: "rgba(255, 255, 255, 0.05)",
      botMessageBorder: "rgba(255, 255, 255, 0.1)",

      // UI elements
      sidebar: "rgba(10, 25, 47, 0.8)",
      sidebarBg: "rgba(10, 25, 47, 0.8)",
      sidebarNavBg: "rgba(255, 255, 255, 0.05)",
      chatBg: "rgba(0, 0, 0, 0.2)",
      searchBarBg: "rgba(10, 25, 47, 0.6)",
      buttonBg: "rgba(255, 255, 255, 0.1)",
      buttonHover: "rgba(255, 255, 255, 0.2)",
      hover: "rgba(255, 255, 255, 0.05)",
      border: "rgba(230, 241, 255, 0.1)",
      borderHover: "rgba(251, 140, 0, 0.3)",

      // Status colors
      success: "#00e676",
      danger: "#ff1744",
      dangerHover: "#d50000",
      error: "#ff1744",
      warning: "#ffab00",
      info: "#2979ff",

      // Skeleton loader colors
      skeletonBase: "rgba(255, 255, 255, 0.05)",
      skeletonHighlight: "rgba(255, 255, 255, 0.1)",

      // Toast colors
      toastBg: "rgba(10, 25, 47, 0.95)",
      toastBorder: "rgba(251, 140, 0, 0.3)",
      toastText: "#e6f1ff",
    },
  },
  light: {
    name: "light",
    colors: {
      // Background gradients - Clean Legal Document Look
      primaryBg:
        "linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)",
      welcomeBg:
        "radial-gradient(ellipse at center, rgba(26, 35, 126, 0.05) 0%, rgba(26, 35, 126, 0.02) 40%, transparent 70%), linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)",
      background: "#ffffff",
      gradient: "linear-gradient(45deg, #1a237e, #283593)",

      // Text colors
      text: "#1a237e", // Navy Blue Text
      textPrimary: "#1a237e",
      textSecondary: "#303f9f",
      textMuted: "#5c6bc0",
      textFaded: "#9fa8da",

      // Accent colors - Navy Blue Dominant with Gold Highlights
      primary: "#1a237e",
      primaryLight: "rgba(26, 35, 126, 0.1)",
      accent: "linear-gradient(45deg, #1a237e, #283593)",
      accentSolid: "#1a237e",
      accentSecondary: "#fb8c00", // Gold accent
      accentHover: "linear-gradient(45deg, #283593, #303f9f)",

      // Message colors
      userMessage: "linear-gradient(135deg, #1a237e 0%, #303f9f 100%)",
      userMessageBorder: "rgba(26, 35, 126, 0.1)",
      botMessage: "#ffffff",
      botMessageBorder: "rgba(0, 0, 0, 0.1)",

      // UI elements
      sidebar: "rgba(255, 255, 255, 0.95)",
      sidebarBg: "rgba(255, 255, 255, 0.95)",
      sidebarNavBg: "rgba(26, 35, 126, 0.05)",
      chatBg: "rgba(255, 255, 255, 0.5)",
      searchBarBg: "rgba(255, 255, 255, 0.9)",
      buttonBg: "rgba(26, 35, 126, 0.08)",
      buttonHover: "rgba(26, 35, 126, 0.15)",
      hover: "rgba(26, 35, 126, 0.05)",
      border: "rgba(26, 35, 126, 0.1)",
      borderHover: "rgba(26, 35, 126, 0.3)",

      // Status colors
      success: "#2e7d32",
      danger: "#c62828",
      dangerHover: "#b71c1c",
      error: "#c62828",
      warning: "#f9a825",
      info: "#1565c0",

      // Skeleton loader colors
      skeletonBase: "rgba(0, 0, 0, 0.05)",
      skeletonHighlight: "rgba(0, 0, 0, 0.1)",

      // Toast colors
      toastBg: "rgba(255, 255, 255, 0.95)",
      toastBorder: "rgba(26, 35, 126, 0.2)",
      toastText: "#1a237e",
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("dark");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("nyayaTheme");
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("nyayaTheme", currentTheme);
    // Apply theme to document root for CSS custom properties
    const root = document.documentElement;
    root.setAttribute("data-theme", currentTheme);
    const theme = themes[currentTheme];

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(
        `--color-${key.replaceAll(/([A-Z])/g, "-$1").toLowerCase()}`,
        value
      );
    });
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      currentTheme,
      theme: themes[currentTheme],
      toggleTheme,
      setTheme: setCurrentTheme,
      themes,
    }),
    [currentTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
