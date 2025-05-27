import React, { useState, useEffect } from "react";
import DashboardCard from "../../components/Small_components/Dashboard/dashboardCard";
import {
  FaRupeeSign,
  FaEye,
  FaTags,
  FaWallet, // Added for payment button icon
} from "react-icons/fa";
import axios from "axios";

const Wallet = () => {
  const [stats, setStats] = useState([
    { icon: FaRupeeSign, name: "Wallet", quantity: 0, color: "bg-orange-500" },
    { icon: FaEye, name: "Total Reach", quantity: 0, color: "bg-yellow-600" },
    {
      icon: FaTags,
      name: "Total Conversion",
      quantity: 0,
      color: "bg-green-500",
    },
  ]);
  const [transactions, setTransactions] = useState([]);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // New state variables for payment (kept, but their direct use for payment initiation might shift)
  const [upiLink, setUpiLink] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // Add these new state variables here
  const [type, setType] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [accessKey, setAccessKey] = useState("");
  // Default values for payment - you can modify these as needed
  // const [amount, setAmount] = useState("100"); // No longer needed as amount comes from formData
  // const [phone, setPhone] = useState(""); // No longer needed as phone comes from user data
  // const [productInfo, setProductInfo] = useState("Wallet Recharge"); // ProductInfo can be a constant

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  // Update formData state
  const [formData, setFormData] = useState({
    amount: "", // This will be the amount entered by the user
    gst: "",
    payment_mode: "online",
    billing_address: {
      area: "",
      locality: "",
      landmark: "",
      subdistrict: "",
      district: "",
      state: "",
      postalCode: "",
    },
    useSameAddress: true,
    business_address: {
      area: "",
      locality: "",
      landmark: "",
      subdistrict: "",
      district: "",
      state: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = import.meta.env.VITE_TOKEN;

        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:4001/marketing/site/apis/vendor-analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data?.data || {};
        const stats = data.all_time_stats || {};

        setStats([
          {
            icon: FaRupeeSign,
            name: "Wallet",
            quantity: parseFloat(data.wallet_balance || 0).toFixed(2),
            color: "bg-orange-500",
          },
          {
            icon: FaEye,
            name: "Total Reach",
            quantity: stats.reach || 0,
            color: "bg-yellow-600",
          },
          {
            icon: FaTags,
            name: "Total Conversion",
            quantity: stats.conversion || 0,
            color: "bg-green-500",
          },
        ]);

        // Set daily transactions
        setTransactions(data.daily_transactions || []);

        // Set recharge history
        setRechargeHistory(data.recharge_history || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);

        if (error.response) {
          if (error.response.status === 401) {
            setError("Authentication failed. Please log in again.");
          } else if (error.response.status === 403) {
            setError("You do not have permission to access this resource.");
          } else {
            setError(
              `Error: ${error.response.data.message || "Something went wrong"}`
            );
          }
        } else if (error.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError(`Error: ${error.message}`);
        }

        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAuthError = () => {
    window.location.href = "/login";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Generate a unique transaction ID
  const generateTxnId = () => {
    const randomPart = Math.floor(
      1000000000000000 + Math.random() * 9000000000000000
    ); // Ensures 16-digit number
    return "TXN" + randomPart;
  };

  // Function to handle payment - now triggered by form submission
  const initiatePayment = async (paymentDetails) => {
    // paymentDetails will contain amount, productInfo, etc.
    const productInfo = "Wallet Recharge"; // Constant product info for wallet recharge

    try {
      const token = import.meta.env.VITE_TOKEN;
      console.log("token", token);

      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      // 🔹 1. Fetch user data with bearer token
      const userRes = await fetch(
        `http://localhost:4001/marketing/site/apis/getVendor`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userResult = await userRes.json();
      console.log("user data", userResult.data.phone);

      const userId = userResult.data.user_id;

      const txnid = generateTxnId();

      const body = {
        user_id: userId,
        firstname: userResult.data.name,
        email: userResult.data.email,
        phone: userResult.data.phone,
        amount: paymentDetails.amount, // Use the amount from the form
        txnid: txnid,
        productinfo: productInfo, // Use the constant product info
        surl: "http://localhost:4001/update-recharge-status", // Ensure this URL is correct for your backend
        furl: "http://localhost:4001/update-recharge-status", // Ensure this URL is correct for your backend
      };

      console.log("body for payment initiation", body);

      const res = await fetch(
        `http://localhost:4001/marketing/wallet/initiate_payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await res.json();
      console.log("Payment Init Response:", result);

      if (result.status === 1) {
        if (result.type === "redirect") {
          window.location.href = result.redirect_url;
        } else if (result.type === "iframe") {
          setType("iframe");
          setPaymentUrl(result.payment_url);
          setAccessKey(result.access_key);
          setShowPaymentModal(true); // Show modal for iframe payments
        }
      } else {
        alert("Payment Failed: " + result.message);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong!");
    }
  };

  // Update handleFormSubmit
  const handleFormSubmit = async () => {
    try {
      // Validate form data before initiating payment
      if (
        !formData.amount ||
        isNaN(parseFloat(formData.amount)) ||
        parseFloat(formData.amount) <= 0
      ) {
        alert("Please enter a valid amount for recharge.");
        return;
      }
      if (
        !formData.billing_address.area ||
        !formData.billing_address.locality ||
        !formData.billing_address.postalCode
      ) {
        alert(
          "Please fill in required billing address fields: Area, Locality, Postal Code."
        );
        return;
      }
      // Add more validation for other fields as needed

      // Instead of making an API call directly, call initiatePayment with form data
      await initiatePayment({
        amount: parseFloat(formData.amount).toFixed(2), // Ensure amount is formatted correctly
        // You can pass other form details here if needed by initiatePayment,
        // though the current backend `initiate_payment` only needs amount, firstname, email, phone, productinfo
      });

      // You might want to close the form immediately, or after successful payment
      // depending on whether the payment gateway provides a direct callback to close the modal.
      setShowForm(false); // Close the form after initiating payment
      // fetchData(); // Fetch data to update wallet balance after successful payment
      // This will be handled by the update-recharge-status endpoint.
    } catch (err) {
      alert(err.message || "Failed to process payment request.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Recharge Wallet Button - this button will now open the form */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(true)} // Open the form when this button is clicked
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
          <FaWallet className="mr-2" />
          Recharge Wallet
        </button>
      </div>

      {/* Payment Modal (for iframe/QR/UPI link display if needed by Easebuzz) */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Complete Payment
            </h2>

            {/* Display iframe if type is 'iframe' */}
            {type === "iframe" && paymentUrl && accessKey && (
              <iframe
                src={`${paymentUrl}pay/${accessKey}`}
                style={{ width: "100%", height: "400px", border: "none" }}
                title="Easebuzz Payment"></iframe>
            )}

            {qrCodeUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={qrCodeUrl}
                  alt="Payment QR Code"
                  className="w-48 h-48"
                />
              </div>
            )}

            {upiLink && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">UPI Link:</p>
                <div className="p-2 bg-gray-100 rounded overflow-x-auto">
                  <code className="text-xs">{upiLink}</code>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-4">
              {upiLink && ( // Only show "Open UPI App" if upiLink exists
                <button
                  onClick={() => {
                    window.open(upiLink, "_blank");
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Open UPI App
                </button>
              )}
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setUpiLink("");
                  setQrCodeUrl("");
                  setType(""); // Reset type
                  setPaymentUrl(""); // Reset paymentUrl
                  setAccessKey(""); // Reset accessKey
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between">
          <span>{error}</span>
          {(error.includes("Authentication") || error.includes("log in")) && (
            <button
              onClick={handleAuthError}
              className="text-red-700 font-bold underline">
              Log In
            </button>
          )}
        </div>
      )}

      {/* Removed the extra "Recharge Wallet" button here */}
      {/* <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Recharge Wallet
        </button>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 mb-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-300 text-center">
          <h2 className="text-xl font-bold mb-2">Daily Transactions</h2>
          <div className="grid grid-cols-4 font-semibold text-lg border-b pb-2 mb-2">
            <div>Date</div>
            <div>Reach</div>
            <div>Conversion</div>
            <div>Cost</div>
          </div>

          {loading ? (
            <div className="py-4 text-gray-500">
              Loading transaction data...
            </div>
          ) : error ? (
            <div className="py-4 text-gray-500">
              Unable to load transaction data
            </div>
          ) : (
            <div className="max-h-100 overflow-y-auto space-y-2">
              {transactions.length > 0 ? (
                transactions.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-4 border-b py-1 text-sm text-gray-700">
                    <div>{item.date}</div>
                    <div>{item.daily_reach}</div>
                    <div>{item.daily_conversion}</div>
                    <div>₹{item.daily_cost}</div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-gray-500">
                  No transaction data available
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-300 text-center">
          <h2 className="text-xl font-bold mb-2">Recharge History</h2>
          <div className="grid grid-cols-4 font-semibold text-lg border-b pb-2 mb-2">
            <div>Date</div>
            <div>Amount</div>
            <div>Transaction ID</div>
            <div>Payment Mode</div>
          </div>

          {loading ? (
            <div className="py-4 text-gray-500">
              Loading recharge history...
            </div>
          ) : error ? (
            <div className="py-4 text-gray-500">
              Unable to load recharge history
            </div>
          ) : (
            <div className="max-h-100 overflow-y-auto space-y-2">
              {rechargeHistory.length > 0 ? (
                rechargeHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-4 border-b py-1 text-sm text-gray-700">
                    <div>{formatDate(item.created_at)}</div>
                    <div>₹{parseFloat(item.recharge_amount).toFixed(2)}</div>
                    <div>{item.transaction_id}</div>
                    <div>{item.payment_mode}</div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-gray-500">
                  No recharge history available
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-2xl space-y-4 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold">Recharge Wallet</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="GST Number"
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  value={formData.gst}
                  onChange={(e) =>
                    setFormData({ ...formData, gst: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  value={formData.payment_mode}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_mode: e.target.value })
                  }>
                  <option value="online">Online Payment</option>
                  <option value="card">Card Payment</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-3">Billing Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Area"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.billing_address.area}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_address: {
                          ...formData.billing_address,
                          area: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    placeholder="Locality"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.billing_address.locality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_address: {
                          ...formData.billing_address,
                          locality: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    placeholder="Landmark"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.billing_address.landmark}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_address: {
                          ...formData.billing_address,
                          landmark: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    placeholder="Sub District"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.billing_address.subdistrict}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_address: {
                          ...formData.billing_address,
                          subdistrict: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    placeholder="District"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.billing_address.district}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_address: {
                          ...formData.billing_address,
                          district: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    placeholder="State"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.billing_address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_address: {
                          ...formData.billing_address,
                          state: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    placeholder="Postal Code"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.billing_address.postalCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_address: {
                          ...formData.billing_address,
                          postalCode: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  checked={formData.useSameAddress}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      useSameAddress: !prev.useSameAddress,
                      business_address: !prev.useSameAddress
                        ? prev.billing_address
                        : prev.business_address,
                    }))
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <label>Use same address for billing and business</label>
              </div>

              {!formData.useSameAddress && (
                <div className="p-4 rounded-lg bg-blue-50">
                  <h3 className="font-semibold mb-3">Business Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="Area"
                      className="w-full border px-3 py-2 rounded"
                      value={formData.business_address.area}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          business_address: {
                            ...formData.business_address,
                            area: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      placeholder="Locality"
                      className="w-full border px-3 py-2 rounded"
                      value={formData.business_address.locality}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          business_address: {
                            ...formData.business_address,
                            locality: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      placeholder="Landmark"
                      className="w-full border px-3 py-2 rounded"
                      value={formData.business_address.landmark}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          business_address: {
                            ...formData.business_address,
                            landmark: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      placeholder="Sub District"
                      className="w-full border px-3 py-2 rounded"
                      value={formData.business_address.subdistrict}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          business_address: {
                            ...formData.business_address,
                            subdistrict: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      placeholder="District"
                      className="w-full border px-3 py-2 rounded"
                      value={formData.business_address.district}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          business_address: {
                            ...formData.business_address,
                            district: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      placeholder="State"
                      className="w-full border px-3 py-2 rounded"
                      value={formData.business_address.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          business_address: {
                            ...formData.business_address,
                            state: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      placeholder="Postal Code"
                      className="w-full border px-3 py-2 rounded"
                      value={formData.business_address.postalCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          business_address: {
                            ...formData.business_address,
                            postalCode: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">
                Cancel
              </button>
              <button
                onClick={handleFormSubmit} // This button now calls handleFormSubmit
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
