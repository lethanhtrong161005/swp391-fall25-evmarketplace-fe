import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  cancelConsignment,
  getAllConsignments,
  updateConsignmentRequest,
  getMemberInspectionSchedule,
} from "../../../services/consigmentService";
import {
  CONSIGNMENT_STATUS_LABELS,
  CONSIGNMENT_STATUS_COLOR,
  ITEM_TYPE,
  CATEGORIES,
} from "../../../utils/constants";

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
  const [cancelId, setCancelId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

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
          category: CATEGORIES[item.category] || item.category,
          itemType: ITEM_TYPE[item.itemType] || item.itemType,
          statusLabel: CONSIGNMENT_STATUS_LABELS[item.status] || item.status,
          statusColor: CONSIGNMENT_STATUS_COLOR[item.status] || "default",
        }));

        setConsignments([...items.map((i) => ({ ...i }))]);
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
  }, [activeTab, pagination.current, pagination.pageSize]);

  const handleCancel = async (cancelReason) => {
    if (!cancelId) return;

    try {
      const res = await cancelConsignment(cancelId, cancelReason);
      if (res.success) {
        message.success("Hủy ký gửi thành công!");
        await fetchData(pagination.current, pagination.pageSize);
        setActiveTab("CANCELLED");
        navigate("/consignment/manager");
      } else {
        message.error(res.message || "Lỗi khi hủy ký gửi");
      }
    } catch (err) {
      console.error(err);
      message.error("Có lỗi khi hủy ký gửi!");
    } finally {
      setCancelId(null);
    }
  };

  const handleUpdate = async (requestId, payload, images = [], videos = []) => {
    try {
      setLoading(true);
      const res = await updateConsignmentRequest(
        requestId,
        payload,
        images,
        videos
      );

      if (res.success) {
        message.success("Cập nhật ký gửi thành công!");
        await fetchData(pagination.current, pagination.pageSize);
      } else {
        message.error(res.message || "Lỗi khi cập nhật ký gửi");
      }
    } catch (err) {
      console.error("Update consignment error:", err);
      message.error("Có lỗi khi cập nhật ký gửi!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchedule = async (requestId) => {
    setLoadingSchedule(true);
    try {
      const res = await getMemberInspectionSchedule(requestId);
      if (res.success) {
        const data = res.data?.[0];
        if (!data) {
          message.warning("Không có dữ liệu lịch hẹn");
          return;
        }
        setScheduleData(data);
        setOpenScheduleModal(true);
      } else {
        message.error(res.message || "Không thể tải lịch hẹn");
      }
    } catch (err) {
      console.error("View schedule error:", err);
      message.error("Lỗi khi tải lịch hẹn");
    } finally {
      setLoadingSchedule(false);
    }
  };

  const closeScheduleModal = () => {
    setOpenScheduleModal(false);
    setScheduleData(null);
  };

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
    cancelId,
    setCancelId,
    handleCancel,
    handleUpdate,
    scheduleData,
    openScheduleModal,
    loadingSchedule,
    handleViewSchedule,
    closeScheduleModal,
  };
};

export default useManagerConsignment;
