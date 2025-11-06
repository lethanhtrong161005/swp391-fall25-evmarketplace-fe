import React from "react";
import { Table, Tag, Typography } from "antd";

const { Text } = Typography;

export default function ManagerListingTable({
  rows = [],
  loading,
  page,
  pageSize,
  total,
  onChange,
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
      dataIndex: "categoryName",
      width: 120,
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "right",
      render: (v) => (v != null ? v.toLocaleString("vi-VN") + " ₫" : "-"),
    },
    {
      title: "Người bán",
      dataIndex: "sellerPhone",
      width: 140,
    },
    {
      title: "Tỉnh / Thành phố",
      dataIndex: "province",
      width: 180,
    },
    {
      title: "Quận / Huyện",
      dataIndex: "district",
      width: 180,
    },
    {
      title: "Phường / Xã",
      dataIndex: "ward",
      width: 180,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      render: (s) => {
        const colorMap = {
          PENDING: "gold",
          APPROVED: "blue",
          ACTIVE: "green",
          RESERVED: "geekblue",
          SOLD: "purple",
          EXPIRED: "volcano",
          REJECTED: "red",
          ARCHIVED: "default",
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
          ARCHIVED: "Lưu trữ",
          HIDDEN: "Ẩn",
          SOFT_DELETED: "Đã xóa tạm",
        };
        return <Tag color={colorMap[s] || "default"}>{labelMap[s] || s}</Tag>;
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
      scroll={{ x: 1000 }}
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
