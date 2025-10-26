import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { getUserProfile } from "@/services/accountService";

const useBranchId = () => {
  const [branchId, setBranchId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBranch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserProfile();

      if (!res?.success || !res?.data?.branch?.id) {
        message.error("Không thể xác định chi nhánh của người dùng");
        return;
      }

      setBranchId(res.data.branch.id);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin chi nhánh:", err);
      message.error("Đã xảy ra lỗi khi lấy thông tin chi nhánh");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranch();
  }, [fetchBranch]);

  return { branchId, loading, reloadBranch: fetchBranch };
};

export default useBranchId;
