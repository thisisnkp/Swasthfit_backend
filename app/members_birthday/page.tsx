"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Search,
  User,
  Bell,
  Settings,
  LogOut,
  Mail,
  MessageSquare,
  Filter,
  CalendarDays,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  Phone,
  UserCircle,
  Building,
  ListFilter,
  Eye,
  EyeOff,
  Edit3,
  Copy,
  Gift,
} from "lucide-react";

// Helper function to format date (example)
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Handle invalid date string if necessary, or return original
      return dateString;
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Fallback to original string
  }
};

interface Member {
  id: string;
  name: string;
  number: string;
  memberCode: string;
  refNo: string;
  gender: "Male" | "Female" | "Other";
  handledBy: string;
  birthday: string; // Expecting a date string like "YYYY-MM-DD"
  appAccess: "Active" | "Inactive";
  appInstalled: boolean;
  avatarUrl?: string; // Optional avatar URL
}

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Ashok Kumar",
    number: "9876543210",
    memberCode: "YDX-27312697",
    refNo: "8888888787",
    gender: "Male",
    handledBy: "Ashok Kumar",
    birthday: "2007-07-12",
    appAccess: "Active",
    appInstalled: false,
    avatarUrl: "https://placehold.co/40x40/E2E8F0/A0AEC0?text=AK",
  },
  {
    id: "2",
    name: "Priya Sharma",
    number: "9876543211",
    memberCode: "YDX-27312698",
    refNo: "8888888788",
    gender: "Female",
    handledBy: "Ravi Singh",
    birthday: "1995-03-25",
    appAccess: "Active",
    appInstalled: true,
    avatarUrl: "https://placehold.co/40x40/FEE2E2/F87171?text=PS",
  },
  {
    id: "3",
    name: "Rahul Verma",
    number: "9876543212",
    memberCode: "YDX-27312699",
    refNo: "8888888789",
    gender: "Male",
    handledBy: "Priya Sharma",
    birthday: "1988-11-05",
    appAccess: "Inactive",
    appInstalled: false,
    avatarUrl: "https://placehold.co/40x40/D1FAE5/34D399?text=RV",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    number: "9876543213",
    memberCode: "YDX-27312700",
    refNo: "8888888790",
    gender: "Female",
    handledBy: "Ashok Kumar",
    birthday: "2000-09-18",
    appAccess: "Active",
    appInstalled: true,
    avatarUrl: "https://placehold.co/40x40/E0E7FF/818CF8?text=SR",
  },
  {
    id: "5",
    name: "Amit Patel",
    number: "9876543214",
    memberCode: "YDX-27312701",
    refNo: "8888888791",
    gender: "Male",
    handledBy: "Ravi Singh",
    birthday: "1992-01-30",
    appAccess: "Active",
    appInstalled: false,
    avatarUrl: "https://placehold.co/40x40/FEF3C7/FBBF24?text=AP",
  },
  {
    id: "6",
    name: "Deepika Singh",
    number: "9876543215",
    memberCode: "YDX-27312702",
    refNo: "8888888792",
    gender: "Female",
    handledBy: "Priya Sharma",
    birthday: "2003-06-08",
    appAccess: "Inactive",
    appInstalled: true,
    avatarUrl: "https://placehold.co/40x40/FCE7F3/F472B6?text=DS",
  },
  {
    id: "7",
    name: "Vikas Gupta",
    number: "9876543216",
    memberCode: "YDX-27312703",
    refNo: "8888888793",
    gender: "Male",
    handledBy: "Ashok Kumar",
    birthday: "1998-12-22",
    appAccess: "Active",
    appInstalled: false,
  },
  {
    id: "8",
    name: "Anjali Mehta",
    number: "9876543217",
    memberCode: "YDX-27312704",
    refNo: "8888888794",
    gender: "Female",
    handledBy: "Ravi Singh",
    birthday: "1990-08-14",
    appAccess: "Active",
    appInstalled: true,
  },
  {
    id: "9",
    name: "Manish Jain",
    number: "9876543218",
    memberCode: "YDX-27312705",
    refNo: "8888888795",
    gender: "Male",
    handledBy: "Priya Sharma",
    birthday: "2005-04-01",
    appAccess: "Inactive",
    appInstalled: false,
  },
  {
    id: "10",
    name: "Sunita Yadav",
    number: "9876543219",
    memberCode: "YDX-27312706",
    refNo: "8888888796",
    gender: "Female",
    handledBy: "Ashok Kumar",
    birthday: "1996-10-27",
    appAccess: "Active",
    appInstalled: true,
  },
];

// Removed navItems array as it's no longer used

const filterOptions = [
  {
    label: "Members Status",
    options: ["Open Enquiry", "Active", "Inactive", "Expired"],
  },
  {
    label: "Lead Type",
    options: ["Open Enquiry", "Walk-in", "Referral", "Online"],
  },
  { label: "Gender", options: ["Open Enquiry", "Male", "Female", "Other"] },
  {
    label: "Source of Promotion",
    options: ["Open Enquiry", "Social Media", "Website", "Friend"],
  },
  {
    label: "Birth Date",
    type: "date-range",
    default: "This Month (25 May 2025 - 24 June 2025)",
  },
  { label: "Client Rep", options: ["Open Enquiry", "Rep A", "Rep B"] },
  {
    label: "Assigned Trainer",
    options: ["Open Enquiry", "Trainer X", "Trainer Y"],
  },
];

