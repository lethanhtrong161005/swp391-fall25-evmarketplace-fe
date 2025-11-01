import { useMemo, useState } from "react";
import { App } from "antd";
import { buildQueryParams } from "./params";
import { DEFAULT_PAGE_SIZE } from "./constants";
import { useOrderFilters } from "./SearchActions";
import { useOrderSorting, usePagination, useOrders } from "./OrderTable";
import { payOrderCash, cancelOrder } from "@services/order.service.js";
import { createOrderContract } from "@services/contract.service";
import { useStaffId } from "./ProfileBar/useProfileBar";


export default function useStaffOrder() {
    const { message: messageApi, modal } = App.useApp();
    const [paymentModal, setPaymentModal] = useState({ open: false, orderId: null });

    const filters = useOrderFilters();
    const sorting = useOrderSorting("createdAt", "descend");
    const pagination = usePagination(DEFAULT_PAGE_SIZE);
    const staffId = useStaffId();

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
    const [detail, setDetail] = useState({ open: false, orderId: null });

    // ===== Modal Thu tiền mặt =====
    const [cashModal, setCashModal] = useState({ open: false, order: null });
    const openCashModal = (order) => setCashModal({ open: true, order });
    const closeCashModal = () => setCashModal({ open: false, order: null });

    const submitCash = async ({ amountVnd, referenceNo, note }) => {
        try {
            await payOrderCash({
                orderId: cashModal.order.id,
                method: "CASH",
                amountVnd,
                referenceNo: referenceNo?.trim() || undefined,
                note: note?.trim() || undefined,
            });
            messageApi.success("Đã ghi nhận thu tiền mặt");
            closeCashModal();
            load();
        } catch (e) {
            const msg = e?.response?.data?.message || e?.message || "Thu tiền mặt thất bại";
            messageApi.error(msg);
        }
    };

    //Tạo hợp đồng 
    const [contractModal, setContractModal] = useState({ open: false, order: null });
    const openCreateContract = (order) => setContractModal({ open: true, order });
    const closeCreateContract = () => setContractModal({ open: false, order: null });

    const submitCreateContract = async ({ file, note, effectiveFrom, effectiveTo }) => {
        try {
            await createOrderContract({
                orderId: contractModal.order.id,
                staffId,
                file,
                note,
                effectiveFrom,
                effectiveTo,
            });
            messageApi.success("Đã tạo hợp đồng (bản giấy) thành công");
            closeCreateContract();
            load();
        } catch (e) {
            messageApi.error(e?.message || "Tạo hợp đồng thất bại");
        }
    };

    const openPaymentHistory = (order) => {
        setPaymentModal({ open: true, orderId: order?.id });
    }

    const closePaymentHistory = () => {
        setPaymentModal({ open: false, orderId: null });
    }

    const handleCancel = async (order) => {
        modal.confirm({
            title: "Xác nhận hủy đơn hàng",
            content: `Bạn có chắc chắn muốn hủy đơn hàng ${order?.orderNo || ""}?`,
            okText: "Xác nhận hủy",
            cancelText: "Đóng",
            okType: "danger",
            onOk: async () => {
                try {
                    await cancelOrder(order.id);
                    messageApi.success("Đã hủy đơn hàng thành công");
                    load();
                } catch (e) {
                    console.error("Cancel order error:", e);
                    const errorMsg = e?.response?.data?.message || e?.message || "Không thể hủy đơn hàng";
                    messageApi.error(errorMsg, 5);
                }
            },
        });
    };

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
        onViewDetail(record) { setDetail({ open: true, orderId: record?.id }); },
        onCancel: handleCancel,

        cashModal, openCashModal, closeCashModal, submitCash,

        contractModal, openCreateContract, closeCreateContract, submitCreateContract,
        detailModal: detail,
        closeDetail() { setDetail({ open: false, orderId: null }); },
        staffId,

        paymentModal, openPaymentHistory, closePaymentHistory,
    };
}
