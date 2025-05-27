"use client";

import { useState } from "react";
import FitnessHeader from "../fitness_header/page";
import { useRouter } from "next/navigation";

const categories = [
  "Weight Training",
  "Full Body Stretching",
  "Functional Training",
  "Cross-fit",
  "Roller Skating",
  "Badminton",
  "Boot Camp",
  "Beautician And Mehendi",
  "Art and Craft",
  "Strength Training",
  "Zulfi Spinning",
  "Cupping Therapy",
  "Cursive Writing",
  "Step Workout",
  "Interval Training",
  "Strong By Zumba",
  "Agility Workout",
  "Kids Activity",
  "Physiotherapy",
  "Antigravity Yoga",
  "Spa",
];

const facilities = [
  "Locker",
  "Changing Room",
  "Valet Parking",
  "Steam",
  "Cardio Training area",
  "Transformation Plans",
  "Wi-fi",
  "Natural Bodybuilding",
  "Injury Rehab",
  "Separate weight loss",
  "Nutrition Counselling",
  "Fat Loss",
];

// **Reusable Components**
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-b border-gray-300 pb-5">
    <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
    <div className="mt-1 space-y-3">{children}</div>
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
  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
    <label className="md:w-1/3 text-gray-600 text-sm font-semibold">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full md:w-[300px] p-3 border rounded-lg"
    />
  </div>
);

const CheckBoxSection = ({
  title,
  description,
  options,
}: {
  title: string;
  description: string;
  options: string[];
}) => {
  return (
    <div className="mt-5 border-b-2 border-gray-300 pb-5">
      <h2 className="text-lg font-semibold text-gray-600 ">{title}</h2>
      <p className="text-gray-600 mb-4 mt-1">{description}</p>

      {/* ✅ Improved Responsive Grid */}
      <div className="grid grid-cols-1   sm:grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-5 h-5 border-2 rounded-md appearance-none
                           flex items-center justify-center checked:border-blue-600
                           checked:bg-transparent checked:before:content-['✔']
                           checked:before:text-blue-600 checked:before:text-sm 
                           checked:before:flex checked:before:items-center checked:before:justify-center"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

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

export default function BasicInformation({ currentStep = 1 }) {
  interface FormData {
    name: string;
    tagline: string;
    description: string;
    categories: string[];
    capacity: string;
    email: string;
    mobile: string;
    landline: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "Faizan Fitness Center",
    tagline: "Healthy Life, Happy Life",
    description:
      " Faizan Fitness Center is a gym that provides a variety of fitness services to its customers.",
    categories: [
      "Weight Training",
      "Full Body Stretching",
      "Functional Training",
      "Cross-fit",
      "Roller Skating",
      "Badminton",
      "Boot Camp",
      "Beautician And Mehendi",
      "Art and Craft",
      "Strength Training",
      "Zulfi Spinning",
      "Cupping Therapy",
      "Cursive Writing",
      "Step Workout",
      "Interval Training",
      "Strong By Zumba",
      "Agility Workout",
      "Kids Activity",
      "Physiotherapy",
      "Antigravity Yoga",
      "Spa",
    ],
    capacity: " 50",
    email: " faizan@123",
    mobile: " 98765432190",
    landline: " 98765432190",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  const handleSaveAndNext = () => {
    router.push("/fitness_center/add_address");
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const [step, setStep] = useState(1);

  return (
    <div className="bg-slate-100 p-5">
      <FitnessHeader currentStep={step} onStepChange={setStep} />

      <div className="max-w-6xl mx-auto bg-white shadow-md mt-8 rounded-lg p-6 md:p-12">
        <div className="space-y-4">
          <Section title="">
            <Input
              label="Fitness Center Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label="Tag Line"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
            />
            <Input
              label="Fitness Center Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Section>

          {/* Fitness Center Category */}
          <CheckBoxSection
            title="Fitness center category"
            description="Select the categories your fitness center operates in."
            options={categories}
          />

          {/* Fitness Center Facilities */}
          <CheckBoxSection
            title="Fitness center facilities"
            description="Select the facilities your fitness center provides to your customers."
            options={facilities}
          />

          {/* Fitness Center Capacity */}
          <Section title="Fitness center Capacity">
            <p className="text-gray-600 text-sm">
              How many members does your gym accommodate at a time? Providing an
              accurate number helps customers understand traffic analysis.
            </p>
            <Input
              label="Fitness Center Capacity *"
              value={formData.capacity}
              name="capacity"
              onChange={handleChange}
            />
          </Section>

          {/* Contact Information */}
          <Section title="Contact Information">
            <p className="text-gray-600 text-sm border-none">
              Contact information will be displayed on your app.
              YourDigitalLift.com will also use these details for communication.
            </p>
            <Input
              label="Fitness Center Email *"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Mobile Number *"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
            <Input
              label="Toll Free/Landline Number"
              name="landline"
              value={formData.landline}
              onChange={handleChange}
            />
          </Section>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 space-x-3 mt-6">
          <Button label="Cancel" onClick={handleCancel} variant="gray" />
          <Button label="Save" variant="blue" />
          <Button
            label="Save & Next"
            onClick={handleSaveAndNext}
            variant="blue"
          />
        </div>
      </div>
    </div>
  );
}
