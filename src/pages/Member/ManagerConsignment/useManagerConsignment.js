import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAllConsignments } from "../../../services/consigmentService";

const useManagerConsignment = (tabs) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [consignments, setConsignments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "SUBMITTED");
  const [counts, setCounts] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  const statusLabels = {
    SUBMITTED: "Đã gửi yêu cầu",
    SCHEDULING: "Chờ lên lịch",
    SCHEDULED: "Đã lên lịch",
    RESCHEDULED: "Hẹn lại",
    INSPECTING: "Đang kiểm định",
    INSPECTED_PASS: "Kiểm định đạt",
    INSPECTED_FAIL: "Kiểm định không đạt",
    REQUEST_REJECTED: "Bị từ chối",
    FINISHED: "Hoàn thành",
    EXPIRED: "Hết hạn",
    CANCELLED: "Đã hủy",
  };

  const statusColors = {
    SUBMITTED: "blue",
    SCHEDULING: "processing",
    SCHEDULED: "gold",
    INSPECTING: "processing",
    INSPECTED_PASS: "green",
    INSPECTED_FAIL: "red",
    REQUEST_REJECTED: "volcano",
    FINISHED: "success",
    EXPIRED: "gray",
  };

  const fetchData = useCallback(
    async (page = 1, size = 10, sort = "createdAt", dir = "desc") => {
      setLoading(true);
      try {
        const res = await getAllConsignments(page - 1, size, sort, dir);

        if (!res?.success) {
          message.error(res?.message || "Không tải được danh sách ký gửi");
          return;
        }

        const data = res.data;
        let items = data?.items || [];

        const newCounts = items.reduce((acc, cur) => {
          acc[cur.status] = (acc[cur.status] || 0) + 1;
          return acc;
        }, {});
        newCounts.ALL = items.length;
        setCounts(newCounts);

        const tabDef = tabs.find((t) => t.key === activeTab);
        const validStatuses = tabDef?.statuses || [activeTab];
        items = items.filter((x) => validStatuses.includes(x.status));

        items = items.map((item) => ({
          ...item,
          statusLabel: statusLabels[item.status] || item.status,
          statusColor: statusColors[item.status] || "default",
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
    [activeTab, tabs]
  );

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [fetchData, pagination.current, pagination.pageSize, activeTab]);

  const onChangeTable = (pag) => {
    setPagination((prev) => ({
      ...prev,
      current: pag.current,
      pageSize: pag.pageSize,
    }));
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const onViewDetail = (item) => setSelectedItem(item);
  const onCloseDetail = () => setSelectedItem(null);
  const goCreateConsignment = () => navigate("/consignment/new");

  return {
    loading,
    consignments,
    pagination,
    onChangeTable,
    selectedItem,
    onViewDetail,
    onCloseDetail,
    activeTab,
    setActiveTab: handleTabChange,
    counts,
    goCreateConsignment,
    fetchData,
  };
};

export default useManagerConsignment;
