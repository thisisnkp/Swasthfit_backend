"use client";
import { setOwner } from "@/lib/features/auth/gymOwnerSlice";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gymId, setGymId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.classList.add("bg-gray-100");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = isOwner
      ? {
          email,
          password,
          user_role: "owner",
          staff_id: "",
        }
      : {
          email,
          password,
          user_role: "staff",
          staff_id: gymId,
        };

    console.log(
      "API URL:",
      `${process.env.NEXT_PUBLIC_BASE_URL}/gym/site/apis/login`
    );
    console.log("Payload being sent:", payload);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/gym/site/apis/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("gymAuthToken", data.token);
        dispatch(setOwner({ email, name: data.gymOwner?.name }));
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-8 overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="hidden lg:block w-full lg:w-1/2">
          <div className="relative h-64 lg:h-full">
            <Image
              src="/swasthfit-gym/images/woman-helping-man-gym.svg"
              alt="Login cover"
              width={724}
              height={1024}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-[400px] space-y-6">
            <div className="text-center space-y-2">
              <Image
                src="/swasthfit-gym/images/swasthfit-logo.png"
                alt="Login cover"
                width={279}
                height={115}
                className="mx-auto"
                loading="lazy"
              />
            </div>

            <h2 className="text-[#1D2026] text-2xl font-semibold">Login</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isOwner && (
                <div className="space-y-1.5">
                  <label className="block text-[#64748B] text-sm">Gym ID</label>
                  <input
                    type="text"
                    placeholder="Enter your gym ID"
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setGymId(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[#64748B] text-sm">Email</label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center relative">
                  <label className="text-[#64748B] text-sm">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-md leading-5">
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="loginAsOwner"
                  checked={isOwner}
                  onChange={() => setIsOwner(!isOwner)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="loginAsOwner"
                  className="text-[#64748B] text-sm">
                  Login as Owner
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white py-2.5 rounded-full transition-colors">
                Login
              </button>
            </form>

            <div className="text-center text-[#64748B] text-sm">
              <p>
                © 2024 Swasthfit All Rights Reserved.{" "}
                <a href="#" className="underline hover:text-[#1E293B]">
                  Privacy and Terms
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
