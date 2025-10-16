import React from "react";
import { Table, Button, Tag } from "antd";

const ConsignmentTable = ({ items, loading, pagination, onChange, onView }) => {
  const columns = [
    { title: "Loại", dataIndex: "itemType", key: "itemType" },
    { title: "Model", dataIndex: "model", key: "model" },
    { title: "Năm SX", dataIndex: "year", key: "year", align: "center" },
    {
      title: "Chi nhánh ưu tiên",
      dataIndex: "preferredBranchName",
      key: "preferredBranchName",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusLabel",
      key: "status",
      render: (_, record) => (
        <Tag color={record.statusColor}>{record.statusLabel}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => new Date(v).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => onView(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={items}
      loading={loading}
      pagination={pagination}
      onChange={onChange}
    />
  );
};

export default ConsignmentTable;
