"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface MembershipPlan {
  id: number;
  name: string;
  membership_type: string;
  price: number;
  gym_id: number;
}

const GymRegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedMembership, setSelectedMembership] = useState("");
  const [selectedMembershipType, setSelectedMembershipType] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);

  // Fetch membership plans from the API
  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        const token = localStorage.getItem("gymAuthToken"); // Retrieve the token from local storage
        if (!token) {
          console.error("Token not found in local storage.");
          alert("You are not authorized. Please log in.");
          return;
        }

        const response = await axios.get(
          "http://localhost:4001/membership/site/apis/getMembershipPlans",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key":
                "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
            },
          }
        );

        if (response.data && response.data.data) {
          setMembershipPlans(response.data.data);
          setSelectedMembership(response.data.data[0]?.name || "");
          setSelectedMembershipType(
            response.data.data[0]?.membership_type || ""
          );
        }
      } catch (error) {
        console.error("Error fetching membership plans:", error);

        if (axios.isAxiosError(error) && error.response?.status === 403) {
          alert("You do not have permission to access this resource.");
        }
      }
    };

    fetchMembershipPlans();
  }, []);

  // Update total amount when membership or type changes
  useEffect(() => {
    const selectedPlan = membershipPlans.find(
      (plan) =>
        plan.name === selectedMembership &&
        plan.membership_type === selectedMembershipType
    );
    setTotalAmount(selectedPlan ? selectedPlan.price : 0);
  }, [selectedMembership, selectedMembershipType, membershipPlans]);

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPlan = membershipPlans.find(
      (plan) =>
        plan.name === selectedMembership &&
        plan.membership_type === selectedMembershipType
    );

    if (!selectedPlan) {
      alert("Invalid membership selection.");
      return;
    }

    const userData = {
      username,
      email,
      phone,
      membershipName: selectedMembership,
      membershipType: selectedMembershipType,
      totalAmount,
      membership_id: selectedPlan.id, // Include membership_id
      gym_id: selectedPlan.gym_id, // Include gym_id
    };

    try {
      const token = localStorage.getItem("gymAuthToken"); // Retrieve the token from local storage
      if (!token) {
        console.error("Token not found in local storage.");
        alert("You are not authorized. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:4001/gym/site/apis/registerGymUser",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key":
              "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
          },
        }
      );

      alert("User registered successfully!");
      console.log("API Response:", response.data);

      // Reset form (optional)
      setUsername("");
      setEmail("");
      setPhone("");
      setSelectedMembership(membershipPlans[0]?.name || "");
      setSelectedMembershipType(membershipPlans[0]?.membership_type || "");
    } catch (error) {
      console.error("Error registering user:", error);

      if (axios.isAxiosError(error) && error.response) {
        console.error("Error Response Data:", error.response.data);
        alert(
          error.response.data.message ||
            "Failed to register user. Please try again."
        );
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Gym Registration
      </h2>
      <form onSubmit={handleSaveUser} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="membershipName"
            className="block text-sm font-medium text-gray-700">
            Membership Name
          </label>
          <select
            id="membershipName"
            value={selectedMembership}
            onChange={(e) => setSelectedMembership(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            {membershipPlans.map((plan) => (
              <option key={plan.id} value={plan.name}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="membershipType"
            className="block text-sm font-medium text-gray-700">
            Membership Type
          </label>
          <select
            id="membershipType"
            value={selectedMembershipType}
            onChange={(e) => setSelectedMembershipType(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            {membershipPlans
              .filter((plan) => plan.name === selectedMembership)
              .map((plan) => (
                <option key={plan.id} value={plan.membership_type}>
                  {plan.membership_type}
                </option>
              ))}
          </select>
        </div>

        <div className="text-lg font-semibold text-gray-800">
          Total Amount: ₹{totalAmount.toFixed(2)}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Save User
        </button>
      </form>
    </div>
  );
};

export default GymRegisterForm;
