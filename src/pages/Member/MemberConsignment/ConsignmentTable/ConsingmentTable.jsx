import React from "react";
import { Table, Button, Tag, Space } from "antd";
import { useNavigate } from "react-router-dom";

const ConsignmentTable = ({
  items,
  loading,
  pagination,
  onChange,
  onView,
  setCancelId,
  onViewSchedule,
  onOpenSchedule,
  onViewAgreement,
}) => {
  const navigate = useNavigate();

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
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "right",
      render: (_, record) => {
        const cancelButton = (
          <Button
            type="primary"
            danger
            disabled={record.status === "CANCELLED"}
            onClick={(e) => {
              e.stopPropagation();
              setCancelId(record.id);
            }}
          >
            Hủy
          </Button>
        );

        switch (record.status) {
          case "SCHEDULING":
          case "RESCHEDULED":
            return (
              <Space>
                {cancelButton}
                <Button
                  type="default"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSchedule(record.id);
                  }}
                >
                  Lên lịch
                </Button>
              </Space>
            );

          case "SCHEDULED":
            return (
              <Space>
                {cancelButton}
                <Button
                  type="default"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewSchedule(record.id);
                  }}
                >
                  Xem lịch hẹn
                </Button>
              </Space>
            );

          case "REQUEST_REJECTED":
            return (
              <Space>
                <div>
                  <strong>Lý do:</strong>{" "}
                  {record?.rejectedReason
                    ? record.rejectedReason.length > 15
                      ? record.rejectedReason.slice(0, 15) + "..."
                      : record.rejectedReason
                    : "Không có"}
                </div>
                {cancelButton}
                <Button
                  type="default"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/consignment/edit/${record.id}`);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Space>
            );

          case "SIGNED":
            return (
              <Space>
                {cancelButton}
                <Button
                  type="default"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewAgreement(record.id);
                  }}
                >
                  Hợp đồng
                </Button>
              </Space>
            );

          default:
            return cancelButton;
        }
      },
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

export default ConsignmentTable;
