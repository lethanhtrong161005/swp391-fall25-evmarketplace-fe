import React, { useMemo } from "react";
import { Avatar, Table, Tag, Typography } from "antd";
import s from "./styles.module.scss";

const { Text } = Typography;

export default function ListingTable({ rows = [], loading, page, pageSize, total, onChange }) {
    const statusColor = (st) => ({
        PENDING: "gold",
        ACTIVE: "green",
        SOLD: "geekblue",
        HIDDEN: "default",
        EXPIRED: "volcano",
        REJECTED: "red",
    }[st] || "default");

    const columns = useMemo(() => [
        {
            title: "",
            dataIndex: "thumbnailUrl",
            width: 64,
            render: (url) => <Avatar shape="square" size={48} src={url} />, 
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            sorter: true,
            ellipsis: true,
            render: (t, r) => (
                <div className={s.titleCell}>
                    <div className={s.titleLine}>{t || "(Không tiêu đề)"}</div>
                    <div className={s.metaLine}>
                        <Text type="secondary">{r.brand} {r.model} • {r.year || "-"}</Text>
                    </div>
                </div>
            ),
            responsive: ["xs", "sm", "md", "lg", "xl"],
        },
        {
            title: "Giá",
            dataIndex: "price",
            sorter: true,
            render: (v) => v != null ? v.toLocaleString("vi-VN") + " ₫" : "-",
            align: "right",
        },
        {
            title: "SOH / Km / Pin",
            key: "specs",
            render: (_, r) => (
                <span>
                    {r.sohPercent != null && <Tag color="blue">SOH {r.sohPercent}%</Tag>}
                    {r.mileageKm != null && <Tag color="geekblue">{r.mileageKm.toLocaleString()} km</Tag>}
                    {r.batteryCapacityKwh != null && <Tag color="purple">{r.batteryCapacityKwh} kWh</Tag>}
                </span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            sorter: true,
            render: (s) => <Tag color={statusColor(s)}>{s}</Tag>,
            width: 120,
        },
        {
            title: "Tỉnh/TP",
            render: (_, r) => r.province || "-",
            width: 140,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            sorter: true,
            width: 180,
        },
    ], []);

    return (
        <Table
            rowKey={(r) => r.id}
            columns={columns}
            dataSource={rows}
            loading={loading}
            size="middle"
            sticky
            scroll={{ x: 960 }}
            pagination={{
                current: page,
                pageSize,
                total,
                showSizeChanger: true,
                showTotal: (t, range) => `${range[0]}-${range[1]} / ${t.toLocaleString("vi-VN")}`,
            }}
            onChange={onChange}
        />
    );
}