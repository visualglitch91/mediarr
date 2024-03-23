import React from "react";
import { createRoot } from "react-dom/client";
import { fetchSettings } from "$lib/settings.ts";
import App from "./App.tsx";

fetchSettings().then(() => {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
