"use client";

import { useState } from "react";
import { HiSearch, HiChevronUp, HiChevronDown } from "react-icons/hi";
import { FaCircle, FaPhoneAlt } from "react-icons/fa";

import { HiArrowSmLeft } from "react-icons/hi";
import { HiArrowSmRight } from "react-icons/hi";

const totalCheckins = 22;
const itemsPerPage = 5;
const totalPages = Math.ceil(totalCheckins / itemsPerPage);

export default function ClientCheckins() {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setSelectedPage(page);
    }
  };

  const [selectedPage, setSelectedPage] = useState(1);
  const [startDate, setStartDate] = useState("2025-12-14");
  const [endDate, setEndDate] = useState("2025-12-14");

  const checkins = Array(5).fill({
    name: "Ashok Kumar",
    phone: "3434543234",
    email: "edgf@gmail.com",
    checkins: 4,
    checkinTime: "January 13, 2025, 05:35 PM",
    checkoutTime: "January 13, 2025, 06:35 PM",
    status: "Active",
  });

  const headers = [
    "Customer Name",
    "Total Check-ins",
    "Latest (Check-in - Check-out)",
    "Subscription Status",
  ];

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          <h2 className="text-sm sm:text-lg md:text-2xl font-bold whitespace-nowrap">
            Client Check-ins Leaderboard
          </h2>

          <div className="flex items-center border rounded-lg overflow-hidden w-full md:w-[350px]">
            <input
              type="text"
              placeholder="Search by Mobile Number or Email Address"
              className="w-full px-4 py-2 focus:outline-none"
            />
            <button className="bg-indigo-600 text-white px-4 py-2">
              Search
            </button>
          </div>
        </div>

        <div className="flex items-center border rounded-lg overflow-hidden">
          <select className="border px-4 py-2 rounded-lg w-auto min-w-max">
            <option>YD Fitness Club (Samara)</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-3">Filters</h3>
      <div
        className="flex flex-wrap items-end gap-4 mb-10  rounded-lg p-4"
        style={{ backgroundColor: "rgb(235 235 235)" }}>
        <div className="flex flex-col">
          <h6 className="mb-1 font-bold">Customer Gender</h6>
          <select className="border px-4 py-2 rounded-lg w-48">
            <option>Open Enquiry</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col">
          <h6 className="font-bold">Start Date</h6>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-4 py-2 rounded-lg w-40 bg-white"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <h6 className="font-bold">End Date</h6>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-4 py-2 rounded-lg w-40 bg-white"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Submit
          </button>
        </div>
      </div>

      {/* Top 5 Check-ins */}
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-8 ">
        Top 5 Check-ins (January 01, 2025 - January 29, 2025)
      </h2>
      <div className="flex justify-center items-center gap-4  md:gap-8 flex-wrap">
        {Array(5)
          .fill("Tanya Israni")
          .map((user, index) => (
            <div key={index} className="text-center">
              <img
                src="/swasthfit-gym/images/profiles.png"
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border object-cover mx-auto"
              />
              <p className="text-indigo-600 underline mt-2">{user}</p>
              <p className="font-medium mt-2">
                Total Check-ins : <span className="font-bold">4</span>
              </p>
            </div>
          ))}
      </div>
      {/* table  */}
      <div className="flex w-full max-w-full mt-6">
        <div className="overflow-x-auto p-4 bg-slate-100 flex-1">
          <table className="w-full border-separate border-spacing-y-3 ">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="rounded-l-lg p-3 text-center">
                  <input type="checkbox" className="w-5 h-5 rounded-md" />
                </th>
                {headers.map((heading, index) => (
                  <th key={index} className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {heading}
                      <span className="flex flex-col items-center">
                        <HiChevronUp />
                        <HiChevronDown />
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {checkins.map((user, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-gray-50  transition-all duration-200">
                  <td className="text-center rounded-l-lg p-5">
                    <input
                      type="checkbox"
                      className="w-5 h-5 border-2  border-purple-600 rounded-md appearance-none
                           flex items-center justify-center
                           checked:bg-transparent checked:before:content-['✔']
                           checked:before:text-purple-600 checked:before:text-xl checked:before:font-bold
                           checked:before:flex checked:before:items-center checked:before:justify-center"
                    />
                  </td>
                  <td className="p-2">
                    <div className=" rounded-lg flex flex-col md:flex-row items-center md:items-start gap-4">
                      <img
                        src="/swasthfit-gym/images/profile4.png"
                        alt="Profile"
                        className="w-20 h-20 rounded-full border object-cover"
                      />

                      <div>
                        <p className="text-indigo-600 underline">{user.name}</p>
                        <p className="text-sm mt-1">{user.phone}</p>
                        <p className="text-sm mt-1">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="text-center">{user.checkins}</td>
                  <td className=" text-center">
                    {user.checkinTime} to {user.checkoutTime}
                  </td>
                  <td className="text-center rounded-r-lg">
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm flex items-center inline-flex gap-2">
                      <FaCircle className="text-[8px]" />
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex flex-wrap justify-center md:justify-between items-center gap-3 mt-4">
        {/* Previous Button */}
        <button
          className="px-4 py-2 flex items-center border rounded-md bg-white disabled:opacity-50"
          disabled={selectedPage === 1}
          onClick={() => handlePageChange(selectedPage - 1)}>
          <HiArrowSmLeft className="mr-2" /> Previous
        </button>

        {/* Page Numbers */}
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md transition-all duration-200 ${
                  selectedPage === page
                    ? "bg-purple-600 text-white"
                    : "border hover:bg-gray-200"
                }`}>
                {page}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          className="px-4 py-2 bg-white border flex items-center rounded-md disabled:opacity-50"
          disabled={selectedPage === totalPages}
          onClick={() => handlePageChange(selectedPage + 1)}>
          Next <HiArrowSmRight className="ml-2" />
        </button>
      </div>
    </div>
  );
}
