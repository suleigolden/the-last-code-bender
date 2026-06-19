import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// OAuth redirects may produce //auth/callback when FRONTEND_URL has a trailing slash.
const { pathname, search, hash } = window.location;
const normalizedPath = pathname.replace(/\/{2,}/g, "/");
if (normalizedPath !== pathname) {
  window.history.replaceState(null, "", normalizedPath + search + hash);
}

createRoot(document.getElementById("root")!).render(<App />);
