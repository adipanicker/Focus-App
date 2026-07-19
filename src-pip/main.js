import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PipTimer from "./PipTimer";
import "../src/styles/index.css";
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(PipTimer, {}) }));
