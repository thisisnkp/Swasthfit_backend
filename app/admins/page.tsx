"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./admin_header/page";
import AdminDetailsForm from "./admin_details/page";
import AdminKycForm from "./admin_kyc/page";
import AmenitiesForm from "./gym_amenties/page";

interface FormData {
  gym_name: string;
  owner_name: string;
  mobile_number: string;
  alternate_mobile_number: string;
  email: string;
  gym_logo: string;
  profile_image: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  cancel_cheque: string;
  pan_name: string;
  pan_number: string;
  gstNumber: string;
  msmNumber: string;
  workout_type: string;
  closing_date: string;
  facilities: string[];
  about_us: string;
}

const steps = [
  { id: 1, title: "Personal Details" },
  { id: 2, title: "KYC Details" },
  { id: 3, title: "Amenities" },
];

const MultiStepAdminForm: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    gym_name: "",
    owner_name: "",
    mobile_number: "",
    alternate_mobile_number: "",
    email: "",
    gym_logo: "/swasthfit-gym/images/gym_logo.png",
    profile_image: "/swasthfit-gym/images/profiles.png",
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    cancel_cheque: "",
    pan_name: "",
    pan_number: "",
    gstNumber: "",
    msmNumber: "",
    workout_type: "",
    closing_date: "1st Saturday of every month",
    facilities: ["AC", "Water Color", "Fire Support", "Security Camera"],
    about_us: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof FormData
  ) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFormData((prev) => ({ ...prev, [fieldName]: selectedFile.name }));
    }
  };

  const handleRemoveFacility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  const handleAddFacility = (newFacility: string) => {
    if (
      newFacility.trim() &&
      !formData.facilities.includes(newFacility.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()],
      }));
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      // Get token from localStorage
      const token = localStorage.getItem("gymAuthToken");
      // Get selected gym ID from localStorage
      const selectedGymStr = localStorage.getItem("selectedGym");
      // Ensure gymId is a string, default to empty string if null
      const gymId = selectedGymStr || "";

      // Submit data based on current step
      if (currentStep === 1) {
        // Admin details - we'll keep this for the final submission
        setCurrentStep(currentStep + 1);
        setIsEditing(false);
      } else if (currentStep === 2) {
        // KYC details submission
        try {
          const kycPayload = {
            gym_id: gymId,
            bank_name: formData.bank_name,
            account_holder_name: formData.account_holder_name,
            account_number: formData.account_number,
            ifsc_code: formData.ifsc_code,
            cancel_cheque: formData.cancel_cheque || null,
            pan_name: formData.pan_name,
            pan_number: formData.pan_number,
            gst_number: formData.gstNumber || null,
            msm_number: formData.msmNumber || null,
          };

          console.log("KYC Details Payload:", kycPayload);

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/admin/site/apis/createKyc`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
                "x-api-key":
                  "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
              },
              body: JSON.stringify(kycPayload),
            }
          );

          const data = await response.json();

          if (response.ok) {
            alert("KYC details submitted successfully!");
            setCurrentStep(currentStep + 1);
            setIsEditing(false);
          } else {
            const errorMessage =
              data.errors?.[0]?.displayMessage ||
              data.message ||
              "Something went wrong!";
            alert(`Error: ${errorMessage}`);
          }
        } catch (error) {
          alert("Failed to submit KYC details due to a network error.");
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof FormData)[] = [
      "gym_name",
      "owner_name",
      "mobile_number",
      "email",
      "bank_name",
      "account_holder_name",
      "account_number",
      "ifsc_code",
      "pan_name",
      "pan_number",
      "workout_type",
      "closing_date",
      "about_us",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem("gymAuthToken");
    console.log("Bearer token from localStorage:", token);

    // Get selected gym ID from localStorage
    const selectedGymStr = localStorage.getItem("selectedGym");
    console.log("Selected Gym ID from localStorage:", selectedGymStr);

    // Ensure gymId is a string, default to empty string if null
    const gymId = selectedGymStr || "";

    // First, submit the amenities data
    try {
      const amenitiesPayload = {
        gym_id: gymId,
        workout_type: formData.workout_type,
        closing_date: formData.closing_date,
        facilities: formData.facilities,
        about_us: formData.about_us,
      };

      console.log("Amenities Payload:", amenitiesPayload);

      const amenitiesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/site/apis/createAmenities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-key":
              "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
          },
          body: JSON.stringify(amenitiesPayload),
        }
      );

      const amenitiesData = await amenitiesResponse.json();

      if (!amenitiesResponse.ok) {
        const errorMessage =
          amenitiesData.errors?.[0]?.displayMessage ||
          amenitiesData.message ||
          "Something went wrong!";
        alert(`Error submitting amenities: ${errorMessage}`);
        return;
      }

      const adminPayload = {
        gym_id: gymId,
        gym_name: formData.gym_name,
        owner_name: formData.owner_name,
        mobile_number: parseInt(formData.mobile_number),
        alternate_mobile_number: formData.alternate_mobile_number
          ? parseInt(formData.alternate_mobile_number)
          : null,
        email: formData.email,
        gym_logo: formData.gym_logo,
        profile_image: formData.profile_image,
        bank_name: formData.bank_name,
        account_holder_name: formData.account_holder_name,
        account_number: formData.account_number,
        ifsc_code: formData.ifsc_code,
        cancel_cheque: formData.cancel_cheque || null,
        pan_name: formData.pan_name,
        pan_number: formData.pan_number,
        gst_number: formData.gstNumber || null,
        msm_number: formData.msmNumber || null,
        workout_type: formData.workout_type,
        closing_date: formData.closing_date,
        facilities: formData.facilities,
        about_us: formData.about_us,
      };

      console.log("Admin Details Payload:", adminPayload);

      const adminResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/site/apis/createAdminDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-key":
              "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
          },
          body: JSON.stringify(adminPayload),
        }
      );

      const adminData = await adminResponse.json();

      if (adminResponse.ok) {
        alert("All details submitted successfully!");
        router.push("/dashboard");
      } else {
        const errorMessage =
          adminData.errors?.[0]?.displayMessage ||
          adminData.message ||
          "Something went wrong!";
        alert(`Error submitting admin details: ${errorMessage}`);
      }
    } catch (error) {
      alert("Failed to submit form due to a network error.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AdminDetailsForm
            formData={formData}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            isEditing={isEditing}
          />
        );
      case 2:
        return (
          <AdminKycForm
            kycData={formData}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            isEditing={isEditing}
          />
        );
      case 3:
        return (
          <AmenitiesForm
            amenitiesData={formData}
            onInputChange={handleInputChange}
            onRemoveFacility={handleRemoveFacility}
            onAddFacility={handleAddFacility}
            isEditing={isEditing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <AdminHeader currentStep={currentStep} />

      <div className="container mx-auto p-4 flex-grow">
        <div className="text-right mb-4">
          {currentStep <= steps.length && (
            <button
              className={`font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline ${
                isEditing
                  ? "bg-green-500 hover:bg-green-700 text-white"
                  : "bg-blue-500 hover:bg-blue-700 text-white"
              }`}
              onClick={handleEditClick}>
              {isEditing ? "Save" : "Edit"}
            </button>
          )}
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <div className="rounded-xl border-2 border-gray-300 p-6 bg-white">
            {renderStepContent()}
          </div>
        </div>
      </div>

      <footer className="bg-white p-4 shadow-md mt-auto">
        <div className="container mx-auto flex justify-between">
          <button
            id="backButton"
            className={`font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline ${
              currentStep === 1
                ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                : "bg-gray-400 hover:bg-gray-500 text-gray-700"
            }`}
            onClick={handleBack}
            disabled={currentStep === 1 || isEditing}>
            Back
          </button>
          {currentStep < steps.length ? (
            <button
              id="nextButton"
              className={`font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline ${
                isEditing
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700 text-white"
              }`}
              onClick={handleNext}
              disabled={isEditing}>
              Next
            </button>
          ) : (
            <button
              id="submitButton"
              className={`font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline ${
                isEditing
                  ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-700 text-white"
              }`}
              onClick={handleSubmit}
              disabled={isEditing}>
              Submit
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default MultiStepAdminForm;
