"use client";
import React from "react";
import { FiUploadCloud } from "react-icons/fi";
interface AdminKycFormProps {
  kycData: {
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    cancel_cheque: string;
    pan_name: string;
    pan_number: string;
    gstNumber: string;
    msmNumber: string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "cancel_cheque"
  ) => void;
  isEditing: boolean;
}

const AdminKycForm: React.FC<AdminKycFormProps> = ({
  kycData,
  onInputChange,
  onFileChange,
  isEditing,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">KYC Details</h2>
      <h3 className="mb-5 font-bold">Bank Details</h3>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="bank_name" className="block font-bold text-sm mb-1">
            Bank Name
          </label>
          <input
            id="bank_name"
            name="bank_name"
            type="text"
            value={kycData.bank_name}
            onChange={onInputChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>
        <div>
          <label
            htmlFor="account_holder_name"
            className="block font-bold text-sm mb-1">
            Account Holder Name
          </label>
          <input
            id="account_holder_name"
            name="account_holder_name"
            type="text"
            value={kycData.account_holder_name}
            onChange={onInputChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>
        <div>
          <label
            htmlFor="account_number"
            className="block font-bold text-sm mb-1">
            Account Number
          </label>
          <input
            id="account_number"
            name="account_number"
            type="text"
            value={kycData.account_number}
            onChange={onInputChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>
        <div>
          <label htmlFor="ifsc_code" className="block font-bold text-sm mb-1">
            IFSC Code
          </label>
          <input
            id="ifsc_code"
            name="ifsc_code"
            type="text"
            value={kycData.ifsc_code}
            onChange={onInputChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold mb-2">
            Upload Cancel Cheque
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={
                kycData.cancel_cheque ||
                "/swasthfit-gym/images/cancel_cheque.png"
              } // Use state value or fallback
              alt="Cancel Cheque"
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/swasthfit-gym/images/cancel_cheque.png";
              }} // Fallback image
            />
            <div
              className={`flex-1 border border-dashed border-gray-300 rounded-lg py-6 text-center ${
                isEditing ? "cursor-pointer" : "cursor-default"
              }`}>
              <div
                className={`text-xl flex items-center justify-center mb-4 ${
                  isEditing ? "" : "pointer-events-none"
                }`}
                onClick={() =>
                  isEditing &&
                  document.getElementById("cancelChequeInput")?.click()
                }>
                <FiUploadCloud />
              </div>
              <div
                className={`font-medium mb-1 ${
                  isEditing ? "text-indigo-600" : "text-gray-500"
                }`}>
                {isEditing ? "Click to upload" : "Read Only"}
              </div>
              <div className="text-sm text-gray-400">SVG, PNG, JPG or GIF</div>
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, "cancel_cheque")}
                  className="hidden"
                  id="cancelChequeInput"
                  disabled={!isEditing}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <h3 className="mb-5 mt-8 font-bold">PAN Card Details</h3>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="pan_name" className="block font-bold text-sm mb-1">
            Name as per PAN Card
          </label>
          <input
            id="pan_name"
            name="pan_name"
            type="text"
            value={kycData.pan_name}
            onChange={onInputChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>
        <div>
          <label htmlFor="pan_number" className="block font-bold text-sm mb-1">
            PAN Card Number
          </label>
          <input
            id="pan_number"
            name="pan_number"
            type="text"
            value={kycData.pan_number}
            onChange={onInputChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>

        <div>
          <label htmlFor="gstNumber" className="block font-bold text-sm mb-1">
            GST Number
          </label>
          <input
            id="gstNumber"
            name="gstNumber"
            type="text"
            value={kycData.gstNumber}
            onChange={onInputChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>
        <div>
          <label htmlFor="msmNumber" className="block font-bold text-sm mb-1">
            MSM Number
          </label>
          <input
            id="msmNumber"
            name="msmNumber"
            type="text"
            value={kycData.msmNumber}
            onChange={onInputChange}
            readOnly={!isEditing}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !isEditing ? "bg-gray-100 cursor-default" : "bg-white"
            }`}
          />
        </div>
      </form>
    </div>
  );
};

export default AdminKycForm;
