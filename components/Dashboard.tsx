// pages/dashboard.tsx
"use client"; // Added for client-side hooks, standard for App Router, harmless for Pages Router
import React, { useState, useMemo, useEffect } from "react"; // Added useEffect
import { useRouter } from "next/navigation"; // Changed to next/navigation for App Router
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  BarChart2,
  Briefcase,
  TrendingUp,
  TrendingDown,
  UserPlus,
  UserCheck,
  UserX,
  RotateCcw,
  CheckSquare,
  XSquare,
  Clock,
  Edit3,
  Trash2,
  Eye,
  Download,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ShoppingCart,
  CreditCard,
  Tag,
  Gift,
  Percent,
  Activity,
  Zap,
  AlertTriangle,
  Info,
  Star,
  PieChart,
  Layers,
  Target,
  List,
  Grid,
  PlusCircle,
  MoreHorizontal,
} from "lucide-react";
// Removed useSelector and RootState imports as owner email will be fetched directly
// import { useSelector } from "react-redux";
// import { RootState } from "@/lib/store";

// Dummy Data
const cardData = [
  {
    title: "Today's Sale",
    value: "₹60,00,000",
    icon: <DollarSign className="text-pink-500" />,
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
    buttonText: "View Clients",
    buttonBgColor: "bg-pink-500",
    buttonTextColor: "text-white",
  },
  {
    title: "Collected Payments",
    value: "2000",
    icon: <CheckSquare className="text-orange-500" />,
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    buttonText: "View Clients",
    buttonBgColor: "bg-orange-500",
    buttonTextColor: "text-white",
  },
  {
    title: "Pending Payments",
    value: "2000",
    icon: <Clock className="text-purple-500" />,
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    buttonText: "View Clients",
    buttonBgColor: "bg-purple-500",
    buttonTextColor: "text-white",
  },
  {
    title: "Total Clients",
    value: "60,00,000",
    icon: <Users className="text-blue-500" />,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    buttonText: "View Clients",
    buttonBgColor: "bg-blue-500",
    buttonTextColor: "text-white",
  },
  {
    title: "Active Clients",
    value: "2000",
    icon: <UserCheck className="text-green-500" />,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    buttonText: "View Clients",
    buttonBgColor: "bg-green-500",
    buttonTextColor: "text-white",
  },
  {
    title: "Inactive Clients",
    value: "2000",
    icon: <UserX className="text-red-500" />,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    buttonText: "View Clients",
    buttonBgColor: "bg-red-500",
    buttonTextColor: "text-white",
  },
  {
    title: "New Clients",
    value: "₹46000.00",
    icon: <UserPlus className="text-teal-500" />,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    buttonText: "View More",
    buttonBgColor: "bg-teal-500",
    buttonTextColor: "text-white",
  },
  {
    title: "Renewals",
    value: "₹46000.00",
    icon: <RotateCcw className="text-indigo-500" />,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    buttonText: "View More",
    buttonBgColor: "bg-indigo-500",
    buttonTextColor: "text-white",
  },
  {
    title: "Upgrade",
    value: "₹46000.00",
    icon: <TrendingUp className="text-yellow-500" />,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    buttonText: "View More",
    buttonBgColor: "bg-yellow-500",
    buttonTextColor: "text-white",
  },
  {
    title: "Check-ins",
    value: "₹46000.00",
    icon: <CheckSquare className="text-lime-500" />,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    buttonText: "View More",
    buttonBgColor: "bg-lime-500",
    buttonTextColor: "text-white",
  },
  {
    title: "Total Enquiries",
    value: "₹46000.00",
    icon: <Briefcase className="text-cyan-500" />,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    buttonText: "",
    buttonBgColor: "",
    buttonTextColor: "",
  },
  {
    title: "Open Enquiries",
    value: "₹46000.00",
    icon: <Activity className="text-fuchsia-500" />,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    buttonText: "",
    buttonBgColor: "",
    buttonTextColor: "",
  },
  {
    title: "Converted Enquiries",
    value: "₹46000.00",
    icon: <Zap className="text-rose-500" />,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    buttonText: "",
    buttonBgColor: "",
    buttonTextColor: "",
  },
  {
    title: "Lost Enquiries",
    value: "₹46000.00",
    icon: <TrendingDown className="text-slate-500" />,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    buttonText: "",
    buttonBgColor: "",
    buttonTextColor: "",
  },
];

