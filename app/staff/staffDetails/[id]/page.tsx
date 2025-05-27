"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { HiChevronUp } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi";
import Modal from "../../Modal";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon, PencilIcon } from "@heroicons/react/24/solid";

const StaffDetails = () => {
  const [attendanceData] = useState([
    {
      checkedIn: "Dec 26, 2024 7:59 PM",
      checkedOut: "Dec 26, 2024 7:59 PM",
      center: "Gym center",
    },
    {
      checkedIn: "Dec 26, 2024 8:30 PM",
      checkedOut: "Dec 26, 2024 9:00 PM",
      center: "Gym center",
    },
    {
      checkedIn: "Dec 26, 2024 7:59 PM",
      checkedOut: "Dec 26, 2024 7:59 PM",
      center: "Gym center",
    },
    {
      checkedIn: "Dec 26, 2024 8:30 PM",
      checkedOut: "Dec 26, 2024 9:00 PM",
      center: "Gym center",
    },
    {
      checkedIn: "Dec 26, 2024 7:59 PM",
      checkedOut: "Dec 26, 2024 7:59 PM",
      center: "Gym center",
    },
    {
      checkedIn: "Dec 26, 2024 8:30 PM",
      checkedOut: "Dec 26, 2024 9:00 PM",
      center: "Gym center",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [staff, setStaff] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);

  const router = useRouter();
  const { id } = useParams();

  console.log("Staff ID:", id); // Log the ID to check if it's being captured correctly
  // Extract ID from the URL

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  useEffect(() => {
    if (id) {
      // Fetch the staff data by ID when the component mounts
      const fetchStaff = async () => {
        try {
          const res = await fetch(
            `${process.env.BASE_URL}/gym/site/apis/getGymStaffById/${id}`
          );
          const data = await res.json();
          if (data && data.data) {
            setStaff(data.data); // Set staff data
          } else {
            console.log("Staff not found");
          }
        } catch (err) {
          console.error("Error fetching staff data:", err);
        }
      };
      fetchStaff();
    }
  }, [id]);

  if (!staff) return <p>Loading...</p>;

  return (
    <div className="p-4 md:py-8 md:px-4 bg-slate-100">
      {/* Header or Page Title */}
      <h1 className="text-2xl font-bold mb-4">Staff (Details): {staff.name}</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-7">
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow py-6 px-3">
            <div className="flex flex-col items-center">
              <img
                src={
                  staff.profile_picture || "/swasthfit-gym/images/profile2.png"
                }
                alt="Staff Profile"
                className="w-24 h-24 rounded-full mb-4 border-2 border-gray-300 object-cover"
              />
              <h3 className="text-lg font-semibold">{staff.name}</h3>
            </div>
            <div className="grid grid-cols-[110px_auto] gap-x-1 gap-y-2 text-sm mt-2">
              <span className="font-medium">Mobile:</span>
              <span className="truncate">
                {staff.mobile || "Not Available"}
              </span>
              <span className="font-medium">Email:</span>
              <span className="truncate">{staff.email}</span>
              <span className="font-medium">Birthday:</span>
              <span>{staff.birthday || "Not Available"}</span>
              <span className="font-medium">Location:</span>
              <span className="truncate">
                {staff.location || "Not Available"}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="bg-slate-100">
            <div className="bg-white shadow rounded-lg p-6">
              {/* Staff Details Section */}
              <h2 className="text-lg font-bold mb-4">Staff Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-[150px_auto] gap-y-2 text-sm">
                <span className="font-medium">Date of Birth:</span>
                <span>{staff.birthday || "Not Available"}</span>
                <span className="font-medium">Age:</span>
                <span>{staff.age || "Not Available"}</span>
                <span className="font-medium">Gender:</span>
                <span>{staff.gender || "Not Available"}</span>
              </div>

              {/* Biometric Operations Section */}
              <h3 className="text-md font-bold mt-6">
                Perform Biometric Device Operations For Staff Members
              </h3>

              <div className="bg-indigo-50 p-4 mt-3 rounded-lg flex flex-wrap gap-3">
                {[
                  {
                    label: "Add Users",
                    color: "bg-indigo-600",
                    action: handleOpenModal,
                  },
                  { label: "Re - Add Users", color: "bg-indigo-600" },
                  { label: "Block Users", color: "bg-red-500" },
                  { label: "Unblock Users", color: "bg-green-500" },
                  { label: "Delete Users", color: "bg-blue-500" },
                ].map((btn, index) => (
                  <button
                    key={index}
                    className={`${btn.color} text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto`}
                    onClick={btn.action} // Open modal only for "Add Users"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              <Modal
                isOpen={isOpen}
                closeModal={handleCloseModal}
                staffInfo={{
                  name: staff.name,
                  email: staff.email,
                  mobile: staff.mobile,
                  profile_picture: staff.profile_picture,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Staff-Section */}
      <div className="p-2 mb-5">
        <h2 className="text-lg font-bold mb-4">Daily Staff Attendance</h2>

        {/* Attendance Buttons */}
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex flex-wrap gap-3">
            <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md text-sm">
              Daily Attendance
            </button>
            <button className="border border-green-500 text-green-500 px-4 py-2 rounded-md text-sm">
              Staff Attendance
            </button>
            <button className="border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm">
              Shift wise Attendance
            </button>
            <button className="border border-indigo-500 text-indigo-500 px-4 py-2 rounded-md text-sm">
              Missed CheckOut: 0
            </button>
          </div>

          {/* Delete Button (Aligned Right) */}
          <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm">
            Delete Attendance
          </button>
        </div>
      </div>

      {/* Table Header */}
      {/* Table Header */}
      <div className="overflow-x-auto p-4">
        <table className="w-full overflow-hidden  border-separate border-spacing-y-2">
          <thead className="bg-gray-800 text-white ">
            <tr>
              <th className="  rounded-l-lg">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-purple-600 rounded-md"
                />
              </th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  Checked In At
                  <span className="flex-1">
                    <HiChevronUp /> <HiChevronDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  Checked Out At
                  <span className="flex-1">
                    <HiChevronUp /> <HiChevronDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  Fitness Center
                  <span className="flex-1">
                    <HiChevronUp /> <HiChevronDown />
                  </span>
                </div>
              </th>
              <th className="p-3 text-center rounded-r-lg">
                <div className="flex items-center justify-center gap-2">
                  Action
                  <span className="flex-1">
                    <HiChevronUp /> <HiChevronDown />
                  </span>
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {attendanceData.map((item, index) => (
              <tr
                key={index}
                className="bg-white hover:bg-gray-50 transition-all duration-200  ">
                <td className="p-4 text-center rounded-l-lg">
                  <input
                    type="checkbox"
                    className="w-5 h-5 border-2 border-purple-600 rounded-md appearance-none 
           flex items-center justify-center
           checked:bg-transparent checked:before:content-['✔'] 
           checked:before:text-purple-600 checked:before:text-xl checked:before:font-bold 
           checked:before:flex checked:before:items-center checked:before:justify-center"
                  />
                </td>
                <td className="p-4 text-left">{item.checkedIn}</td>
                <td className="p-4 text-left">{item.checkedOut}</td>
                <td className="p-4 text-left ">{item.center}</td>

                {/* Actions */}
                <td className="p-4 flex  items-center gap-3 rrounded-r-xl">
                  {/* Edit Icon */}
                  <button className="bg-green-100 p-2 rounded-full hover:bg-green-200 transition">
                    <PencilIcon className="h-5 w-5 text-green-500" />
                  </button>

                  {/* Dropdown Menu */}
                  <Menu as="div" className="relative">
                    <MenuButton className="border border-blue-500 px-3 py-1.5 rounded-lg flex items-center text-blue-500 hover:bg-blue-100 transition">
                      Action <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </MenuButton>

                    {/* Dropdown Items */}
                    <MenuItems className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
                      <MenuItem>
                        {({ active }) => (
                          <button
                            className={`w-full px-4 py-2 text-left text-green-600 text-sm rounded-md transition ${
                              active ? "bg-gray-200" : ""
                            }`}>
                            Active
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            className={`w-full px-4 py-2 text-left text-sm text-red-600 rounded-md transition ${
                              active ? "bg-gray-200" : ""
                            }`}>
                            Inactive
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffDetails;
