"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function StrategyViewPage() {
  // TEMP: demo-only trigger for the error boundary
  if (typeof window !== "undefined" && window.location.hash === "#boom") {
    console.log("Hash trigger detected, throwing error...");
    throw new Error("Demo error for video");
  }

  return <DashboardLayout initialMode="learn" />;
}
