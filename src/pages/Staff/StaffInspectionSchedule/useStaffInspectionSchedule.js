import { useEffect, useState, useCallback } from "react";
import { getStaffInspectionSchedule } from "@/services/staff/staffConsignmentService";
import dayjs from "dayjs";

export default function useStaffInspectionSchedule() {
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);
  const statuses = ["SCHEDULED", "CHECKED_IN", "NO_SHOW", "CANCELLED"];
  const today = dayjs().format("YYYY-MM-DD");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStaffInspectionSchedule(today, statuses);
      if (res?.success && Array.isArray(res.data)) {
        setSchedules(res.data);
      } else {
        setSchedules([]);
        console.warn("Không có dữ liệu lịch kiểm định.");
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch kiểm định:", err);
      setError(err?.message || "Không thể tải dữ liệu lịch kiểm định");
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { schedules, loading, today, error, refetch: fetchData };
}
