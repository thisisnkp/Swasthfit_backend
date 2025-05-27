"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const mainNavItems = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "Enquiry",
      href: "/enquiry",
      subMenu: [
        { name: "Enquiry List", href: "/enquiry/enquiryList" },
        { name: "Enquiry Form", href: "/enquiry/enquiryForm" },
      ],
    },
    {
      name: "Admins",
      href: "/admins",
      subMenu: [
        { name: "Admin KYC Details", href: "/admins/admin_kyc" },
        { name: "Amenities", href: "/admins/gym_amenities" },
      ],
    },
    {
      name: "Payment Details",
      href: "/Payment_details",
      subMenu: [
        { name: "Payment Detail", href: "/Payment_details/payment_detail" },
        { name: "Balance Recharge", href: "/Payment_details/balance_recharge" },
        { name: "SMS Settings", href: "/Payment_details/sms_setting" },
      ],
    },
    { name: "Follow Ups", href: "/follow_ups" },
    { name: "Members", href: "/members" },
    { name: "Analysis", href: "/analysis" },
    // { name: "Memberships", href: "/membership" },
    { name: "Batches & Classes", href: "/batches_classes" },
    { name: "Accounts", href: "/accounts" },
    { name: "Notifications & WhatsApp", href: "/notifications" },
    { name: "Trainers", href: "/trainers" },
    { name: "Community Posts", href: "/community_posts" },
    {
      name: "Fitness Center",
      href: "/fitness_center",
      subMenu: [
        { name: "Preview", href: "/fitness_center/preview" },
        { name: "Basic Information", href: "/fitness_center/basicInformation" },
      ],
    },

    {
      name: "Staff List",
      href: "/staff",
      // subMenu: [
      //   { name: "StaffDetails", href: "/staff/staffDetails/:id" },
      // ]
    },

    { name: "Attendance Reports", href: "/attendance_reports" },
    { name: "E-commerce", href: "/ecommerce" },
    { name: "Wallet", href: "/wallet" },
    { name: "App Settings", href: "/app_settings" },
    { name: "Tutorial & Help Videos", href: "/tutorials" },
    {
      name: "Payment",
      href: "/payment",
      subMenu: [
        { name: "Success", href: "/payment/success" },
        { name: "Failure", href: "/payment/failure" },
      ],
    },
    { name: "Coupons", href: "/coupons" },
    { name: "Membership", href: "/membership" },
    { name: "Role Management", href: "/role" },
    { name: "Members birthday", href: "/members_birthday" },
  ];

  const dropdownItems = ["Fitness Center", "Payment Details", "Enquiry"];

  const isActive = (route: string) => (pathname === route ? "active" : "");

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <nav className="bg-[#081225]">
      <div className="mx-auto max-w-[1600px]">
        <div className="hidden lg:flex flex-col">
          <div className="flex h-24 items-center space-x-4 px-4">
            <div className="hidden lg:flex lg:space-x-5 lg:flex-wrap">
              {mainNavItems.map((item) => (
                <div key={item.name} className="relative">
                  {dropdownItems.includes(item.name) && item.subMenu ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`flex items-center font-medium text-[14px] text-[#B9B9B9] hover:text-white mb-4 ${isActive(
                          item.href
                        )}`}>
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      {openDropdown === item.name && (
                        <div className="absolute left-0 mt-2 w-48 bg-[#1e293b] rounded-md shadow-lg z-50">
                          {item.subMenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-white hover:bg-[#334155]">
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center font-medium text-[14px] text-[#B9B9B9] hover:text-white mb-4 ${isActive(
                        item.href
                      )}`}>
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
