// src/pages/Staff/StaffOrder/useStaffOrder.js
import { useMemo, useState } from "react";
import { message } from "antd";
import { buildQueryParams } from "./params";
import { DEFAULT_PAGE_SIZE } from "./constants";
import { useOrderFilters } from "./SearchActions";
import { useOrderSorting, usePagination, useOrders } from "./OrderTable";
import { payOrderCash } from "@services/order.service.js";

export default function useStaffOrder() {
    // ... các phần bạn đang có giữ nguyên
    const filters = useOrderFilters();
    const sorting = useOrderSorting("createdAt", "descend");
    const pagination = usePagination(DEFAULT_PAGE_SIZE);

    const [submittedFilters, setSubmittedFilters] = useState({ orderNo: "", status: undefined, dateRange: [] });

    const queryParams = useMemo(() => buildQueryParams({
        page: pagination.page,
        size: pagination.size,
        orderNo: submittedFilters.orderNo,
        status: submittedFilters.status,
        dateRange: submittedFilters.dateRange,
        sortField: sorting.sortField,
        sortOrder: sorting.sortOrder,
    }), [pagination.page, pagination.size, submittedFilters, sorting.sortField, sorting.sortOrder]);

    const { loading, rows, total, load } = useOrders(queryParams);

    // ===== Modal Thu tiền mặt =====
    const [cashModal, setCashModal] = useState({ open: false, order: null });
    const openCashModal = (order) => setCashModal({ open: true, order });
    const closeCashModal = () => setCashModal({ open: false, order: null });

    const submitCash = async ({ amount, referenceNo, note }) => {
        try {
            await payOrderCash({
                orderId: cashModal.order.id,
                amount,
                referenceNo: referenceNo?.trim() || undefined,
                note: note?.trim() || undefined,
            });
            message.success("Đã ghi nhận thu tiền mặt");
            closeCashModal();
            load(); // refresh bảng + profile bar
        } catch (e) {
            const msg = e?.response?.data?.message || e?.message || "Thu tiền mặt thất bại";
            message.error(msg);
        }
    };

    // ... các handler search/table giữ nguyên

    return {
        loading, rows, total,
        page: pagination.page, size: pagination.size,
        orderNo: filters.orderNo, status: filters.status, dateRange: filters.dateRange,
        sortField: sorting.sortField, sortOrder: sorting.sortOrder,
        onSearchSubmit() { setSubmittedFilters({ orderNo: filters.orderNo?.trim() || "", status: filters.status || undefined, dateRange: filters.dateRange || [] }); pagination.setPage(1); },
        onResetFilters() { filters.resetFilters(); sorting.resetSorting(); pagination.resetPagination(); setSubmittedFilters({ orderNo: "", status: undefined, dateRange: [] }); },
        onTableChange(p, _f, sorter) { pagination.applyPagination(p); sorting.applySorter(sorter); },
        onChangeOrderNo: filters.setOrderNo,
        onChangeStatus: (v) => filters.setStatus(v || undefined),
        onChangeDateRange: (r) => filters.setDateRange(r || []),
        onRefresh: load,
        onViewDetail(record) { message.info(`Xem chi tiết đơn #${record?.orderNo}`); },

        // cash
        cashModal, openCashModal, closeCashModal, submitCash,
    };
}
