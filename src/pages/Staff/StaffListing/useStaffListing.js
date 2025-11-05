import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchConsignmentListings } from "@services/listing.service";

function useDebounce(value, delay = 400) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
}

export default function useStaffListing() {
    // Filters state (UI)
    const [filters, setFilters] = useState({
        q: "",
        itemType: undefined, // "VEHICLE" | "BATTERY"
        status: undefined,
        visibility: undefined,
        categoryId: undefined,
        brandId: undefined,
        modelId: undefined,
        createdAtFrom: undefined,
        createdAtTo: undefined,
        priceMin: undefined,
        priceMax: undefined,
        yearMin: undefined,
        yearMax: undefined,
        mileageMax: undefined,
        sohMin: undefined,
        batteryCapacityMinKwh: undefined,
        batteryCapacityMaxKwh: undefined,
        voltageMinV: undefined,
        voltageMaxV: undefined,
        massMaxKg: undefined,
        chemistries: [],
    });

    const [page, setPage] = useState(1);      // AntD table uses 1-based
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState({ field: "createdAt", dir: "desc" });

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);

    const debouncedQ = useDebounce(filters.q);

    const submitFilters = useCallback((patch) => {
        setFilters(prev => ({ ...prev, ...patch }));
        setPage(1);
    }, []);

    const onTableChange = useCallback((pagination, _filters, sorter) => {
        const s = Array.isArray(sorter) ? sorter[0] : sorter;
        const field = s?.field || "createdAt";
        const order = s?.order === "ascend" ? "asc" : s?.order === "descend" ? "desc" : undefined;
        setSort(prev => ({ field: order ? field : prev.field, dir: order || prev.dir }));
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { items, total: t } = await fetchConsignmentListings({
                page: page - 1, // API 0-based
                size: pageSize,
                sort: sort.field,
                dir: sort.dir,
                filters: { ...filters, q: debouncedQ },
            });
            setRows(items);
            setTotal(t);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, sort.field, sort.dir, filters, debouncedQ]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        // data
        loading,
        rows,
        total,
        // paging & sort
        page,
        pageSize,
        sort,
        onTableChange,
        // filters
        filters,
        submitFilters,
        setFilters,
        // refresh
        refresh: fetchData,
    };
}
