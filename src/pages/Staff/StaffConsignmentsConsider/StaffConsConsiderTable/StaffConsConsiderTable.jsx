import React, { useState } from "react";
import { Table, Button, Tag, Space } from "antd";
import AcceptModal from "../StaffConsiderModal/AcceptModal"; // ✅ Modal component (dùng <Modal>, không dùng Modal.confirm)

const StaffConsConsiderTable = ({
  items = [],
  loading = false,
  pagination,
  onChange,
  onView,
  setRejectId,
  onAccept, 
}) => {
  const [acceptRecord, setAcceptRecord] = useState(null);

  const columns = [
    {
      title: "Loại",
      dataIndex: "itemType",
      key: "itemType",
      align: "left",
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
      width: 100,
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
      render: (v) =>
        new Date(v).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
      width: 180,
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_, record) => {
        const rejectButton = (
          <Button
            type="primary"
            danger
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setRejectId?.(record.id);
            }}
          >
            Từ chối
          </Button>
        );

        if (record.status === "SUBMITTED") {
          return (
            <Space>
              {rejectButton}
              <Button
                type="default"
                size="small"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  setAcceptRecord(record);
                }}
              >
                Chấp nhận
              </Button>
            </Space>
          );
        }

        return rejectButton;
      },
    },
  ];

  return (
    <>
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
        scroll={{ x: true }}
      />

      {acceptRecord && (
        <AcceptModal
          record={acceptRecord}
          handleAccept={onAccept}
          onClose={() => setAcceptRecord(null)}
        />
      )}
    </>
  );
};

export default StaffConsConsiderTable;
