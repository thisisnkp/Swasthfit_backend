"use client"; // This is a client component

import { useEffect, useState } from "react";

// Define the available tabs
type Tab = "personal" | "kyc" | "amenities";

// Define the component
const GymProfilePage: React.FC = () => {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  // State to manage if the current tab is in edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for fetched data
  const [fetchedData, setFetchedData] = useState<any>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("gymAuthToken");

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await fetch(
          "http://localhost:4001/admin/site/apis/getAdminDetailsById",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key":
                "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Fetched Data:", result.data);
          setFetchedData(result.data); // Store the fetched data in state
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle tab button clicks
  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setIsEditing(false); // Reset edit mode when switching tabs
  };

  // Handle field changes
  const handleFieldChange = (field: string, value: any) => {
    setFetchedData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle save button click
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("gymAuthToken");

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await fetch(
        "http://localhost:4001/admin/site/apis/updateAdminDetails",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(fetchedData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Updated Data:", result);
        alert("Data updated successfully!");
        setIsEditing(false); // Exit edit mode after saving
      } else {
        console.error("Failed to update data:", response.statusText);
        alert("Failed to update data.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("An error occurred while updating data.");
    }
  };

  // Render the content dynamically based on the fetched data
  const renderTabContent = () => {
    if (!fetchedData) {
      return <p>Loading...</p>; // Show a loading message while data is being fetched
    }

    if (activeTab === "personal") {
      return (
        <div
          id="personal"
          className="tab-content bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gym Name
              </label>
              <input
                type="text"
                value={fetchedData.gym_name || ""}
                onChange={(e) => handleFieldChange("gym_name", e.target.value)}
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Owner Name
              </label>
              <input
                type="text"
                value={fetchedData.owner_name || ""}
                onChange={(e) =>
                  handleFieldChange("owner_name", e.target.value)
                }
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="text"
                value={fetchedData.mobile_number || ""}
                onChange={(e) =>
                  handleFieldChange("mobile_number", e.target.value)
                }
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alternate Mobile Number
              </label>
              <input
                type="text"
                value={fetchedData.alternate_mobile_number || ""}
                onChange={(e) =>
                  handleFieldChange("alternate_mobile_number", e.target.value)
                }
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={fetchedData.email || ""}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}
              />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "kyc") {
      return (
        <div id="kyc" className="tab-content bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">KYC Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                value={fetchedData.bank_name || ""}
                onChange={(e) => handleFieldChange("bank_name", e.target.value)}
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Holder Name
              </label>
              <input
                type="text"
                value={fetchedData.account_holder_name || ""}
                onChange={(e) =>
                  handleFieldChange("account_holder_name", e.target.value)
                }
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                value={fetchedData.account_number || ""}
                onChange={(e) =>
                  handleFieldChange("account_number", e.target.value)
                }
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                IFSC Code
              </label>
              <input
                type="text"
                value={fetchedData.ifsc_code || ""}
                onChange={(e) => handleFieldChange("ifsc_code", e.target.value)}
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}
              />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "amenities") {
      return (
        <div
          id="amenities"
          className="tab-content bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Workout Type
              </label>
              <input
                type="text"
                value={fetchedData.workout_type || ""}
                onChange={(e) =>
                  handleFieldChange("workout_type", e.target.value)
                }
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Closing Date
              </label>
              <input
                type="text"
                value={fetchedData.closing_date || ""}
                onChange={(e) =>
                  handleFieldChange("closing_date", e.target.value)
                }
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facilities
              </label>
              <textarea
                value={fetchedData.facilities || ""}
                onChange={(e) =>
                  handleFieldChange("facilities", e.target.value)
                }
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                About Us
              </label>
              <textarea
                value={fetchedData.about_us || ""}
                onChange={(e) => handleFieldChange("about_us", e.target.value)}
                readOnly={!isEditing}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 ${
                  !isEditing ? "bg-gray-100 cursor-default" : ""
                }`}></textarea>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="container mx-auto p-4 flex-grow">
        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-300 mb-6">
          <button
            className={`tab-button px-4 py-2 text-gray-600 hover:text-blue-500 focus:outline-none ${
              activeTab === "personal"
                ? "active border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
            onClick={() => handleTabClick("personal")}>
            Personal Details
          </button>
          <button
            className={`tab-button px-4 py-2 text-gray-600 hover:text-blue-500 focus:outline-none ${
              activeTab === "kyc"
                ? "active border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
            onClick={() => handleTabClick("kyc")}>
            KYC Details
          </button>
          <button
            className={`tab-button px-4 py-2 text-gray-600 hover:text-blue-500 focus:outline-none ${
              activeTab === "amenities"
                ? "active border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
            onClick={() => handleTabClick("amenities")}>
            Amenities
          </button>
        </div>

        {/* Content Sections */}
        {renderTabContent()}

        <div className="mt-6 text-right">
          {/* Edit Button */}
          {!isEditing && (
            <button
              className="edit-button font-bold py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-700 text-white focus:outline-none focus:shadow-outline mr-2"
              onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}

          {/* Save Button */}
          {isEditing && (
            <button
              className="save-button font-bold py-2 px-4 rounded-md bg-green-500 hover:bg-green-700 text-white focus:outline-none focus:shadow-outline"
              onClick={handleSave}>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymProfilePage;
