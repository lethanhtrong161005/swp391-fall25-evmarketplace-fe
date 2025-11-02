import { useCallback } from "react";
import { useState } from "react";
import {
  considerAccepted,
  considerRejected,
  getConsignmentsConsider,
} from "../../../services/staff/staffConsignmentService";
import { message } from "antd";
import {
  CATEGORIES,
  CONSIGNMENT_STATUS_COLOR,
  CONSIGNMENT_STATUS_LABELS,
  ITEM_TYPE,
} from "../../../utils/constants";
import { useEffect } from "react";

const useStaffConsignmentsConsider = () => {
  const [loading, setLoading] = useState(false);
  const [consignments, setConsignments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const fetchData = useCallback(
    async (
      page = pagination.current,
      size = pagination.pageSize,
      sort = "createdAt",
      dir = "desc"
    ) => {
      setLoading(true);
      try {
        const res = await getConsignmentsConsider(page - 1, size, sort, dir);

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
        console.log("Fetch consignment error:", err);
        message.error("Lỗi khi tải danh sách ký gửi");
      } finally {
        setLoading(false);
      }
    },
    [pagination.current, pagination.pageSize]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReject = async (id, rejectedReason) => {
    setLoading(true);
    try {
      const res = await considerRejected(id, rejectedReason);
      if (res?.success) {
        message.success("Từ chối yêu cầu ký gửi thành công!");
        fetchData();
      } else {
        message.error(res?.message || "Không thể từ chối yêu cầu!");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi xử lý từ chối!");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    setLoading(true);
    try {
      const res = await considerAccepted(id);
      if (res?.data.success) {
        message.success("Đã chấp nhận yêu cầu ký gửi!");
        fetchData();
      } else {
        message.error(res?.message || "Không thể chấp nhận yêu cầu!");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi xử lý chấp nhận!");
    } finally {
      setLoading(false);
    }
  };

  const onViewDetail = (item) => setSelectedItem(item);
  const onCloseDetail = () => setSelectedItem(null);
  return {
    loading,
    consignments,
    pagination,
    fetchData,
    selectedItem,
    onViewDetail,
    onCloseDetail,
    handleAccept,
    handleReject,
  };
};

export default useStaffConsignmentsConsider;
