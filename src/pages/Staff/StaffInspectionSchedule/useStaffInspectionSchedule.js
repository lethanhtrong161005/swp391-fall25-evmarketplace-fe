import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  getStaffInspectionSchedule,
  checkInInspectionSchedule,
} from "@/services/staff/staffConsignmentService";
import { markCancelInspectionSchedule } from "@/services/consigmentService";
import { message } from "antd";
import dayjs from "dayjs";

const STATIC_STATUSES = ["SCHEDULED", "CHECKED_IN", "NO_SHOW", "CANCELLED"];

export default function useStaffInspectionSchedule() {
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const isMounted = useRef(true);
  const selectedDateRef = useRef(dayjs());
  const statuses = useMemo(() => STATIC_STATUSES, []);

  const fetchSchedulesByDate = useCallback(
    async (dateParam) => {
      const dateToFetch = dayjs(dateParam || selectedDateRef.current).format("YYYY-MM-DD");
      setLoading(true);
      setError(null);
      try {
        const res = await getStaffInspectionSchedule(dateToFetch, statuses);
        if (res?.success && Array.isArray(res.data)) {
          if (isMounted.current) setSchedules(res.data);
        } else {
          if (isMounted.current) setSchedules([]);
        }
      } catch (err) {
        if (isMounted.current)
          setError(err?.message || "Không thể tải dữ liệu lịch kiểm định");
      } finally {
        if (isMounted.current) setLoading(false);
      }
    },
    [statuses]
  );

  const handleCheckIn = useCallback(
    async (id, dateOverride) => {
      try {
        setLoading(true);
        const res = await checkInInspectionSchedule(id);
        if (res?.success) {
          message.success("Check-in thành công!");
          await fetchSchedulesByDate(dateOverride || selectedDateRef.current);
        } else {
          message.error(res?.message || "Không thể check-in lịch này.");
        }
      } catch {
        message.error("Lỗi khi check-in lịch kiểm định.");
      } finally {
        if (isMounted.current) setLoading(false);
      }
    },
    [fetchSchedulesByDate]
  );

  const handleCancelSchedule = useCallback(
    async (id, reason, dateOverride) => {
      try {
        setLoading(true);
        const res = await markCancelInspectionSchedule(id, reason);
        if (res?.success) {
          message.warning("Đã hủy lịch kiểm định!");
          await fetchSchedulesByDate(dateOverride || selectedDateRef.current);
        } else {
          message.error(res?.message || "Không thể hủy lịch kiểm định.");
        }
      } catch {
        message.error("Lỗi khi hủy lịch kiểm định.");
      } finally {
        if (isMounted.current) setLoading(false);
      }
    },
    [fetchSchedulesByDate]
  );

  useEffect(() => {
    selectedDateRef.current = selectedDate;
    fetchSchedulesByDate(selectedDate);
  }, [selectedDate, fetchSchedulesByDate]);

  useEffect(() => {
    isMounted.current = true;
    fetchSchedulesByDate(selectedDateRef.current);
    return () => {
      isMounted.current = false;
    };
  }, [fetchSchedulesByDate]);

  return {
    schedules,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    fetchSchedulesByDate,
    handleCheckIn,
    handleCancelSchedule,
  };
}
