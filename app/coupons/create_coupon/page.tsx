import React, { useState } from "react";

interface CreateCouponFormProps {
  onCreate: (formData: any) => void;
}

const CreateCouponForm: React.FC<CreateCouponFormProps> = ({ onCreate }) => {
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    discount_type: string;
    discount: string;
    valid_from: string;
    valid_to: string;
    apply_quantity_type: string;
    status: string;
    apply_quantity?: string; // Optional for "unlimited"
  }>({
    name: "",
    code: "",
    discount_type: "Percentage",
    discount: "",
    valid_from: "",
    valid_to: "",
    apply_quantity_type: "limited",
    status: "active",
    apply_quantity: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the coupon code
    if (!formData.code) {
      alert("Please enter a valid coupon code.");
      return;
    }

    const token = localStorage.getItem("gymAuthToken");

    try {
      const res = await fetch(
        `http://localhost:4001/gym/site/apis/checkCouponCode?code=${formData.code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      // Check if the coupon code already exists
      if (data.exists) {
        alert("Coupon code already exists. Please use a different code.");
        return;
      } else {
        // Prepare the payload
        const payload = { ...formData };
        if (formData.apply_quantity_type === "unlimited") {
          delete payload.apply_quantity;
        }

        // Call the onCreate function to create the coupon
        onCreate(payload);
      }
    } catch (error) {
      console.error("Error checking coupon code:", error);
      alert(
        "An error occurred while checking the coupon code. Please try again."
      );
    }
  };

  return (
    <form
      className="bg-white shadow-md rounded-lg p-6 space-y-4"
      onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Coupon Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Coupon Code
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Discount Type
        </label>
        <select
          name="discount_type"
          value={formData.discount_type}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500">
          <option value="Percentage">Percentage</option>
          <option value="Fixed">Fixed</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Discount
        </label>
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Valid From
          </label>
          <input
            type="date"
            name="valid_from"
            value={formData.valid_from}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Valid To
          </label>
          <input
            type="date"
            name="valid_to"
            value={formData.valid_to}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Apply Quantity Type
        </label>
        <select
          name="apply_quantity_type"
          value={formData.apply_quantity_type}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500">
          <option value="limited">Limited</option>
          <option value="unlimited">Unlimited</option>
        </select>
      </div>
      {formData.apply_quantity_type === "limited" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Apply Quantity
          </label>
          <input
            type="number"
            name="apply_quantity"
            value={formData.apply_quantity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            required
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500">
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
        Create Coupon
      </button>
    </form>
  );
};

export default CreateCouponForm;
