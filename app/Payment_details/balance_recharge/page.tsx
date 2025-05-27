"use client";
import React, { useState } from "react";
import Image from "next/image"; // Optional: for Next.js Image optimization

const smsPlans = [
  {
    title: "STARTER SMS PLAN",
    subtitle: "Suitable for small gyms with more than 50+ clients",
    price: "$300",
    duration: "/ month",
    features: ["1000 SMS", "Automatic SMS", "Bulk SMS"],
  },
  {
    title: "PREMIUM SMS PLAN",
    subtitle: "Suitable for gyms with more than 200+ clients",
    price: "$1000",
    duration: "/ month",
    features: ["5000 SMS", "Automatic SMS", "Bulk SMS"],
  },
  {
    title: "ENTERPRISE SMS PLAN",
    subtitle: "Suitable for Multi-Branch Gyms with more than 500+ clients",
    price: "$2000",
    duration: "/ month",
    features: ["10,000 SMS", "Automatic SMS", "Bulk SMS"],
  },
  {
    title: "BUSINESS SMS PLAN",
    subtitle: "Suitable for Multi-Branch Gyms with more than 500+ clients",
    price: "$3600",
    duration: "/ month",
    features: ["20,000 SMS", "Automatic SMS", "Bulk SMS"],
  },
];

export default function BalanceRecharge() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Balance & Recharge
          </h2>
          <p className="text-sm mt-1 text-gray-600">
            Last Recharge Details – Aug 28, 2024 (Rs. 200)
          </p>
          <p className="text-sm mt-1 text-gray-600">
            SMS Pack Details – (₹ 0.25 Per SMS) Valid Till Aug 31, 2024
          </p>
        </div>
        <div className="bg-[#5955ff] text-white px-4 py-2 rounded-md shadow-md text-sm">
          Balance: 1857.00
        </div>
      </div>

      {/* Pricing Plans Section */}
      <div className="bg-white mt-8 py-8 px-4 md:px-8 lg:px-16 rounded-lg shadow-md">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Pricing Plans
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Only pay for what you use. Don’t get stalled by contracts, capacity
            planning, and price modeling. Choose the best plan to fit your
            needs.
          </p>
        </div>

        <div className="max-w-7xl mx-auto w-full p-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {smsPlans.map((plan, index) => (
              <div
                key={index}
                className="bg-white hover:bg-[#eef1ff] transition-all border border-gray-200 px-4 py-8 rounded-2xl shadow-sm text-center flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.subtitle}</p>
                  <div className="text-3xl font-bold text-[#5955ff]">
                    {plan.price}
                    <span className="text-base font-medium">
                      {plan.duration}
                    </span>
                  </div>
                </div>
                <ul className="my-6 space-y-2 text-sm text-gray-600 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>• {feature}</li>
                  ))}
                </ul>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-auto bg-[#5955ff] text-white text-sm font-medium py-2 px-2 rounded-lg hover:bg-[#4b49e2] transition">
                  Subscribe Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl px-4 py-8  text-center relative shadow-lg max-w-md mx-auto w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold">
              ×
            </button>
            <img
              src="/swasthfit-gym/images/support.png"
              alt="support"
              className="mx-auto w-26 h-26"
              loading="lazy"
            />
            <p className="text-gray-800 font-medium text-md mb-1">
              To buy this pack please contact
            </p>
            <p className="text-gray-800 font-medium text-md mb-1">
              GYM representative
            </p>
            <p className="text-gray-600 mt-2 text-md">+91 9876543210</p>
          </div>
        </div>
      )}
    </div>
  );
}
