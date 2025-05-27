"use client";
import Image from "next/image";
import { BsPlayBtn } from "react-icons/bs";
import { FaChartBar } from "react-icons/fa";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { FaCircle, FaPhoneAlt } from "react-icons/fa";

const checkins = Array(10).fill({
  c_name: "Ashok Kumar",
  p_name: "bench table",
  orderId: "3434543234",
  email: "edgf@gmail.com",
  pincode: 252016,
  checkinTime: "January 13, 2025, 05:35 PM",
  checkoutTime: "January 13, 2025, 06:35 PM",
  status: "Active",
});

const orders = [
  {
    status: "Cancelled",
    amount: "₹46000.00",
    bgColor: "bg-red-100",
    iconColor: "bg-red-500",
  },
  {
    status: "Pending",
    amount: "₹46000.00",
    bgColor: "bg-yellow-100",
    iconColor: "bg-orange-500",
  },
  {
    status: "Confirmed",
    amount: "₹46000.00",
    bgColor: "bg-green-100",
    iconColor: "bg-green-500",
  },
  {
    status: "Collected",
    amount: "₹46000.00",
    bgColor: "bg-purple-100",
    iconColor: "bg-purple-500",
  },
];

const actions = [
  { title: "Add Category", description: "Add category in store from here" },
  { title: "Category List", description: "View all listed category from here" },
  { title: "Add Product", description: "Add Product in the store from here" },
  { title: "Product List", description: "View all listed product from here" },
];

const buttons = [
  "Edit Store",
  "Add Location",
  "Add Coupon",
  "Coupon List",
  "Add Delivery Slots",
  "Delivery Slots List",
];

const headers = [
  "Order Id",
  "Product Name",
  "Customer Name",
  "Delivery Pincode",
  "Status",
];

export default function FitnessDashboard() {
  return (
    <div className="bg-slate-100">
      <h2 className="text-lg md:text-2xl font-bold whitespace-nowrap px-3 py-4">
        Fitness Center (Preview)
      </h2>
      <div className="bg-slate-100 min-h-screen flex flex-col items-center p-4">
 
        <div className="relative w-full rounded-lg ">
          <Image
            src="/swasthfit-gym/images/bg1.png"
            alt="Banner"
            width={1200}
            height={300}
            className="w-full h-56 object-cover"
            loading="lazy"
          />
        </div>

        <div className="relative -mt-12 flex flex-col w-full p-4">
          <div className="flex flex-wrap items-center justify-between w-full max-w-5xl mx-auto px-4">
            <div className="flex items-center space-x-5">
              <Image
                src="/swasthfit-gym/images/profile1.png"
                alt="Profile Picture"
                width={150}
                height={150}
                className="w-36 h-36 rounded-full border-4 border-white shadow-md"
                loading="lazy"
              />
              <div>
                <h2 className="text-sm sm:text-2xl font-semibold">
                  Welcome To,
                </h2>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                  Muscle Blaze
                </p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center mt-4 sm:mt-0">
              <BsPlayBtn className="mr-2" /> Tutorials
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full max-w-5xl mt-4">
          {buttons.map((btn, index) => (
            <button
              key={index}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              {btn}
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto   p-4 bg-white rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold mb-4">My Orders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${order.bgColor} shadow-md`}>
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${order.iconColor} text-white mb-2`}>
                  <FaChartBar />
                </div>
                <p className="text-lg font-semibold">{order.amount}</p>
                <p className="text-gray-600">{order.status}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {actions.map((action, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="text-lg font-semibold">{action.title}</p>
                <p className="text-gray-600 text-sm">{action.description}</p>
                <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-full">
                  Click Here
                </button>
              </div>
            ))}
          </div>
        </div>

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
                    <td className="text-center rounded-l-lg p-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 border-2  border-purple-600 rounded-md appearance-none
                           flex items-center justify-center
                           checked:bg-transparent checked:before:content-['✔']
                           checked:before:text-purple-600 checked:before:text-xl checked:before:font-bold
                           checked:before:flex checked:before:items-center checked:before:justify-center"
                      />
                    </td>
                    <td className="text-center">{user.orderId}</td>
                    <td className="text-center">{user.p_name}</td>
                    <td className="p-3 flex items-center justify-center">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                        <img
                          src="/swasthfit-gym/images/profile4.png"
                          alt="Profile"
                          className="w-14 h-14 rounded-full border object-cover"
                          loading="lazy"
                        />
                        <div>
                          <p className="text-sm mt-1 text-indigo-600 underline">
                            {user.c_name}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{user.pincode}</td>
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
      </div>
    </div>
  );
}
