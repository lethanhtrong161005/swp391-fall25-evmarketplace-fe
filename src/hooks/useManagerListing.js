// @hooks/useManagerListing.jsx
import { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { listingDrafts } from "@/utils/listingDrafts";
import { mapDraftToRow } from "@/utils/mapDraftToRow";
import { fetchMyListings, fetchMyListingCounts } from "@services/listing.service";

const TAB_DEFS = [
    { key: "ACTIVE", label: "ĐANG HIỂN THỊ" },
    { key: "PENDING", label: "CHỜ DUYỆT" },
    { key: "APPROVED", label: "ĐÃ DUYỆT" },
    { key: "REJECTED", label: "BỊ TỪ CHỐI" },
    { key: "EXPIRED", label: "HẾT HẠN" },
    { key: "SOLD", label: "ĐÃ BÁN" },
    { key: "RESERVED", label: "ĐANG GIỮ CHỖ" },
    { key: "HIDDEN", label: "ĐÃ ẨN" },
    { key: "DRAFT", label: "TIN NHÁP" }, // local only
];

const useManagerListing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.id ?? user?.accountId ?? user?.sub ?? null;

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("PENDING");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [serverPage, setServerPage] = useState({ items: [], total: 0, totalPages: 0, page: 0 });
    const [draftsVersion, setDraftsVersion] = useState(0);
    const [serverCounts, setServerCounts] = useState({}); // ← counts từ BE

    // Local drafts
    const localDraftRows = useMemo(() => {
        const list = listingDrafts.list(userId);
        return list.map(mapDraftToRow);
    }, [userId, draftsVersion]);

    // Map item server -> row
    const mapServerItemToRow = useCallback((item) => ({
        id: item.id,
        title: item.title || "(Không tiêu đề)",
        category: [item.brand, item.model, item.year].filter(Boolean).join(" ") || "—",
        location: item.province || "—",
        price: Number(item.price || 0),
        updatedAt: new Date(item.createdAt || Date.now()).toLocaleString("vi-VN"),
        status: String(item.status || "").toUpperCase(),
        _localDraft: false,
    }), []);

    // Fetch page theo tab (remote)
    useEffect(() => {
        let cancelled = false;
        if (activeTab === "DRAFT") return; // local only

        (async () => {
            try {
                setLoading(true);
                const res = await fetchMyListings({
                    page, size: pageSize, status: activeTab, q: query || undefined,
                });
                if (!cancelled) setServerPage(res);
            } catch (e) {
                if (!cancelled) console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [activeTab, page, pageSize, query]);

    // Fetch counts thật từ BE (không tính DRAFT local)
    const loadCounts = useCallback(async () => {
        try {
            const map = await fetchMyListingCounts();
            setServerCounts(map || {});
        } catch (e) {
            console.warn("Fetch counts failed:", e?.message);
            setServerCounts({});
        }
    }, []);
    useEffect(() => { loadCounts(); }, [loadCounts]);

    const itemsForActiveTab = useMemo(() => {
        if (activeTab === "DRAFT") return localDraftRows;
        return serverPage.items.map(mapServerItemToRow);
    }, [activeTab, localDraftRows, serverPage.items, mapServerItemToRow]);

    // Counts hiển thị: BE + DRAFT local (và luôn “đủ key”)
    const counts = useMemo(() => {
        const base = Object.fromEntries(TAB_DEFS.map(t => [t.key, 0]));
        // từ BE
        for (const k of Object.keys(serverCounts || {})) {
            base[k] = serverCounts[k] ?? 0;
        }
        // DRAFT local
        base.DRAFT = localDraftRows.length;
        return base;
    }, [serverCounts, localDraftRows.length]);

    // Pagination cho Table
    const pagination = useMemo(() => {
        if (activeTab === "DRAFT") {
            const total = localDraftRows.length;
            return { total, current: 1, pageSize: total || 10, disabled: true, showSizeChanger: false };
        }
        return {
            total: serverPage.total,
            current: (serverPage.page ?? 0) + 1,
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
        };
    }, [activeTab, localDraftRows.length, serverPage.total, serverPage.page, pageSize]);

    const onChangeTable = useCallback((p) => {
        if (activeTab === "DRAFT") return;
        setPage((p.current || 1) - 1);
        setPageSize(p.pageSize || 10);
    }, [activeTab]);

    const goCreateListing = () => navigate("/listing/new");


    const refreshDrafts = useCallback(() => setDraftsVersion(x => x + 1), []);
    const onView = useCallback((row) => {
        if (row._localDraft) navigate(`/listing/new?draftId=${row._draftId}`);
        else navigate(`/listing/${row.id}`);
    }, [navigate]);
    const onEdit = useCallback((row) => {
        if (row._localDraft) navigate(`/listing/new?draftId=${row._draftId}`);
        else navigate(`/listing/${row.id}/edit`);
    }, [navigate]);
    const onDelete = useCallback((row) => {
        if (row._localDraft) {
            listingDrafts.remove(row._draftId, userId);
            refreshDrafts();
        } else {
            // TODO: call delete API → sau đó:
            // reload page & counts
            // await loadCounts();
        }
    }, [refreshDrafts, userId]);

    return {
        loading,
        tabs: TAB_DEFS,
        counts,
        activeTab, setActiveTab,
        query, setQuery,
        itemsForActiveTab,
        goCreateListing,
        onView, onEdit, onDelete,
        pagination,
        onChangeTable,
        reloadCounts: loadCounts, 
    };
};

export default useManagerListing;
