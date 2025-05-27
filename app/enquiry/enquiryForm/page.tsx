"use client";

import React from "react";

const EnquiriesPage = () => {
  // Placeholder options for dropdowns - you would typically fetch these or define them elsewhere
  const selectOptions = [
    { value: "", label: "Select One" },
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const genderOptions = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
    { id: "others", label: "Others" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-700">
          Enquiries (Basic Information)
        </h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          + Add Enquiry
        </button>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Column: Enquiry Basic Information */}
        <div className="w-full rounded-lg bg-white p-6 shadow lg:w-2/3">
          <form className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                id="customerName"
                defaultValue="ordingly_2022"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="customerEmail"
                className="block text-sm font-medium text-gray-700">
                Customer Email
              </label>
              <input
                type="email"
                name="customerEmail"
                id="customerEmail"
                placeholder="Email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobileNumber"
                id="mobileNumber"
                defaultValue="+91 9876543210"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="alternateMobileNumber"
                className="block text-sm font-medium text-gray-700">
                Alternate Mobile Number
              </label>
              <input
                type="tel"
                name="alternateMobileNumber"
                id="alternateMobileNumber"
                defaultValue="+91 9876543210"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="guardianContactMobileNumber"
                className="block text-sm font-medium text-gray-700">
                Guardian Contact Mobile Number
              </label>
              <input
                type="tel"
                name="guardianContactMobileNumber"
                id="guardianContactMobileNumber"
                defaultValue="+91 9876543210"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                defaultValue="1998-01-20" // HTML date format
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="enquiryDate"
                className="block text-sm font-medium text-gray-700">
                Enquiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="enquiryDate"
                id="enquiryDate"
                defaultValue="2025-01-01T03:04" // HTML datetime-local format
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="clientRep"
                className="block text-sm font-medium text-gray-700">
                Client Rep <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="clientRep"
                id="clientRep"
                defaultValue="Ashok kumoir"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex items-center space-x-4">
                {genderOptions.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={option.id}
                      name="gender"
                      type="radio"
                      defaultChecked={option.id === "male"} // Example default
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={option.id}
                      className="ml-2 block text-sm text-gray-900">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                id="address"
                rows={3}
                placeholder="Address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
            <div>
              <label
                htmlFor="customerCompanyName"
                className="block text-sm font-medium text-gray-700">
                Customer Company Name
              </label>
              <input
                type="text"
                name="customerCompanyName"
                id="customerCompanyName"
                placeholder="Name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="customerGSTNumber"
                className="block text-sm font-medium text-gray-700">
                Customer GST Number
              </label>
              <input
                type="text"
                name="customerGSTNumber"
                id="customerGSTNumber"
                placeholder="Number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="aadhaarNumber"
                className="block text-sm font-medium text-gray-700">
                Aadhaar Number
              </label>
              <input
                type="text"
                name="aadhaarNumber"
                id="aadhaarNumber"
                placeholder="Number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="panNumber"
                className="block text-sm font-medium text-gray-700">
                PAN Number
              </label>
              <input
                type="text"
                name="panNumber"
                id="panNumber"
                placeholder="Select"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="sourcePromotion"
                className="block text-sm font-medium text-gray-700">
                Source Promotion <span className="text-red-500">*</span>
              </label>
              <select
                id="sourcePromotion"
                name="sourcePromotion"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                {selectOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="sourceEnquiry"
                className="block text-sm font-medium text-gray-700">
                Source Enquiry <span className="text-red-500">*</span>
              </label>
              <select
                id="sourceEnquiry"
                name="sourceEnquiry"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                {selectOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="assignTrainer"
                className="block text-sm font-medium text-gray-700">
                Assign Trainer
              </label>
              <select
                id="assignTrainer"
                name="assignTrainer"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                {selectOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="followupStage"
                className="block text-sm font-medium text-gray-700">
                Followup Stage
              </label>
              <select
                id="followupStage"
                name="followupStage"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                {selectOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Right Column: Add Follow up */}
        <div className="w-full rounded-lg bg-white p-6 shadow lg:w-1/3">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Add Follow up
          </h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="typeOfFollowUp"
                className="block text-sm font-medium text-gray-700">
                Type of Follow Up <span className="text-red-500">*</span>
              </label>
              <select
                id="typeOfFollowUp"
                name="typeOfFollowUp"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="">
                {selectOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.value === ""}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="assignTo"
                className="block text-sm font-medium text-gray-700">
                Assign To <span className="text-red-500">*</span>
              </label>
              <select
                id="assignTo"
                name="assignTo"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="">
                {selectOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.value === ""}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="response"
                className="block text-sm font-medium text-gray-700">
                Response <span className="text-red-500">*</span>
              </label>
              <select
                id="response"
                name="response"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="">
                {selectOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.value === ""}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="convertibility"
                className="block text-sm font-medium text-gray-700">
                Convertibility <span className="text-red-500">*</span>
              </label>
              <select
                id="convertibility"
                name="convertibility"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="">
                {selectOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.value === ""}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="nextFollowUpDate"
                className="block text-sm font-medium text-gray-700">
                Next Follow up Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="nextFollowUpDate"
                id="nextFollowUpDate"
                defaultValue="2025-01-01T03:14" // Example default
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="contactMode"
                className="block text-sm font-medium text-gray-700">
                Contact Mode <span className="text-red-500">*</span>
              </label>
              <select
                id="contactMode"
                name="contactMode"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="">
                {selectOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.value === ""}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="toDoComment"
                className="block text-sm font-medium text-gray-700">
                To Do/Comment <span className="text-red-500">*</span>
              </label>
              <select
                id="toDoComment"
                name="toDoComment"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="">
                <option value="" disabled>
                  Quick Message
                </option>{" "}
                {/* Changed placeholder based on image */}
                {selectOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="quickMessage"
                className="block text-sm font-medium text-gray-700">
                Quick Message
              </label>
              <select
                id="quickMessage"
                name="quickMessage"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="">
                {selectOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.value === ""}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="remarksSummary"
                className="block text-sm font-medium text-gray-700">
                Remarks/Summary
              </label>
              <textarea
                name="remarksSummary"
                id="remarksSummary"
                rows={3}
                placeholder="Select One" // Assuming this might be a textarea or a select; using textarea for now
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Referral by
              </label>
              <div className="mt-1">
                <div className="flex items-center">
                  <input
                    type="text"
                    name="memberId"
                    id="memberId"
                    placeholder="Select One"
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    className="whitespace-nowrap rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Lookup member Code
                  </button>
                </div>
                <div className="my-2 flex items-center">
                  <hr className="flex-grow border-gray-300" />
                  <span className="mx-2 text-sm text-gray-500">OR</span>
                  <hr className="flex-grow border-gray-300" />
                </div>
                <select
                  id="thirdPartyReferralName"
                  name="thirdPartyReferralName"
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  defaultValue="">
                  {selectOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.value === ""}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Save
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Save & Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiriesPage;