const summaryData = [
  {
    label: "Follow-Ups",
    value: "00",
    icon: <Edit3 className="text-gray-500 mr-2" />,
  },
  {
    label: "Appointments",
    value: "01",
    icon: <Calendar className="text-gray-500 mr-2" />,
  },
  {
    label: "Classes",
    value: "01",
    icon: <Layers className="text-gray-500 mr-2" />,
  },
  {
    label: "Expired Subscriptions",
    value: "01",
    icon: <AlertTriangle className="text-red-500 mr-2" />,
  },
  {
    label: "Subscriptions About to Expire",
    value: "50",
    icon: <Clock className="text-orange-500 mr-2" />,
  },
  {
    label: "Active PT Subscriptions",
    value: "00",
    icon: <Star className="text-yellow-500 mr-2" />,
  },
  {
    label: "Expired PT Subscriptions",
    value: "01",
    icon: <AlertTriangle className="text-red-500 mr-2" />,
  },
  {
    label: "Pending Renewals",
    value: "00",
    icon: <RotateCcw className="text-blue-500 mr-2" />,
  },
  {
    label: "Live App Installs",
    value: "36 (2%)",
    icon: <Download className="text-green-500 mr-2" />,
  },
  {
    label: "Client Birthdays",
    value: "01",
    icon: <Gift className="text-pink-500 mr-2" />,
  },
  {
    label: "Client Anniversaries",
    value: "00",
    icon: <Tag className="text-indigo-500 mr-2" />,
  },
];

