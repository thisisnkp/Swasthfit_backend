"use client";
import { checkAuth } from "@/utils/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Login from "./Login";

const WithAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const token = localStorage.getItem("gymAuthToken");
  const path = usePathname();
  useEffect(() => {
    if (token === null) {
      router.push("/login");
    } else {
      path == "/" || path == "/login"
        ? router.push("/dashboard")
        : router.push(path);
    }
  }, [router]);
  if (token === null) {
    return <Login />;
  }
  return <>{children}</>;
};

export default WithAuth;
