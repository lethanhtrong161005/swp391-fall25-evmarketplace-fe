import { useState, useEffect } from "react";
import { message } from "antd";
import { getConsignmentsManagement } from "../../../services/consigmentService";
import { useCallback } from "react";
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

  const fetchData = useCallback(
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

        if (res.success) {
          const items = (res.data?.items || []).map((item) => ({
            ...item,
            category: CATEGORIES[item.category] || item.category,
            itemType: ITEM_TYPE[item.itemType] || item.itemType,
            statusLabel: CONSIGNMENT_STATUS_LABELS[item.status] || item.status,
            statusColor: CONSIGNMENT_STATUS_COLOR[item.status] || "default",
          }));
          setConsignmentsManagement(items);
        } else {
          message.error(res.message || "Không lấy được danh sách ký gửi");
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

  useEffect(() => {
    if (branchId) fetchData();
  }, [fetchData, branchId]);

  const onViewDetail = (item) => setSelectedItem(item);
  const onCloseDetail = () => setSelectedItem(null);
  return {
    consignmentsManagement,
    loading: loading || branchLoading,
    branchId,
    selectedItem,
    onViewDetail,
    onCloseDetail,
  };
};

export default useManagerConsignmentsManagement;
