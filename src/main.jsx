import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { DateFilterProvider } from "./context/DateFilterContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <DateFilterProvider>
        <App />
      </DateFilterProvider>
    </BrowserRouter>
  </StrictMode>
);
