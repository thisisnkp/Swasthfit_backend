import React from "react";

const GymForm = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">
          Admin Please Fill up Your Details
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gym Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Super Star"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Super Star"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Gym Logo
                </label>
                <input
                  type="file"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">KYC Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Owner Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Super Star"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alternate Mobile Number
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Super Star"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Profile Image
                </label>
                <input
                  type="file"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email ID
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Super Star"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload SVO, PNO, JPO or OFF
                </label>
                <input
                  type="file"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </section>

          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GymForm;
