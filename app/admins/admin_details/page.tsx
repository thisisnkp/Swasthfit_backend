"use client";
import React from "react";
import { FiUploadCloud } from "react-icons/fi";

// Define props expected by this component
interface AdminDetailsFormProps {
  formData: {
    gym_name: string;
    owner_name: string;
    mobile_number: string;
    alternate_mobile_number: string;
    email: string;
    gym_logo: string;
    profile_image: string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "gym_logo" | "profile_image"
  ) => void;
  isEditing: boolean;
}

const AdminDetailsForm: React.FC<AdminDetailsFormProps> = ({
  formData,
  onInputChange,
  onFileChange,
  isEditing,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="gym_name" className="block font-bold text-sm mb-1">
            Gym Name
          </label>
          <input
            type="text"
            id="gym_name"
            name="gym_name"
            value={formData.gym_name}
            onChange={onInputChange}
            readOnly={!isEditing}
            placeholder="Enter Gym Name"
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>

        <div>
          <label htmlFor="owner_name" className="block text-sm font-bold mb-1">
            Owner Name
          </label>
          <input
            type="text"
            id="owner_name"
            name="owner_name"
            value={formData.owner_name}
            onChange={onInputChange}
            readOnly={!isEditing}
            placeholder="Enter Owner Name"
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>

        <div>
          <label
            htmlFor="mobile_number"
            className="block text-sm font-bold mb-1">
            Mobile Number
          </label>
          <input
            type="text"
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={onInputChange}
            readOnly={!isEditing}
            placeholder="Enter Mobile Number"
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>

        <div>
          <label
            htmlFor="alternate_mobile_number"
            className="block text-sm font-bold mb-1">
            Alternate Mobile Number
          </label>
          <input
            type="text"
            id="alternate_mobile_number"
            name="alternate_mobile_number"
            value={formData.alternate_mobile_number}
            onChange={onInputChange}
            readOnly={!isEditing}
            placeholder="Enter Alternate Number"
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-1">
            Email ID
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            readOnly={!isEditing}
            placeholder="Enter Email"
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold mb-2">
            Upload Gym Logo
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={formData.gym_logo} // Use state value for image source
              alt="Gym Logo"
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/swasthfit-gym/images/gym_logo.png";
              }} // Fallback image
            />
            <div
              className={`flex-1 border border-dashed border-gray-300 rounded-lg py-6 text-center ${
                isEditing ? "cursor-pointer" : "cursor-default"
              }`}>
              <div
                className={`text-xl flex items-center justify-center mb-4 ${
                  isEditing ? "" : "pointer-events-none"
                }`}
                onClick={() =>
                  isEditing && document.getElementById("gymLogoInput")?.click()
                }>
                <FiUploadCloud />
              </div>
              <div
                className={`font-medium mb-1 ${
                  isEditing ? "text-indigo-600" : "text-gray-500"
                }`}>
                {isEditing ? "Click to upload" : "Read Only"}
              </div>
              <div className="text-sm text-gray-400">SVG, PNG, JPG or GIF</div>
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, "gym_logo")}
                  className="hidden"
                  id="gymLogoInput"
                  disabled={!isEditing}
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            Upload Profile Image
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={formData.profile_image} // Use state value for image source
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/swasthfit-gym/images/profiles.png";
              }} // Fallback image
            />
            <div
              className={`flex-1 border border-dashed border-gray-300 rounded-lg py-6 text-center ${
                isEditing ? "cursor-pointer" : "cursor-default"
              }`}>
              <div
                className={`text-xl flex items-center justify-center mb-4 ${
                  isEditing ? "" : "pointer-events-none"
                }`}
                onClick={() =>
                  isEditing &&
                  document.getElementById("profileImageInput")?.click()
                }>
                <FiUploadCloud />
              </div>
              <div
                className={`font-medium mb-1 ${
                  isEditing ? "text-indigo-600" : "text-gray-500"
                }`}>
                {isEditing ? "Click to upload" : "Read Only"}
              </div>
              <div className="text-sm text-gray-400">SVG, PNG, JPG or GIF</div>
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, "profile_image")}
                  className="hidden"
                  id="profileImageInput"
                  disabled={!isEditing}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailsForm;
