"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useBounty } from "../../state/BountyContext";
import { validateStep1, validateStep2 } from "../../hooks/useValidation";

export default function Sidebar() {
  const { state } = useBounty();
  const pathname = usePathname();
  const router = useRouter();

  const currentStep = (() => {
    const m = pathname?.match(/step\/(\d+)/);
    return m ? Number(m[1]) : 1;
  })();

  const step1Valid = Object.keys(validateStep1(state.data)).length === 0;
  const step2Valid = Object.keys(validateStep2(state.data)).length === 0;

  const canGoToStep = (target: number) => {
    if (target <= currentStep) return true;
    if (target === 2) return step1Valid;
    if (target === 3) return step1Valid && step2Valid;
    return false;
  };

  // New order: 1 Basics, 2 Backer, 3 Rewards
  const items = [
    { id: 1, label: "Basics", to: "/wizard/step/1" },
    { id: 2, label: "Backer", to: "/wizard/step/2" },
    { id: 3, label: "Rewards", to: "/wizard/step/3" }
  ];

  const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <aside
      className="
        flex flex-col
        w-full md:w-64
        h-auto md:h-full
        bg-white
        border-b md:border-b-0 md:border-r
        p-3 sm:p-4 md:p-6
      "
    >
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-800">
          Create Bounty
        </h3>
        <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
          3 steps to publish your bounty
        </p>
      </div>

      {/* Steps nav */}
      <nav className="flex flex-col gap-2 md:flex-1">
        {items.map((it) => {
          const disabled = !canGoToStep(it.id);
          const active = it.id === currentStep;
          const completed =
            it.id === 1 ? step1Valid : it.id === 2 ? step2Valid : false;

          return (
            <button
              key={it.id}
              onClick={() => !disabled && router.push(it.to)}
              disabled={disabled}
              className={`
                text-left flex items-center gap-3 w-full
                p-2 sm:p-3 rounded-md transition-colors
                ${
                  active
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : "hover:bg-gray-50"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <div
                className={`
                  flex items-center justify-center font-semibold
                  rounded-full
                  w-7 h-7 sm:w-8 sm:h-8
                  ${
                    completed
                      ? "bg-blue-600 text-white"
                      : active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }
                `}
                aria-hidden
              >
                {completed ? <CheckIcon /> : it.id}
              </div>

              <div className="min-w-0">
                <div
                  className={`
                    text-xs sm:text-sm font-medium
                    ${active ? "text-gray-900" : "text-gray-700"}
                  `}
                >
                  {it.label}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400">
                  {completed
                    ? "Completed"
                    : active
                    ? "In progress"
                    : disabled
                    ? "Locked"
                    : "Pending"}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Progress bar */}
      <div className="mt-4 md:mt-6">
        <div className="text-[10px] sm:text-xs text-gray-500 mb-2">
          Progress
        </div>

        <div className="flex gap-2 items-center">
          {items.map((seg) => {
            const filled = seg.id === 1 ? step1Valid : seg.id === 2 ? step2Valid : false;
            const active = currentStep === seg.id;
            return (
              <div
                key={seg.id}
                className={`
                  flex-1 h-1.5 sm:h-2 rounded
                  ${
                    filled
                      ? "bg-blue-600"
                      : active
                      ? "bg-blue-300"
                      : "bg-gray-200"
                  }
                `}
                aria-hidden
              />
            );
          })}
        </div>

        <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-500 flex justify-between">
          <span>Start</span>
          <span>Finish</span>
        </div>
      </div>
    </aside>
  );
}