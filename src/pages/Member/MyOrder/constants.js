// constants.js
export const SORT_FIELD_WHITELIST = new Set([
    "createdAt", "updatedAt", "amount", "paidAmount", "reservedUntil",
]);

export const DEFAULT_PAGE_SIZE = 10;

// Khớp enum BE, label tiếng Việt
export const STATUS_META = {
    PENDING_PAYMENT: { color: "processing", label: "Chờ thanh toán" },
    PAID: { color: "success", label: "Đã thanh toán" },
    CONTRACT_SIGNED: { color: "processing", label: "Đã ký hợp đồng" },
    COMPLETED: { color: "success", label: "Hoàn tất" },
    CANCELED: { color: "error", label: "Đã hủy" },
    PAYMENT_FAILED: { color: "error", label: "Thanh toán thất bại" },
};

// Select options: value = enum BE, label = tiếng Việt
export const STATUS_OPTIONS = Object.keys(STATUS_META).map((k) => ({
    label: STATUS_META[k].label,
    value: k,
}));

