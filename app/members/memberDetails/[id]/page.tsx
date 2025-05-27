"use client";
import { useState } from "react";
import Membership2 from "./profile";
import Model from "./model";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/solid";

export default function MembershipPage() {
  const [activeTab, setActiveTab] = useState("Information");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    "Information",
    "Subscriptions",
    "Attendance",
    "All Post",
    "Multi Gym Attendance",
    "Workout",
    "Follow Up History",
  ];

  const medicalDetails = [
    "Does s/he have a heart condition?",
    "Does s/he have Diabetes?",
    "Does s/he ever experience pain in his Chest when exercising or resting?",
    "Does s/he ever feel faint or dizzy spells?",
    "Does s/he have a back pain or joint pains?",
    "Does s/he have Asthma?",
    "Is s/he taking any medications?",
    "Have s/he had any surgery that may affect his physical activity?",
    "Does s/he have any injury or a reason to change his exercise regime?",
    "Is she Pregnant? Or given birth in past 7 weeks?",
    "Does s/he have any allergies?",
    "Does s/he don’t have any medical problem?",
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="bg-slate-100 shadow-md p-5 ">
        <div className="container mx-auto flex text-center items-center  justify-between">
          <h1 className="text-xl font-bold text-left">Member</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex bg-slate-100 flex-col md:flex-row gap-5 mx-2 p-4 ">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Membership2 />
        </div>

        {/* Content Area */}
        <div className="w-full md:w-4/4 ">
          {/* <div className="overflow-y-scroll  overflow-x-scroll scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 p-4 */}
          <div className="h-[auto] w-[100%] ">
            <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg ">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Edit
              </button>
              <button className="text-blue-500 px-4 py-2 rounded-lg border border-blue-500 hover:bg-blue-600 hover:text-white">
                Check in
              </button>
              <button className="text-blue-500 px-4 py-2 rounded-lg border border-blue-500 hover:bg-blue-600 hover:text-white">
                Send Notification
              </button>
              <button className="text-blue-500 px-4 py-2 rounded-lg border border-blue-500 hover:bg-blue-600 hover:text-white">
                Send WhatsApp Message
              </button>
              <button className="text-blue-500 px-4 py-2 rounded-lg border border-blue-500 hover:bg-blue-600 hover:text-white">
                Wallet
              </button>
            </div>
          </div>

          {/* MemberShip-Section */}
          <div className="mt-7 bg-white p-3 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Membership Actions</h2>

            <div className="mt-4 bg-gray-100 w-full h-auto md:h-[150px] rounded-lg p-4 flex flex-wrap gap-3 md:justify-between items-start">
              {/* Left Side Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  Assign Personal Training
                </button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  Book a Free Trial
                </button>
              </div>

              {/* Right Side Buttons */}
              <div className="flex flex-wrap md:flex-col gap-3">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={() => setIsModalOpen(true)}>
                  Add Subscription
                </button>
                {isModalOpen && (
                  <Model
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                  />
                )}

                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Assign Combo Offer
                </button>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="mt-5 pl-1 border-b border-gray-300 text-md ">
            <h1>
              <strong>Remarks</strong>
            </h1>
            <p className="pt-3 mb-5 text-sm">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam
              error ea quidem autem fugit sint a ex ratione aspernatur
              distinctio repudiandae corrupti eligendi tenetur praesentium
              assumenda, mollitia nisi! Earum accusantium sed, odit tenetur
              mollitia aliquid minus, eos porro esse suscipit magnam molestiae
              nostrum pariatur neque harum obcaecati. Tempora, cum? Saepe, quis
              error. Est ipsum nulla laudantium incidunt. Sint exercitationem
              repellat harum dolores culpa eum maxime laudantium a illum,
              voluptate quis quaerat in accusantium iste totam. Adipisci animi
              placeat consequatur minus officia dicta beatae assumenda ad
              maiores omnis voluptatum autem magni fugit, tempore ducimus,
              doloremque sequi incidunt repudiandae laboriosam quis veniam?
            </p>
          </div>
          {/* Navbar_page */}
          <div className="mt-5 bg-white ">
            <div className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-4 p-2 text-sm overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                      : "border-transparent text-gray-600 hover:text-black"
                  }`}
                  onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Medical History Design */}
          <div className="mt-7">
            {/* Header Section */}
            <div className="flex justify-between items-center bg-gray-800 text-white p-3 rounded-lg">
              <h2 className="text-lg font-semibold">Medical History</h2>
              <button className="p-2 hover:bg-gray-700 rounded">
                <PencilIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Medical Details List */}
            <div className="mt-3">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">Medical Details</h3>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                  <PlusIcon className="w-5 h-5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-3 text-sm">
                {medicalDetails.map((question, index) => (
                  <div key={index} className="">
                    <span className="font-medium">
                      {index + 1}. {question}
                    </span>
                    <br />
                    <span className="text-red-600 font-semibold">No</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mt-7">
            {/* Header Section */}
            <div className="flex justify-between items-center bg-gray-800 text-white p-2 rounded-lg">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <button
                className="p-2 hover:bg-gray-700 rounded"
                aria-label="Edit Information">
                <PencilIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
              {/* Member Details */}
              <div className="mt-3 ">
                <h3 className="text-md font-semibold mb-3">Member Details</h3>
                <div className="text-sm space-y-1">
                  <p>
                    Date of Birth: <span className="text-gray-700">None</span>
                  </p>
                  <p>
                    Age: <span className="text-gray-700">None</span>
                  </p>
                  <p>
                    Gender: <span className="text-gray-700">Male</span>
                  </p>
                </div>
              </div>

              {/* Emergency Contact Details */}
              <div className=" mt-3">
                <h3 className="text-md font-semibold mb-3">
                  Emergency Contact Details
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    Name: <span className="text-gray-700">None</span>
                  </p>
                  <p>
                    Mobile Number: <span className="text-gray-700">None</span>
                  </p>
                  <p>
                    Email Address: <span className="text-gray-700">None</span>
                  </p>
                  <p>
                    Relationship: <span className="text-gray-700">None</span>
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              <div className=" mt-3">
                <h3 className="text-md font-semibold mb-3">
                  Additional Details
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    Source of Promotion:{" "}
                    <span className="text-gray-700">Flyers</span>
                  </p>
                  <p>
                    Employment Status:{" "}
                    <span className="text-gray-700">Unknown</span>
                  </p>
                  <p>
                    Organization: <span className="text-gray-700">None</span>
                  </p>
                  <p>
                    Notes: <span className="text-gray-700">None</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical History Design  */}
          <div className="mt-7">
            {/* Header Section */}
            <div className="flex justify-between items-center bg-gray-800 text-white p-2 rounded-lg">
              <h2 className="text-lg font-semibold">
                Member Address & Location
              </h2>
              <button className="p-2 hover:bg-gray-700 rounded">
                <PencilIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Medical Details List */}
            <div className="mt-3">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">Address</h3>
                <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                  <PlusIcon className="w-5 h-5" />
                  <span>Add</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
                <h4>Member address han not be adde....</h4>
              </div>
            </div>
          </div>

          {/* div-End  */}
        </div>
      </div>
    </>
  );
}
