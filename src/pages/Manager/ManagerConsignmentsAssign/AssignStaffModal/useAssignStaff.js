import { useState, useCallback } from "react";
import { message } from "antd";
import { assignStaffToConsignment } from "@/services/consigmentService";

const useAssignConsignmentStaff = () => {
  const [loading, setLoading] = useState(false);

  const assignStaff = useCallback(async (requestId, staffId) => {
    setLoading(true);
    try {
      const res = await assignStaffToConsignment(requestId, staffId);

      if (res.success) {
        message.success("Phân công nhân viên thành công");
        return true;
      } else {
        message.error(res.message || "Phân công thất bại");
        return false;
      }
    } catch (err) {
      console.error("Lỗi khi phân công nhân viên:", err);
      message.error("Đã xảy ra lỗi khi phân công nhân viên");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { assignStaff, loading };
};

export default useAssignConsignmentStaff;
