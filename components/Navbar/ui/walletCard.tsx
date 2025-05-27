import React from "react";

interface DashboardCardProps {
  icon: React.ElementType; // This type is for React components (like FaRupeeSign)
  name: string;
  quantity: number | string; // Quantity can be a number or a formatted string
  color: string; // Tailwind CSS color class (e.g., "bg-orange-500")
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon: Icon,
  name,
  quantity,
  color,
}) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md text-white ${color} flex items-center justify-between`}>
      <div className="text-4xl">
        {/* Render the icon component passed as a prop */}
        <Icon />
      </div>
      <div className="text-right">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-2xl font-bold">{quantity}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
