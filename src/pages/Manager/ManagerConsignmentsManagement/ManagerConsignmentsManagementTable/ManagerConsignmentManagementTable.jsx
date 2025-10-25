import React from "react";
import { Table, Button, Tag, Space } from "antd";
import useStaffOfBranch from "../../../../hooks/useStaffOfBranch";

const ManagerConsignmentsManagementTable = ({
  items,
  loading,
  branchId,
  pagination,
  onChange,
  onView,
}) => {
  const { getStaffNameById } = useStaffOfBranch(branchId);
  const columns = [
    {
      title: "Loại",
      dataIndex: "itemType",
      key: "itemType",
    },
    { title: "Model", dataIndex: "model", key: "model", align: "left" },
    { title: "Năm SX", dataIndex: "year", key: "year", align: "center" },
    {
      title: "Chi nhánh ưu tiên",
      dataIndex: "preferredBranchName",
      key: "preferredBranchName",
      align: "left",
    },
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
    {
      title: "Nhân viên phụ trách",
      dataIndex: "staffId",
      key: "staffId",
      align: "right",
      render: (staffId) => getStaffNameById(staffId),
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

export default ManagerConsignmentsManagementTable;
