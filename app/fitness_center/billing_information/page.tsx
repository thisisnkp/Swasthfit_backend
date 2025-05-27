"use client";

import { useState } from "react";
import FitnessHeader from "../fitness_header/page";
import { useRouter } from "next/navigation";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="pb-5">
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    <p className="text-sm text-gray-500">Enter your {title.toLowerCase()}.</p>
    <div className="mt-4 space-y-3">{children}</div>
  </div>
);

const Input = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
    <label className="md:w-1/3 text-gray-700 text-sm font-medium">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full md:w-[300px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Button = ({
  label,
  variant,
  onClick,
}: {
  label: string;
  variant: "gray" | "blue";
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg ${
      variant === "gray"
        ? "bg-gray-200 text-gray-500"
        : "bg-blue-600 text-white"
    }`}>
    {label}
  </button>
);

export default function BillingInformation() {
  const [formData, setFormData] = useState({
    fitnessCenterName: "963854848444",
    companyName: "963854848444",
    fitnessCenterAddress: "963854848444",
    ownerName: "Abc",
    ownerEmail: "abc@gmail.com",
    ownerMobile: "963854848444",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  const handleSaveAndNext = () => {
    router.push("/dashboard"); // Change this to your actual route
  };

  const handleBack = () => {
    router.push("/fitness_center/timings_holiday");
  };

  const [step, setStep] = useState(4);

  return (
    <div>
      <FitnessHeader currentStep={step} onStepChange={setStep} />
      {/* <FitnessHeader></FitnessHeader> */}
      {/* <FitnessHeader currentStep={1} /> */}
      <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 md:p-10">
          <Section title="Billing Information">
            <Input
              label="Fitness Center Name"
              name="fitnessCenterName"
              value={formData.fitnessCenterName}
              onChange={handleChange}
            />
            <Input
              label="Company Name *"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
            <Input
              label="Fitness Center Address"
              name="fitnessCenterAddress"
              value={formData.fitnessCenterAddress}
              onChange={handleChange}
            />
          </Section>

          <div className="border-b border-gray-300 my-6"></div>

          <Section title="Owner Information">
            <Input
              label="Owner Name *"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
            />
            <Input
              label="Owner Email *"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
            />
            <Input
              label="Owner Mobile Number"
              name="ownerMobile"
              value={formData.ownerMobile}
              onChange={handleChange}
            />
          </Section>
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
            <Button label="Back" onClick={handleBack} variant="gray" />
            <Button label="Save" variant="blue" />
            <Button
              label="Save & Next"
              onClick={handleSaveAndNext}
              variant="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
