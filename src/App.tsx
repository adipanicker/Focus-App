import { useState } from "react";
import NavBar from "../src/components/layout/Navbar";
import HomePage from "@/pages/HomePage";
import StatsPage from "@/pages/StatsPage";
import SettingsPage from "@/pages/SettingsPage";

type Page = "home" | "stats" | "settings";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="min-h-screen bg-neutral-900 p-6 flex flex-col gap-6">
      <NavBar active={page} onNavigate={setPage} />
      {page === "home" && <HomePage />}
      {page === "stats" && <StatsPage />}
      {page === "settings" && <SettingsPage />}
    </div>
  );
}
