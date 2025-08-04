"use client";

import { useEffect, useState } from "react";
import DashboardForm from "../components/DashboardForm";
import HistoryList from "../components/HistoryList";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [refresh]);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full min-h-[calc(100vh-64px)] flex flex-col gap-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 drop-shadow-sm leading-tight">
        Personal Expense Tracker
      </h1>
      <DashboardForm onEntryAdded={() => setRefresh((prev) => !prev)} />
      <HistoryList refresh={refresh} />
    </div>
  );
}
