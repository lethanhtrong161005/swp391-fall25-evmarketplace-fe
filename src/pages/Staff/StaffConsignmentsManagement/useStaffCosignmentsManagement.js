import { useCallback } from "react";
import { useState } from "react";
import { getConsignments } from "../../../services/staff/staffConsignmentService";
import { message } from "antd";
import {
  CATEGORIES,
  CONSIGNMENT_STATUS_COLOR,
  CONSIGNMENT_STATUS_LABELS,
  ITEM_TYPE,
} from "../../../utils/constants";
import { useEffect } from "react";

const useStaffConsignmentsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [consignments, setConsignments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedItem, setSelectedItem] = useState(null);

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
        message.error("Lỗi khi tải danh sách ký gửi");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pagesize]);

  const onViewDetail = (item) => setSelectedItem(item);
  const onCloseDetail = () => setSelectedItem(null);
  return {
    loading,
    consignments,
    pagination,
    fetchData,
    selectedItem,
    onViewDetail,
    onCloseDetail
  };
};

export default useStaffConsignmentsManagement;