interface DropdownProps {
  label: string;
  options: string[];
  icon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  label,
  options,
  icon,
  className,
  buttonClassName,
  menuClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}>
      <div>
        <button
          type="button"
          className={`inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${buttonClassName}`}
          onClick={() => setIsOpen(!isOpen)}>
          {icon && <span className="mr-2">{icon}</span>}
          {selectedOption}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {isOpen && (
        <div
          className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${menuClassName}`}>
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu">
            {options.map((option) => (
              <a
                key={option}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => {
                  setSelectedOption(option);
                  setIsOpen(false);
                }}>
                {option}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ActionDropdown: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAction = (action: string) => {
    console.log(`Performing ${action} for member ${memberId}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-150"
        aria-expanded={isOpen}
        aria-haspopup="true">
        <span className="sr-only">Open actions</span>
        Action
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button">
          <div className="py-1" role="none">
            <a
              href="#"
              onClick={() => handleAction("Email")}
              className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
              role="menuitem">
              <Mail
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              Send Email
            </a>
            <a
              href="#"
              onClick={() => handleAction("SMS")}
              className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
              role="menuitem">
              <MessageSquare
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              Send SMS
            </a>
            <a
              href="#"
              onClick={() => handleAction("View Details")}
              className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
              role="menuitem">
              <Eye
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              View Details
            </a>
            <a
              href="#"
              onClick={() => handleAction("Edit Member")}
              className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
              role="menuitem">
              <Edit3
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              Edit
            </a>
            <a
              href="#"
              onClick={() => handleAction("Copy Details")}
              className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
              role="menuitem">
              <Copy
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              Copy Details
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const MembersBirthdayPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(
    "YD Fitness Club (smara)"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredMembers = mockMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.number.includes(searchTerm) ||
      member.memberCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Top Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for Name, Mobile..."
                  className="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CustomDropdown
                label={selectedBranch}
                options={[
                  "YD Fitness Club (smara)",
                  "Downtown Branch",
                  "Uptown Branch",
                ]}
                icon={<Building className="h-5 w-5 text-indigo-600" />}
                buttonClassName="bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100"
              />
              <div className="flex items-center">
                <UserCircle className="h-8 w-8 text-gray-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">
                    Hello, Wade Warren
                  </p>
                </div>
              </div>
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar - REMOVED */}
      {/* <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-1 sm:space-x-2 h-12 items-center">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-2 py-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap ${
                  item.current
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </nav> 
      */}

      {/* Main Content Area */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 mt-4">
        {" "}
        {/* Added mt-4 to compensate for removed navbar */}
        {/* Page Title and Secondary Search */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Members Birthday (Listing)
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by Mobile Number or Email Address"
                className="pl-10 pr-4 py-2 w-full sm:w-72 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Search
            </button>
            <p className="text-sm text-gray-600 hidden lg:block">
              {selectedBranch}
            </p>
          </div>
        </div>
        {/* Filters Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <ListFilter className="h-5 w-5 mr-2 text-indigo-600" /> Filters
            </h2>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <button className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> Active
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center">
                <XCircle className="h-4 w-4 mr-1" /> Deactive
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
                <Download className="h-4 w-4 mr-1" /> Export CSV
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-4">
            {filterOptions.map((filter) => (
              <div key={filter.label}>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {filter.label}
                </label>
                {filter.type === "date-range" ? (
                  <input
                    type="text"
                    defaultValue={filter.default}
                    className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <CustomDropdown
                    label={filter.options?.[0] || filter.label}
                    options={filter.options || []}
                    buttonClassName="w-full text-xs !py-2"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Submit
            </button>
          </div>
        </div>
        {/* Summary and Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-700">
            Total members:{" "}
            <span className="text-indigo-600 font-semibold">
              {filteredMembers.length}
            </span>
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium shadow-sm flex items-center">
              <Bell className="h-4 w-4 mr-2" /> Send Notification
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium shadow-sm flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" /> Send SMS
            </button>
            <p className="text-xs text-gray-500">
              SMS Remaining:{" "}
              <span className="font-semibold text-gray-700">8631</span>
            </p>
          </div>
        </div>
        {/* Members Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="p-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Name & Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Handled By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Gift className="h-4 w-4 mr-1 text-pink-500" /> Birthday
                    Date
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  App Access
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {member.avatarUrl ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={member.avatarUrl}
                            alt={member.name}
                            onError={(e) =>
                              (e.currentTarget.src = `https://placehold.co/40x40/E2E8F0/A0AEC0?text=${member.name.charAt(
                                0
                              )}`)
                            }
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {member.number}
                        </div>
                        {!member.appInstalled && (
                          <div className="text-xs text-red-500 mt-0.5">
                            App Not Installed
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {member.memberCode}
                    </div>
                    <div className="text-xs text-gray-500">
                      Ref No.: {member.refNo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.handledBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {formatDate(member.birthday)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.appAccess === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {member.appAccess}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ActionDropdown memberId={member.id} />
                  </td>
                </tr>
              ))}
              {paginatedMembers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    No members found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredMembers.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredMembers.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {/* Current page indicator could be more complex, showing a few page numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === currentPage || // current page
                      pageNum === 1 || // first page
                      pageNum === totalPages || // last page
                      (pageNum >= currentPage - 1 &&
                        pageNum <= currentPage + 1) || // pages around current
                      (currentPage <= 3 && pageNum <= 3) || // first few pages
                      (currentPage >= totalPages - 2 &&
                        pageNum >= totalPages - 2) // last few pages
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          aria-current={
                            currentPage === pageNum ? "page" : undefined
                          }
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}>
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === currentPage - 2 && currentPage > 3) ||
                      (pageNum === currentPage + 2 &&
                        currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MembersBirthdayPage;
