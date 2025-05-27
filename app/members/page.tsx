"use client";

import React, { useEffect, useState } from "react";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { PencilIcon } from "@heroicons/react/24/solid";

export default function MembersPage() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  interface MenuItem {
    name: string;
    href: string;
    subMenu: { name: string; href: string }[];
  }
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await fetch(
          `${process.env.BASE_URL}/membership/site/apis/getAllMembershipDetails`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key":
                "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d", // <-- your API key
            },
          }
        );

        const json = await res.json();

        const submenu = json.data.map((item: any) => ({
          name: item.name,
          href: `/members/memberDetails/${item.id}`,
        }));
        setMenuItems([
          {
            name: "Members",
            href: "/members",
            subMenu: submenu, // 👈 submenu should be type { name: string; href: string }[]
          },
        ]);

        interface MembershipDetails {
          user: {
            user_name: string;
            email?: string;
            mobile?: string;
            gender?: string;
          };
          MembershipPlan?: {
            name?: string;
            type?: string;
          };
          start_date: string;
          end_date: string;
          status?: string;
          id: string;
        }

        if (
          json.message === "All memberships fetched successfully" &&
          Array.isArray(json.data)
        ) {
          const formattedData = json.data.map((item: any) => ({
            id: item.id,
            name: item.user.user_name || "N/A",
            email: item.user.user_email || "N/A",
            mobile: item.user.user_mobile || "N/A",
            gender: item.user.user_gender || "N/A",
            mem_plan: item.MembershipPlan.name || "N/A",
            mem_type: item.MembershipPlan.membership_type || "N/A",
            gym_name: item.gym.gym_name || "N/A",
            start_date: new Date(item.start_date).toLocaleString(),
            end_date: new Date(item.end_date).toLocaleString(),
            status: item.status || "Inactive",
          }));

          setAttendanceData(formattedData);
          setFilteredData(formattedData); // Initially show all data
        }
      } catch (error) {}
    };

    fetchMemberships();
  }, []);

  useEffect(() => {
    // Apply the search query to filter data
    const filtered = attendanceData.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query) ||
        item.gender.toLowerCase().includes(query)
      );
    });
    setFilteredData(filtered);
  }, [searchQuery, attendanceData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const updateMembershipStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(
        `${process.env.BASE_URL}/membership/site/apis/updateMembershipStatus/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await res.json();

      if (result.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this membership?")) {
      return;
    }

    try {
      const res = await fetch(
        `${process.env.BASE_URL}/membership/site/apis/deleteMembershipById/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
          },
        }
      );

      const result = await res.json();

      if (result.success) {
        // Delete successful -> Remove from frontend UI
        setAttendanceData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
        alert("Membership deleted successfully!");
      } else {
        alert("Failed to delete membership.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleStatusChange = async (index: number, newStatus: string) => {
    const membershipId = filteredData[index].id;

    const isUpdated = await updateMembershipStatus(membershipId, newStatus);

    if (isUpdated) {
      const updatedData = [...filteredData];
      updatedData[index].status = newStatus;
      setFilteredData(updatedData);
      alert("Status updated successfully!");
    } else {
      alert("Failed to update status. Please try again.");
    }
  };

  const goToDetails = (id: number) => {
    router.push(`/members/memberDetails/${id}`);
  };

  return (
    <div className="p-4 md:py-8 md:px-4 bg-slate-100">
      <h1 className="text-2xl font-bold mb-4">Members List</h1>

      {/* Search Bar for Filtering */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name, Email, Gender, or Status"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      <div className="overflow-x-auto p-4">
        <table className="w-full overflow-visible border-separate border-spacing-y-2">
          <thead className="bg-gray-800 text-white">
            <tr>
              {[
                "Name",
                "Email",
                "Mobile No.",
                "Gender",
                "Membership plan",
                "Membership type",
                "Gym name",
                "Start date",
                "End date",
                "Status",
                "Action",
              ].map((heading, idx) => (
                <th
                  key={idx}
                  className={`p-3 text-center ${
                    idx === 0 ? "rounded-l-lg" : ""
                  } ${idx === 9 ? "" : ""}`}>
                  <div className="flex items-center rounded-r-lg justify-center gap-2">
                    {heading}
                    <span className="flex-1">
                      <HiChevronUp /> <HiChevronDown />
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="bg-white hover:bg-gray-50 transition-all duration-200">
                <td className="p-4 text-left">{item.name}</td>
                <td className="p-4 text-left">{item.email}</td>
                <td className="p-4 text-left">{item.mobile}</td>
                <td className="p-4 text-left">{item.gender}</td>
                <td className="p-4 text-left">{item.mem_plan}</td>
                <td className="p-4 text-left">{item.mem_type}</td>
                <td className="p-4 text-left">{item.gym_name}</td>
                <td className="p-4 text-left">{item.start_date}</td>
                <td className="p-4 text-left">{item.end_date}</td>
                <td className="p-4 text-left">
                  <button
                    onClick={() =>
                      handleStatusChange(
                        index,
                        item.status === "Active" ? "Inactive" : "Active"
                      )
                    }
                    className={`relative w-24 h-9 rounded-full flex items-center transition-all duration-300 shadow-md
                      ${
                        item.status === "Active"
                          ? "bg-green-500 justify-end"
                          : "bg-red-500 justify-start"
                      }`}>
                    <div className="w-6 h-6 bg-white rounded-full mx-1 shadow-md z-10" />
                    <span className="text-white font-semibold px-2 z-0">
                      {item.status}
                    </span>
                  </button>
                </td>
                <td className="p-4 flex items-center gap-3">
                  <button className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition">
                    <FaEye
                      onClick={() => goToDetails(item.id)}
                      className="h-5 w-5 text-blue-500"
                    />
                  </button>
                  <button className="bg-green-100 p-2 rounded-full hover:bg-green-200 transition">
                    <PencilIcon className="h-5 w-5 text-green-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-100 p-2 rounded-full hover:bg-red-200 transition">
                    <MdDelete className="h-5 w-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
