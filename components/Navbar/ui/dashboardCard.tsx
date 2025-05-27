// import React, { useState, useMemo } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   Search,
//   Filter,
//   Calendar,
//   Users,
//   DollarSign,
//   BarChart2,
//   Briefcase,
//   TrendingUp,
//   TrendingDown,
//   UserPlus,
//   UserCheck,
//   UserX,
//   RotateCcw,
//   CheckSquare,
//   XSquare,
//   Clock,
//   Edit3,
//   Trash2,
//   Eye,
//   Download,
//   Settings,
//   Bell,
//   HelpCircle,
//   LogOut,
//   ShoppingCart,
//   CreditCard,
//   Tag,
//   Gift,
//   Percent,
//   Activity,
//   Zap,
//   AlertTriangle,
//   Info,
//   Star,
//   PieChart,
//   Layers,
//   Target,
//   List,
//   Grid,
//   PlusCircle,
//   MoreHorizontal,
// } from "lucide-react";

// // Dummy Data
// const cardData = [
//   {
//     title: "Today's Sale",
//     value: "₹60,00,000",
//     icon: <DollarSign className="text-pink-500" />,
//     bgColor: "bg-pink-50",
//     textColor: "text-pink-700",
//     buttonText: "View Clients",
//     buttonBgColor: "bg-pink-500",
//     buttonTextColor: "text-white",
//   },
//   {
//     title: "Collected Payments",
//     value: "2000",
//     icon: <CheckSquare className="text-orange-500" />,
//     bgColor: "bg-orange-50",
//     textColor: "text-orange-700",
//     buttonText: "View Clients",
//     buttonBgColor: "bg-orange-500",
//     buttonTextColor: "text-white",
//   },
//   {
//     title: "Pending Payments",
//     value: "2000",
//     icon: <Clock className="text-purple-500" />,
//     bgColor: "bg-purple-50",
//     textColor: "text-purple-700",
//     buttonText: "View Clients",
//     buttonBgColor: "bg-purple-500",
//     buttonTextColor: "text-white",
//   },
//   {
//     title: "Total Clients",
//     value: "60,00,000",
//     icon: <Users className="text-blue-500" />,
//     bgColor: "bg-blue-50",
//     textColor: "text-blue-700",
//     buttonText: "View Clients",
//     buttonBgColor: "bg-blue-500",
//     buttonTextColor: "text-white",
//   },
//   {
//     title: "Active Clients",
//     value: "2000",
//     icon: <UserCheck className="text-green-500" />,
//     bgColor: "bg-green-50",
//     textColor: "text-green-700",
//     buttonText: "View Clients",
//     buttonBgColor: "bg-green-500",
//     buttonTextColor: "text-white",
//   },
//   {
//     title: "Inactive Clients",
//     value: "2000",
//     icon: <UserX className="text-red-500" />,
//     bgColor: "bg-red-50",
//     textColor: "text-red-700",
//     buttonText: "View Clients",
//     buttonBgColor: "bg-red-500",
//     buttonTextColor: "text-white",
//   },
//   {
//     title: "New Clients",
//     value: "₹46000.00",
//     icon: <UserPlus className="text-teal-500" />,
//     bgColor: "bg-gray-100",
//     textColor: "text-gray-700",
//     buttonText: "View More",
//     buttonBgColor: "bg-teal-500",
//     buttonTextColor: "text-white",
//   },
//   {
//     title: "Renewals",
//     value: "₹46000.00",
//     icon: <RotateCcw className="text-indigo-500" />,
//     bgColor: "bg-gray-100",
//     textColor: "text-gray-700",
//     buttonText: "View More",
//     buttonBgColor: "bg-indigo-500",
//     buttonTextColor: "text-white",
//   },
//   {
//     title: "Upgrade",
//     value: "₹46000.00",
//     icon: <TrendingUp className="text-yellow-500" />,
//     bgColor: "bg-gray-100",
//     textColor: "text-gray-700",
//     buttonText: "View More",
//     buttonBgColor: "bg-yellow-500",
//     buttonTextColor: "text-white",
//   },
//   {
//     title: "Check-ins",
//     value: "₹46000.00",
//     icon: <CheckSquare className="text-lime-500" />,
//     bgColor: "bg-gray-100",
//     textColor: "text-gray-700",
//     buttonText: "View More",
//     buttonBgColor: "bg-lime-500",
//     buttonTextColor: "text-white",
//   },
//   {
//     title: "Total Enquiries",
//     value: "₹46000.00",
//     icon: <Briefcase className="text-cyan-500" />,
//     bgColor: "bg-gray-100",
//     textColor: "text-gray-700",
//     buttonText: "",
//     buttonBgColor: "",
//     buttonTextColor: "",
//   },
//   {
//     title: "Open Enquiries",
//     value: "₹46000.00",
//     icon: <Activity className="text-fuchsia-500" />,
//     bgColor: "bg-gray-100",
//     textColor: "text-gray-700",
//     buttonText: "",
//     buttonBgColor: "",
//     buttonTextColor: "",
//   },
//   {
//     title: "Converted Enquiries",
//     value: "₹46000.00",
//     icon: <Zap className="text-rose-500" />,
//     bgColor: "bg-gray-100",
//     textColor: "text-gray-700",
//     buttonText: "",
//     buttonBgColor: "",
//     buttonTextColor: "",
//   },
//   {
//     title: "Lost Enquiries",
//     value: "₹46000.00",
//     icon: <TrendingDown className="text-slate-500" />,
//     bgColor: "bg-gray-100",
//     textColor: "text-gray-700",
//     buttonText: "",
//     buttonBgColor: "",
//     buttonTextColor: "",
//   },
// ];

