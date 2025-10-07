import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CollectionProvider } from "./context/CollectionContext";
import ScrollToTop from "./components/ScrollToTop";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/mp2-aariga2">
      <CollectionProvider>
      <ScrollToTop />
        <App />
      </CollectionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
