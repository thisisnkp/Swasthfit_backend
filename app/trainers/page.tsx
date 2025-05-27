"use client";

import React, { useState, useCallback, useEffect } from "react";

// Define the available tabs
type Tab = "register" | "view" | "edit";

// Define the Trainer data structure based on the API responses
interface Trainer {
  id?: string; // UI internal ID, not from API directly
  user_id?: number; // From API response
  gym_id?: number; // From API response

  // Fields for check-trainer & trainer/create API payloads
  email: string; // Corresponds to user_email in user object
  name: string; // Corresponds to user_name in user object
  mobile: string; // Corresponds to user_mobile in user object

  // Fields directly from Trainer model
  firstname: string;
  lastname: string;
  profile_photo: string;
  transformation_photos: string;
  address: string; // Corresponds to user_address in UI
  expertise: string;
  experience: string;
  bank_account_no: string;
  ifsc_code: string;
  time_slot: string;
  client_price: number;

  // Optional fields from API responses (can be null)
  client_details?: string | null;
  client_bio?: string | null;
  client_quote?: number | null;
  client_qr_code?: string | null;
  marketing_suite_purchases?: string | null;
  ratings?: string | null;
  aadhar_details?: string | null; // From Sequelize Trainer model
  pan_details?: string | null; // From Sequelize Trainer model
  offer?: string | null;
  diet_and_workout_details?: string | null;
  commission_earned?: number | null;
  created_at?: string; // ISO date string from API
  updated_at?: string; // ISO date string from API

  // Additional UI-only fields that might be mapped to API fields
  user_dob?: string;
  user_age?: number;
  user_gender?: string;
  user_bank?: string;
  user_height?: number;
  user_weight?: number;
  user_earned_coins?: number;
  user_gullak_money_earned?: number;
  user_gullak_money_used?: number;
  user_competitions?: string;
  user_type?: string; // 'gym-trainer'
  user_social_media_id?: string;
  user_downloads?: number;
  user_ratings?: string; // Redundant with 'ratings'
  user_qr_code?: string;
  is_signup?: boolean;
  otpless_token?: string;
  is_approved?: boolean;

  // Local state management timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Default initial state for a new trainer, matching the 'trainer/create' payload structure
const initialTrainerState: Trainer = {
  id: "", // Will be generated locally for UI state management
  email: "",
  name: "",
  mobile: "",
  firstname: "",
  lastname: "",
  profile_photo: "",
  transformation_photos: "",
  address: "",
  expertise: "",
  experience: "",
  bank_account_no: "",
  ifsc_code: "",
  time_slot: "",
  client_price: 0,
  client_details: null,
  client_bio: null,
  client_quote: null,
  client_qr_code: null,
  marketing_suite_purchases: null,
  ratings: null,
  aadhar_details: null,
  pan_details: null,
  offer: null,
  diet_and_workout_details: null,
  commission_earned: null,
  user_type: "gym-trainer", // Default value
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Custom Modal Component
interface ModalProps {
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const CustomModal: React.FC<ModalProps> = ({
  message,
  onConfirm,
  onCancel,
  showCancelButton = false,
}) => {
  if (!message) return null; // Don't render if no message

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          {showCancelButton && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors">
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const TrainerManagementPage: React.FC = () => {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState<Tab>("register");
  // State to manage the list of trainers fetched from API
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  // State to manage the trainer being edited
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  // State for the form data when creating/editing a trainer
  const [formData, setFormData] = useState<Trainer>(initialTrainerState);
  // State for the initial email/username verification
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyUsername, setVerifyUsername] = useState("");
  const [showFullForm, setShowFullForm] = useState(false);
  // State for custom modal
  const [modalMessage, setModalMessage] = useState("");
  const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | null>(
    null
  );
  const [modalOnCancel, setModalOnCancel] = useState<(() => void) | null>(null);
  const [showModalCancel, setShowModalCancel] = useState(false);
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);

  // Simulate storing gym_id and auth token in localStorage for demonstration
  useEffect(() => {
    if (!localStorage.getItem("gym_id")) {
      localStorage.setItem("gym_id", "1"); // Example gym ID
    }
    if (!localStorage.getItem("gymAuthToken")) {
      localStorage.setItem("gymAuthToken", "mock_auth_token_123"); // Example token
    }
  }, []);

  // Fetch trainers when 'view' tab is active or after a successful operation
  useEffect(() => {
    if (activeTab === "view") {
      fetchTrainers();
    }
  }, [activeTab]); // Dependency on activeTab to refetch when switching to view

  // Handle tab button clicks
  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "register") {
      setFormData(initialTrainerState); // Reset form for new registration
      setShowFullForm(false); // Hide full form initially
      setVerifyEmail("");
      setVerifyUsername("");
    }
    if (tab === "view") {
      setSelectedTrainer(null); // Clear selected trainer when viewing all
      fetchTrainers(); // Ensure trainers are fetched when navigating to 'view'
    }
  };

  // Handle form field changes
  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // API call: check-trainer
  const handleVerifyUser = async () => {
    if (!verifyEmail || !verifyUsername) {
      setModalMessage("Please enter both email and username to proceed.");
      setModalOnConfirm(() => () => setModalMessage(""));
      setShowModalCancel(false);
      return;
    }

    const gymId = localStorage.getItem("gym_id");
    const authToken = localStorage.getItem("gymAuthToken");

    if (!gymId || !authToken) {
      setModalMessage(
        "Gym ID or Auth Token not found in local storage. Please ensure you are logged in."
      );
      setModalOnConfirm(() => () => setModalMessage(""));
      setShowModalCancel(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4001/gym/site/apis/check-trainer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            email: verifyEmail,
            name: verifyUsername,
            gym_id: Number(gymId),
          }),
        }
      );

