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

  const statuses = useMemo(() => STATIC_STATUSES, []);
  const formattedSelected = useMemo(
    () => dayjs(selectedDate).format("YYYY-MM-DD"),
    [selectedDate]
  );

  const fetchSchedulesByDate = useCallback(
    async (date) => {
      setLoading(true);
      setError(null);
      try {
        const formattedDate = dayjs(date).format("YYYY-MM-DD");
        const res = await getStaffInspectionSchedule(formattedDate, statuses);
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
    async (id) => {
      try {
        setLoading(true);
        const res = await checkInInspectionSchedule(id);
        if (res?.success) {
          message.success("Check-in thành công!");
          await fetchSchedulesByDate(formattedSelected);
        } else {
          message.error(res?.message || "Không thể check-in lịch này.");
        }
      } catch {
        message.error("Lỗi khi check-in lịch kiểm định.");
      } finally {
        if (isMounted.current) setLoading(false);
      }
    },
    [fetchSchedulesByDate, formattedSelected]
  );

  const handleCancelSchedule = useCallback(
    async (id, reason) => {
      try {
        setLoading(true);
        const res = await markCancelInspectionSchedule(id, reason);
        if (res?.success) {
          message.warning("Đã đánh dấu vắng mặt!");
          await fetchSchedulesByDate(formattedSelected);
        } else {
          message.error(res?.message || "Không thể đánh dấu vắng mặt.");
        }
      } catch {
        message.error("Lỗi khi đánh dấu vắng mặt.");
      } finally {
        if (isMounted.current) setLoading(false);
      }
    },
    [fetchSchedulesByDate, formattedSelected]
  );

  useEffect(() => {
    isMounted.current = true;
    fetchSchedulesByDate(formattedSelected);
    return () => {
      isMounted.current = false;
    };
  }, [fetchSchedulesByDate, formattedSelected]);

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
