import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { getManagerListings } from "@/services/listing.service";

export default function useManagerListing() {
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setRows([]); // 🧹 reset table trước khi load
    try {
      const { items, total } = await getManagerListings({
        status,
        q: query,
        page: page - 1,
        size: pageSize,
      });

      console.log("✅ Data received:", items);
      setRows(items || []);
      setTotal(total || 0);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      message.error("Không thể tải danh sách bài đăng!");
    } finally {
      setLoading(false);
    }
  }, [status, query, page, pageSize]);

  // Gọi API mỗi khi filter hoặc phân trang thay đổi
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
    refresh: fetchData,
  };
}
