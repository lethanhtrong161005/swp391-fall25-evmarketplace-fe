import { useState, useEffect } from "react";

export function useAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalBatteries: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        // TODO: Thay thế bằng API call thực tế
        // const response = await adminDashboardService.getStats();

        // Mock data tạm thời
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStats({
          totalUsers: 1247,
          totalVehicles: 156,
          totalBatteries: 89,
          monthlyRevenue: 125000000,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return {
    stats,
    loading,
  };
}