const tableColumns = [
  { Header: "Sr.No", accessor: "srNo" },
  { Header: "Renewed Membership", accessor: "renewedMembership" },
  { Header: "Client ID", accessor: "clientId" },
  { Header: "Client Name", accessor: "clientName" },
  { Header: "Assigned To", accessor: "assignedTo" },
  { Header: "Status", accessor: "status" },
  { Header: "Membership", accessor: "membership" },
  { Header: "Start Date", accessor: "startDate" },
  { Header: "End Date", accessor: "endDate" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Balance", accessor: "balance" },
  { Header: "Action", accessor: "action" },
];

const tableData = [
  {
    srNo: 1,
    renewedMembership: "RM001",
    clientId: "C001",
    clientName: "Aarav Sharma",
    assignedTo: "Rohan Kumar",
    status: "Active",
    membership: "Gold Plan - 1 Year",
    startDate: "01 Jan, 2024",
    endDate: "31 Dec, 2024",
    amount: "₹12000",
    balance: "₹0",
    action: "View",
  },
  {
    srNo: 2,
    renewedMembership: "RM002",
    clientId: "C002",
    clientName: "Diya Patel",
    assignedTo: "Priya Singh",
    status: "Pending",
    membership: "Silver Plan - 6 Months",
    startDate: "15 Feb, 2024",
    endDate: "14 Aug, 2024",
    amount: "₹7000",
    balance: "₹1000",
    action: "View",
  },
  {
    srNo: 3,
    renewedMembership: "RM003",
    clientId: "C003",
    clientName: "Vikram Singh",
    assignedTo: "Amit Patel",
    status: "Active",
    membership: "Bronze Plan - 3 Months",
    startDate: "10 Mar, 2024",
    endDate: "09 Jun, 2024",
    amount: "₹4000",
    balance: "₹0",
    action: "View",
  },
  {
    srNo: 4,
    renewedMembership: "RM004",
    clientId: "C004",
    clientName: "Neha Gupta",
    assignedTo: "Sunita Sharma",
    status: "Expired",
    membership: "Gold Plan - 1 Year",
    startDate: "01 Dec, 2022",
    endDate: "30 Nov, 2023",
    amount: "₹12000",
    balance: "₹0",
    action: "View",
  },
  {
    srNo: 5,
    renewedMembership: "RM005",
    clientId: "C005",
    clientName: "Rahul Verma",
    assignedTo: "Rohan Kumar",
    status: "Active",
    membership: "Silver Plan - 6 Months",
    startDate: "20 Apr, 2024",
    endDate: "19 Oct, 2024",
    amount: "₹7000",
    balance: "₹0",
    action: "View",
  },
];

// Reusable Dashboard Card Component
interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  onButtonClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  bgColor = "bg-white",
  textColor = "text-gray-800",
  buttonText,
  buttonBgColor = "bg-blue-500",
  buttonTextColor = "text-white",
  onButtonClick,
}) => {
  return (
    <div
      className={`${bgColor} ${textColor} p-4 md:p-6 rounded-xl shadow-lg flex flex-col justify-between min-h-[120px] md:min-h-[160px]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm md:text-base font-medium text-gray-500">
            {title}
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">
            {value}
          </p>
        </div>
        <div className="p-2 bg-gray-200 rounded-full">
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<any>, {
                size: 20,
                className: `${
                  (icon as React.ReactElement<any>).props.className || ""
                }`,
              })
            : icon}
        </div>
      </div>
      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className={`${buttonBgColor} ${buttonTextColor} text-xs md:text-sm font-semibold py-2 px-3 md:px-4 rounded-lg mt-3 self-start hover:opacity-90 transition-opacity`}>
          {buttonText}
        </button>
      )}
      {buttonText && !onButtonClick && (
        <div
          className={`${buttonBgColor} ${buttonTextColor} text-xs md:text-sm font-semibold py-2 px-3 md:px-4 rounded-lg mt-3 self-start`}>
          {buttonText}
        </div>
      )}
    </div>
  );
};

// Reusable Table Component
interface TableColumn {
  Header: string;
  accessor: string;
}

interface ReusableTableProps {
  columns: TableColumn[];
  data: any[];
  title?: string;
  showFilters?: boolean;
  actionButtons?: React.ReactNode;
}

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  data,
  title,
  showFilters = true,
  actionButtons,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const filteredData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, sortConfig]);

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-6">
      {title && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {title}
          </h2>
          {actionButtons && <div className="mt-2 sm:mt-0">{actionButtons}</div>}
        </div>
      )}
      {showFilters && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search table..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
              <Filter size={16} className="mr-2" /> Filters
            </button>
            <button className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Download size={16} className="mr-2" /> Export
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  onClick={() => requestSort(column.accessor)}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap">
                  <div className="flex items-center">
                    {column.Header}
                    {sortConfig &&
                      sortConfig.key === column.accessor &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp size={14} className="ml-1" />
                      ) : (
                        <ChevronDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.accessor}
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {column.accessor === "status" ? (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          row[column.accessor] === "Active"
                            ? "bg-green-100 text-green-800"
                            : row[column.accessor] === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : row[column.accessor] === "Expired"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        {row[column.accessor]}
                      </span>
                    ) : column.accessor === "action" ? (
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        <Eye size={16} className="mr-1" />{" "}
                        {row[column.accessor]}
                      </button>
                    ) : (
                      row[column.accessor]
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Interface for the expected API response structure for owner details
interface ApiOwnerData {
  id: number;
  name: string;
  mobile: string;
  alternate_mobile?: string; // Optional field
  email: string;
  profile_image?: string; // Optional field
  pancard_name?: string; // Optional field
  pancard_no?: string; // Optional field
  // Add other fields as needed from the API response
  user_role: string;
  created_at: string;
  updated_at: string;
}

interface ApiOwnerResponse {
  data: ApiOwnerData;
}

const DashboardPage = () => {
  const router = useRouter();
  // No longer using useSelector for ownerDetails here

  const handlePromoteGym = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let ownerEmail: string | undefined;

    try {
      // Step 1: Fetch gym_id and bearerToken from localStorage
      const gymId = localStorage.getItem("selectedGym");
      const bearerToken = localStorage.getItem("gymAuthToken");

      if (!bearerToken) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }
      if (!gymId) {
        alert("Gym ID is missing from local storage.");
        return;
      }

      // Inside handlePromoteGym function
      // Step 2: Fetch owner details to get the email
      const ownerDetailsResponse = await fetch(
        `http://localhost:4001/gym/site/apis/getGymOwnerById/${gymId}`,
        {
          method: "GET",
        }
      );

      if (!ownerDetailsResponse.ok) {
        console.error(
          "Failed to fetch owner details:",
          ownerDetailsResponse.status,
          ownerDetailsResponse.statusText
        );
        const errorData = await ownerDetailsResponse
          .json()
          .catch(() => ({ message: "Failed to parse owner details error" }));
        alert(
          `Failed to fetch owner details: ${
            errorData.message || "Please try again."
          }`
        );
        return;
      }

      const ownerDetailsData: ApiOwnerResponse =
        await ownerDetailsResponse.json();
      ownerEmail = ownerDetailsData?.data?.email;

      console.log("Email fetched from API:", ownerEmail);

      if (!ownerEmail) {
        alert(
          "Gym Email could not be fetched. Please check your account details."
        );
        return;
      }

      // Step 3: Proceed with the marketing API call using the fetched email
      const marketingApiResponse = await fetch(
        `http://localhost:4001/marketing/site/apis/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`, // Re-use bearerToken
            "x-api-key":
              "5b7b04b796bc25026689605b2c7e3da829610349d5059d8d7d602247a9b0755d",
          },
          body: JSON.stringify({ email: ownerEmail, module_type: "gym" }),
        }
      );

      if (!marketingApiResponse.ok) {
        console.error(
          "Failed to verify for marketing token:",
          marketingApiResponse.status,
          marketingApiResponse.statusText
        );
        const errorData = await marketingApiResponse.json().catch(() => ({
          message: "Failed to parse marketing API error response",
        }));
        alert(
          `Failed to generate marketing token: ${
            errorData.message || "Please try again."
          }`
        );
        return;
      }

      const marketingData = await marketingApiResponse.json();
      if (marketingData.token) {
        localStorage.setItem("token", marketingData.token); // This might be a different token for the marketing app
        router.push(`http://localhost:5173?token=${marketingData.token}`);
      } else {
        alert(
          "Failed to generate marketing token from response. Please try again."
        );
      }
    } catch (error) {
      console.error("Error in handlePromoteGym:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const topRowCards = cardData.slice(0, 3);
  const middleRowCards = cardData.slice(3, 6);
  const bottomRowCards = cardData.slice(6, 10);
  const lastRowCards = cardData.slice(10, 14);

  const handleCardButtonClick = (title: string) => {
    console.log(`${title} button clicked`);
    // Add navigation or other actions here
  };

  const filterButtonsData = [
    "Irregular Members",
    "Balance Due Register",
    "Upcoming Renewals",
    "Expired Membership Register",
    "Pending Renewals (More than 7 days)",
  ];

  const actionButtonsConfig = [
    {
      label: "Add Enquiry",
      icon: <PlusCircle size={16} />,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => console.log("Add Enquiry clicked"),
    },
    {
      label: "Quick Billing",
      icon: <CreditCard size={16} />,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => console.log("Quick Billing clicked"),
    },
    {
      label: "Receipts",
      icon: <DollarSign size={16} />,
      color: "bg-yellow-500 hover:bg-yellow-600 text-black",
      onClick: () => console.log("Receipts clicked"),
    },
    {
      label: "Quick Follow Up",
      icon: <Edit3 size={16} />,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => console.log("Quick Follow Up clicked"),
    },
    {
      label: "QR Codes & Links",
      icon: <Grid size={16} />,
      color: "bg-teal-500 hover:bg-teal-600",
      onClick: () => console.log("QR Codes clicked"),
    },
    {
      label: "Promote Gym",
      icon: <TrendingUp size={16} />,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: handlePromoteGym,
    },
  ];

  const dateRangeButtonsData = [
    "Today",
    "Last 7 Days",
    "Last 15 Days",
    "Last 30 Days",
    "Last 90 Days",
    "Custom Date",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top action buttons */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        {filterButtonsData.map((label: string) => (
          <button
            key={label}
            className="bg-red-500 text-white text-xs sm:text-sm font-medium py-2 px-3 rounded-lg hover:bg-red-600 transition-colors">
            {label}
          </button>
        ))}
        <div className="flex flex-wrap gap-2 ml-auto">
          {actionButtonsConfig.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.onClick}
              className={`${btn.color} text-white text-xs sm:text-sm font-medium py-2 px-3 rounded-lg flex items-center gap-1 transition-colors`}>
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {dateRangeButtonsData.map((label: string) => (
          <button
            key={label}
            className={`text-xs sm:text-sm font-medium py-2 px-4 rounded-lg transition-colors ${
              label === "Today"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Cards */}
        <div className="w-full lg:w-2/3">
          {/* Top Row Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
            {topRowCards.map((card, index) => (
              <DashboardCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                bgColor={card.bgColor}
                textColor={card.textColor}
                buttonText={card.buttonText}
                buttonBgColor={card.buttonBgColor}
                buttonTextColor={card.buttonTextColor}
                onButtonClick={
                  card.buttonText
                    ? () => handleCardButtonClick(card.title)
                    : undefined
                }
              />
            ))}
          </div>

          {/* Middle Row Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
            {middleRowCards.map((card, index) => (
              <DashboardCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                bgColor={card.bgColor}
                textColor={card.textColor}
                buttonText={card.buttonText}
                buttonBgColor={card.buttonBgColor}
                buttonTextColor={card.buttonTextColor}
                onButtonClick={
                  card.buttonText
                    ? () => handleCardButtonClick(card.title)
                    : undefined
                }
              />
            ))}
          </div>

          {/* Bottom Row Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
            {bottomRowCards.map((card, index) => (
              <DashboardCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                bgColor={card.bgColor}
                textColor={card.textColor}
                buttonText={card.buttonText}
                buttonBgColor={card.buttonBgColor}
                buttonTextColor={card.buttonTextColor}
                onButtonClick={
                  card.buttonText
                    ? () => handleCardButtonClick(card.title)
                    : undefined
                }
              />
            ))}
          </div>
          {/* Last Row Cards (No Buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
            {lastRowCards.map((card, index) => (
              <DashboardCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                bgColor={card.bgColor}
                textColor={card.textColor}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="w-full lg:w-1/3 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Summary
          </h3>
          <div className="space-y-3">
            {summaryData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm text-gray-600 py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="mt-6">
        <ReusableTable
          title="Upcoming Renewals (Next 7 Days) - 4 Clients"
          columns={tableColumns}
          data={tableData}
          actionButtons={
            <button className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              View All Upcoming
            </button>
          }
        />
        <ReusableTable
          title="My Follow Up Total Follow ups (0)"
          columns={tableColumns.slice(0, 7).concat([
            { Header: "Follow Up Date", accessor: "followUpDate" },
            { Header: "Action", accessor: "action" },
          ])}
          data={tableData
            .map((d) => ({ ...d, followUpDate: "25 May, 2025" }))
            .slice(0, 2)}
          actionButtons={
            <button className="text-sm bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              View All Follow Ups
            </button>
          }
        />
        <ReusableTable
          title="My Appointment Total Appointments (1)"
          columns={tableColumns.slice(0, 6).concat([
            { Header: "Appointment Date", accessor: "appointmentDate" },
            { Header: "Time", accessor: "appointmentTime" },
            { Header: "Action", accessor: "action" },
          ])}
          data={tableData
            .map((d) => ({
              ...d,
              appointmentDate: "26 May, 2025",
              appointmentTime: "10:00 AM",
            }))
            .slice(0, 1)}
          actionButtons={
            <button className="text-sm bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              View All Appointments
            </button>
          }
        />
        <ReusableTable
          title="Today's Batches (1) Batchwise Attendance"
          columns={[
            { Header: "Batch Name", accessor: "batchName" },
            { Header: "Time", accessor: "batchTime" },
            { Header: "Trainer", accessor: "trainer" },
            { Header: "Total Member", accessor: "totalMember" },
            { Header: "Present", accessor: "present" },
            { Header: "Absent", accessor: "absent" },
            { Header: "Action", accessor: "action" },
          ]}
          data={[
            {
              batchName: "Morning Yoga",
              batchTime: "07:00 AM - 08:00 AM",
              trainer: "Anjali Mehta",
              totalMember: 20,
              present: 15,
              absent: 5,
              action: "Mark Attendance",
            },
          ]}
          actionButtons={
            <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              View All Batches
            </button>
          }
        />
      </div>
    </div>
  );
};

export default DashboardPage;
