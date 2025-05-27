"use client";
import { useEffect, useState } from "react";
import { RootState } from "@/lib/store";
import { Search, ChevronDown, X } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define a type for the gym object for better type safety
interface Gym {
  id: string; // Assuming gym ID is a string based on usage
  gym_name: string;
  // Add other properties of the gym object if needed
}

export default function Header() {
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [gyms, setGyms] = useState<Gym[]>([]); // Use the Gym type
  const [selectedGym, setSelectedGym] = useState("Select Gym");
  const ownerDetails = useSelector((state: RootState) => state.owner.owner);
  const router = useRouter();
  const [gymId, setGymId] = useState<string>("");

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const email = ownerDetails?.owner?.email;
        if (!email) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/gym/site/apis/gymOwnerByEmail`,
          {
            params: { email },
            headers: {
              "Content-Type": "application/json",
              key: "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
            },
          }
        );

        // Log the response data
        console.log("API Response:", response.data);

        const gymOwnerList = response?.data?.data?.gymOwner;
        const gymList = response?.data?.data?.gyms as Gym[]; // Type assertion
        const userRole = gymOwnerList?.user_role;

        if (userRole === "staff") {
          router.push("/staff");
          return;
        }

        if (gymList && Array.isArray(gymList) && gymList.length > 0) {
          setGyms(gymList);

          // Check if there's a selected gym ID in localStorage
          const savedGymId = localStorage.getItem("selectedGym");
          console.log("Saved Gym ID from localStorage on load:", savedGymId);

          let initialSelectedGym: Gym = gymList[0]; // Default to the first gym
          let initialGymId: string = gymList[0].id;

          if (savedGymId) {
            // Find the gym with the saved ID, ensuring type consistency for comparison
            const foundGym = gymList.find(
              (gym) => String(gym.id) === savedGymId
            );
            console.log("Found gym based on saved ID:", foundGym);

            if (foundGym) {
              initialSelectedGym = foundGym;
              initialGymId = foundGym.id;
            } else {
              console.warn(
                `Gym with ID ${savedGymId} not found in the fetched list. Using the first gym.`
              );
            }
          } else {
            console.log(
              "No saved gym ID found in localStorage. Using the first gym."
            );
          }

          setSelectedGym(initialSelectedGym.gym_name);
          setGymId(initialGymId);
        } else {
          setGyms([]);
          setSelectedGym("No Gym Found");
          setGymId(""); // Reset gymId if no gyms found
        }
      } catch (error) {
        console.error("Error fetching gyms:", error);
        setSelectedGym("Error Loading Gym");
        setGyms([]); // Clear gyms on error
        setGymId(""); // Reset gymId on error
      }
    };

    fetchGyms();
  }, [ownerDetails, router]); // Added router to dependency array

  // Simplified selectGym function - only saves to localStorage and reloads
  function selectGym(gymId: string) {
    // Save to localStorage
    localStorage.setItem("selectedGym", gymId);
    console.log("Selected gym saved to localStorage:", gymId);

    // Reload the page to apply changes
    window.location.reload();
  }

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <header className="bg-[#081225] px-4 py-2 relative">
      <div className="mx-auto max-w-[1600px] flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full flex items-center space-x-2 md:w-1/3">
          <Image
            src="/swasthfit-gym/images/logo.svg?height=48&width=70"
            alt="SwaasthFit Logo"
            width={70}
            height={48}
          />
          <input
            type="text"
            placeholder="Search for Name, Mobile number..."
            className="w-full bg-[#1C2237] text-gray-300 pl-4 pr-10 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-purple-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-3 relative">
          {/* Branch Dropdown */}
          <div className="relative hidden md:flex items-center">
            <div className="text-sm text-gray-400">Select Branch</div>
            <button
              className="ml-2 flex items-center space-x-2 bg-[#1C2237] px-3 py-2 rounded-md border border-gray-700 relative"
              onClick={() => {
                setBranchDropdownOpen(!branchDropdownOpen);
                setProfileDropdownOpen(false); // Close profile dropdown
              }}>
              <span className="text-white">{selectedGym}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {branchDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-48 bg-[#1C2237] text-white rounded-md shadow-lg z-50 border border-gray-700">
                {gyms.map(
                  (
                    gym // Use the typed gym object
                  ) => (
                    <button
                      key={gym.id}
                      className="w-full text-left px-4 py-2 hover:bg-[#2A314D] text-sm"
                      onClick={() => {
                        // setSelectedGym(gym.gym_name); // State update here is redundant before reload
                        selectGym(gym.id); // Call selectGym with the gym ID
                        setBranchDropdownOpen(false);
                      }}>
                      {gym.gym_name}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setBranchDropdownOpen(false); // Close branch dropdown
              }}>
              <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                CD
              </div>
              <div className="hidden lg:flex flex-col ml-2">
                <div className="text-sm text-gray-400">Hello,</div>
                <div className="text-sm text-white font-medium">
                  {ownerDetails.owner?.name}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
            </div>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1C2237] text-white rounded-md shadow-lg z-50 border border-gray-700">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-[#2A314D] text-sm"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    handleProfileClick();
                  }}>
                  View Full Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-[#2A314D] text-sm"
                  onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity50">
          <div className="bg-[#1C2237] text-white rounded-lg shadow-lg p-6 w-full max-w-md relative border border-gray-700">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setModalOpen(false)}>
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center">
              <Image
                src="/swasthfit-gym/images/profile.jpg"
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full mb-4"
                loading="lazy"
              />
              <h2 className="text-xl font-semibold">
                {ownerDetails.owner?.name || "Name Not Found"}
              </h2>
              <p className="text-gray-400">
                {ownerDetails.owner?.email || "Email Not Found"}
              </p>
              <p className="text-gray-400">
                {ownerDetails.owner?.mobile || "Phone Not Found"}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
