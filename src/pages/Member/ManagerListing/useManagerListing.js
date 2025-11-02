import { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useAuth } from "@contexts/AuthContext";
import { listingDrafts } from "@utils/listingDrafts";
import {
  fetchMyListings,
  fetchMyListingCounts,
  changeStatusListing,
  restoreListing,
} from "@services/listing.service";
import { toListingTableRow, mapDraftToRow } from "@mappers/toListingTableRow";

const TAB_DEFS = [
  { key: "ACTIVE", label: "ĐANG HIỂN THỊ" },
  { key: "PENDING", label: "CHỜ DUYỆT" },
  { key: "APPROVED", label: "CẦN THANH TOÁN" },
  { key: "REJECTED", label: "BỊ TỪ CHỐI" },
  { key: "EXPIRED", label: "HẾT HẠN" },
  { key: "HIDDEN", label: "ĐÃ ẨN" },
  { key: "SOFT_DELETED", label: "THÙNG RÁC" },
  { key: "DRAFT", label: "TIN NHÁP" },
];

const useManagerListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? user?.accountId ?? user?.sub ?? null;

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const [serverPage, setServerPage] = useState({
    items: [],
    total: 0,
    totalPages: 0,
    page: 0,
  });
  const [serverCounts, setServerCounts] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  // local drafts
  const localDraftRows = useMemo(() => {
    const list = listingDrafts.list(userId);
    return list.map(mapDraftToRow);
  }, [userId]);

  const refetchPage = useCallback(
    async (p = page, s = pageSize) => {
      if (activeTab === "DRAFT") return;
      const res = await fetchMyListings({
        page: p,
        size: s,
        status: activeTab,
        q: query || undefined,
      });
      setServerPage(res);
    },
    [activeTab, page, pageSize, query]
  );

  // counts
  const loadCounts = useCallback(async () => {
    try {
      const map = await fetchMyListingCounts();
      setServerCounts(map || {});
    } catch (e) {
      console.warn("Fetch counts failed:", e?.message);
      setServerCounts({});
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([refetchPage(), loadCounts()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  }, [refetchPage, loadCounts]);

  useEffect(() => {
    let cancelled = false;
    if (activeTab === "DRAFT") return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetchMyListings({
          page,
          size: pageSize,
          status: activeTab,
          q: query || undefined,
        });
        if (!cancelled) setServerPage(res);
      } catch (e) {
        if (!cancelled) console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTab, page, pageSize, query]);
  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const itemsForActiveTab = useMemo(() => {
    if (activeTab === "DRAFT") return localDraftRows;
    return (serverPage.items || []).map(toListingTableRow);
  }, [activeTab, localDraftRows, serverPage.items]);

  const counts = useMemo(() => {
    const base = Object.fromEntries(TAB_DEFS.map((t) => [t.key, 0]));
    for (const k of Object.keys(serverCounts || {}))
      base[k] = serverCounts[k] ?? 0;
    base.DRAFT = localDraftRows.length;
    return base;
  }, [serverCounts, localDraftRows.length]);

  const pagination = useMemo(() => {
    if (activeTab === "DRAFT") {
      const total = localDraftRows.length;
      return {
        total,
        current: 1,
        pageSize: total || 10,
        disabled: true,
        showSizeChanger: false,
      };
    }
    return {
      total: serverPage.total,
      current: (serverPage.page ?? 0) + 1,
      pageSize,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
    };
  }, [
    activeTab,
    localDraftRows.length,
    serverPage.total,
    serverPage.page,
    pageSize,
  ]);

  const onChangeTable = useCallback(
    (p) => {
      if (activeTab === "DRAFT") return;
      setPage((p.current || 1) - 1);
      setPageSize(p.pageSize || 10);
    },
    [activeTab]
  );

  const goCreateListing = () => navigate("/listing/new");

  const onView = useCallback(
    (row) => {
      if (row._localDraft) navigate(`/listing/new?draftId=${row._draftId}`);
      else navigate(`/detail/${row.id}`);
    },
    [navigate]
  );

  const onEdit = useCallback(
    (row) => {
      if (row._localDraft) navigate(`/listing/new?draftId=${row._draftId}`);
      else navigate(`/listing/edit/${row.id}`);
    },
    [navigate]
  );

  // ====== Sau mutate: sync page + counts ======
  const _afterMutate = useCallback(async () => {
    const currCount = Array.isArray(serverPage.items)
      ? serverPage.items.length
      : 1;
    const remaining = currCount - 1;
    const isLastItemOnPage = remaining <= 0 && page > 0;
    const nextPage = isLastItemOnPage ? page - 1 : page;

    await refetchPage(nextPage, pageSize);
    await loadCounts();
    if (isLastItemOnPage) setPage(nextPage);
  }, [serverPage.items, page, pageSize, refetchPage, loadCounts]);

  // Ẩn (ACTIVE → HIDDEN)
  const onHide = useCallback(
    async (row) => {
      const res = await changeStatusListing({ id: row.id, status: "HIDDEN" });
      if (res.status === 200 && res.data?.success) {
        message.success("Đã ẩn bài đăng");
        await _afterMutate();
      } else {
        message.error(res.data?.message || "Ẩn thất bại");
      }
    },
    [_afterMutate]
  );

  // Xoá mềm (PENDING/REJECTED/EXPIRED/HIDDEN → SOFT_DELETED)
  const onSoftDelete = useCallback(
    async (row) => {
      setDeletingId(row.id);
      try {
        const res = await changeStatusListing({
          id: row.id,
          status: "SOFT_DELETED",
        });
        if (res.status === 200 && res.data?.success) {
          message.success("Đã chuyển vào thùng rác");
          await _afterMutate();
        } else {
          message.error(res.data?.message || "Xoá mềm thất bại");
        }
      } finally {
        setDeletingId(null);
      }
    },
    [_afterMutate]
  );

  // Khôi phục (HIDDEN/SOFT_DELETED → ACTIVE/EXPIRED theo prevDeadline)
  const onRestore = useCallback(
    async (row) => {
      const res = await restoreListing(row.id);
      if (res.status === 200 && res.data?.success) {
        message.success(res.data?.message || "Đã khôi phục bài đăng");
        await _afterMutate();
      } else {
        message.error(res.data?.message || "Khôi phục thất bại");
      }
    },
    [_afterMutate]
  );

  return {
    loading,
    tabs: TAB_DEFS,
    counts,
    activeTab,
    setActiveTab,
    query,
    setQuery,
    itemsForActiveTab,
    goCreateListing,
    onView,
    onEdit,
    onDelete: onSoftDelete,
    onRestore,
    onHide,
    pagination,
    onChangeTable,
    reloadCounts: loadCounts,
    refreshData,
    deletingId,
  };
};

export default useManagerListing;
