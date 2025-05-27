"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

export default function PaymentPage() {
  const [upiLink, setUpiLink] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // State for input fields
  const [userName, setUserName] = useState("");
  const [amount, setAmount] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productInfo, setProductInfo] = useState("");

  // Removed type, paymentUrl, accessKey states as they are for the other payment flow
  // const [type, setType] = useState("");
  // const [paymentUrl, setPaymentUrl] = useState("");
  // const [accessKey, setAccessKey] = useState("");

  const generateTxnId = () => {
    const randomPart = Math.floor(
      1000000000000000 + Math.random() * 9000000000000000
    );
    return "TXN" + randomPart;
  };

  const handleGetUpiLink = async () => {
    const persisted = localStorage.getItem("persist:root");
    const parsed = persisted ? JSON.parse(persisted) : {};
    const ownerData = JSON.parse(parsed.owner || "{}");

    // Get selected gym ID from localStorage
    const selectedGymStr = localStorage.getItem("selectedGym");
    console.log("Selected Gym ID from localStorage:", selectedGymStr);

    // Ensure gymId is a string, default to empty string if null
    const gymId: string = selectedGymStr || "";

    if (!ownerData?.owner?.name || !ownerData?.owner?.email) {
      alert("User data missing. Please login again.");
      return;
    }

    const userEmail = ownerData.owner.email; // Use a different variable name to avoid conflict
    try {
      // Fetch user ID
      const userRes = await fetch(
        `http://localhost:4001/user/site/apis/getUserByEmail/${userEmail}`
      );
      const userResult = await userRes.json();
      if (!userResult.success || !userResult.data) {
        alert("User not found. Please check your email.");
        return;
      }
      // Assuming userResult.data.id is the user ID
      const userId: string = userResult.data.id; // Adjust type if it's a number

      // Construct the payload for generate-upi-link API
      const payload = {
        userName: userName, // Type: string
        amount: amount, // Type: string
        email: userEmail, // Use the fetched userEmail
        phone: phone, // Type: string
        productinfo: productInfo, // Type: string
        user_id: userId, // Type: string (or number, based on API)
        gym_id: gymId, // Type: string
        txnid: generateTxnId(), // Type: string
      };

      console.log("Generate UPI Link Payload:", payload); // Log the payload

      const response = await fetch("http://localhost:4001/generate-upi-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Generate UPI Link Response:", result);

      if (result.status === 1) {
        // Set UPI link and QR code URL from the response
        setUpiLink(result.upi_link); // Assuming the response key is upi_link

        // Use the provided Google Charts QR code URL
        setQrCodeUrl(
          "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=" +
            encodeURIComponent(result.upi_link)
        );
      } else {
        alert(
          "Failed to generate UPI link: " + (result.message || "Unknown error")
        );
        setUpiLink(""); // Clear previous link on failure
        setQrCodeUrl(""); // Clear previous QR code on failure
      }
    } catch (error) {
      console.error("Error generating UPI link:", error);
      alert("Something went wrong while generating UPI link!");
      setUpiLink(""); // Clear previous link on error
      setQrCodeUrl(""); // Clear previous QR code on error
    }
  };

  // Removed the initiatePayment function as per the request to focus on UPI link
  /* 
  const initiatePayment = async () => {
    // Function body removed to fix syntax error
  };
  */

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">UPI Payment</h1>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-gray-700">
            User Name
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="Enter user name"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number" // Use type="number" for amount
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label
            htmlFor="userEmail"
            className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email" // Use type="email" for email
            id="userEmail"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="Enter email"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel" // Use type="tel" for phone
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="Enter phone number"
          />
        </div>
        <div className="md:col-span-2">
          {" "}
          {/* Make product info span two columns on medium screens */}
          <label
            htmlFor="productInfo"
            className="block text-sm font-medium text-gray-700">
            Product Info
          </label>
          <input
            type="text"
            id="productInfo"
            value={productInfo}
            onChange={(e) => setProductInfo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="Enter product information"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleGetUpiLink} // Call the new function
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700">
          Get UPI Link
        </button>

        {/* Pay Now button */}
        {upiLink && (
          <a
            href={upiLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 inline-block">
            Pay Now
          </a>
        )}
      </div>

      {/* Rendering the QR Code and UPI Link */}
      {/* Check if upiLink is a non-empty string before rendering */}
      {upiLink && typeof upiLink === "string" && upiLink.length > 0 && (
        <div className="flex flex-col items-center justify-center mt-8">
          <h2 className="text-xl font-semibold mb-4">Scan to Pay</h2>
          {/* Always show the image tag with QR code URL */}
          <img
            src={
              "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=" +
              encodeURIComponent(upiLink)
            }
            alt="UPI QR Code"
            className="w-64 h-64"
          />

          <a
            href={upiLink}
            className="mt-4 text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer">
            Click here if you prefer to pay via UPI link
          </a>
        </div>
      )}
    </div>
  );
}
