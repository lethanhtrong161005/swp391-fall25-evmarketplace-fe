import React from "react";
import { Table, Button, Tag, Space } from "antd";

const StaffConsManageTable = ({
  items,
  loading,
  pagination,
  onChange,
  onView,
  // setCancelId,
}) => {
  const columns = [
    {
      title: "Số điện thoại",
      dataIndex: "accountPhone",
      key: "accountPhone",
      align: "left",
    },
    {
      title: "Khách hàng",
      dataIndex: "accountName",
      key: "accountName",
      align: "left",
    },
    {
      title: "Loại",
      dataIndex: "itemType",
      key: "itemType",
    },
    { title: "Model", dataIndex: "model", key: "model", align: "left" },
    { title: "Năm SX", dataIndex: "year", key: "year", align: "center" },
    {
      title: "Trạng thái",
      dataIndex: "statusLabel",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Tag color={record.statusColor}>{record.statusLabel}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "right",
      render: (v) => new Date(v).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
  ];

  return (
    <Table
      className="customTable"
      rowKey="id"
      onRow={(record) => ({
        onClick: () => onView(record),
        style: { cursor: "pointer" },
      })}
      columns={columns}
      dataSource={items}
      loading={loading}
      pagination={pagination}
      onChange={onChange}
    />
  );
};

export default StaffConsManageTable;
