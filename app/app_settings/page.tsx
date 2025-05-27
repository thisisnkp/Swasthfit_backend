"use client";

import React, { useState, useEffect, useCallback, FC, FormEvent } from "react";
import {
  Calendar,
  UserPlus,
  ListChecks,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Type Definitions
interface User {
  id: number;
  user_name: string;
  user_email: string;
  user_mobile?: string; // Assuming mobile can be optional
}

interface Batch {
  id: number;
  gym_id: number;
  batch_from: string; // API returns time string, e.g., "10:00:00"
  batch_to: string; // API returns time string, e.g., "12:00:00"
  batch_name: string;
  total_hours?: string; // As per API response in ViewAssignedBatches
  createdAt?: string;
  updatedAt?: string;
}

interface AssignedUser {
  id: number;
  user_name: string;
  user_email: string;
  user_mobile: string;
}

interface GymAssignedBatch {
  id: number;
  batch_id: number;
  user_id: number;
  gym_id: number;
  createdAt: string;
  updatedAt: string;
  user: AssignedUser;
}

interface FullBatchDetails extends Batch {
  GymAssignedBatches: GymAssignedBatch[];
}

interface NotificationMessage {
  message: string;
  type: "success" | "error";
}

// Helper function to get gym_id from localStorage or use a default
const getGymId = (): string => {
  if (typeof window !== "undefined") {
    // Ensure localStorage is accessed only on the client
    const storedGymId = localStorage.getItem("gym_id");
    return storedGymId || "1";
  }
  // For now, directly using '1' as per prompt context, but localStorage is the target
  return storedGymId || "1";
};

// API Base URL
const API_BASE_URL = "http://localhost:4001/gym/site/apis";
const storedGymId = localStorage.getItem("gym_id");
console.log("gym_id fff ", storedGymId);

// Helper to format date for API (YYYY-MM-DD HH:MM:SS)
const formatDateTimeForAPI = (isoDateTime: string): string => {
  if (!isoDateTime) return "";
  return isoDateTime.replace("T", " ").substring(0, 19);
};

// Helper to get current datetime-local string for default values
const getCurrentDateTimeLocal = (addHours: number = 0): string => {
  const now = new Date();
  now.setHours(now.getHours() + addHours);
  now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15); // Round to nearest 15 min
  now.setSeconds(0);
  now.setMilliseconds(0);

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Notification Component
interface NotificationProps {
  message: string | null;
  type: "success" | "error" | null;
  onClose: () => void;
}

const Notification: FC<NotificationProps> = ({ message, type, onClose }) => {
  if (!message || !type) return null;
  const isSuccess = type === "success";
  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-md shadow-lg text-white ${
        isSuccess ? "bg-green-500" : "bg-red-500"
      } flex items-center space-x-2 z-50`}>
      {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-lg font-bold">
        &times;
      </button>
    </div>
  );
};

// Create Batch Component
interface CreateBatchProps {
  setNotification: (notification: NotificationMessage | null) => void;
}

const CreateBatch: FC<CreateBatchProps> = ({ setNotification }) => {
  const [batchName, setBatchName] = useState<string>("");
  const [batchFrom, setBatchFrom] = useState<string>(
    getCurrentDateTimeLocal(1)
  );
  const [batchTo, setBatchTo] = useState<string>(getCurrentDateTimeLocal(3));
  const [totalHours, setTotalHours] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (batchFrom && batchTo) {
      const fromDate = new Date(batchFrom);
      const toDate = new Date(batchTo);
      if (toDate.getTime() > fromDate.getTime()) {
        // Use getTime() for comparison
        const diffMs = toDate.getTime() - fromDate.getTime();
        const diffHrs = diffMs / (1000 * 60 * 60);
        setTotalHours(parseFloat(diffHrs.toFixed(2)));
      } else {
        setTotalHours(0);
      }
    } else {
      setTotalHours(0);
    }
  }, [batchFrom, batchTo]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (totalHours <= 0) {
      setNotification({
        message: "Batch end time must be after start time.",
        type: "error",
      });
      return;
    }
    if (!batchName.trim()) {
      setNotification({ message: "Batch name is required.", type: "error" });
      return;
    }

    setIsLoading(true);
    setNotification(null);
    const gymId = getGymId();

    const payload = {
      gym_id: storedGymId,
      batch_from: formatDateTimeForAPI(batchFrom),
      batch_to: formatDateTimeForAPI(batchTo),
      batch_name: batchName,
      total_hours: totalHours,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json(); // Define type for 'data' if possible
      if (response.ok && data.success) {
        setNotification({
          message: data.message || "Batch created successfully!",
          type: "success",
        });
        setBatchName("");
        setBatchFrom(getCurrentDateTimeLocal(1));
        setBatchTo(getCurrentDateTimeLocal(3));
      } else {
        setNotification({
          message: data.message || "Failed to create batch.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Create Batch API error:", error);
      setNotification({
        message: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Create New Batch
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="batchName"
            className="block text-sm font-medium text-gray-700">
            Batch Name
          </label>
          <input
            type="text"
            id="batchName"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="batchFrom"
              className="block text-sm font-medium text-gray-700">
              Batch From (Date & Time)
            </label>
            <input
              type="datetime-local"
              id="batchFrom"
              value={batchFrom}
              onChange={(e) => setBatchFrom(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="batchTo"
              className="block text-sm font-medium text-gray-700">
              Batch To (Date & Time)
            </label>
            <input
              type="datetime-local"
              id="batchTo"
              value={batchTo}
              onChange={(e) => setBatchTo(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Hours
          </label>
          <p className="mt-1 text-lg text-gray-900">
            {totalHours.toFixed(2)} hours
          </p>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {isLoading ? "Creating..." : "Create Batch"}
        </button>
      </form>
    </div>
  );
};

// Assign Batch Component
interface AssignBatchProps {
  setNotification: (notification: NotificationMessage | null) => void;
}

const AssignBatch: FC<AssignBatchProps> = ({ setNotification }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    setIsDataLoading(true);
    setNotification(null);
    try {
      const gymId = localStorage.getItem("gym_id");
      const parsedGymId = parseInt(gymId || "1", 10);

      const usersResponse = await fetch(`${API_BASE_URL}/users/gym`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gym_id: gymId,
        }),
      });
      const usersData: { success: boolean; users?: User[]; message?: string } =
        await usersResponse.json();
      if (usersResponse.ok && usersData.success) {
        setUsers(usersData.users || []);
      } else {
        setNotification({
          message: usersData.message || "Failed to fetch users.",
          type: "error",
        });
        setUsers([]);
      }

      const batchesResponse = await fetch(`${API_BASE_URL}/batches/gym`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gym_id: gymId,
        }),
      });
      const batchesData: {
        success: boolean;
        batches?: Batch[];
        message?: string;
      } = await batchesResponse.json();
      if (batchesResponse.ok && batchesData.success) {
        setBatches(batchesData.batches || []);
      } else {
        setNotification({
          message: batchesData.message || "Failed to fetch batches.",
          type: "error",
        });
        setBatches([]);
      }
    } catch (error) {
      console.error("Fetch users/batches error:", error);
      setNotification({
        message: "Error fetching data. Please try again.",
        type: "error",
      });
    } finally {
      setIsDataLoading(false);
    }
  }, [setNotification]); // Add setNotification to dependencies

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUserId || !selectedBatchId) {
      setNotification({
        message: "Please select a user and a batch.",
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    setNotification(null);
    const gymId = getGymId();
    const payload = {
      user_id: parseInt(selectedUserId, 10),
      batch_id: parseInt(selectedBatchId, 10),
      gym_id: storedGymId,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/assign-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: { success: boolean; message?: string } =
        await response.json();
      if (response.ok && data.success) {
        setNotification({
          message: data.message || "Batch assigned successfully!",
          type: "success",
        });
        setSelectedUserId("");
        setSelectedBatchId("");
        // Optionally, re-fetch assigned batches if this tab should reflect changes immediately
        // or if the 'View Assigned' tab needs to be updated.
      } else {
        setNotification({
          message: data.message || "Failed to assign batch.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Assign Batch API error:", error);
      setNotification({
        message: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return <div className="p-6 text-center">Loading users and batches...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Assign Batch to User
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="user"
            className="block text-sm font-medium text-gray-700">
            Select User
          </label>
          <select
            id="user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required>
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.user_name} ({user.user_email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="batch"
            className="block text-sm font-medium text-gray-700">
            Select Batch
          </label>
          <select
            id="batch"
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required>
            <option value="">-- Select Batch --</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.batch_name} ({batch.batch_from} - {batch.batch_to})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {isLoading ? "Assigning..." : "Assign Batch"}
        </button>
      </form>
    </div>
  );
};

// View Assigned Batches Component
interface ViewAssignedBatchesProps {
  setNotification: (notification: NotificationMessage | null) => void;
}

const ViewAssignedBatches: FC<ViewAssignedBatchesProps> = ({
  setNotification,
}) => {
  const [assignedBatches, setAssignedBatches] = useState<FullBatchDetails[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAssignedBatches = useCallback(async () => {
    setIsLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`${API_BASE_URL}/get-batches`);
      const data: {
        success: boolean;
        batches?: FullBatchDetails[];
        message?: string;
      } = await response.json();
      if (response.ok && data.success) {
        setAssignedBatches(data.batches || []);
      } else {
        setNotification({
          message: data.message || "Failed to fetch assigned batches.",
          type: "error",
        });
        setAssignedBatches([]);
      }
    } catch (error) {
      console.error("Fetch assigned batches error:", error);
      setNotification({
        message: "Error fetching assigned batches. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    fetchAssignedBatches();
  }, [fetchAssignedBatches]);

  if (isLoading) {
    return <div className="p-6 text-center">Loading assigned batches...</div>;
  }

  if (assignedBatches.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No batches found or no users assigned yet.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        View Assigned Batches
      </h2>
      <div className="space-y-6">
        {assignedBatches.map((batch) => (
          <div key={batch.id} className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-medium text-indigo-600">
              {batch.batch_name}
            </h3>
            <p className="text-sm text-gray-600">
              Time: {batch.batch_from} - {batch.batch_to} | Total Hours:{" "}
              {batch.total_hours || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Batch ID: {batch.id}, Gym ID: {batch.gym_id}
            </p>

            {batch.GymAssignedBatches && batch.GymAssignedBatches.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-2">
                  Assigned Users:
                </h4>
                <ul className="space-y-2">
                  {batch.GymAssignedBatches.map((assignment) => (
                    <li
                      key={assignment.id}
                      className="p-3 bg-gray-50 rounded-md border border-gray-100">
                      <p className="font-medium text-gray-800">
                        {assignment.user.user_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Email: {assignment.user.user_email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Mobile: {assignment.user.user_mobile || "N/A"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No users assigned to this batch yet.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Page Component (e.g., pages/batch-management.tsx)
const BatchManagementPage: FC = () => {
  const [activeTab, setActiveTab] = useState<string>("create");
  const [notification, setNotification] = useState<NotificationMessage | null>(
    null
  );
  const [currentGymId, setCurrentGymId] = useState<string>("");

  useEffect(() => {
    // Fetch gymId on client mount
    setCurrentGymId(getGymId());
  }, []);

  const handleSetNotification = (notif: NotificationMessage | null) => {
    setNotification(notif);
    if (notif) {
      setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
    }
  };

  const tabs = [
    { id: "create", label: "Create Batch", icon: <Calendar size={18} /> },
    { id: "assign", label: "Assign Batch", icon: <UserPlus size={18} /> },
    { id: "view", label: "View Assigned", icon: <ListChecks size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      <Notification
        message={notification?.message || null}
        type={notification?.type || null}
        onClose={() => setNotification(null)}
      />
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Gym Batch Management
          </h1>
          {currentGymId && (
            <>
              <p className="text-center text-gray-500">
                Manage and assign gym batches with ease. Current Gym ID:{" "}
                {currentGymId}
              </p>
              <p className="text-center text-xs text-gray-400 mt-1">
                (Note: Gym ID is currently set to '{currentGymId}'. In a real
                app, this would be dynamically set after login, e.g., from
                localStorage: <code>localStorage.getItem('gym_id')</code>.)
              </p>
            </>
          )}
        </header>

        <div className="mb-6">
          <div className="flex flex-wrap space-x-1 sm:space-x-2 border-b border-gray-300">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-3 sm:px-4 text-sm font-medium rounded-t-lg focus:outline-none
                  ${
                    activeTab === tab.id
                      ? "border-b-2 border-indigo-500 text-indigo-600 bg-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}>
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <main>
          {activeTab === "create" && (
            <CreateBatch setNotification={handleSetNotification} />
          )}
          {activeTab === "assign" && (
            <AssignBatch setNotification={handleSetNotification} />
          )}
          {activeTab === "view" && (
            <ViewAssignedBatches setNotification={handleSetNotification} />
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Gym Portal. All rights reserved.
          </p>
          <p className="text-xs mt-1">
            API Endpoints are expected at{" "}
            <code className="bg-gray-200 px-1 rounded">{API_BASE_URL}</code>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default BatchManagementPage;
