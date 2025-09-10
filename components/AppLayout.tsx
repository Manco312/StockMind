"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type UserType = "distributor" | "salesperson" | "inventory_manager";

interface AppLayoutProps {
  userType: UserType;
  userName: string;
  children: React.ReactNode;
  activeSection?: string;
  title?: string;
}

export default function AppLayout({
  userType,
  userName,
  children,
  activeSection = "inicio",
  title,
}: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 bg-slate-800 text-white p-2 rounded-md shadow-lg"
        title="Abrir menú"
        aria-label="Abrir menú de navegación"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        userType={userType}
        activeSection={activeSection}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header userType={userType} userName={userName} />

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-auto pt-14 lg:pt-6">
          {title && (
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {title}
              </h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
