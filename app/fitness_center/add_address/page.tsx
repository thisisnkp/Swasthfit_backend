"use client";

import { useState } from "react";
import FitnessHeader from "../fitness_header/page";
import { useRouter } from "next/navigation";

const InputField = ({
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
  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
    <label className="text-sm font-medium text-gray-700 sm:w-1/4 text-left">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full sm:w-3/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default function FitnessLocation() {
  const [formData, setFormData] = useState({
    address1: "abc@gmail.com",
    address2: "98765432190",
    locality: "98765432190",
    landmark: "98765432190",
    city: "98765432190",
    state: "98765432190",
    country: "98765432190",
    pincode: "98765432190",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  const handleSaveAndNext = () => {
    router.push("/fitness_center/timings_holiday"); // Change this to your actual route
  };

  const handleBack = () => {
    router.push("/fitness_center/basicInformation");
  };

  const [step, setStep] = useState(2);

  return (
    <div>
      {/* <FitnessHeader /> */}
      <FitnessHeader currentStep={step} onStepChange={setStep} />
      <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
        <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-6 md:p-10 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Find and locate YD Fitness Club
              </h3>
              <p className="text-sm text-gray-500">
                Enter your gym’s name below and select your gym from the
                autocomplete...
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-3 sm:mt-0">
              Change Location
            </button>
          </div>

          <div className="w-full h-60  rounded-lg mb-6">
            <img
              src=""
              alt="Map Location"
              className="w-full h-60 rounded-lg mb-6"
            />
          </div>

          <div className="border-b border-gray-300 my-6"></div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Fitness Center Address
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Enter your gym’s name below and select your gym from the
            autocomplete...
          </p>
          <div className="grid grid-cols-1 gap-4">
            <InputField
              label="Address Line 1 *"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
            />
            <InputField
              label="Address Line 2 *"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
            />
            <InputField
              label="Locality *"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
            />
            <InputField
              label="Landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
            <InputField
              label="City *"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <InputField
              label="State *"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
            <InputField
              label="Country *"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
            <InputField
              label="Pincode *"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 space-x-3 mt-6">
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
