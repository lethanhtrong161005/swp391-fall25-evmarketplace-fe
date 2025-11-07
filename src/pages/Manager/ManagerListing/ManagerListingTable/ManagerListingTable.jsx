import React from "react";
import { Table, Tag, Typography, Select } from "antd";
import { CATEGORIES } from "../../../../utils/constants";
import "./ManagerListingTable.scss";

const { Text } = Typography;

const STATUS_OPTIONS = [
  "PENDING",
  "APPROVED",
  "ACTIVE",
  "RESERVED",
  "SOLD",
  "EXPIRED",
  "REJECTED",
  "HIDDEN",
  "SOFT_DELETED",
];

const colorMap = {
  PENDING: "gold",
  APPROVED: "blue",
  ACTIVE: "green",
  RESERVED: "geekblue",
  SOLD: "purple",
  EXPIRED: "volcano",
  REJECTED: "red",
  HIDDEN: "gray",
  SOFT_DELETED: "magenta",
};

const labelMap = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  ACTIVE: "Đang hiển thị",
  RESERVED: "Đã đặt cọc",
  SOLD: "Đã bán",
  EXPIRED: "Hết hạn",
  REJECTED: "Từ chối",
  HIDDEN: "Ẩn",
  SOFT_DELETED: "Đã xóa tạm",
};

export default function ManagerListingTable({
  rows = [],
  loading,
  page,
  pageSize,
  total,
  onChange,
  onStatusChange,
}) {
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      ellipsis: true,
      render: (t, r) => (
        <>
          <div style={{ fontWeight: 500 }}>{t}</div>
          <Text type="secondary">
            {r.brand} {r.model} • {r.year}
          </Text>
        </>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryCode",
      width: 140,
      render: (v) => CATEGORIES[v] || v || "-",
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "right",
      render: (v) => (v != null ? v.toLocaleString("vi-VN") + " ₫" : "-"),
    },
    {
      title: "Người bán",
      dataIndex: "sellerName",
      width: 180,
      render: (v, r) => (
        <>
          <div>{v || "-"}</div>
          <Text type="secondary">{r.sellerPhone || "-"}</Text>
        </>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      ellipsis: true,
      render: (_, r) =>
        [r.ward, r.district, r.province].filter(Boolean).join(", ") || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 180,
      render: (s, record) => {
        const disabledStatuses = ["PENDING", "APPROVED", "REJECTED"];
        const isDisabled = disabledStatuses.includes(s);

        return (
          <Select
            size="small"
            value={s}
            disabled={isDisabled}
            className="status-select" // 👈 style riêng
            onChange={(newStatus) => onStatusChange(record, newStatus)}
            dropdownStyle={{ minWidth: 160 }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <Select.Option key={opt} value={opt}>
                <Tag color={colorMap[opt] || "default"}>
                  {labelMap[opt] || opt}
                </Tag>
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 180,
      render: (v) => (v ? new Date(v).toLocaleString("vi-VN") : "-"),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={rows}
      loading={loading}
      size="middle"
      scroll={{ x: 1200 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (t) => `Tổng ${t} bài đăng`,
      }}
      onChange={onChange}
    />
  );
}
