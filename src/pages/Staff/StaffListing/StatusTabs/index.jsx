import React from "react";
import { Segmented } from "antd";

const OPTIONS = [
    { label: "Tất cả", value: undefined },
    { label: "Chờ duyệt", value: "PENDING" },
    { label: "Hoạt động", value: "ACTIVE" },
    { label: "Đã bán", value: "SOLD" },
    { label: "Ẩn", value: "HIDDEN" },
    { label: "Hết hạn", value: "EXPIRED" },
    { label: "Từ chối", value: "REJECTED" },
];

export default function StatusTabs({ value, onChange }) {
    return (
        <Segmented
            size="middle"
            options={OPTIONS}
            value={value}
            onChange={(val) => onChange && onChange(val)}
        />
    );
}