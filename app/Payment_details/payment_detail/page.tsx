"use client";
import Image from "next/image";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { PiNotepadLight } from "react-icons/pi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import Link from "next/link";

const tableHeaders = [
  { label: "No" },
  { label: "Membership", key: "membership" },
  { label: "Start Date", key: "startDate" },
  { label: "End Date", key: "endDate" },
  { label: "Plan Price", key: "planPrice" },
  { label: "Discount Amount", key: "discountAmount" },
  { label: "Net Sale Amount", key: "netSaleAmount" },
  { label: "Total Sale Amount", key: "totalSaleAmount" },
  { label: "Total Paid Amount", key: "totalPaidAmount" },
  { label: "Total Balance Amount", key: "totalBalanceAmount" },
  { label: "Payment Status", key: "paymentStatus" },
];

const sampleDataArray = [
  {
    membership: "1 month membership",
    startDate: "20-01-25",
    endDate: "19-02-25",
    planPrice: "₹ 10000",
    discountAmount: "₹ 1000",
    netSaleAmount: "₹ 8000",
    totalSaleAmount: "₹ 9000",
    totalPaidAmount: "₹ 22881",
    totalBalanceAmount: "₹ 15000",
    paymentStatus: "Pending",
  },
  {
    membership: "3 month membership",
    startDate: "01-02-25",
    endDate: "01-05-25",
    planPrice: "₹ 15000",
    discountAmount: "₹ 2000",
    netSaleAmount: "₹ 13000",
    totalSaleAmount: "₹ 14500",
    totalPaidAmount: "₹ 10000",
    totalBalanceAmount: "₹ 4500",
    paymentStatus: "Partially Paid",
  },
];

