import GymDashboard from "@/components/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swasthfit | Dashboard",
  description: "This is the dashboard page",
};
const Dashboard = () => {
  return <GymDashboard />;
};

export default Dashboard;
