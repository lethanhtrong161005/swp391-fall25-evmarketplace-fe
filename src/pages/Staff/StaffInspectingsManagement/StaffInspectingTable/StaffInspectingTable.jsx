import React from "react";
import { Table, Button, Tag, Space } from "antd";

const StaffInspectingTable = ({
  items,
  loading,
  pagination,
  onChange,
  onView,
  onResult,
  onCancel,
}) => {
  const columns = [
    {
      title: "Loại",
      dataIndex: "itemType",
      key: "itemType",
      align: "center",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      align: "left",
    },
    {
      title: "Năm SX",
      dataIndex: "year",
      key: "year",
      align: "center",
    },
    {
      title: "Chi nhánh ưu tiên",
      dataIndex: "preferredBranchName",
      key: "preferredBranchName",
      align: "left",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusLabel",
      key: "statusLabel",
      align: "center",
      render: (_, record) => (
        <Tag color={record.statusColor}>{record.statusLabel}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (v) => new Date(v).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {(record.status === "INSPECTING" || record.status === "INSPECTED_FAIL") && (
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                onResult?.(record);
              }}
            >
              {record.status === "INSPECTING" ? "Kết quả" : "Chỉnh sửa"}
            </Button>
          )}

          {record.status === "INSPECTED_PASS" && (
            <Button
              danger
              onClick={(e) => {
                e.stopPropagation();
                onCancel?.(record);
              }}
            >
              Hủy
            </Button>
          )}

          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(record);
            }}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      className="customTable"
      rowKey="id"
      columns={columns}
      dataSource={items}
      loading={loading}
      pagination={pagination}
      onChange={onChange}
      onRow={(record) => ({
        onClick: () => onView?.(record),
        style: { cursor: "pointer" },
      })}
    />
  );
};

export default StaffInspectingTable;