// const summaryData = [
//   {
//     label: "Follow-Ups",
//     value: "00",
//     icon: <Edit3 className="text-gray-500 mr-2" />,
//   },
//   {
//     label: "Appointments",
//     value: "01",
//     icon: <Calendar className="text-gray-500 mr-2" />,
//   },
//   {
//     label: "Classes",
//     value: "01",
//     icon: <Layers className="text-gray-500 mr-2" />,
//   },
//   {
//     label: "Expired Subscriptions",
//     value: "01",
//     icon: <AlertTriangle className="text-red-500 mr-2" />,
//   },
//   {
//     label: "Subscriptions About to Expire",
//     value: "50",
//     icon: <Clock className="text-orange-500 mr-2" />,
//   },
//   {
//     label: "Active PT Subscriptions",
//     value: "00",
//     icon: <Star className="text-yellow-500 mr-2" />,
//   },
//   {
//     label: "Expired PT Subscriptions",
//     value: "01",
//     icon: <AlertTriangle className="text-red-500 mr-2" />,
//   },
//   {
//     label: "Pending Renewals",
//     value: "00",
//     icon: <RotateCcw className="text-blue-500 mr-2" />,
//   },
//   {
//     label: "Live App Installs",
//     value: "36 (2%)",
//     icon: <Download className="text-green-500 mr-2" />,
//   },
//   {
//     label: "Client Birthdays",
//     value: "01",
//     icon: <Gift className="text-pink-500 mr-2" />,
//   },
//   {
//     label: "Client Anniversaries",
//     value: "00",
//     icon: <Tag className="text-indigo-500 mr-2" />,
//   },
// ];

// const tableColumns = [
//   { Header: "Sr.No", accessor: "srNo" },
//   { Header: "Renewed Membership", accessor: "renewedMembership" },
//   { Header: "Client ID", accessor: "clientId" },
//   { Header: "Client Name", accessor: "clientName" },
//   { Header: "Assigned To", accessor: "assignedTo" },
//   { Header: "Status", accessor: "status" },
//   { Header: "Membership", accessor: "membership" },
//   { Header: "Start Date", accessor: "startDate" },
//   { Header: "End Date", accessor: "endDate" },
//   { Header: "Amount", accessor: "amount" },
//   { Header: "Balance", accessor: "balance" },
//   { Header: "Action", accessor: "action" },
// ];

// const tableData = [
//   {
//     srNo: 1,
//     renewedMembership: "RM001",
//     clientId: "C001",
//     clientName: "Aarav Sharma",
//     assignedTo: "Rohan Kumar",
//     status: "Active",
//     membership: "Gold Plan - 1 Year",
//     startDate: "01 Jan, 2024",
//     endDate: "31 Dec, 2024",
//     amount: "₹12000",
//     balance: "₹0",
//     action: "View",
//   },
//   {
//     srNo: 2,
//     renewedMembership: "RM002",
//     clientId: "C002",
//     clientName: "Diya Patel",
//     assignedTo: "Priya Singh",
//     status: "Pending",
//     membership: "Silver Plan - 6 Months",
//     startDate: "15 Feb, 2024",
//     endDate: "14 Aug, 2024",
//     amount: "₹7000",
//     balance: "₹1000",
//     action: "View",
//   },
//   {
//     srNo: 3,
//     renewedMembership: "RM003",
//     clientId: "C003",
//     clientName: "Vikram Singh",
//     assignedTo: "Amit Patel",
//     status: "Active",
//     membership: "Bronze Plan - 3 Months",
//     startDate: "10 Mar, 2024",
//     endDate: "09 Jun, 2024",
//     amount: "₹4000",
//     balance: "₹0",
//     action: "View",
//   },
//   {
//     srNo: 4,
//     renewedMembership: "RM004",
//     clientId: "C004",
//     clientName: "Neha Gupta",
//     assignedTo: "Sunita Sharma",
//     status: "Expired",
//     membership: "Gold Plan - 1 Year",
//     startDate: "01 Dec, 2022",
//     endDate: "30 Nov, 2023",
//     amount: "₹12000",
//     balance: "₹0",
//     action: "View",
//   },
//   {
//     srNo: 5,
//     renewedMembership: "RM005",
//     clientId: "C005",
//     clientName: "Rahul Verma",
//     assignedTo: "Rohan Kumar",
//     status: "Active",
//     membership: "Silver Plan - 6 Months",
//     startDate: "20 Apr, 2024",
//     endDate: "19 Oct, 2024",
//     amount: "₹7000",
//     balance: "₹0",
//     action: "View",
//   },
// ];

