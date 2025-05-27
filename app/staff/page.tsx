"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const StaffList = () => {
  const router = useRouter();
  interface StaffMember {
    id: number;
    name: string;
    phone?: string;
    mobile?: string;
    email?: string;
    birthday?: string;
    location?: string;
  }

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  interface MenuItem {
    name: string;
    href: string;
    subMenu: { name: string; href: string }[];
  }

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(
          `${process.env.BASE_URL}/gym/site/apis/getAllGymStaff`
        );
        const result = await response.json();

        const submenu = result.data.map((staff: StaffMember) => ({
          name: staff.name,
          href: `/staff/staffDetails/${staff.id}`,
        }));
        setMenuItems([
          {
            name: "Staff List",
            href: "/staff",
            subMenu: submenu,
          },
        ]);

        console.log("API Response:", result.data); // Log the API response

        if (response.ok) {
          setStaffMembers(result.data);
        } else {
          console.error("Failed to fetch staff:", result.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchStaff();
  }, []);

  const goToDetails = (id: number) => {
    router.push(`/staff/staffDetails/${id}`);
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Staff Members List</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {staffMembers.map((staff, index) => (
          <div
            key={index}
            className="cursor-pointer bg-white rounded-lg shadow py-10 px-4 w-full max-w-xs transition hover:shadow-lg hover:bg-slate-50"
            onClick={() => goToDetails(staff.id)}>
            <div className="flex flex-col items-center">
              <img
                src="/swasthfit-gym/images/profile2.png"
                alt="Staff Profile"
                className="w-24 h-24 rounded-full mb-4 border-2 border-gray-300 object-cover"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold">{staff.name}</h3>
            </div>
            <div className="grid grid-cols-[110px_auto] gap-x-1 gap-y-2 text-sm mt-2">
              <span className="font-medium">Mobile:</span>{" "}
              <span className="truncate">{staff.phone || staff.mobile}</span>
              <span className="font-medium">Email:</span>{" "}
              <span className="truncate">{staff.email}</span>
              <span className="font-medium">Birthday:</span>{" "}
              <span>{staff.birthday || "N/A"}</span>
              <span className="font-medium">Location:</span>{" "}
              <span className="truncate">{staff.location || "Unknown"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffList;
