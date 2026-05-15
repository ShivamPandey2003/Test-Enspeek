import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App, { queryClient } from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { QueryClientProvider } from "@tanstack/react-query";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
    </QueryClientProvider>
  </StrictMode>
);
