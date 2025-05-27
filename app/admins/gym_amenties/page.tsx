"use client";
import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface AmenitiesFormProps {
  amenitiesData: {
    workout_type: string;
    closing_date: string;
    facilities: string[];
    about_us: string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onRemoveFacility: (index: number) => void;
  onAddFacility: (newFacility: string) => void;
  isEditing: boolean;
}

const AmenitiesForm: React.FC<AmenitiesFormProps> = ({
  amenitiesData,
  onInputChange,
  onRemoveFacility,
  onAddFacility,
  isEditing,
}) => {
  const [newFacility, setNewFacility] = useState("");

  const handleAddClick = () => {
    onAddFacility(newFacility);
    setNewFacility("");
  };

  const handleNewFacilityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewFacility(e.target.value);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Amenities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="workout_type" className="block font-bold mb-2">
            Add Workout Type
          </label>
          <div className="relative">
            <select
              id="workout_type"
              name="workout_type"
              value={amenitiesData.workout_type}
              onChange={onInputChange}
              disabled={!isEditing}
              className={`w-full p-3 border border-gray-300 rounded-lg appearance-none ${
                !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
              }`}>
              <option value="">Select your workout type</option>
              <option value="Cardio">Cardio</option>
              <option value="Strength">Strength</option>
              <option value="CrossFit">CrossFit</option>
              <option value="Yoga">Yoga</option>
            </select>
            <ChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />{" "}
            {/* Keep icon, but make it non-interactive */}
          </div>
        </div>

        <div>
          <label htmlFor="closing_date" className="block font-bold mb-2">
            Closing Date
          </label>
          <div className="relative">
            <select
              id="closing_date"
              name="closing_date"
              value={amenitiesData.closing_date}
              onChange={onInputChange}
              disabled={!isEditing} // Use disabled for select
              className={`w-full p-3 border border-gray-300 rounded-lg appearance-none ${
                !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
              }`}>
              <option value="1st Saturday of every month">
                1st Saturday of every month
              </option>
              <option value="Last Sunday of every month">
                Last Sunday of every month
              </option>
              <option value="National Holidays">National Holidays</option>
            </select>
            <ChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />{" "}
            {/* Keep icon, but make it non-interactive */}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2">Facilities</label>
        {isEditing && (
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newFacility}
              onChange={handleNewFacilityInputChange}
              placeholder="Add new facility"
              className="flex-grow p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Add
            </button>
          </div>
        )}
        <div
          className={`flex flex-wrap gap-2 mt-2 border border-gray-300 rounded-lg p-3 ${
            !isEditing ? "bg-gray-100" : "bg-white"
          }`}>
          {amenitiesData.facilities.map((facility, index) => (
            <span
              key={index}
              className="flex items-center bg-green-500 text-white px-3 py-1 rounded-md text-sm">
              {facility}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => onRemoveFacility(index)}
                  className="ml-2">
                  <X size={16} />
                </button>
              )}
            </span>
          ))}
          {!isEditing && amenitiesData.facilities.length === 0 && (
            <span className="text-gray-500">No facilities added.</span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="about_us" className="block font-bold mb-2">
          About Us
        </label>
        <textarea
          id="about_us"
          name="about_us"
          maxLength={275}
          placeholder="Type here............"
          value={amenitiesData.about_us}
          onChange={onInputChange}
          readOnly={!isEditing}
          className={`w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
          }`}
        />
        {isEditing && (
          <p className="text-sm text-gray-500 mt-1">
            {275 - amenitiesData.about_us.length} characters left
          </p>
        )}
      </div>
    </div>
  );
};

export default AmenitiesForm;
