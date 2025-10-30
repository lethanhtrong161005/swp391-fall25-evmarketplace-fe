import React from "react";
import { Table, Button, Tag, Space } from "antd";
import { useState } from "react";
import AssignStaffModal from "../AssignStaffModal/AssignStaffModal";
import useAssignConsignmentStaff from "../AssignStaffModal/useAssignStaff";
import useStaffOfBranch from "../../../../hooks/useStaffOfBranch";

const ManagerConsignmentsAssignTable = ({
  items,
  loading,
  branchId,
  pagination,
  onChange,
  onView,
  onReload,
}) => {
  const [assignVisible, setAssignVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { assignStaff, loading: assignLoading } = useAssignConsignmentStaff();
  const { getStaffNameById } = useStaffOfBranch(branchId);
  const openAssignModal = (record) => {
    setSelectedItem(record);
    setAssignVisible(true);
  };
  const handleAssign = async (staffId) => {
    const success = await assignStaff(selectedItem.id, staffId);
    if (success && onReload) onReload();
  };
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
    {
      title: "Thao tác",
      key: "actions",
      align: "right",
      render: (_, record) => {
        switch (record.status) {
          case "SUBMITTED":
            return (
              <>
                <Space>
                  <Button
                    type="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAssignModal(record);
                    }}
                  >
                    Phân công
                  </Button>
                </Space>
              </>
            );
          default:
        }
      },
    },
  ];

  return (
    <>
      <Table
        className="customTable"
        rowKey="id"
        onRow={(record) => ({
          onClick: () => onView(record),
          style: { cursor: "pointer" },
        })}
        columns={columns}
        dataSource={items}
        loading={loading || assignLoading}
        pagination={pagination}
        onChange={onChange}
      />

      <AssignStaffModal
        branchId={branchId}
        visible={assignVisible}
        onClose={() => setAssignVisible(false)}
        onAssign={handleAssign}
      />
    </>
  );
};

export default ManagerConsignmentsAssignTable;
