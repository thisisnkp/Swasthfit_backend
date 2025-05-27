"use client";

import { useState } from "react";
import FitnessHeader from "../fitness_header/page";
import { useRouter } from "next/navigation";

type DaysOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

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

export default function TimingsH() {
  const [workingDays, setWorkingDays] = useState<Record<DaysOfWeek, boolean>>({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });

  const [sessions, setSessions] = useState([
    { startTime: "13:00", endTime: "13:00", gender: "Unisex" },
    { startTime: "13:00", endTime: "13:00", gender: "Unisex" },
    { startTime: "13:00", endTime: "13:00", gender: "Unisex" },
  ]);

  // Toggle working days
  const toggleWorkingDay = (day: DaysOfWeek) => {
    setWorkingDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  // Update session times
  const updateSessionTime = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSessions((prev) =>
      prev.map((session, i) =>
        i === index ? { ...session, [field]: value } : session
      )
    );
  };

  // Update gender selection
  const updateSessionGender = (index: number, gender: string) => {
    setSessions((prev) =>
      prev.map((session, i) => (i === index ? { ...session, gender } : session))
    );
  };

  const router = useRouter();
  const handleSaveAndNext = () => {
    router.push("/fitness_center/billing_information"); // Change this to your actual route
  };

  const handleBack = () => {
    router.push("/fitness_center/add_address");
  };

  const [step, setStep] = useState(3);

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* <FitnessHeader /> */}
      <FitnessHeader currentStep={step} onStepChange={setStep} />
      <div className="flex justify-center p-4">
        <div className="max-w-5xl w-full bg-white shadow-md rounded-lg p-6 md:p-10">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            Open Days
          </h2>
          <p className="text-sm md:text-md mb-4">
            Select the days your fitness center is open.
          </p>

          <div className="flex flex-wrap gap-4 mb-6 border-b-2 border-gray-300 pb-4">
            <h5 className="text-md font-semibold">Working Days* :</h5>
            {Object.keys(workingDays).map((day) => (
              <label
                key={day}
                className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={workingDays[day as DaysOfWeek]}
                  onChange={() => toggleWorkingDay(day as DaysOfWeek)}
                  className="w-5 h-5 border-2 rounded-md appearance-none
                   flex items-center justify-center checked:border-blue-600
                   checked:bg-transparent checked:before:content-['✔']
                   checked:before:text-blue-600 checked:before:text-sm 
                   checked:before:flex checked:before:items-center checked:before:justify-center"
                />
                <span className="text-gray-700 text-sm md:text-md">{day}</span>
              </label>
            ))}
          </div>

          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            Timings
          </h2>
          <p className="text-sm md:text-md mb-4">
            Add your fitness center timings below.
          </p>

          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                {/* Start Time Input */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
                  <label className="text-sm md:text-md text-gray-700">
                    Session {index + 1}
                  </label>
                  <input
                    type="time"
                    value={session.startTime}
                    onChange={(e) =>
                      updateSessionTime(index, "startTime", e.target.value)
                    }
                    className="border-2 p-2 rounded-md w-full md:w-48 lg:w-52
                             text-gray-500 text-[16px] bg-white 
                             focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* End Time Input */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
                  <label className="text-sm md:text-md text-gray-700">To</label>
                  <input
                    type="time"
                    value={session.endTime}
                    onChange={(e) =>
                      updateSessionTime(index, "endTime", e.target.value)
                    }
                    className="border-2 p-2 rounded-md w-full md:w-48 lg:w-52
                             text-gray-500 text-[16px] bg-white 
                             focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender Selection */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {["Unisex", "Men", "Women"].map((gender) => (
                    <label key={gender} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`gender-${index}`}
                        checked={session.gender === gender}
                        onChange={() => updateSessionGender(index, gender)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 text-sm md:text-md">
                        {gender}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons Section */}
          <div className="flex flex-wrap justify-end gap-3 mt-10">
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
