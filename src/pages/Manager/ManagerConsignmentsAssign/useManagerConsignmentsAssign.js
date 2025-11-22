import { useState, useEffect } from "react";
import { message } from "antd";
import { getConsignmentsAssign } from "../../../services/consigmentService";
import { useCallback } from "react";
import {
  CATEGORIES,
  CONSIGNMENT_STATUS_COLOR,
  CONSIGNMENT_STATUS_LABELS,
  ITEM_TYPE,
} from "../../../utils/constants";
import useBranchId from "@/hooks/useBranchId";

const useManagerConsignmentsAssign = () => {
  const [loading, setLoading] = useState(false);
  const [consignmentsAssign, setConsignmentsAssign] = useState([]);
  const { branchId, loading: branchLoading } = useBranchId();
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    try {
      const res = await getConsignmentsAssign(branchId);
      const rawData = res?.data?.data || res?.data || res;
      const items = (Array.isArray(rawData) ? rawData : []).map((item) => ({
        ...item,
        category: CATEGORIES[item.category] || item.category,
        itemType: ITEM_TYPE[item.itemType] || item.itemType,
        statusLabel: CONSIGNMENT_STATUS_LABELS[item.status] || item.status,
        statusColor: CONSIGNMENT_STATUS_COLOR[item.status] || "default",
      }));

      setConsignmentsAssign(items);
    } catch (err) {
      console.error(err.message);
      message.error("Đã xảy ra lỗi khi tải danh sách ký gửi");
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    if (!branchLoading && branchId) {
      fetchData();
    }
  }, [branchId, branchLoading, fetchData]);

  const onViewDetail = (item) => setSelectedItem(item);
  const onCloseDetail = () => setSelectedItem(null);
  return {
    consignmentsAssign,
    loading: loading || branchLoading,
    branchId,
    fetchData,
    selectedItem,
    onViewDetail,
    onCloseDetail,
  };
};

export default useManagerConsignmentsAssign;
