"use client";
import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { LuMessageCircle } from "react-icons/lu";
import { FiSend } from "react-icons/fi";
import Image from "next/image";

const CommunityPosts = () => {
  const [activeTab, setActiveTab] = useState("Pending Post");

  return (
    <div className="p-4 md:p-8 bg-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold">Community All Posts</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by Mobile Number or Email Address"
            className="border px-4 py-2 rounded-md text-sm w-72"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Search
          </button>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Upload Post
        </button>
      </div>

      <div className="flex justify-around bg-white p-2 border-b-2 border-gray-300 my-4 text-gray-600 rounded-lg">
        {["Pending Post", "Active Post", "Declined Post", "All Posts"].map(
          (tab) => (
            <span
              key={tab}
              className={`pb-2 cursor-pointer ${
                activeTab === tab
                  ? "border-b-4 border-blue-500 text-blue-500"
                  : ""
              }`}
              onClick={() => setActiveTab(tab)}>
              {tab}
            </span>
          )
        )}
      </div>

      <div className="flex w-full  max-w-full mt-6">
        <div className="overflow-x-auto flex-1">
          <table className="w-full border-separate border-spacing-y-3 ">
            <thead className="bg-gray-800 p-4 text-white">
              <tr className="rounded-lg">
                <th className=" rounded-l-lg p-2">
                  <input
                    type="checkbox"
                    className="rounded-l-lg p-3 text-left w-5 h-5 rounded-lg"
                  />
                </th>

                <th className=" rounded-r-lg p-2">
                  <span className="text-md flex justify-center items-center">
                    Post
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className=" bg-white ">
              <tr>
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="w-5 h-5 border-2  border-purple-600 rounded-md appearance-none
                           flex items-center justify-center
                           checked:bg-transparent checked:before:content-['✔']
                           checked:before:text-purple-600 checked:before:text-xl checked:before:font-bold
                           checked:before:flex checked:before:items-center checked:before:justify-center"
                  />
                </td>
                <td className="p-4">
                  <div className="flex justify-center items-center  ">
                    <div className="bg-white border-2 rounded-lg p-4 w-full max-w-2xl">
                      <div className="flex gap-4">
                        {/* Post Image */}
                        <div className="w-1/3">
                          <Image
                            src="/swasthfit-gym/images/profile3.png"
                            alt="Post"
                            width={1200}
                            height={300}
                            className="w-full h-auto rounded-lg object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Post Details */}
                        <div className="flex-1">
                          {/* User Info */}

                          <div className="flex items-center gap-2 mb-2 border-b-2 p-2">
                            <Image
                              src="/swasthfit-gym/images/profile4.png"
                              alt="Profile"
                              width={1200}
                              height={300}
                              className="w-16 h-16 rounded-full"
                              loading="lazy"
                            />
                            <span className="font-semibold text-blue-600">
                              YD Fitness Club
                            </span>
                            <button className="ml-auto text-gray-500">⋮</button>
                          </div>

                          {/* Post Stats */}
                          <div className="flex gap-4 text-gray-500 mt-5 mb-5">
                            <span className="flex gap-2 text-[20px]">
                              <FaRegHeart className="text-blue-600" /> 02
                            </span>
                            <span className="flex gap-2 text-[20px]">
                              <LuMessageCircle className="text-blue-600" /> 02
                            </span>
                            <span className="flex gap-2 text-[20px]">
                              <FiSend className="text-blue-600" /> 02
                            </span>
                          </div>

                          {/* Read More Link */}
                          <p className=" cursor-pointer">Read more...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody className=" bg-white ">
              <tr>
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="w-5 h-5 border-2  border-purple-600 rounded-md appearance-none
                           flex items-center justify-center
                           checked:bg-transparent checked:before:content-['✔']
                           checked:before:text-purple-600 checked:before:text-xl checked:before:font-bold
                           checked:before:flex checked:before:items-center checked:before:justify-center"
                  />
                </td>
                <td className="p-4">
                  <div className="flex justify-center items-center  ">
                    <div className="bg-white border-2 rounded-lg p-4 w-full max-w-2xl">
                      <div className="flex gap-4">
                        {/* Post Image */}
                        <div className="w-1/3">
                          <Image
                            src="/swasthfit-gym/images/profile3.png"
                            alt="Post"
                            width={1200}
                            height={300}
                            className="w-full h-auto rounded-lg object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Post Details */}
                        <div className="flex-1">
                          {/* User Info */}

                          <div className="flex items-center gap-2 mb-2 border-b-2 p-2">
                            <Image
                              src="/swasthfit-gym/images/profile4.png"
                              alt="Profile"
                              width={1200}
                              height={300}
                              className="w-16 h-16 rounded-full"
                              loading="lazy"
                            />
                            <span className="font-semibold text-blue-600">
                              YD Fitness Club
                            </span>
                            <button className="ml-auto text-gray-500">⋮</button>
                          </div>

                          {/* Post Stats */}
                          <div className="flex gap-4 text-gray-500 mt-5 mb-5">
                            <span className="flex gap-2 text-[20px]">
                              <FaRegHeart className="text-blue-600" /> 02
                            </span>
                            <span className="flex gap-2 text-[20px]">
                              <LuMessageCircle className="text-blue-600" /> 02
                            </span>
                            <span className="flex gap-2 text-[20px]">
                              <FiSend className="text-blue-600" /> 02
                            </span>
                          </div>

                          {/* Read More Link */}
                          <p className=" cursor-pointer">Read more...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody className=" bg-white ">
              <tr>
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="w-5 h-5 border-2  border-purple-600 rounded-md appearance-none
                           flex items-center justify-center
                           checked:bg-transparent checked:before:content-['✔']
                           checked:before:text-purple-600 checked:before:text-xl checked:before:font-bold
                           checked:before:flex checked:before:items-center checked:before:justify-center"
                  />
                </td>
                <td className="p-4">
                  <div className="flex justify-center items-center  ">
                    <div className="bg-white border-2 rounded-lg p-4 w-full max-w-2xl">
                      <div className="flex gap-4">
                        {/* Post Image */}
                        <div className="w-1/3">
                          <Image
                            src="/swasthfit-gym/images/profile3.png"
                            alt="Post"
                            width={1200}
                            height={300}
                            className="w-full h-auto rounded-lg object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Post Details */}
                        <div className="flex-1">
                          {/* User Info */}

                          <div className="flex items-center gap-2 mb-2 border-b-2 p-2">
                            <Image
                              src="/swasthfit-gym/images/profile4.png"
                              alt="Profile"
                              width={1200}
                              height={300}
                              className="w-16 h-16 rounded-full"
                              loading="lazy"
                            />
                            <span className="font-semibold text-blue-600">
                              YD Fitness Club
                            </span>
                            <button className="ml-auto text-gray-500">⋮</button>
                          </div>

                          {/* Post Stats */}
                          <div className="flex gap-4 text-gray-500 mt-5 mb-5">
                            <span className="flex gap-2 text-[20px]">
                              <FaRegHeart className="text-blue-600" /> 02
                            </span>
                            <span className="flex gap-2 text-[20px]">
                              <LuMessageCircle className="text-blue-600" /> 02
                            </span>
                            <span className="flex gap-2 text-[20px]">
                              <FiSend className="text-blue-600" /> 02
                            </span>
                          </div>

                          {/* Read More Link */}
                          <p className=" cursor-pointer">Read more...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommunityPosts;
