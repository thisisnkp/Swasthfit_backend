"use client";
import React from "react";
import { CheckCircle } from "lucide-react";

const steps = [
  { id: 1, title: "Personal Details" },
  { id: 2, title: "KYC Details" },
  { id: 3, title: "Amenities" },
];

type Props = {
  currentStep: number;
};

const AdminHeader: React.FC<Props> = ({ currentStep }) => {
  return (
    <div className="bg-slate-100 p-5">
      <h2 className="text-2xl font-bold text-center mb-8">
        Admin Please Fill up Your Details
      </h2>

      <div className="flex justify-center items-center space-x-6">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center space-y-3">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition duration-300 ${
                    isCompleted || isCurrent
                      ? "border-indigo-600 text-indigo-600"
                      : "border-gray-300 text-gray-500"
                  }`}>
                  {isCompleted ? <CheckCircle size={20} /> : `0${step.id}`}
                </div>

                <div
                  className={`text-sm font-medium ${
                    isCompleted || isCurrent
                      ? "text-indigo-600"
                      : "text-gray-500"
                  }`}>
                  {step.title}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-20 transition-all duration-300 ${
                    currentStep > step.id ? "bg-indigo-500" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHeader;
