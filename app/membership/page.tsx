"use client";
import React, { useState, useEffect } from "react";

interface Membership {
  id: number;
  created_by: string;
  type: string;
  gym_id: number;
  name: string;
  features: string;
  description: string;
  membership_type: string;
  price: number;
  duration: number;
  status: string;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
}

interface MembershipFormData {
  type: string;
  name: string;
  features: string;
  description: string;
  membership_type: string;
  price: string;
  duration: string;
  status: string;
}

const MembershipPage = () => {
  const [activeTab, setActiveTab] = useState("Show");
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch memberships from API
  useEffect(() => {
    if (activeTab === "Show") {
      const fetchMemberships = async () => {
        setLoading(true);
        setError("");
        try {
          const token = localStorage.getItem("gymAuthToken");
          if (!token) {
            setError("Authentication token not found");
            return;
          }

          const response = await fetch(
            "http://localhost:4001/membership/site/apis/getMembershipPlans",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "x-api-key":
                  "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
              },
            }
          );

          if (!response.ok) {
            setError(`HTTP error! status: ${response.status}`);
            return;
          }

          const data = await response.json();
          console.log("Raw API Response:", data);

          if (
            data.message === "Membership plans fetched successfully" &&
            Array.isArray(data.data)
          ) {
            setMemberships(data.data);
            console.log("Memberships set:", data.data);
          } else {
            setError(data.message || "Failed to fetch memberships");
            console.error("API Error:", data);
          }
        } catch (error) {
          console.error("Error fetching memberships:", error);
          setError("An error occurred while fetching memberships");
        } finally {
          setLoading(false);
        }
      };

      fetchMemberships();
    }
  }, [activeTab]);

  const handleCreateMembership = async (formData: MembershipFormData) => {
    try {
      const token = localStorage.getItem("gymAuthToken"); // Get bearer token from local storage

      const response = await fetch(
        "http://localhost:4001/membership/site/apis/createMembership-plans",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            "x-api-key":
              "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d", // Add the x-api-key header
          },
          body: JSON.stringify(formData), // Send the form data as JSON
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Membership created successfully!");
        setActiveTab("Show"); // Switch to the "Show" tab
      } else {
        alert("Failed to create membership. Please try again.");
      }
    } catch (error) {
      console.error("Error creating membership:", error);
      alert(
        "An error occurred while creating the membership. Please try again."
      );
    }
  };

  // Add this before the return statement
  console.log("Current memberships state:", memberships);
  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("Show")}
          className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "Show"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform scale-105"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}>
          Show Memberships
        </button>
        <button
          onClick={() => setActiveTab("Create")}
          className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "Create"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform scale-105"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}>
          Create Membership
        </button>
      </div>

      {activeTab === "Show" && (
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-center py-4 bg-red-50 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!loading && !error && memberships.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">
                No membership plans found. Please create some plans.
              </p>
            </div>
          )}

          {memberships.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {memberships.map((membership) => (
                <div
                  key={membership.id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1 capitalize">
                      {membership.name}
                    </h3>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Code: {membership.type}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">
                      ₹{membership.price}
                    </div>
                    <span className="text-gray-500">
                      {membership.duration} days
                    </span>
                  </div>

                  <div className="flex-grow space-y-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Features:
                      </h4>
                      <ul className="space-y-2 text-gray-600">
                        {membership.features
                          .split(",")
                          .map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <span className="mr-2">•</span>
                              {feature.trim()}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="text-sm">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold
                        ${membership.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                        {membership.status}
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold
                    hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200">
                    Buy Membership
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Create" && (
        <div className="mx-auto max-w-3xl">
          <CreateMembershipForm onCreate={handleCreateMembership} />
        </div>
      )}
    </div>
  );
};

const CreateMembershipForm = ({
  onCreate,
}: {
  onCreate: (formData: MembershipFormData) => void;
}) => {
  const [formData, setFormData] = useState<MembershipFormData>({
    type: "",
    name: "silver",
    features: "",
    description: "",
    membership_type: "",
    price: "",
    duration: "",
    status: "active",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData); // Pass the form data to the parent component
  };

  return (
    <form
      className="bg-white shadow-md rounded-lg p-6 space-y-4"
      onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <select
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500">
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Features
        </label>
        <textarea
          name="features"
          value={formData.features}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Membership Type
        </label>
        <input
          type="text"
          name="membership_type"
          value={formData.membership_type}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Duration (in days)
        </label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
        Create Membership
      </button>
    </form>
  );
};

export default MembershipPage;
