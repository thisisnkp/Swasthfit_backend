"use client";

import { FaSearch, FaPhoneAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white w-full max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl rounded-lg shadow-lg flex flex-col max-h-screen overflow-y-auto scrollbar-none">
        {/* Modal Header */}
        <div className="flex justify-between items-center  p-3 rounded-t-lg">
          <h2 className="text-md font-semibold">Add Subscription</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Section */}
        <div className="flex flex-col  bg-gray-100 sm:flex-row rounded-lg items-center ml-2 mr-2 p-5 gap-4">
          <img
            src="/swasthfit-gym/images/profile2.png"
            alt="User"
            className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">ROHAN NANDA</h2>
            <p className="text-sm flex items-center mt-2">
              <FaPhoneAlt className="mr-2" /> 9876543210
            </p>
            <button className="flex items-center text-sm mt-2 font-medium">
              <HiOutlineMail className="text-black font-semibold mr-2" />{" "}
              nanda_y4l@gmail.com
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-4 ">
          <table className="w-full border-collapse text-sm">
            <div className=" bg-gray-800  p-1 rounded-lg text-white ">
              <thead>
                <tr>
                  <th className="p-1">No.</th>
                  <th className="p-1">Membership Plan</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                  <th className="p-3">Base Price</th>
                  <th className="p-3">Selling Price</th>
                  <th className="p-3">Apply Coupon</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
            </div>
            <div className="mt-3 rounded-lg bg-gray-100 ">
              <tbody>
                <tr>
                  <td className="p-3">01</td>
                  <td className="p-3">
                    <input
                      type="text"
                      className="w-full border rounded p-1 text-center"
                      value="963854848444"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      className="w-full border rounded p-1 text-center"
                      value="01-0-2025"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      className="w-full border rounded p-1 text-center"
                      value="01-0-2025"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      className="w-full border rounded p-1 text-center"
                      value="5000"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      className="w-full border rounded p-1 text-center"
                      value="4778.99"
                    />
                  </td>
                  <td className="p-3">
                    <button className="bg-blue-600 text-white rounded px-5 py-2">
                      Apply
                    </button>
                  </td>
                  <td className="p-3">
                    <button className="bg-green-500 text-white rounded px-5 py-2 w-full">
                      Add more Plan
                    </button>
                  </td>
                </tr>
              </tbody>
            </div>
          </table>
        </div>

        {/* Group Members Section */}
        <div className="p-4 border-b border-gray-300">
          <label className="block text-sm font-medium">Group Members ID</label>
          <input
            type="text"
            className="w-full border p-2 rounded mt-1"
            placeholder="Enter member code"
          />
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
            <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded">
              <FaSearch /> <span>Lookup member Code</span>
            </button>
            <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded">
              <FaSearch /> <span>Lookup enquiry Code</span>
            </button>
          </div>
        </div>

        {/* Billing Summary */}
        <div className="flex justify-center h-full p-4">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-lg">
            <p className="flex justify-between">
              <span>MRP</span>
              <span>₹ 5000.00</span>
            </p>
            <p className="flex justify-between">
              <span>Discount</span>
              <span>₹ 4778.99</span>
            </p>
            <p className="flex justify-between">
              <span>Net Sales Amount</span>
              <span>₹ 187.29</span>
            </p>
            <p className="flex justify-between">
              <span>Coupon Applied</span>
              <span>₹ 0.00</span>
            </p>
            <p className="flex justify-between">
              <span>CGST@</span>
              <span>₹ 16.86</span>
            </p>
            <p className="flex justify-between">
              <span>SGST@</span>
              <span>₹ 16.86</span>
            </p>

            {/* Total Amount Section */}
            <div className="bg-blue-500 text-white p-4 mt-4 rounded-lg shadow-md w-full">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Amount to be Paid</span>
                <span>₹ 221.0</span>
              </div>
              <p className="text-xs text-white opacity-80 mt-1">
                *Inclusive of GST
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-gray-300 mt-5 ">
          <label className="block text-sm font-medium">Select a Batch</label>
          <input
            type="text"
            className="w-full border p-2 rounded mt-1"
            placeholder="select a batch for this customer "
          />
        </div>
        <div className="flex justify-end space-x-2 p-4">
          <button
            className="bg-blue-600 px-4 py-2 rounded text-white"
            onClick={onClose}>
            Close
          </button>
          <button className="bg-blue-600 px-4 py-2 rounded text-white">
            Add Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
