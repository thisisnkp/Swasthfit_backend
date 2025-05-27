import React from "react";

interface CardProps {
  status: "Active" | "Expired"; // Restrict to specific values
  couponName: string;
  discount: string;
  totalUsed: number;
  remaining: number | string; // Can be a number or "Unlimited"
  validUntil: string;
}

const Card: React.FC<CardProps> = ({
  status,
  couponName,
  discount,
  totalUsed,
  remaining,
  validUntil,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            status === "Active"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}>
          {status}
        </span>
        <span className="text-sm text-gray-500">Valid Until: {validUntil}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">{couponName}</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Discount</p>
          <p className="text-lg font-semibold text-gray-800">{discount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Used</p>
          <p className="text-lg font-semibold text-gray-800">{totalUsed}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="text-lg font-semibold text-gray-800">{remaining}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