// // Reusable Dashboard Card Component
// interface DashboardCardProps {
//   title: string;
//   value: string;
//   icon: React.ReactNode;
//   bgColor?: string;
//   textColor?: string;
//   buttonText?: string;
//   buttonBgColor?: string;
//   buttonTextColor?: string;
//   onButtonClick?: () => void;
// }

// const DashboardCard: React.FC<DashboardCardProps> = ({
//   title,
//   value,
//   icon,
//   bgColor = "bg-white",
//   textColor = "text-gray-800",
//   buttonText,
//   buttonBgColor = "bg-blue-500",
//   buttonTextColor = "text-white",
//   onButtonClick,
// }) => {
//   return (
//     <div
//       className={`${bgColor} ${textColor} p-4 md:p-6 rounded-xl shadow-lg flex flex-col justify-between min-h-[120px] md:min-h-[160px]`}>
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm md:text-base font-medium text-gray-500">
//             {title}
//           </p>
//           <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">
//             {value}
//           </p>
//         </div>
//         <div className="p-2 bg-gray-200 rounded-full">
//           {React.cloneElement(icon as React.ReactElement, {
//             size: 20,
//             className: `${(icon as React.ReactElement).props.className}`,
//           })}
//         </div>
//       </div>
//       {buttonText && onButtonClick && (
//         <button
//           onClick={onButtonClick}
//           className={`${buttonBgColor} ${buttonTextColor} text-xs md:text-sm font-semibold py-2 px-3 md:px-4 rounded-lg mt-3 self-start hover:opacity-90 transition-opacity`}>
//           {buttonText}
//         </button>
//       )}
//       {buttonText &&
//         !onButtonClick && ( // Render button even if no action for styling
//           <div
//             className={`${buttonBgColor} ${buttonTextColor} text-xs md:text-sm font-semibold py-2 px-3 md:px-4 rounded-lg mt-3 self-start`}>
//             {buttonText}
//           </div>
//         )}
//     </div>
//   );
// };

// // Reusable Table Component
// interface TableColumn {
//   Header: string;
//   accessor: string;
// }

// interface ReusableTableProps {
//   columns: TableColumn[];
//   data: any[];
//   title?: string;
//   showFilters?: boolean;
//   actionButtons?: React.ReactNode;
// }

// const ReusableTable: React.FC<ReusableTableProps> = ({
//   columns,
//   data,
//   title,
//   showFilters = true,
//   actionButtons,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState<{
//     key: string;
//     direction: string;
//   } | null>(null);

//   const filteredData = useMemo(() => {
//     let sortableData = [...data];
//     if (sortConfig !== null) {
//       sortableData.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === "ascending" ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === "ascending" ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableData.filter((item) =>
//       Object.values(item).some((val) =>
//         String(val).toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [data, searchTerm, sortConfig]);

//   const requestSort = (key: string) => {
//     let direction = "ascending";
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === "ascending"
//     ) {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   return (
//     <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-6">
//       {title && (
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
//             {title}
//           </h2>
//           {actionButtons && <div className="mt-2 sm:mt-0">{actionButtons}</div>}
//         </div>
//       )}
//       {showFilters && (
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
//           <div className="relative w-full sm:w-auto">
//             <input
//               type="text"
//               placeholder="Search table..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//           </div>
//           <div className="flex items-center gap-2 mt-2 sm:mt-0">
//             <button className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
//               <Filter size={16} className="mr-2" /> Filters
//             </button>
//             <button className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
//               <Download size={16} className="mr-2" /> Export
//             </button>
//           </div>
//         </div>
//       )}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               {columns.map((column) => (
//                 <th
//                   key={column.accessor}
//                   onClick={() => requestSort(column.accessor)}
//                   className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap">
//                   <div className="flex items-center">
//                     {column.Header}
//                     {sortConfig &&
//                       sortConfig.key === column.accessor &&
//                       (sortConfig.direction === "ascending" ? (
//                         <ChevronUp size={14} className="ml-1" />
//                       ) : (
//                         <ChevronDown size={14} className="ml-1" />
//                       ))}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredData.map((row, rowIndex) => (
//               <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
//                 {columns.map((column) => (
//                   <td
//                     key={column.accessor}
//                     className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
//                     {column.accessor === "status" ? (
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           row[column.accessor] === "Active"
//                             ? "bg-green-100 text-green-800"
//                             : row[column.accessor] === "Pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : row[column.accessor] === "Expired"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}>
//                         {row[column.accessor]}
//                       </span>
//                     ) : column.accessor === "action" ? (
//                       <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
//                         <Eye size={16} className="mr-1" />{" "}
//                         {row[column.accessor]}
//                       </button>
//                     ) : (
//                       row[column.accessor]
//                     )}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//             {filteredData.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="text-center py-4 text-gray-500">
//                   No data found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
// //
