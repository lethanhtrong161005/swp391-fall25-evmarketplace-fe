import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { getConsignmentsManagement } from "../../../services/consigmentService";
import {
  CATEGORIES,
  CONSIGNMENT_STATUS_COLOR,
  CONSIGNMENT_STATUS_LABELS,
  ITEM_TYPE,
} from "../../../utils/constants";
import useBranchId from "@/hooks/useBranchId";

const useManagerConsignmentsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [consignmentsManagement, setConsignmentsManagement] = useState([]);
  const { branchId, loading: branchLoading } = useBranchId();
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchManagerConsignments = useCallback(
    async (page = 1, size = 10, sort = "createdAt", dir = "desc") => {
      if (!branchId) return;
      setLoading(true);
      try {
        const res = await getConsignmentsManagement(
          branchId,
          page - 1,
          size,
          sort,
          dir
        );

        if (res?.success) {
          const items = (res.data?.items || res.data || []).map((item) => ({
            ...item,
            category: CATEGORIES[item.category] || item.category,
            itemType: ITEM_TYPE[item.itemType] || item.itemType,
            statusLabel:
              CONSIGNMENT_STATUS_LABELS[item.status] || item.status,
            statusColor:
              CONSIGNMENT_STATUS_COLOR[item.status] || "default",
          }));
          setConsignmentsManagement(items);
        } else {
          message.error(res?.message || "Không lấy được danh sách ký gửi");
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách ký gửi:", err);
        message.error("Đã xảy ra lỗi khi tải danh sách ký gửi");
      } finally {
        setLoading(false);
      }
    },
    [branchId]
  );

  // ⏱️ Auto fetch khi có branchId
  useEffect(() => {
    if (branchId) fetchManagerConsignments();
  }, [fetchManagerConsignments, branchId]);

  // 📄 Modal actions
  const onViewDetail = (item) => setSelectedItem(item);
  const onCloseDetail = () => setSelectedItem(null);

  return {
    consignmentsManagement,
    loading: loading || branchLoading,
    branchId,
    selectedItem,
    onViewDetail,
    onCloseDetail,

    fetchManagerConsignments,
    setConsignmentsManagement,
  };
};

export default useManagerConsignmentsManagement;
