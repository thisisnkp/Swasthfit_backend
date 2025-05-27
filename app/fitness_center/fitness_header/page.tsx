"use client";

import { CheckCircle } from "lucide-react";

const steps = [
  { id: 1, title: "Basic Information" },
  { id: 2, title: "Add Address" },
  { id: 3, title: "Timings & Holiday" },
  { id: 4, title: "Billing Information" },
];

interface FitnessHeaderProps {
  currentStep: number;
  onStepChange?: (step: number) => void;
}

export default function FitnessHeader({
  currentStep,
  onStepChange,
}: FitnessHeaderProps) {
  const handleStepClick = (stepId: number) => {
    if (onStepChange) {
      onStepChange(stepId);
    }
  };

  return (
    <div className="bg-slate-100 p-5">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-black text-center">
        Fitness Center (Step {currentStep})
      </h2>

      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-10">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center w-14 sm:w-24 relative cursor-pointer"
            onClick={() => handleStepClick(step.id)}>
            {index !== 0 && (
              <div className="absolute left-[-50%] top-1/2 w-6 sm:w-14 h-[2px] sm:h-[4px] bg-gray-300 transform -translate-y-1/2"></div>
            )}

            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-14 sm:h-14 rounded-full border-4 transition-all duration-300 ease-in-out ${
                currentStep > step.id
                  ? "bg-blue-600 border-blue-600 text-white"
                  : currentStep === step.id
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-400 text-gray-500"
              }`}>
              {currentStep > step.id ? (
                <CheckCircle size={18} className="sm:size-28" />
              ) : (
                <span className="text-black text-xs sm:text-xl font-bold">
                  0{step.id}
                </span>
              )}
            </div>

            {/* Step Title */}
            <span className="mt-1 text-black text-center text-[10px] sm:text-sm md:text-base font-medium">
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
