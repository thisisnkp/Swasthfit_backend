"use client";

import React, { useEffect, useState } from "react";

const QrCodePage: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        // Replace with your actual API endpoint or dynamic data source
        const agentId = "12345"; // Example agent ID
        const activityType = "workout"; // Example activity type
        const activityId = "67890"; // Example activity ID

        if (!agentId) {
          setError("Agent ID not found. Please log in.");
          setReferralLink("");
          setQrCodeUrl("");
          return;
        }

        const generatedLink = `http://localhost:3000/activity-scan?agent_id=${agentId}&activity_type=${activityType}&activity_id=${activityId}`;
        setReferralLink(generatedLink);

        const quickChartUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
          generatedLink
        )}&size=250`;
        setQrCodeUrl(quickChartUrl);
        setError("");
      } catch (err) {
        console.error("Error fetching referral data:", err);
        setError("Failed to generate referral link. Please try again.");
      }
    };

    fetchReferralData();
  }, []);

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => alert("Referral link copied to clipboard!"))
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          alert("Failed to copy link.");
        });
    } else {
      // Fallback for unsupported browsers
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Referral link copied to clipboard!");
      } catch (err) {
        console.error("Fallback: Failed to copy text: ", err);
        alert("Failed to copy link.");
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-center text-2xl font-bold text-blue-600 mb-2">
          Your Referral QR Code
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Ask students to scan this code to register under you.
        </p>
        {error ? (
          <p className="text-red-500 text-center mb-4">{error}</p>
        ) : (
          <>
            {qrCodeUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={qrCodeUrl}
                  alt="Referral QR"
                  className="w-64 h-64 object-contain"
                />
              </div>
            )}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                value={referralLink}
                readOnly
              />
              <button
                onClick={copyToClipboard}
                disabled={!referralLink}
                aria-disabled={!referralLink}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
                Copy
              </button>
            </div>
          </>
        )}
        <p className="text-sm text-gray-500 text-center">
          Share this link or QR with your referrals.
        </p>
      </div>
    </div>
  );
};

export default QrCodePage;
