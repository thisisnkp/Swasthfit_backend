"use client";
import { useState, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { FaCircle } from "react-icons/fa";

type FilterKeys =
  | "membership"
  | "services"
  | "createdBy"
  | "paymentStatus"
  | "gender"
  | "status"
  | "type"
  | "serviceType"
  | "startDate"
  | "endDate";

type Filters = Record<FilterKeys, string>;

const SubscriptionRegister = () => {
  const initialFilters: Filters = {
    membership: "Open Enquiry",
    services: "Open Enquiry",
    createdBy: "Open Enquiry",
    paymentStatus: "Open Enquiry",
    gender: "Open Enquiry",
    status: "Open Enquiry",
    type: "Open Enquiry",
    serviceType: "Open Enquiry",
    startDate: "2025-12-14",
    endDate: "2025-12-14",
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedPage, setSelectedPage] = useState(1);

  const headers = useMemo(
    () => [
      "Invoice No.",
      "Invoice Date",
      "Customer Name",
      "Plan Name",
      "Start Date",
      "End Date",
      "Plan Status",
      "Net Sale Amount",
      "GST",
      "Total Sale Amount",
      "Payment Status",
      "Action",
    ],
    []
  );

  const cards = useMemo(
    () => [
      {
        label: "Total Subscriptions",
        value: "3124",
        color: "border-blue-400 text-blue-500",
      },
      {
        label: "Active Subscriptions",
        value: "1204",
        color: "border-green-400 text-green-500",
      },
      {
        label: "Expired Subscriptions",
        value: "1376",
        color: "border-red-400 text-red-500",
      },
      {
        label: "Pending Subscriptions",
        value: "9",
        color: "border-pink-400 text-pink-500",
      },
      {
        label: "Used Subscriptions",
        value: "532",
        color: "border-indigo-400 text-indigo-500",
      },
      {
        label: "Pending Payment",
        value: "1610",
        color: "border-yellow-400 text-yellow-500",
      },
      {
        label: "Net Sales Amount",
        value: "20288114.91",
        color: "border-green-400 text-green-500",
      },
      {
        label: "GST Amount",
        value: "330068.68",
        color: "border-blue-400 text-blue-500",
      },
      {
        label: "Total Amount",
        value: "20618183.59",
        color: "border-indigo-400 text-indigo-500",
      },
      {
        label: "Balance Amount",
        value: "7226831.35",
        color: "border-orange-400 text-orange-500",
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        invoiceNo: "YDL-27312697",
        date: "Dec 26, 2024 7:59 PM",
        customer: {
          name: "Ashok Kumar",
          phone: "3434543234",
          email: "edgfc@gmail.com",
          appStatus: "App Not Installed",
        },
        planName: "1 Year Gym Pack [2986218]",
        startDate: "12-01-25",
        endDate: "11-01-26",
        planStatus: "Active",
        netSale: "₹ 12711.9",
        gst: "₹ 2288.1",
        totalSale: "₹ 15000",
        paymentStatus: "Balance: ₹8000",
        totalPaid: "₹ 0",
      },
    ],
    []
  );

  const filterOptions = useMemo(
    () => [
      { label: "Select Membership", key: "membership" },
      { label: "Select Service", key: "services" },
      { label: "Created by", key: "createdBy" },
      { label: "Payment Services", key: "paymentStatus" },
      { label: "Gender", key: "gender" },
      { label: "Subscription Status", key: "status" },
      { label: "Subscription Type", key: "type" },
      { label: "Subscription Service Type", key: "serviceType" },
    ],
    []
  );

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          <h2 className="text-sm sm:text-lg md:text-2xl font-bold whitespace-nowrap">
            Subscription Register
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

      {/* Filters */}
      <h3 className="text-2xl font-bold mb-3">Filters</h3>
      <div className="flex flex-wrap items-end gap-4 mb-4 rounded-lg p-4 bg-gray-200">
        {filterOptions.map((filter) => (
          <div key={filter.key} className="flex flex-col">
            <h6 className="mb-1 font-bold">{filter.label}</h6>
            <select
              className="border px-4 py-2 rounded-lg w-48"
              value={filters[filter.key as FilterKeys]} // Ensure TypeScript knows the key is valid
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  [filter.key]: e.target.value,
                }))
              }>
              <option>Open Enquiry</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        ))}
        <div className="flex flex-col">
          <h6 className="font-bold">Start Date</h6>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="border px-4 py-2 rounded-lg w-40 bg-white"
          />
        </div>
        <div className="flex flex-col">
          <h6 className="font-bold">End Date</h6>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="border px-4 py-2 rounded-lg w-40 bg-white"
          />
        </div>
        <div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Submit
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="p-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`border ${card.color} rounded-lg px-3 py-3 text-center text-md font-semibold`}>
              {card.label} : {card.value}
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
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
            {data.map((item, index) => (
              <tr
                key={index}
                className="bg-white hover:bg-gray-50 transition-all duration-200">
                <td className="text-center rounded-l-lg p-3">
                  <input type="checkbox" className="w-5 h-5 rounded-md" />
                </td>
                <td className="p-3">{item.invoiceNo}</td>
                <td className="p-3">{item.date}</td>
                <td className="p-3">
                  <p className="font-semibold text-blue-600">
                    {item.customer.name}
                  </p>
                  <p>{item.customer.phone}</p>
                  <p className="text-sm text-red-500">
                    {item.customer.appStatus}
                  </p>
                  <p className="text-sm text-gray-500">{item.customer.email}</p>
                </td>
                <td className="p-3">{item.planName}</td>
                <td className="p-3">{item.startDate}</td>
                <td className="p-3">{item.endDate}</td>
                <td className="text-center rounded-r-lg">
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm flex items-center inline-flex gap-2">
                    <FaCircle className="text-[8px]" />
                    {item.planStatus}
                  </span>
                </td>
                <td className="p-3">{item.netSale}</td>
                <td className="p-3">{item.gst}</td>
                <td className="p-3">{item.totalSale}</td>
                <td className="p-3">
                  <p className="text-orange-500">{item.paymentStatus}</p>
                  <p className="text-green-500">Total Paid: {item.totalPaid}</p>
                </td>
                <td className="p-3 text-center">✏️</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionRegister;
