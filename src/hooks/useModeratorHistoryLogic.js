import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@hooks/useAuth";
import { message } from "antd";
import { getModeratorHistory } from "@services/moderator/listing.moderator.service";

export function useModeratorHistoryLogic() {
  // Lấy thông tin user hiện tại
  const { user } = useAuth();

  // Quản lý bộ lọc tìm kiếm
  const [filters, setFilters] = useState({
    q: "",
    actorId: null,
    dateRange: [],
    toStatuses: [],
  });

  // Quản lý phân trang
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Quản lý dữ liệu bảng
  const [tableData, setTableData] = useState({
    items: [],
    total: 0,
    page: 0,
    size: 10,
    hasNext: false,
  });

  const [loading, setLoading] = useState(false);
  const [lastFetchParams, setLastFetchParams] = useState(null);

  const { current: currentPage, pageSize } = pagination;

  // Chuyển đổi dữ liệu từ API sang format chuẩn
  const transformHistoryData = useCallback((apiItem, index) => {
    const historyId = apiItem.historyId ?? apiItem.id;
    const createdAt =
      apiItem.createdAt || apiItem.timestamp || new Date().toISOString();
    return {
      id: historyId != null ? String(historyId) : `temp-${index}`,
      uniqueKey: `${apiItem.listingId}-${apiItem.toStatus}-${createdAt}-${
        apiItem.actorId || "null"
      }-${historyId ?? index}`,
      listingId: apiItem.listingId,
      title: apiItem.listingTitle || "",
      action: apiItem.action || "",
      toStatus: apiItem.toStatus || "",
      actorId: apiItem.actorId,
      actorName: apiItem.actorFullName || apiItem.actorName || "",
      reason: apiItem.note || "",
      timestamp: createdAt,
      createdAt,
    };
  }, []);

  // Lấy dữ liệu lịch sử duyệt
  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage - 1,
        size: pageSize,
        q: filters.q || undefined,
        actorId: (filters.actorId ?? user?.uid) || undefined,
        fromTs:
          filters.dateRange && filters.dateRange[0]
            ? filters.dateRange[0].toISOString()
            : undefined,
        toTs:
          filters.dateRange && filters.dateRange[1]
            ? filters.dateRange[1].toISOString()
            : undefined,
        toStatuses:
          filters.toStatuses && filters.toStatuses.length > 0
            ? filters.toStatuses
            : undefined,
      };

      const response = await getModeratorHistory(params);

      if (response?.data) {
        const { items, page: currentPage, size, hasNext } = response.data;

        // Lọc chỉ hiển thị quyết định của moderator
        const transformedItems = items
          .map((item, index) => transformHistoryData(item, index))
          .filter(
            (it) =>
              (it.toStatus === "APPROVED" || it.toStatus === "REJECTED") &&
              !!it.actorId
          );

        const finalItems = transformedItems.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Cập nhật dữ liệu bảng
        const totalCount =
          (response.data && response.data.totalElements) || finalItems.length;
        const finalData = {
          items: finalItems,
          total: totalCount,
          page: currentPage,
          size,
          hasNext,
        };

        setTableData(finalData);

        setPagination((prev) => ({
          ...prev,
          total: totalCount,
        }));
      } else {
        setTableData({
          items: [],
          total: 0,
          page: 0,
          size: 10,
          hasNext: false,
        });
        setPagination((prev) => ({
          ...prev,
          total: 0,
        }));
      }
    } catch {
      message.error("Không thể tải lịch sử duyệt tin đăng");
      setTableData({
        items: [],
        total: 0,
        page: 0,
        size: 10,
        hasNext: false,
      });
      setPagination((prev) => ({
        ...prev,
        total: 0,
      }));
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, pageSize, transformHistoryData, user]);

  // Cập nhật bộ lọc
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  }, []);

  // Thay đổi phân trang
  const handleTableChange = useCallback((newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  // Đặt lại bộ lọc
  const handleResetFilters = useCallback(() => {
    setFilters({
      q: "",
      actorId: null,
      dateRange: [],
      toStatuses: [],
    });
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  }, []);

  // Tìm kiếm
  const handleSearch = useCallback(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Tự động tải dữ liệu khi thay đổi
  useEffect(() => {
    const currentParams = JSON.stringify({ filters, currentPage, pageSize });
    if (lastFetchParams === currentParams) return;
    setLastFetchParams(currentParams);
    fetchHistory();
  }, [filters, currentPage, pageSize, fetchHistory, lastFetchParams]);

  return {
    filters,
    pagination,
    tableData,
    loading,
    handleFilterChange,
    handleTableChange,
    handleResetFilters,
    handleSearch,
    setFilters,
    setPagination,
  };
}
