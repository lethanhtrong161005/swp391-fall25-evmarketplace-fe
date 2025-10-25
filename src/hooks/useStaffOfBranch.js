import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { getStaffOfBranch } from "@/services/accountService";

const useStaffOfBranch = (branchId) => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStaff = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    try {
      const res = await getStaffOfBranch(branchId);
      if (res.success) {
        setStaffList(res.data || []);
      } else {
        message.error(res.message || "Không thể lấy danh sách nhân viên");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách nhân viên:", err);
      message.error("Đã xảy ra lỗi khi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const getStaffNameById = useCallback(
    (id) => {
      const staff = staffList.find((s) => s.id === id);
      return staff?.profile?.fullName || "Không có";
    },
    [staffList]
  );

  return { staffList, loading, reloadStaff: fetchStaff, getStaffNameById };
};

export default useStaffOfBranch;
