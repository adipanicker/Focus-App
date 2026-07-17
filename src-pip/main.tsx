import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PipTimer from "./PipTimer";
import "../src/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PipTimer />
  </StrictMode>,
);
