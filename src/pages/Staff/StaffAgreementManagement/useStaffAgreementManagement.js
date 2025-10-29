import { useState, useCallback } from "react";
import { message } from "antd";
import {
  getInspections,
  addAgreement,
} from "@/services/staff/staffConsignmentService";
import { getConsignmentById } from "../../../services/consigmentService";

const useStaffAgreementManagement = () => {
  const [loading, setLoading] = useState(false);
  const [inspections, setInspections] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchInspections = useCallback(
    async (
      status = ["PASS", "FAIL"], // kết quả kiểm định (PASS, FAIL)
      isActive = true // chỉ lấy bản ghi hoạt động
    ) => {
      try {
        setLoading(true);

        // 🔹 Bước 1: Gọi API lấy danh sách kiểm định
        const res = await getInspections(status, isActive);
        const data = res.data || [];

        // 🔹 Bước 2: Với mỗi inspection, gọi API lấy consignment
        const enrichedData = await Promise.all(
          data.map(async (inspection) => {
            try {
              if (inspection.requestId) {
                const consignmentRes = await getConsignmentById(inspection.requestId);
                return {
                  ...inspection,
                  consignment: consignmentRes.data,
                };
              }
              return inspection;
            } catch (err) {
              console.warn(`Không thể tải consignment `, err);
              return inspection;
            }
          })
        );

        // 🔹 Bước 3: Lọc chỉ giữ các consignment có status mong muốn
        const allowedStatuses = ["INSPECTED_PASS", "INSPECTED_FAIL", "SIGNED"];
        const filtered = enrichedData.filter(
          (item) =>
            item.consignment &&
            allowedStatuses.includes(item.consignment.status)
        );

        setInspections(filtered);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải danh sách kiểm định");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const openAddAgreementModal = (inspection) => {
    setSelectedInspection(inspection);
    setIsModalVisible(true);
  };

  const closeAddAgreementModal = () => {
    setIsModalVisible(false);
    setSelectedInspection(null);
  };

  const handleAddAgreement = async (values) => {
    try {
      const {
        commissionPercent,
        acceptablePrice,
        startAt,
        duration,
        depositPercent,
      } = values;

      const requestId = selectedInspection?.requestId;
      if (!requestId) {
        message.error("Không tìm thấy requestId của kiểm định này");
        return;
      }

      const res = await addAgreement(
        requestId,
        commissionPercent,
        acceptablePrice,
        startAt,
        duration,
        depositPercent
      );

      message.success("Thêm hợp đồng thành công!");
      closeAddAgreementModal();
      fetchInspections(); // refresh lại danh sách sau khi thêm
      return res;
    } catch (error) {
      console.error(error);
      message.error("Không thể thêm hợp đồng");
    }
  };

  return {
    loading,
    inspections,
    selectedInspection,
    isModalVisible,
    fetchInspections,
    openAddAgreementModal,
    closeAddAgreementModal,
    handleAddAgreement,
  };
};

export default useStaffAgreementManagement;
