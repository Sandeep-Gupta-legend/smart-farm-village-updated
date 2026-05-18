import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { fetchAPI } from "./utils/fetchAPI.ts";

// Global fetch override to automatically handle API URLs
const originalFetch = window.fetch;
window.fetch = ((input: string | Request, init?: RequestInit) => {
  let url = typeof input === 'string' ? input : input.url;
  
  // If it's a relative API path, use our wrapper
  if (typeof url === 'string' && url.startsWith('/api/')) {
    return fetchAPI(input, init);
  }
  
  // Otherwise use original fetch
  return originalFetch(input, init);
}) as typeof fetch;

createRoot(document.getElementById("root")!).render(<App />);
