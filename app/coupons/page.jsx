"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import Card from "../../components/Card";
import CreateCouponForm from "./create_coupon/page";

const CouponsPage = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [expiredCoupons, setExpiredCoupons] = useState([]);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem("gymAuthToken");

        const res = await fetch(
          "http://localhost:4001/gym/site/apis/couponsData",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setActiveCoupons(data.data.active);
          setExpiredCoupons(data.data.expired);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (formData) => {
    try {
      const token = localStorage.getItem("gymAuthToken");

      const res = await fetch(
        "http://localhost:4001/gym/site/apis/createCoupons",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Coupon created successfully!");
        setActiveTab("Active"); // Switch to the "Active" tab
        router.push("/coupons"); // Redirect to /coupons
      } else if (data.error && data.error.code === "ER_DUP_ENTRY") {
        alert("Coupon code already exists. Please use a different code.");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      alert("An error occurred while creating the coupon. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("Active")}
          className={`py-2 px-4 rounded-md ${
            activeTab === "Active"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}>
          Active Coupons
        </button>
        <button
          onClick={() => setActiveTab("History")}
          className={`py-2 px-4 rounded-md ${
            activeTab === "History"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}>
          Coupons History
        </button>
        <button
          onClick={() => setActiveTab("Create")}
          className={`py-2 px-4 rounded-md ${
            activeTab === "Create"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}>
          Create Coupons
        </button>
      </div>

      {activeTab === "Active" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-5xl">
          {activeCoupons.map((coupon) => (
            <Card
              key={coupon.id}
              status="Active"
              couponName={coupon.name}
              discount={`${coupon.discount}%`}
              totalUsed={coupon.used_count}
              remaining={
                coupon.apply_quantity_type === "unlimited"
                  ? "Unlimited"
                  : coupon.remaining_quantity
              }
              validUntil={coupon.valid_to}
            />
          ))}
        </div>
      )}

      {activeTab === "History" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-5xl">
          {expiredCoupons.map((coupon) => (
            <Card
              key={coupon.id}
              status="Expired"
              couponName={coupon.name}
              discount={`${coupon.discount}%`}
              totalUsed={coupon.used_count}
              remaining={
                coupon.apply_quantity_type === "unlimited"
                  ? "Unlimited"
                  : coupon.remaining_quantity
              }
              validUntil={coupon.valid_to}
            />
          ))}
        </div>
      )}

      {activeTab === "Create" && (
        <div className="mx-auto max-w-3xl">
          <CreateCouponForm onCreate={handleCreateCoupon} />
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
