import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { ThemeProvider } from "./context/ThemeContext";
import { BankingProvider } from "./context/BankingContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ThemeProvider>
      <BankingProvider>
        <App />
      </BankingProvider>
    </ThemeProvider>
  </React.StrictMode>
);