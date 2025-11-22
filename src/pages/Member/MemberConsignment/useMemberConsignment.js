import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  cancelConsignment,
  getAllConsignments,
  updateConsignmentRequest,
  getMemberInspectionSchedule,
  getConsignmentById,
  markCancelInspectionSchedule,
} from "../../../services/consigmentService";
import { getAgreementByRequestId } from "../../../services/agreementService";
import {
  CONSIGNMENT_STATUS_LABELS,
  CONSIGNMENT_STATUS_COLOR,
  ITEM_TYPE,
  CATEGORIES,
  ERROR_MESSAGES,
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
  const [agreementDetail, setAgreementDetail] = useState(null);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);

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
          scheduleId: item.schedule?.id,
          category: CATEGORIES[item.category] || item.category,
          itemType: ITEM_TYPE[item.itemType] || item.itemType,
          statusLabel: CONSIGNMENT_STATUS_LABELS[item.status] || item.status,
          statusColor: CONSIGNMENT_STATUS_COLOR[item.status] || "default",
        }));
        setConsignments([...items]);
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
      if (res?.data?.success) {
        message.success("Hủy ký gửi thành công!");
        await fetchData(pagination.current, pagination.pageSize);
        setActiveTab("CANCELLED");
        navigate("/consignment");
      } else {
        const rawMsg = res?.data?.message || "Lỗi khi hủy ký gửi";
        const viMsg = ERROR_MESSAGES[rawMsg] || "Đã xảy ra lỗi khi hủy ký gửi";
        message.error(viMsg);
      }
    } catch (err) {
      console.error("Cancel error:", err);
      const rawMsg = err?.response?.data?.message || "Có lỗi khi hủy ký gửi!";
      const viMsg = ERROR_MESSAGES[rawMsg] || "Đã xảy ra lỗi khi hủy ký gửi!";
      message.error(viMsg);
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

  const handleOpenSchedule = async (requestId) => {
    try {
      setLoadingSchedule(true);
      const res = await getConsignmentById(requestId);
      if (res?.success && res?.data) {
        navigate("/consignment/availability", {
          state: { requestId: res.data.id },
        });
      } else {
        message.error(res?.message || "Không thể tải thông tin ký gửi");
      }
    } catch (err) {
      console.error("Get consignment by ID error:", err);
      message.error("Lỗi khi tải thông tin ký gửi!");
    } finally {
      setLoadingSchedule(false);
    }
  };

  const handleCancelSchedule = async (scheduleId, reason) => {
    if (!scheduleId) return;
    try {
      const res = await markCancelInspectionSchedule(scheduleId, reason);
      if (res?.success) {
        message.success("Hủy lịch kiểm định thành công!");
        await fetchData(pagination.current, pagination.pageSize);
        setActiveTab("SCHEDULED");
      } else {
        message.error(res?.message || "Không thể hủy lịch kiểm định.");
      }
    } catch (err) {
      console.error("Cancel inspection schedule error:", err);
      message.error("Có lỗi khi hủy lịch kiểm định!");
    }
  };

  const handleOpenAgreementDetail = async (requestId) => {
    if (!requestId) return;
    try {
      setLoading(true);
      const res = await getAgreementByRequestId(requestId);
      if (res?.success && res?.data) {
        const wrapper = res.data;
        const item = wrapper?.item ?? wrapper;
        setAgreementDetail(item);
        setIsAgreementModalOpen(true);
      } else {
        message.warning("Không tìm thấy hợp đồng ký gửi.");
      }
    } catch (err) {
      console.error("Error loading agreement:", err);
      message.error("Lỗi khi tải hợp đồng ký gửi.");
    } finally {
      setLoading(false);
    }
  };

  const closeAgreementModal = () => {
    setIsAgreementModalOpen(false);
    setAgreementDetail(null);
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
  const goCreateConsignment = () => navigate("/consignment/newcons");

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
    handleOpenSchedule,
    handleCancelSchedule,
    agreementDetail,
    isAgreementModalOpen,
    handleOpenAgreementDetail,
    closeAgreementModal,
  };
};

export default useManagerConsignment;
