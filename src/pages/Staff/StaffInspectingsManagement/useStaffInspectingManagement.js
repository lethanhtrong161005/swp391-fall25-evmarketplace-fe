import { useState, useCallback, useEffect } from "react";
import { message } from "antd";
import { getConsignments } from "@/services/staff/staffConsignmentService";
import {
  CATEGORIES,
  ITEM_TYPE,
  CONSIGNMENT_STATUS_COLOR,
  CONSIGNMENT_STATUS_LABELS,
} from "@/utils/constants";
import {
  addInspection,
  getInspectionByRequestId,
  inactivateInspection,
} from "../../../services/staff/staffConsignmentService";

export default function useStaffInspectingManagement() {
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [consignments, setConsignments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [inactiveModalOpen, setInactiveModalOpen] = useState(false);
  const [inactiveTarget, setInactiveTarget] = useState(null);

  const fetchData = useCallback(
    async (page = 1, size = 10, sort = "createdAt", dir = "desc") => {
      setLoading(true);
      try {
        const res = await getConsignments(page - 1, size, sort, dir);

        if (!res?.success) {
          message.error(res?.message || "Không tải được danh sách!");
          return;
        }

        const data = res?.data;
        let items = data?.items || [];

        const filterStatuses = ["INSPECTING", "INSPECTED_PASS", "INSPECTED_FAIL"];
        items = items.filter((item) => filterStatuses.includes(item.status));

        items = items.map((item) => ({
          ...item,
          category: CATEGORIES[item.category] || item.category,
          itemType: ITEM_TYPE[item.itemType] || item.itemType,
          statusLabel: CONSIGNMENT_STATUS_LABELS[item.status] || item.status,
          statusColor: CONSIGNMENT_STATUS_COLOR[item.status] || "default",
        }));

        setConsignments(items);
        setPagination({
          current: page,
          pageSize: data?.size || size,
          total: data?.totalElements || 0,
        });
      } catch (err) {
        console.error("Fetch consignment error:", err);
        message.error("Lỗi khi tải danh sách ký gửi.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleOpenModal = useCallback((record) => {
    setSelectedRequest(record);
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedRequest(null);
  }, []);

  const handleSubmitInspection = useCallback(
    async (values) => {
      if (!selectedRequest?.id) return;

      setConfirmLoading(true);
      try {
        const { inspectionSummary, suggestedPrice, result } = values;
        const res = await addInspection(
          selectedRequest.id,
          inspectionSummary,
          suggestedPrice,
          result
        );

        if (res?.success) {
          message.success("Thêm kết quả kiểm định thành công!");
          handleCloseModal();
          await fetchData(pagination.current, pagination.pageSize);
        } else {
          message.error(res?.message || "Không thể thêm kết quả kiểm định.");
        }
      } catch (err) {
        console.error("Add inspection error:", err);
        message.error("Lỗi khi thêm kết quả kiểm định.");
      } finally {
        setConfirmLoading(false);
      }
    },
    [selectedRequest, fetchData, pagination, handleCloseModal]
  );

  const handleOpenInactive = useCallback((record) => {
    setInactiveTarget(record);
    setInactiveModalOpen(true);
  }, []);

  const handleCloseInactive = useCallback(() => {
    setInactiveModalOpen(false);
    setInactiveTarget(null);
  }, []);

  const handleConfirmInactive = useCallback(async () => {
    if (!inactiveTarget?.id) return;

    setConfirmLoading(true);
    try {
      const resInspection = await getInspectionByRequestId(inactiveTarget.id);
      const inspectionId = resInspection?.data?.id;

      if (!resInspection?.success || !inspectionId) {
        message.error("Không tìm thấy kết quả kiểm định để hủy!");
        return;
      }

      const resDeactivate = await inactivateInspection(inspectionId);

      if (resDeactivate?.success) {
        message.success("Đã hủy kết quả kiểm định thành công!");
        handleCloseInactive();
        await fetchData(pagination.current, pagination.pageSize);
      } else {
        message.error(resDeactivate?.message || "Không thể hủy kiểm định.");
      }
    } catch (err) {
      console.error("Inactivate inspection error:", err);
      message.error("Lỗi khi hủy kết quả kiểm định.");
    } finally {
      setConfirmLoading(false);
    }
  }, [inactiveTarget, fetchData, pagination, handleCloseInactive]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    consignments,
    loading,
    pagination,
    openModal,
    confirmLoading,
    selectedRequest,
    inactiveModalOpen,
    inactiveTarget,
    handleOpenModal,
    handleCloseModal,
    handleSubmitInspection,
    handleOpenInactive,
    handleCloseInactive,
    handleConfirmInactive,
    fetchData,
  };
}
