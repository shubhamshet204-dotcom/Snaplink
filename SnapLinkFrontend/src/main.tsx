import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "glass-panel border border-slate-800 text-white text-sm font-semibold rounded-xl px-4 py-3",
          duration: 3500,
          style: {
            background: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#fff"
          }
        }}
      />
      <App />
    </AuthProvider>
  </StrictMode>
);
