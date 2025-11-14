import { useState, useCallback } from "react";
import { message } from "antd";
import {
  getManagerAgreement,
  searchManagerAgreementsByPhone,
  getSettlementByAgreementId as getSettlementByAgreementIdService,
  setSettlementPayout,
} from "../../../services/agreementService";

const useManagerAgreementsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [agreementsManagement, setAgreementsManagement] = useState([]);

  const fetchManagerAgreements = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getManagerAgreement();
      const data = Array.isArray(res?.data) ? res.data : res;
      setAgreementsManagement(data);
      return data;
    } catch (err) {
      console.error("Lỗi khi tải danh sách hợp đồng:", err);
      message.error("Không thể tải danh sách hợp đồng, vui lòng thử lại.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchManagerAgreements = useCallback(async (phone) => {
    if (!phone?.trim()) {
      message.warning("Vui lòng nhập số điện thoại để tìm kiếm!");
      return;
    }

    try {
      setLoading(true);
      const res = await searchManagerAgreementsByPhone(phone.trim());
      const data = Array.isArray(res?.data) ? res.data : res;
      if (!data?.length) message.info("Không tìm thấy hợp đồng nào.");
      setAgreementsManagement(data);
      return data;
    } catch (err) {
      console.error("Lỗi khi tìm kiếm hợp đồng:", err);
      message.error("Không thể tìm kiếm hợp đồng, vui lòng thử lại.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getSettlementByAgreementId = useCallback(async (agreementId) => {
    try {
      const res = await getSettlementByAgreementIdService(agreementId);
      if (res?.success && res?.data) return res.data;
      message.warning("Không tìm thấy bản sao kê.");
      return null;
    } catch (err) {
      console.error("Lỗi khi lấy bản sao kê:", err);
      message.error("Không thể lấy bản sao kê từ agreementId.");
      return null;
    }
  }, []);

  const uploadPayoutFile = useCallback(
    async (settlementId, file) => {
      if (!file || file.type !== "application/pdf") {
        message.error("Chỉ chấp nhận tệp PDF hợp lệ!");
        return;
      }

      setLoading(true);
      try {
        const res = await setSettlementPayout(settlementId, file);
        if (res?.status === 200) {
          message.success("Cập nhật thanh toán thành công!");
          await fetchManagerAgreements();
        } else {
          message.error("Thanh toán thất bại!");
        }
      } catch (err) {
        console.error("Lỗi khi upload file thanh toán:", err);
        message.error("Có lỗi khi gửi tệp thanh toán.");
      } finally {
        setLoading(false);
      }
    },
    [fetchManagerAgreements]
  );

  return {
    loading,
    agreementsManagement,
    fetchManagerAgreements,
    searchManagerAgreements,
    getSettlementByAgreementId,
    uploadPayoutFile,
  };
};

export default useManagerAgreementsManagement;
