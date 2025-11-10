import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { getManagerListings, managerUpdateListingStatus } from "@/services/listing.service";

export default function useManagerListing() {
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setRows([]);
    try {
      const { items, total } = await getManagerListings({
        status,
        q: query,
        page: page - 1,
        size: pageSize,
      });
      setRows(items || []);
      setTotal(total || 0);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      message.error("Không thể tải danh sách bài đăng!");
    } finally {
      setLoading(false);
    }
  }, [status, query, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTableChange = useCallback((pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  }, []);

  const handleSearch = useCallback((text) => {
    setQuery(text?.trim?.() || "");
    setPage(1);
  }, []);

  const handleStatusFilter = useCallback((value) => {
    setStatus(value || "");
    setPage(1);
  }, []);

  /** 🧩 Mở modal xác nhận */
  const openStatusModal = useCallback((record, newStatus) => {
    if (!record || !record.id || !newStatus || newStatus === record.status) return;
    setSelectedListing(record);
    setSelectedStatus(newStatus);
    setModalOpen(true);
  }, []);

  /** ✅ Xác nhận đổi trạng thái */
  const confirmStatusChange = useCallback(async (record, newStatus) => {
    setConfirmLoading(true);
    try {
      const res = await managerUpdateListingStatus({ id: record.id, status: newStatus });
      message.success(`Cập nhật trạng thái thành công (${newStatus})`);
      setModalOpen(false);
      fetchData();
      return res;
    } catch (err) {
      console.error("❌ Update status error:", err);
      message.error(err?.message || "Không thể cập nhật trạng thái!");
    } finally {
      setConfirmLoading(false);
    }
  }, [fetchData]);

  return {
    rows,
    total,
    page,
    pageSize,
    loading,
    status,
    query,
    handleTableChange,
    handleSearch,
    handleStatusFilter,
    // modal
    modalOpen,
    selectedListing,
    selectedStatus,
    confirmLoading,
    openStatusModal,
    confirmStatusChange,
    closeModal: () => setModalOpen(false),
    refresh: fetchData,
  };
}
