"use client";

import React from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

import { ChevronDownIcon, PencilIcon } from "@heroicons/react/24/solid";

export default function StaffDetails() {
  const data = [
    {
      checkedIn: "Dec 26, 2024 7:59 PM",
      checkedOut: "Dec 26, 2024 7:59 PM",
      center: "Gye center",
    },
    {
      checkedIn: "Dec 26, 2024 7:59 PM",
      checkedOut: "Dec 26, 2024 7:59 PM",
      center: "Gye center",
    },
    {
      checkedIn: "Dec 26, 2024 7:59 PM",
      checkedOut: "Dec 26, 2024 7:59 PM",
      center: "Gye center",
    },
    {
      checkedIn: "Dec 26, 2024 7:59 PM",
      checkedOut: "Dec 26, 2024 7:59 PM",
      center: "Gye center",
    },
    {
      checkedIn: "Dec 26, 2024 7:59 PM",
      checkedOut: "Dec 26, 2024 7:59 PM",
      center: "Gye center",
    },
  ];

  return (
    <div className=" p-4 md:py-8  md:px-4 bg-slate-100 ">
      {/* Header or Page Title */}
      <h1 className="text-2xl font-bold mb-4 rounded-lg bg-white p-4">
        Staff (Details) : Rohan
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-7">
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow py-6 px-3">
            <div className="flex flex-col items-center">
              <img
                src="/swasthfit-gym/images/profile.jpg"
                alt="Staff Profile"
                className="w-24 h-24 rounded-full mb-4 border-2 border-gray-300 object-cover"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold">Rohan</h3>
            </div>
            <div className="grid grid-cols-[110px_auto]  gap-x-1 gap-y-2 text-sm mt-2">
              <span className="font-medium">Mo:</span>
              <span className="truncate">9876543210</span>
              <span className="font-medium">Email:</span>
              <span className="truncate">nanda.ydl@gmail.com</span>
              <span className="font-medium">Birthday:</span>
              <span>None</span>
              <span className="font-medium">Location:</span>
              <span className="truncate">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/4 ">
          <div className="bg-slate-100   ">
            <div className="bg-white shadow rounded-lg p-6 ">
              {/* Staff Details Section */}
              <h2 className="text-lg font-bold mb-4">Staff Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-[150px_auto] gap-y-2 text-sm">
                <span className="font-medium">Date of Birth:</span>
                <span>25/04/2025</span>
                <span className="font-medium">Age:</span>
                <span>25</span>
                <span className="font-medium">Gender:</span>
                <span>Male</span>
              </div>

              {/* Biometric Operations Section */}
              <h3 className="text-md font-bold mt-6">
                Perform Biometric Device Operations For Staff Members
              </h3>
              <div className="bg-indigo-50 p-4 mt-3 rounded-lg flex flex-wrap gap-3 ">
                {[
                  { label: "Add Users", color: "bg-indigo-600" },
                  { label: "Re - Add Users", color: "bg-indigo-600" },
                  { label: "Block Users", color: "bg-red-500" },
                  { label: "Unblock Users", color: "bg-green-500" },
                  { label: "Delete Users", color: "bg-blue-500" },
                ].map((btn, index) => (
                  <button
                    key={index}
                    className={`${btn.color} text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto`}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff-Section  */}
      <div className="p-2 mb-5">
        <h2 className="text-lg font-bold mb-4">Daily Staff Attendance</h2>

        {/* Attendance Buttons */}
        <div className=" flex flex-wrap gap-3 justify-between items-center ">
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
              Missed CheckOut : 0
            </button>
          </div>

          {/* Delete Button (Aligned Right) */}
          <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm">
            Delete Attendance
          </button>
        </div>
      </div>

      {/* Delete Attendance Button */}

      <div className="overflow-x-auto p-4">
        <table className="min-w-full">
          {/* Table Header */}
          <thead className="rounded overflow-hidden">
            <tr className="bg-gray-800 text-white rounded-lg">
              <th className="p-3 text-left rounded-l-lg">
                <input type="checkbox" className="w-4 h-4 text-indigo-600" />
              </th>
              <th className="p-3 text-left">Checked In At</th>
              <th className="p-3 text-left">Checked Out At</th>
              <th className="p-3 text-left">Fitness Center</th>
              <th className="p-3 text-left rounded-r-lg">Action</th>
            </tr>
          </thead>

          <tbody className="mt-20">
            {data.map((item, index) => (
              <tr
                key={index}
                className="bg-white shadow-sm hover:bg-gray-50 transition-all duration-200 border-b rounded-lg overflow-hidden">
                <td className="p-4 text-center rounded-l-lg">
                  <input
                    type="checkbox"
                    className="w-5 h-5 border-gray-300 rounded-md cursor-pointer checked:bg-purple-500 focus:ring-2 focus:ring-purple-500"
                  />
                </td>
                <td className="p-4 text-center">{item.checkedIn}</td>
                <td className="p-4 text-center">{item.checkedOut}</td>
                <td className="p-4 text-center">{item.center}</td>

                {/* Actions */}
                <td className="p-4 flex justify-center items-center gap-3 rounded-r-lg">
                  <button className="bg-green-100 p-2 rounded-full hover:bg-green-200 transition">
                    <PencilIcon className="h-5 w-5 text-green-500" />
                  </button>
                  <Menu as="div" className="relative">
                    <MenuButton className="border border-blue-500 px-3 py-1.5 rounded-lg flex items-center text-blue-500 hover:bg-blue-100 transition">
                      Action <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </MenuButton>

                    {/* Dropdown Menu */}
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
}
