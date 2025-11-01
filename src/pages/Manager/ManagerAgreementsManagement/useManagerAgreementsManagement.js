import { useState, useCallback } from "react";
import { message } from "antd";
import { getManagerAgreement } from "../../../services/agreementService";

const useManagerAgreementsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [agreementsManagement, setAgreementsManagement] = useState([]);

  const fetchManagerAgreements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getManagerAgreement();
         const data = Array.isArray(res?.data) ? res.data : [];
      setAgreementsManagement(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách hợp đồng:", err);
      message.error("Không thể tải danh sách hợp đồng, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    agreementsManagement,
    fetchManagerAgreements,
    setAgreementsManagement,
  };
};

export default useManagerAgreementsManagement;
