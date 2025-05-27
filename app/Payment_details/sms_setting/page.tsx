import React from "react";
const smsTypes = [
  "Birthday Messages",
  "Balance Due Messages",
  "Expiry Messages",
  "Before Expiry Messages",
  "After Expiry Messages",
  "Irregular Member Message",
];

export default function SmsSettings() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">
        SMS Settings (Basic Settings)
      </h2>

      <div className="overflow-x-auto  rounded-t-xl">
        <table className="min-w-full text-sm text-left border-separate border-spacing-y-4 ">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 p-3 text-center border-r border-gray-700 rounded-l-md">
                Operations
              </th>
              <th className="w-2/3 p-3 text-center rounded-r-md">Values</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {[
              {
                label: "Cron Irregular Members Message Template",
                templateName: "Birthday Template - 01",
                message:
                  "Dear Test User,\n\nHope your special day brings you all that your heart desire!\n\nHappy Birthday From YDL Fitness – Mumbai\n\n- YourDigitalLift",
              },
              {
                label: "Birthday Message Template",
                templateName: "Birthday Template - 01",
                message:
                  "Dear Test User,\n\nHope your special day brings you all that your heart desire!\n\nHappy Birthday From YDL Fitness – Mumbai\n\n- YourDigitalLift",
              },
              {
                label: "Enquiry Message Template",
                templateName: "Enquiry Template - 01",
                message:
                  "Dear Test User, Welcome to YDL Fitness – Mumbai, we are glad to know that you are interested in our services.\n\nAndroid App Link: https://bit.ly/android-app iOS App Link: https://bit.ly/ios-app Visit Our Website: https://yourdigitallift.com\n\n- YourDigitalLift",
              },
              {
                label: "Subscription Message Template",
                templateName: "Birthday Template - 01",
                message:
                  "Dear Test User,\n\nHope your special day brings you all that your heart desire!\n\nHappy Birthday From YDL Fitness – Mumbai\n\n- YourDigitalLift",
              },
            ].map((item, idx) => (
              <tr
                key={idx}
                className={`shadow-sm rounded-md ${
                  item.label.includes("Cron Irregular")
                    ? "bg-gray-200"
                    : "bg-gray-200"
                }`}>
                {/* Label Cell */}
                <td className="p-4 font-semibold text-gray-800  border-r border-gray-300 rounded-l-md align-top">
                  {item.label}
                </td>

                {/* Value Cell */}
                <td className="p-4 text-gray-700  rounded-r-md">
                  {item.label === "Cron Irregular Members Message Template" ? (
                    <div className="flex flex-wrap gap-2">
                      {smsTypes.map((type, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-2 text-md px-3 py-1 rounded-full shadow-sm cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 border-2 border-purple-600 rounded-md appearance-none 
                        flex items-center justify-center
                        checked:bg-transparent checked:before:content-['✔'] 
                        checked:before:text-purple-600 checked:before:text-xl checked:before:font-bold 
                        checked:before:flex checked:before:items-center checked:before:justify-center"
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap p-2 border border-gray-300 rounded-md bg-gray-100">
                        {item.message}
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                        <label className="text-sm text-gray-700 min-w-max">
                          Select{" "}
                          {item.label.includes("Enquiry")
                            ? "Enquiry"
                            : "Birthday"}{" "}
                          Template
                        </label>
                        <select className="border border-gray-300 rounded-md p-2 text-sm w-full md:w-auto">
                          <option>{item.templateName}</option>
                        </select>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <button className="bg-[#5955ff] hover:bg-[#4b49e2] text-white px-6 py-2 rounded-md text-sm font-medium">
          Save
        </button>
      </div>
    </div>
  );
}
