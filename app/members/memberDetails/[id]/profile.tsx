"use client";
import { FaCircle, FaPhoneAlt } from "react-icons/fa";
import { LuWallet } from "react-icons/lu";
import { HiOutlineMail } from "react-icons/hi";
import Image from "next/image";

const userDetails = [
  { icon: <FaPhoneAlt />, text: "Add Location" },
  { icon: <HiOutlineMail />, text: "Add DOB" },
  { icon: <LuWallet />, text: "Date Of Enquiry: Jan 24, 2025" },
  { icon: <LuWallet />, text: "Member Code: YDL-3203291" },
  { icon: <LuWallet />, text: "MRef No.: None" },
  { icon: <LuWallet />, text: "Client Repo:" },
  { icon: <LuWallet />, text: "Emergency No: None" },
];

const ProfileCard = () => {
  return (
    <div className="w-full max-w-md mx-auto space-y-5">
    
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row items-center">
        <Image
          src="/swasthfit-gym/images/profile2.png"
          alt="Profile"
          width={90}
          height={90}
          className="rounded-full"
          priority
        />
        <div className="ml-4 w-full text-center md:text-left">
          <h2 className="text-lg font-semibold">ROHAN NANDA</h2>
          <p className="flex items-center justify-center md:justify-start text-gray-700 mt-2">
            <FaPhoneAlt className="mr-2" /> 9876543210
          </p>
          <button className="flex items-center justify-center md:justify-start text-blue-600 mt-2 font-medium underline">
            <HiOutlineMail className="text-xl  text-black mr-2" /> Add Email
          </button>
          <p className="flex items-center justify-center md:justify-start mt-2 font-medium text-gray-700">
            <LuWallet className="text-xl mr-2" /> Balance Amount: ₹10,000
          </p>
        </div>
      </div>


      <div className="flex justify-center">
        <button className="bg-indigo-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700">
          Open Webcam
        </button>
      </div>


      <div className="bg-white shadow-md rounded-lg p-4">
        <ul className="space-y-3 text-gray-700">
          {userDetails.map((item, index) => (
            <li key={index} className="flex items-center">
              {item.icon} <span className="ml-2">{item.text}</span>
            </li>
          ))}
        </ul>

        <p className="text-red-600 bg-red-100 font-semibold flex rounded-md items-center inline-flex px-2 py-1 gap-2 text-sm mt-3">
          <FaCircle className=" text-[8px]" /> App Not Installed
        </p>

        <h2 className="mt-4  font-semibold">Interested In:</h2>
        <p className="flex items-center mt-2">
          <FaPhoneAlt className="mr-2 " /> Assigned Trainer: Rohan Nanda
        </p>

        <p className="text-red-600 bg-red-100 font-semibold rounded-md flex inline-flex text-sm px-2 py-1 gap-2 items-center mt-3">
          <FaCircle className=" text-[8px]" /> BIOMETRIC NOT ADDED
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;