      const result = await response.json();
      console.log("Check Trainer API Response:", result);

      if (!response.ok) {
        // Handle non-2xx responses, e.g., 404 for "Trainer profile not found"
        if (result.message === "Trainer profile not found for this user.") {
          setModalMessage(
            "Trainer profile not found. Proceeding to create new trainer profile."
          );
          setModalOnConfirm(() => () => {
            setModalMessage("");
            setShowFullForm(true); // Go to full form for new trainer
            // Pre-fill email, name, mobile from verification fields
            setFormData((prev) => ({
              ...initialTrainerState,
              email: verifyEmail,
              name: verifyUsername, // Assuming username maps to name
              mobile: "", // Mobile isn't part of verification, so leave blank or try to get from user
            }));
          });
          setShowModalCancel(false);
        } else {
          setModalMessage(
            `Error verifying trainer: ${result.message || "Unknown error"}`
          );
          setModalOnConfirm(() => () => setModalMessage(""));
          setShowModalCancel(false);
        }
      } else {
        // Trainer profile found
        setModalMessage(
          "Trainer profile found. Pre-filling details for editing."
        );
        setModalOnConfirm(() => () => {
          setModalMessage("");
          setShowFullForm(true); // Go to full form, pre-filled
          // Map API response to formData
          const apiTrainer = result.trainer; // Assuming 'trainer' is the key for the trainer object
          const apiUser = result.user; // Assuming 'user' is the key for the user object

          const mappedTrainer: Trainer = {
            ...initialTrainerState, // Start with default to ensure all fields are present
            id: apiTrainer.id ? String(apiTrainer.id) : crypto.randomUUID(), // Use API ID or generate
            user_id: apiTrainer.user_id,
            gym_id: apiTrainer.gym_id,
            email: apiUser?.user_email || verifyEmail,
            name: apiUser?.user_name || verifyUsername,
            mobile: apiUser?.user_mobile || "",
            firstname: apiTrainer.firstname || "",
            lastname: apiTrainer.lastname || "",
            profile_photo: apiTrainer.profile_photo || "",
            transformation_photos: apiTrainer.transformation_photos || "",
            address: apiTrainer.address || "",
            expertise: apiTrainer.expertise || "",
            experience: apiTrainer.experience || "",
            bank_account_no: apiTrainer.bank_account_no || "",
            ifsc_code: apiTrainer.ifsc_code || "",
            time_slot: apiTrainer.time_slot || "",
            client_price: apiTrainer.client_price || 0,
            client_details: apiTrainer.client_details,
            client_bio: apiTrainer.client_bio,
            client_quote: apiTrainer.client_quote,
            client_qr_code: apiTrainer.client_qr_code,
            marketing_suite_purchases: apiTrainer.marketing_suite_purchases,
            ratings: apiTrainer.ratings,
            aadhar_details: apiTrainer.aadhar_details,
            pan_details: apiTrainer.pan_details,
            offer: apiTrainer.offer,
            diet_and_workout_details: apiTrainer.diet_and_workout_details,
            commission_earned: apiTrainer.commission_earned,
            created_at: apiTrainer.created_at,
            updated_at: apiTrainer.updated_at,
          };
          setFormData(mappedTrainer);
          setSelectedTrainer(mappedTrainer); // Set selected trainer for edit mode
        });
        setShowModalCancel(false);
      }
    } catch (error) {
      console.error("Error during check-trainer API call:", error);
      setModalMessage(
        `Network error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setModalOnConfirm(() => () => setModalMessage(""));
      setShowModalCancel(false);
    } finally {
      setIsLoading(false);
    }
  };

  // API call: trainer/create
  const handleAddTrainer = async (e: React.FormEvent) => {
    e.preventDefault();

    const gymId = localStorage.getItem("gym_id");
    const authToken = localStorage.getItem("gymAuthToken");

    if (!gymId || !authToken) {
      setModalMessage("Gym ID or Auth Token not found in local storage.");
      setModalOnConfirm(() => () => setModalMessage(""));
      setShowModalCancel(false);
      return;
    }

    setIsLoading(true);
    try {
      // Construct payload with only the required fields
      const payload = {
        email: formData.email,
        name: formData.name,
        mobile: formData.mobile,
        firstname: formData.firstname,
        lastname: formData.lastname,
        profile_photo: formData.profile_photo,
        transformation_photos: formData.transformation_photos,
        address: formData.address,
        expertise: formData.expertise,
        experience: formData.experience,
        bank_account_no: formData.bank_account_no,
        ifsc_code: formData.ifsc_code,
        time_slot: formData.time_slot,
        client_price: formData.client_price,
        gym_id: Number(gymId), // Pass gym_id from local storage
      };

      const response = await fetch(
        "http://localhost:4001/gym/site/apis/trainer/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("Create Trainer API Response:", result);

      if (response.ok) {
        setModalMessage("Trainer registered successfully!");
        setModalOnConfirm(() => () => {
          setModalMessage("");
          handleTabClick("view"); // Go to view trainers tab
        });
        setShowModalCancel(false);
      } else {
        setModalMessage(
          `Failed to register trainer: ${result.message || "Unknown error"}`
        );
        setModalOnConfirm(() => () => setModalMessage(""));
        setShowModalCancel(false);
      }
    } catch (error) {
      console.error("Error adding trainer:", error);
      setModalMessage(
        `Network error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setModalOnConfirm(() => () => setModalMessage(""));
      setShowModalCancel(false);
    } finally {
      setIsLoading(false);
    }
  };

  // API call: trainers/:gym_id
  const fetchTrainers = useCallback(async () => {
    const gymId = localStorage.getItem("gym_id");
    const authToken = localStorage.getItem("gymAuthToken");

    if (!gymId || !authToken) {
      setModalMessage(
        "Gym ID or Auth Token not found in local storage. Cannot fetch trainers."
      );
      setModalOnConfirm(() => () => setModalMessage(""));
      setShowModalCancel(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4001/gym/site/apis/trainers/${gymId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result = await response.json();
      console.log("Fetch Trainers API Response:", result);

      if (response.ok && result.success) {
        // Map API response to local Trainer interface
        const fetchedTrainers: Trainer[] = result.trainers.map(
          (apiTrainer: any) => ({
            id: String(apiTrainer.id), // Use API's ID as unique key
            user_id: apiTrainer.user_id,
            gym_id: apiTrainer.gym_id,
            email: apiTrainer.user?.user_email || "", // Get email from nested user object
            name: apiTrainer.user?.user_name || "", // Get name from nested user object
            mobile: apiTrainer.user?.user_mobile || "", // Get mobile from nested user object
            firstname: apiTrainer.firstname || "",
            lastname: apiTrainer.lastname || "",
            profile_photo: apiTrainer.profile_photo || "",
            transformation_photos: apiTrainer.transformation_photos || "",
            address: apiTrainer.address || "",
            expertise: apiTrainer.expertise || "",
            experience: apiTrainer.experience || "",
            bank_account_no: apiTrainer.bank_account_no || "",
            ifsc_code: apiTrainer.ifsc_code || "",
            time_slot: apiTrainer.time_slot || "",
            client_price: apiTrainer.client_price || 0,
            client_details: apiTrainer.client_details,
            client_bio: apiTrainer.client_bio,
            client_quote: apiTrainer.client_quote,
            client_qr_code: apiTrainer.client_qr_code,
            marketing_suite_purchases: apiTrainer.marketing_suite_purchases,
            ratings: apiTrainer.ratings,
            aadhar_details: apiTrainer.aadhar_details,
            pan_details: apiTrainer.pan_details,
            offer: apiTrainer.offer,
            diet_and_workout_details: apiTrainer.diet_and_workout_details,
            commission_earned: apiTrainer.commission_earned,
            created_at: apiTrainer.created_at,
            updated_at: apiTrainer.updated_at,
            // Set local Date objects for consistency if needed for sorting/display
            createdAt: apiTrainer.created_at
              ? new Date(apiTrainer.created_at)
              : new Date(),
            updatedAt: apiTrainer.updated_at
              ? new Date(apiTrainer.updated_at)
              : new Date(),
          })
        );
        setTrainers(fetchedTrainers);
      } else {
        setModalMessage(
          `Failed to fetch trainers: ${result.message || "Unknown error"}`
        );
        setModalOnConfirm(() => () => setModalMessage(""));
        setShowModalCancel(false);
        setTrainers([]); // Clear trainers on error
      }
    } catch (error) {
      console.error("Error fetching trainers:", error);
      setModalMessage(
        `Network error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setModalOnConfirm(() => () => setModalMessage(""));
      setShowModalCancel(false);
      setTrainers([]); // Clear trainers on network error
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array as gymId and authToken are from localStorage

  // Handle updating an existing trainer (assuming an API for this would be similar to create)
  const handleUpdateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer?.id) {
      setModalMessage("Error: Trainer not selected for update.");
      setModalOnConfirm(() => () => setModalMessage(""));
      setShowModalCancel(false);
      return;
    }

    const gymId = localStorage.getItem("gym_id");
    const authToken = localStorage.getItem("gymAuthToken");

    if (!gymId || !authToken) {
      setModalMessage("Gym ID or Auth Token not found in local storage.");
      setModalOnConfirm(() => () => setModalMessage(""));
      setShowModalCancel(false);
      return;
    }

    setIsLoading(true);
    try {
      // Assuming an update API would take similar fields as create, plus the trainer ID
      // Replace with your actual update API endpoint and payload if different
      const updatePayload = {
        id: selectedTrainer.id, // Assuming ID is part of update payload
        email: formData.email,
        name: formData.name,
        mobile: formData.mobile,
        firstname: formData.firstname,
        lastname: formData.lastname,
        profile_photo: formData.profile_photo,
        transformation_photos: formData.transformation_photos,
        address: formData.address,
        expertise: formData.expertise,
        experience: formData.experience,
        bank_account_no: formData.bank_account_no,
        ifsc_code: formData.ifsc_code,
        time_slot: formData.time_slot,
        client_price: formData.client_price,
        gym_id: Number(gymId),
        // Include other fields if your update API expects them
        aadhar_details: formData.aadhar_details,
        pan_details: formData.pan_details,
        client_details: formData.client_details,
        client_bio: formData.client_bio,
        client_quote: formData.client_quote,
        client_qr_code: formData.client_qr_code,
        marketing_suite_purchases: formData.marketing_suite_purchases,
        ratings: formData.ratings,
        offer: formData.offer,
        diet_and_workout_details: formData.diet_and_workout_details,
        commission_earned: formData.commission_earned,
      };

      const response = await fetch(
        `http://localhost:4001/gym/site/apis/trainer/update/${selectedTrainer.id}`,
        {
          // Example update endpoint
          method: "PUT", // Or PATCH depending on your API
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatePayload),
        }
      );

      const result = await response.json();
      console.log("Update Trainer API Response:", result);

      if (response.ok) {
        setModalMessage("Trainer details updated successfully!");
        setModalOnConfirm(() => () => {
          setModalMessage("");
          handleTabClick("view"); // Go back to view trainers tab
        });
        setShowModalCancel(false);
      } else {
        setModalMessage(
          `Failed to update trainer: ${result.message || "Unknown error"}`
        );
        setModalOnConfirm(() => () => setModalMessage(""));
        setShowModalCancel(false);
      }
    } catch (error) {
      console.error("Error updating trainer:", error);
      setModalMessage(
        `Network error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setModalOnConfirm(() => () => setModalMessage(""));
      setShowModalCancel(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a trainer (assuming an API for this)
  const handleDeleteTrainer = useCallback(
    (trainerId: string) => {
      setModalMessage("Are you sure you want to remove this trainer?");
      setModalOnConfirm(() => async () => {
        setModalMessage(""); // Close modal immediately

        const authToken = localStorage.getItem("gymAuthToken");
        if (!authToken) {
          setModalMessage(
            "Auth Token not found in local storage. Cannot delete trainer."
          );
          setModalOnConfirm(() => () => setModalMessage(""));
          setShowModalCancel(false);
          return;
        }

        setIsLoading(true);
        try {
          const response = await fetch(
            `http://localhost:4001/gym/site/apis/trainer/delete/${trainerId}`,
            {
              // Example delete endpoint
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          const result = await response.json();
          console.log("Delete Trainer API Response:", result);

          if (response.ok) {
            setModalMessage("Trainer removed successfully!");
            setModalOnConfirm(() => () => {
              setModalMessage("");
              fetchTrainers(); // Re-fetch trainers after deletion
            });
            setShowModalCancel(false);
          } else {
            setModalMessage(
              `Failed to remove trainer: ${result.message || "Unknown error"}`
            );
            setModalOnConfirm(() => () => setModalMessage(""));
            setShowModalCancel(false);
          }
        } catch (error) {
          console.error("Error removing trainer:", error);
          setModalMessage(
            `Network error: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
          setModalOnConfirm(() => () => setModalMessage(""));
          setShowModalCancel(false);
        } finally {
          setIsLoading(false);
        }
      });
      setModalOnCancel(() => () => setModalMessage("")); // Close modal on cancel
      setShowModalCancel(true);
    },
    [fetchTrainers]
  ); // Dependency on fetchTrainers to ensure it's up-to-date

  // Handle edit button click on a trainer card
  const handleEditClick = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    // Map the fetched trainer data to the formData for editing
    setFormData({
      ...initialTrainerState, // Start with initial state to ensure all fields are present
      ...trainer, // Overlay existing trainer data
      // Ensure specific mappings if needed, e.g., address from API to user_address for UI if not directly mapped
      address: trainer.address || "", // Ensure 'address' is used for the form
      email: trainer.email || trainer.email || "", // Prioritize 'email' from API, fallback to user_email
      name: trainer.name || trainer.name || "", // Prioritize 'name' from API, fallback to user_name
      mobile: trainer.mobile || trainer.mobile || "", // Prioritize 'mobile' from API, fallback to user_mobile
    });
    setActiveTab("edit");
  };

  // Render the form fields for trainer creation/editing
  const renderTrainerForm = (isEditMode: boolean) => (
    <form
      onSubmit={isEditMode ? handleUpdateTrainer : handleAddTrainer}
      className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">
        {isEditMode ? "Edit Trainer Details" : "Trainer Information"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Fields for trainer/create API */}
        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleFieldChange}
          required
        />
        <InputField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleFieldChange}
          required
        />
        <InputField
          label="Mobile"
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={handleFieldChange}
          required
        />
        <InputField
          label="First Name"
          name="firstname"
          value={formData.firstname}
          onChange={handleFieldChange}
          required
        />
        <InputField
          label="Last Name"
          name="lastname"
          value={formData.lastname}
          onChange={handleFieldChange}
          required
        />
        <InputField
          label="Profile Photo URL"
          name="profile_photo"
          value={formData.profile_photo}
          onChange={handleFieldChange}
        />
        <InputField
          label="Transformation Photos URLs (comma separated)"
          name="transformation_photos"
          value={formData.transformation_photos}
          onChange={handleFieldChange}
        />
        <TextAreaField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleFieldChange}
        />
        <TextAreaField
          label="Expertise"
          name="expertise"
          value={formData.expertise}
          onChange={handleFieldChange}
        />
        <InputField
          label="Experience"
          name="experience"
          value={formData.experience}
          onChange={handleFieldChange}
        />
        <InputField
          label="Bank Account No."
          name="bank_account_no"
          value={formData.bank_account_no}
          onChange={handleFieldChange}
        />
        <InputField
          label="IFSC Code"
          name="ifsc_code"
          value={formData.ifsc_code}
          onChange={handleFieldChange}
        />
        <TextAreaField
          label="Time Slot"
          name="time_slot"
          value={formData.time_slot}
          onChange={handleFieldChange}
        />
        <InputField
          label="Client Price"
          name="client_price"
          type="number"
          value={formData.client_price}
          onChange={handleFieldChange}
        />

        {/* Additional fields from the full trainer model, if they are to be edited/displayed */}
        <InputField
          label="Client Details"
          name="client_details"
          value={formData.client_details || ""}
          onChange={handleFieldChange}
        />
        <TextAreaField
          label="Client Bio"
          name="client_bio"
          value={formData.client_bio || ""}
          onChange={handleFieldChange}
        />
        <InputField
          label="Client Quote"
          name="client_quote"
          type="number"
          value={formData.client_quote || 0}
          onChange={handleFieldChange}
        />
        <InputField
          label="Client QR Code Data"
          name="client_qr_code"
          value={formData.client_qr_code || ""}
          onChange={handleFieldChange}
        />
        <InputField
          label="Marketing Suite Purchases"
          name="marketing_suite_purchases"
          value={formData.marketing_suite_purchases || ""}
          onChange={handleFieldChange}
        />
        <InputField
          label="Ratings"
          name="ratings"
          value={formData.ratings || ""}
          onChange={handleFieldChange}
        />
        <InputField
          label="Aadhar Details"
          name="aadhar_details"
          value={formData.aadhar_details || ""}
          onChange={handleFieldChange}
        />
        <InputField
          label="PAN Details"
          name="pan_details"
          value={formData.pan_details || ""}
          onChange={handleFieldChange}
        />
        <InputField
          label="Offer"
          name="offer"
          value={formData.offer || ""}
          onChange={handleFieldChange}
        />
        <TextAreaField
          label="Diet and Workout Details"
          name="diet_and_workout_details"
          value={formData.diet_and_workout_details || ""}
          onChange={handleFieldChange}
        />
        <InputField
          label="Commission Earned"
          name="commission_earned"
          type="number"
          value={formData.commission_earned || 0}
          onChange={handleFieldChange}
        />
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        {isEditMode && (
          <button
            type="button"
            onClick={() => handleTabClick("view")}
            className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors shadow-md">
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-lg font-semibold">
          {isEditMode ? "Update Trainer" : "Register Trainer"}
        </button>
      </div>
    </form>
  );

  // Helper component for input fields
  const InputField: React.FC<{
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
  }> = ({ label, name, value, onChange, type = "text", required = false }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
      />
    </div>
  );

  // Helper component for textarea fields
  const TextAreaField: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
  }> = ({ label, name, value, onChange, required = false }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={3}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white"
      />
    </div>
  );

  // Helper component for select fields (retained for potential future use or if needed for gender etc.)
  const SelectField: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    required?: boolean;
  }> = ({ label, name, value, onChange, options, required = false }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white">
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  // Render content based on active tab
  const renderTabContent = () => {
    if (isLoading) {
      return <div className="text-center py-8 text-gray-600">Loading...</div>;
    }

    if (activeTab === "register") {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {!showFullForm ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Register New Trainer - Verification
              </h2>
              <div>
                <label
                  htmlFor="verifyEmail"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Trainer Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="verifyEmail"
                  value={verifyEmail}
                  onChange={(e) => setVerifyEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="verifyUsername"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="verifyUsername"
                  value={verifyUsername}
                  onChange={(e) => setVerifyUsername(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                />
              </div>
              <button
                onClick={handleVerifyUser}
                className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-lg font-semibold mt-4">
                Verify & Proceed
              </button>
            </div>
          ) : (
            renderTrainerForm(selectedTrainer !== null) // Pass true if selectedTrainer exists, indicating edit mode
          )}
        </div>
      );
    }

    if (activeTab === "view") {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Trainers</h2>
            <button
              onClick={() => handleTabClick("register")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md text-sm">
              Add New Trainer
            </button>
          </div>
          {trainers.length === 0 ? (
            <p className="text-gray-600">No trainers registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="border rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  {trainer.profile_photo && (
                    <img
                      src={trainer.profile_photo}
                      alt={`${trainer.firstname} ${trainer.lastname}`}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/100x100/AEC6CF/000000?text=${trainer.firstname.charAt(
                          0
                        )}${trainer.lastname.charAt(0)}`;
                      }}
                    />
                  )}
                  <h3 className="text-lg font-bold text-blue-700 mb-2 text-center">
                    {trainer.firstname} {trainer.lastname}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Email: {trainer.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Mobile: {trainer.mobile}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expertise: {trainer.expertise}
                  </p>
                  <p className="text-sm text-gray-600">
                    Experience: {trainer.experience}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ${trainer.client_price}/session
                  </p>
                  {trainer.ratings && (
                    <p className="text-sm text-gray-600">
                      Ratings: {trainer.ratings}
                    </p>
                  )}
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditClick(trainer)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors shadow-md text-sm">
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        trainer.id && handleDeleteTrainer(trainer.id)
                      }
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-md text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "edit") {
      if (!selectedTrainer) {
        return (
          <p className="text-center py-8 text-red-600">
            No trainer selected for editing.
          </p>
        );
      }
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {renderTrainerForm(true)}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans">
      <div className="container mx-auto p-4 flex-grow">
        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-300 mb-6 sticky top-0 bg-gray-100 z-10 py-2">
          <button
            className={`tab-button px-6 py-3 text-gray-700 font-medium hover:text-blue-600 focus:outline-none transition-colors rounded-t-lg ${
              activeTab === "register"
                ? "active border-b-4 border-blue-600 text-blue-600 bg-white shadow-md"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleTabClick("register")}>
            Register Trainer
          </button>
          <button
            className={`tab-button px-6 py-3 text-gray-700 font-medium hover:text-blue-600 focus:outline-none transition-colors rounded-t-lg ${
              activeTab === "view"
                ? "active border-b-4 border-blue-600 text-blue-600 bg-white shadow-md"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleTabClick("view")}>
            Show All Trainers
          </button>
          {activeTab === "edit" && (
            <button
              className={`tab-button px-6 py-3 text-gray-700 font-medium hover:text-blue-600 focus:outline-none transition-colors rounded-t-lg ${
                activeTab === "edit"
                  ? "active border-b-4 border-blue-600 text-blue-600 bg-white shadow-md"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => handleTabClick("edit")}>
              Edit Trainer
            </button>
          )}
        </div>

        {/* Content Sections */}
        {renderTabContent()}
      </div>
      <CustomModal
        message={modalMessage}
        onConfirm={modalOnConfirm || undefined}
        onCancel={modalOnCancel || undefined}
        showCancelButton={showModalCancel}
      />
    </div>
  );
};

export default TrainerManagementPage;
