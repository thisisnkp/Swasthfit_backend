"use client";
import { X } from "lucide-react";
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

interface StaffInfo {
  name: string;
  email: string;
  mobile: string;
  profile_picture?: string;
}

const BiometricModal = ({
  isOpen,
  closeModal,
  staffInfo,
}: {
  isOpen: boolean;
  closeModal: () => void;
  staffInfo: StaffInfo;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-4 relative">
        <button
          onClick={closeModal}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700">
          <X size={22} />
        </button>

        <h2 className="text-lg font-bold text-gray-800 mb-4">
          ADD STAFF TO BIOMETRIC DEVICE (NEW)
        </h2>

        {/* Staff Info */}
        <div className="bg-slate-100 p-4 rounded-lg flex flex-col md:flex-row items-center md:items-start gap-4">
          <img
            src={
              staffInfo.profile_picture || "/swasthfit-gym/images/profile2.png"
            }
            alt="Profile"
            className="w-20 h-20 rounded-full border object-cover"
          />

          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">{staffInfo.name}</h3>
            <p className="flex items-center justify-center md:justify-start gap-2 mt-2 text-gray-700">
              <FaPhoneAlt className="mr-2" /> {staffInfo.mobile}
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2 mt-1 text-gray-700">
              <HiOutlineMail className="mr-2 text-xl" /> {staffInfo.email}
            </p>
          </div>
        </div>

        {/* Form Fields (keep your existing inputs here) */}
        <div className="mt-4 space-y-4">
          {/* Biometric Code (Label & Input on Same Line) */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="text-md font-medium whitespace-nowrap">
              Biometric Code:
            </label>
            <input
              type="text"
              className=" border border-gray-300 text-gray-500 rounded px-3 py-2 w-full md:w-auto"
              value="963854848444"
              readOnly
            />
          </div>

          {/* RFID (Optional) (On a Separate Row) */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="text-md font-medium whitespace-nowrap">
              RFID (Optional):
            </label>
            <input
              type="text"
              className=" border border-gray-300 text-gray-500 rounded px-3 py-2 w-full md:w-auto"
              value="963854848444"
              readOnly
            />
          </div>

          {/* Biometric Type Selection  w-full md:w-auto*/}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="text-md font-medium">Biometric Type:</label>
            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              {["Finger", "Face", "RFID Card"].map((type, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 p-2  rounded-md ">
                  <input
                    type="radio"
                    name="biometric"
                    defaultChecked={index === 0}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Device Selection */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="text-md font-medium whitespace-nowrap">
              Select Device:
            </label>
            <input
              type="text"
              className=" border border-gray-300 text-gray-500 rounded px-3 py-2 w-full md:w-auto"
              value="963854848444"
              readOnly
            />
          </div>
        </div>
        {/* ... */}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={closeModal}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg w-full sm:w-auto transition duration-300 hover:bg-gray-600">
            Close
          </button>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg w-full sm:w-auto transition duration-300 hover:bg-indigo-700">
            Add User to Biometric Device
          </button>
        </div>
      </div>
    </div>
  );
};

export default BiometricModal;
