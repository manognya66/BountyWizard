"use client";
import React from "react";
import Sidebar from "../widgets/Sidebar";

export default function WizardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-3 p-4 md:p-6">
              <Sidebar />
            </div>
            <div className="col-span-12 md:col-span-9 p-4 md:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
