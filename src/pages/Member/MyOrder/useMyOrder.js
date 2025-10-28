import { useMemo, useState } from "react";
import { App } from "antd";
import { buildQueryParams } from "./params";
import { DEFAULT_PAGE_SIZE } from "./constants";
import { useOrderFilters } from "./SearchActions";
import { useOrderSorting, usePagination, useOrders } from "./OrderTable";
import { createVNPayPayment } from "@services/payment.service";
import { cancelOrder, getOrderDetail } from "@services/order.service";
import cookieUtils from "@utils/cookieUtils";

export default function useMyOrder() {
    const { message: messageApi, modal } = App.useApp();
    
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
    const [detailModal, setDetailModal] = useState({ open: false, orderId: null });
    const closeDetailModal = () => setDetailModal({ open: false, orderId: null });

    // Payment Modal
    const [paymentModal, setPaymentModal] = useState({ open: false, order: null });
    const openPaymentModal = (order) => setPaymentModal({ open: true, order });
    const closePaymentModal = () => setPaymentModal({ open: false, order: null });

    const submitPayment = async ({ amount }) => {
        const hideLoading = messageApi.loading("Đang khởi tạo thanh toán...", 0);
        
        try {
            const { ok, url } = await createVNPayPayment(paymentModal.order.id, { amountVnd: amount });
            
            if (ok && url) {
                hideLoading();
                messageApi.success("Đang chuyển đến VNPay...");
                closePaymentModal();
                setTimeout(() => {
                    window.location.href = url;
                }, 500);
            } else {
                hideLoading();
                messageApi.error("Không nhận được URL thanh toán từ server. Vui lòng thử lại.");
            }
        } catch (e) {
            hideLoading();
            console.error("Payment error:", e);
            
            // Handle different error types
            let errorMsg = "Không thể khởi tạo thanh toán";
            
            if (e?.response?.data?.message) {
                errorMsg = e.response.data.message;
            } else if (e?.response?.data?.error) {
                errorMsg = e.response.data.error;
            } else if (e?.message) {
                errorMsg = e.message;
            }
            
            messageApi.error(errorMsg, 5);
        }
    };

    const onDownloadContract = async (order) => {
        try {
            const { data } = await getOrderDetail(order.id);
            const url = data?.order?.contractUrl;
            if (!url) return messageApi.info("Chưa có hợp đồng");
            const token = cookieUtils.getToken();
            const resp = await fetch(url, { method: "GET", headers: { Authorization: `Bearer ${token}`, Accept: "application/pdf" }, credentials: "include" });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const blob = await resp.blob();
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl);
        } catch (e) {
            messageApi.error(e?.response?.data?.message || e?.message || "Không thể tải hợp đồng");
        }
    };

    const onCancel = async (order) => {
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
        onViewDetail(record) { setDetailModal({ open: true, orderId: record?.id }); },
        paymentModal, openPaymentModal, closePaymentModal, submitPayment,
        onDownloadContract,
        onCancel,
        detailModal,
        closeDetailModal,
    };
}

