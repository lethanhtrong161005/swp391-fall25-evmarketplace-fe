import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { getAllContracts } from '@services/contract.service';
import dayjs from 'dayjs';

const toLocalIso = (d) => (d ? dayjs(d).format('YYYY-MM-DDTHH:mm:ss') : undefined);

export default function useStaffContract() {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('descend');

    const [orderNo, setOrderNo] = useState('');
    const [createdRange, setCreatedRange] = useState([]);
    const [effectiveRange, setEffectiveRange] = useState([]);

    // chống double fetch khi đã gọi thủ công
    const skipNextEffectRef = useRef(false);

    const filters = useMemo(() => ({
        orderNo: orderNo?.trim() || undefined,
        createdFrom: createdRange?.[0] ? toLocalIso(createdRange[0]) : undefined,
        createdTo: createdRange?.[1] ? toLocalIso(createdRange[1]) : undefined,
        effectiveFrom: effectiveRange?.[0] ? toLocalIso(effectiveRange[0]) : undefined,
        effectiveTo: effectiveRange?.[1] ? toLocalIso(effectiveRange[1]) : undefined,
    }), [orderNo, createdRange, effectiveRange]);

    // Hàm fetch có thể nhận overrides để gọi BE tức thì với tham số mong muốn
    const fetchContracts = useCallback(async (overrides = {}) => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                sort: sortField,
                dir: sortOrder === 'descend' ? 'desc' : 'asc',
                page: (overrides.page ?? (page - 1)),
                size: overrides.size ?? size,
                ...(overrides.extra ?? {}), // chèn thêm fields nếu cần
            };
            const res = await getAllContracts(params);
            setRows(res?.data?.items ?? []);
            setTotal(res?.data?.totalElements ?? 0);
        } catch (e) {
            setRows([]); setTotal(0);
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [filters, sortField, sortOrder, page, size]);

    // Auto-fetch khi deps đổi (lần đầu và các thay đổi tự động)
    useEffect(() => {
        if (skipNextEffectRef.current) { // vừa bấm "Tìm kiếm" thủ công
            skipNextEffectRef.current = false;
            return;
        }
        fetchContracts();
    }, [fetchContracts]);

    // Bấm "Tìm kiếm": gọi BE NGAY với page = 0 (UI hiển thị 1)
    const onSearchSubmit = () => {
        skipNextEffectRef.current = true;
        fetchContracts({ page: 0 }); // gọi ngay BE
        setPage(1);                  // sync UI
    };

    const onResetFilters = () => {
        setOrderNo(''); setCreatedRange([]); setEffectiveRange([]);
        setPage(1); setSortField('createdAt'); setSortOrder('descend');
        // có thể fetch luôn nếu muốn:
        skipNextEffectRef.current = true;
        fetchContracts({ page: 0, extra: { orderNo: undefined, createdFrom: undefined, createdTo: undefined, effectiveFrom: undefined, effectiveTo: undefined } });
    };

    const onRefresh = () => {
        skipNextEffectRef.current = true;
        fetchContracts(); // gọi lại với tham số hiện tại
    };

    const onTableChange = (pagination, _filters, sorter) => {
        setPage(pagination.current || 1);
        setSize(pagination.pageSize || 10);
        if (sorter && sorter.field) setSortField(sorter.field);
        if (sorter && sorter.order) {
            setSortOrder(sorter.order);
        } else {
            setSortField('createdAt');
            setSortOrder('descend');
        }
    };

    return {
        loading, rows, total, page, size,
        sortField, sortOrder,
        orderNo, setOrderNo,
        createdRange, setCreatedRange,
        effectiveRange, setEffectiveRange,
        onSearchSubmit, onResetFilters, onTableChange, onRefresh,
        fetchContracts,
    };
}