export default function PaymentDetail() {
  const [activeTab, setActiveTab] = useState("personal"); // 'personal', 'bank', 'payment'
  const [showAddGatewayForm, setShowAddGatewayForm] = useState(false);

  const [date, setDate] = useState("22/02/2025");

  const renderPersonalDetailsTab = () => (
    <>
      <div className="relative w-full rounded-lg overflow-hidden mb-4">
        {" "}
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
        <div className="flex flex-wrap items-center justify-between w-full max-w-4xl mx-auto px-4">
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
              <h2 className="text-sm sm:text-2xl font-semibold underline break-words">
                ROHIT SHARMA,
              </h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                +91 9876543210
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 bg-white rounded-lg shadow-md">
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700">
              Enter Your Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                defaultValue="olivia@gmail.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">📧</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="dob"
              className="block mb-1 font-medium text-gray-700">
              DOB
            </label>
            <div className="relative">
              <input
                id="dob"
                type="text"
                defaultValue="22/02/2025"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">📅</span>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            {" "}
            <label
              htmlFor="street"
              className="block mb-1 font-medium text-gray-700">
              Street / Area
            </label>
            <input
              id="street"
              type="text"
              defaultValue="ABC"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="remarks"
              className="block mb-1 font-medium text-gray-700">
              Remarks/Summary
            </label>
            <textarea
              id="remarks"
              placeholder="Select One"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              rows={4}></textarea>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            {" "}
            <label className="block font-medium text-gray-700">
              Is IGST Bill
            </label>
            <div className="flex items-center gap-4">
              {" "}
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  name="igst"
                  value="yes"
                  defaultChecked
                  className="form-radio text-indigo-600"
                />{" "}
                Yes
              </label>
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  name="igst"
                  value="no"
                  className="form-radio text-indigo-600"
                />{" "}
                No
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-3 text-sm text-gray-700 border-t border-gray-200 pt-6">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-lg text-gray-500" />{" "}
            <p>Client Rep : Rohan Nanda</p>
          </div>
          <div className="flex items-center gap-3">
            <PiNotepadLight className="text-lg text-gray-500" />{" "}
            <p>Bill Rep : Rohan Nanda (145822)</p>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlineUserGroup className="text-lg text-gray-500" />{" "}
            <p>Membership Added by : XYZ</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t border-gray-200 pt-6">
          <div>
            <label
              htmlFor="billRep"
              className="block mb-1 font-medium text-gray-700">
              Bill Rep*
            </label>
            <select
              id="billRep"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500">
              <option value="olivia">olivia</option>
              <option value="rohan">rohan</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="invoiceNo"
              className="block mb-1 font-medium text-gray-700">
              Invoice No.
            </label>
            <input
              id="invoiceNo"
              type="text"
              defaultValue="515858181884"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="invoiceDate"
              className="block mb-1 font-medium text-gray-700">
              Invoice Date
            </label>
            <div className="relative">
              <input
                id="invoiceDate"
                type="text"
                defaultValue="22/02/2025"
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">📅</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-full mt-6 border-t border-gray-200 pt-2">
        <div className="overflow-x-auto p-4 bg-white rounded-lg shadow-md flex-1">
          <h3 className="text-sm sm:text-lg md:text-xl font-bold whitespace-nowrap mb-4 text-gray-800">
            Membership
          </h3>
          <table className="w-full border-separate border-spacing-y-2">
            <thead className="bg-gray-700 text-white rounded-t-lg">
              <tr>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    className={`p-3 text-center ${
                      index === 0 ? "rounded-tl-lg" : ""
                    } ${
                      index === tableHeaders.length - 1 ? "rounded-tr-lg" : ""
                    }`}>
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleDataArray.map((user, index) => (
                <tr
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 transition-all duration-200 border-b border-gray-200 last:border-0">
                  <td className="text-center py-3 px-2">{index + 1}</td>
                  <td className="text-center py-3 px-2">{user.membership}</td>
                  <td className="text-center py-3 px-2">{user.startDate}</td>
                  <td className="text-center py-3 px-2">{user.endDate}</td>
                  <td className="text-center py-3 px-2">{user.planPrice}</td>
                  <td className="text-center py-3 px-2">
                    {user.discountAmount}
                  </td>
                  <td className="text-center py-3 px-2">
                    {user.netSaleAmount}
                  </td>
                  <td className="text-center py-3 px-2">
                    {user.totalSaleAmount}
                  </td>
                  <td className="text-center py-3 px-2">
                    {user.totalPaidAmount}
                  </td>
                  <td className="text-center py-3 px-2">
                    {user.totalBalanceAmount}
                  </td>
                  <td className="text-center py-3 px-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        user.paymentStatus === "Pending"
                          ? "bg-red-100 text-red-800"
                          : user.paymentStatus === "Partially Paid"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                      {user.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderBankDetailsTab = () => (
    <div className="max-w-4xl mx-auto w-full p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Bank Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="bankName"
            className="block mb-1 font-medium text-gray-700">
            Bank Name
          </label>
          <input
            id="bankName"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            placeholder="Enter Bank Name"
          />
        </div>

        <div>
          <label
            htmlFor="accountHolderName"
            className="block mb-1 font-medium text-gray-700">
            Account Holder Name
          </label>
          <input
            id="accountHolderName"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            placeholder="Enter Account Holder Name"
          />
        </div>

        <div>
          <label
            htmlFor="accountNumber"
            className="block mb-1 font-medium text-gray-700">
            Bank Account Number
          </label>
          <input
            id="accountNumber"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            placeholder="Enter Account Number"
          />
        </div>

        <div>
          <label
            htmlFor="ifscCode"
            className="block mb-1 font-medium text-gray-700">
            IFSC Code
          </label>
          <input
            id="ifscCode"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            placeholder="Enter IFSC Code"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label
            htmlFor="branchName"
            className="block mb-1 font-medium text-gray-700">
            Branch Name (Optional)
          </label>
          <input
            id="branchName"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            placeholder="Enter Branch Name"
          />
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring focus:ring-indigo-200">
          Save Bank Details
        </button>
      </div>
    </div>
  );

  const renderPaymentGatewayTab = () => (
    <div className="max-w-4xl mx-auto w-full p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Payment Gateway</h3>
      {!showAddGatewayForm ? (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring focus:ring-green-200"
            onClick={() => setShowAddGatewayForm(true)}>
            Add Payment Gateway
          </button>

          <Link
            href="https://auth.easebuzz.in/easebuzz/signup/SwaasthfiitWFZ"
            passHref
            legacyBehavior>
            <a
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring focus:ring-blue-200 cursor-pointer"
              target="_blank"
              rel="noopener noreferrer">
              Create Payment Gateway
            </a>
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-4">
            Add details of your payment gateway.
          </p>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="gatewayType"
                className="block mb-1 font-medium text-gray-700">
                Gateway Type
              </label>
              <select
                id="gatewayType"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500">
                <option value="">Select Gateway</option>
                <option value="razorpay">Razorpay</option>
                <option value="easebuzz">Easebuzz</option>
                <option value="paytm">Paytm</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="apiKey"
                className="block mb-1 font-medium text-gray-700">
                API Key
              </label>
              <input
                id="apiKey"
                type="text"
                placeholder="Enter API Key"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="secretKey"
                className="block mb-1 font-medium text-gray-700">
                Secret Key
              </label>
              <input
                id="secretKey"
                type="text"
                placeholder="Enter Secret Key"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="merchantId"
                className="block mb-1 font-medium text-gray-700">
                Merchant ID
              </label>
              <input
                id="merchantId"
                type="text"
                placeholder="Enter Merchant ID"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="accountEmail"
                className="block mb-1 font-medium text-gray-700">
                Account Email
              </label>
              <input
                id="accountEmail"
                type="email"
                placeholder="Enter Account Email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring focus:ring-indigo-200">
                Save Payment Gateway
              </button>
              <button
                type="button"
                className="ml-4 bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-200 focus:outline-none"
                onClick={() => setShowAddGatewayForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-slate-100 min-h-screen pb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 flex-wrap pt-4 px-4 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          <h2 className="text-sm sm:text-lg md:text-2xl font-bold whitespace-nowrap text-gray-800">
            Client Details
          </h2>
          <div className="flex items-center border rounded-lg overflow-hidden w-full md:w-[350px]">
            <input
              type="text"
              placeholder="Search by Mobile Number or Email Address"
              className="w-full px-4 py-2 focus:outline-none"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition duration-200">
              Search
            </button>
          </div>
        </div>
        <div className="flex items-center border rounded-lg overflow-hidden">
          <select className="border px-4 py-2 rounded-lg w-auto min-w-max focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500">
            <option>YD Fitness Club (Samara)</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div className="max-w-4xl mx-auto w-full px-4 mt-4">
        <div className="flex border-b border-gray-300">
          <button
            className={`py-2 px-4 text-sm md:text-base font-medium ${
              activeTab === "personal"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            } focus:outline-none transition duration-200`}
            onClick={() => setActiveTab("personal")}>
            Personal Details
          </button>
          <button
            className={`py-2 px-4 text-sm md:text-base font-medium ${
              activeTab === "bank"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            } focus:outline-none transition duration-200`}
            onClick={() => setActiveTab("bank")}>
            Bank Details
          </button>
          <button
            className={`py-2 px-4 text-sm md:text-base font-medium ${
              activeTab === "payment"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            } focus:outline-none transition duration-200`}
            onClick={() => setActiveTab("payment")}>
            Payment Gateway
          </button>
        </div>
      </div>
      {/* Tab Content Area */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-6">
        {" "}
        {/* Added padding and margin-top */}
        {activeTab === "personal" && renderPersonalDetailsTab()}
        {activeTab === "bank" && renderBankDetailsTab()}
        {activeTab === "payment" && renderPaymentGatewayTab()}
      </div>
    </div>
  );
}
