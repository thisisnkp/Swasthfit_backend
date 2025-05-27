"use client";

// This is a client componen
import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/Navbar/ui/walletCard";
import {
  FaRupeeSign,
  FaEye,
  FaTags,
  FaWallet, // Added for payment button icon
} from "react-icons/fa";
import axios from "axios";

// Define interfaces for better type checking
interface Stat {
  icon: React.ElementType;
  name: string;
  quantity: number | string;
  color: string;
}

interface Address {
  area: string;
  locality: string;
  landmark: string;
  subdistrict: string;
  district: string;
  state: string;
  postalCode: string;
}

interface FormData {
  amount: string;
  gst: string;
  payment_mode: string;
  billing_address: Address;
  useSameAddress: boolean;
  business_address: Address;
}

interface Transaction {
  date: string;
  daily_reach: number;
  daily_conversion: number;
  daily_cost: number;
}

interface RechargeHistoryItem {
  created_at: string;
  recharge_amount: number;
  transaction_id: string;
  payment_mode: string;
}

interface WalletProps {}

const Wallet: React.FC<WalletProps> = () => {
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rechargeHistory, setRechargeHistory] = useState<RechargeHistoryItem[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [upiLink, setUpiLink] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [accessKey, setAccessKey] = useState<string>("");
  const [amount, setAmount] = useState<string>("100"); // Default for payment initiation
  const [phone, setPhone] = useState<string>(""); // Not used in initiatePayment in your code
  const [productInfo, setProductInfo] = useState<string>("Wallet Recharge"); // Not used in initiatePayment in your code
  const [error, setError] = useState<string>("");

  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    amount: "",
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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("gymAuthToken");

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
      const allTimeStats = data.all_time_stats || {};

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
          quantity: allTimeStats.reach || 0,
          color: "bg-yellow-600",
        },
        {
          icon: FaTags,
          name: "Total Conversion",
          quantity: allTimeStats.conversion || 0,
          color: "bg-green-500",
        },
      ]);

      setTransactions(data.daily_transactions || []);
      setRechargeHistory(data.recharge_history || []);
      setLoading(false);
    } catch (error: any) {
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleAuthError = () => {
    window.location.href = "/login";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const generateTxnId = (): string => {
    const randomPart = Math.floor(
      1000000000000000 + Math.random() * 9000000000000000
    );
    return "TXN" + randomPart;
  };

  const initiatePayment = async () => {
    try {
      const token = localStorage.getItem("gymAuthToken");
      console.log("token", token);

      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

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
      console.log("useedta", userResult.data.phone);

      const userId = userResult.data.user_id;
      const txnid = generateTxnId();

      const body = {
        user_id: userId,
        firstname: userResult.data.name,
        email: userResult.data.email,
        phone: userResult.data.phone,
        amount: "0.01", // Using a hardcoded amount for testing
        txnid: txnid,
        productinfo: "Gym Membership",
        surl: "http://localhost:4001/update-recharge-status", // Success URL for backend
        furl: "http://localhost:4001/update-recharge-status", // Failure URL for backend
      };

      console.log("body", body);

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
          setShowPaymentModal(true); // Assuming you want to show the modal for iframe as well
        }
      } else {
        alert("Payment Failed: " + result.message);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong!");
    }
  };

  const handleFormSubmit = async () => {
    try {
      const token = localStorage.getItem("gymAuthToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const formatAddress = (addr: Address): string => {
        return `${addr.area}, ${addr.locality}${
          addr.landmark ? `, ${addr.landmark}` : ""
        }, ${addr.subdistrict}, ${addr.district}, ${addr.state} - ${
          addr.postalCode
        }`;
      };

      const payload = {
        recharge_amount: parseFloat(formData.amount),
        gst: formData.gst,
        payment_mode: formData.payment_mode,
        billing_address: formatAddress(formData.billing_address),
        business_address: formData.useSameAddress
          ? formatAddress(formData.billing_address)
          : formatAddress(formData.business_address),
      };

      const paymentResponse = await axios.post(
        "http://localhost:4001/marketing/site/apis/payWalletRecharge",
        payload,
        config
      );

      if (paymentResponse.data.success) {
        alert("Payment successful! Wallet will be updated shortly.");
        setShowForm(false);
        fetchData(); // Refresh wallet data
      } else {
        throw new Error(paymentResponse.data.message || "Payment failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to process payment request.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
          <FaWallet className="mr-2" />
          Recharge Wallet
        </button>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Complete Payment
            </h2>

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
              <button
                onClick={() => {
                  window.open(upiLink, "_blank");
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Open UPI App
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setUpiLink("");
                  setQrCodeUrl("");
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

      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Recharge Wallet
        </button>
      </div>

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
                    <div>
                      ₹{parseFloat(item.recharge_amount.toString()).toFixed(2)}
                    </div>
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
                onClick={handleFormSubmit}
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
