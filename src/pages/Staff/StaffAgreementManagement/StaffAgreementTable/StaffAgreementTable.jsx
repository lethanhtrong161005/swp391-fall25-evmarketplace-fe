import React from "react";
import { Table, Button, Tag, Space, Typography, Tooltip } from "antd";
import dayjs from "dayjs";

const { Paragraph } = Typography;

// 🎨 Mapping trạng thái consignment sang label & màu
const STATUS_LABELS = {
  SUBMITTED: "Đã gửi",
  SCHEDULING: "Đã duyệt",
  SCHEDULED: "Đã lên lịch",
  INSPECTING: "Đang kiểm định",
  INSPECTED_PASS: "Đạt kiểm định",
  INSPECTED_FAIL: "Không đạt",
  REQUEST_REJECTED: "Từ chối yêu cầu",
  SIGNED: "Đã ký hợp đồng",
  CANCELLED: "Đã hủy",
  FINISHED: "Hoàn thành",
  EXPIRED: "Hết hạn",
};

const STATUS_COLORS = {
  SUBMITTED: "blue",
  SCHEDULING: "gold",
  SCHEDULED: "cyan",
  INSPECTING: "processing",
  INSPECTED_PASS: "green",
  INSPECTED_FAIL: "volcano",
  REQUEST_REJECTED: "red",
  SIGNED: "purple",
  CANCELLED: "gray",
  FINISHED: "green",
  EXPIRED: "default",
};

const StaffAgreementTable = ({
  items,
  loading,
  pagination,
  onChange,
  onRowClick,
  onAddAgreement,
  onEditDraft,
}) => {
  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: ["consignment", "accountName"],
      align: "left",
      width: 180,
      render: (v) => v || "-",
    },
    {
      title: "Số điện thoại",
      dataIndex: ["consignment", "accountPhone"],
      align: "center",
      width: 140,
      render: (v) => v || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: ["consignment", "status"], 
      align: "center",
      width: 150,
      render: (v) => {
        const color = STATUS_COLORS[v] || "default";
        const label = STATUS_LABELS[v] || v || "-";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Giá đề xuất",
      dataIndex: "suggestedPrice",
      align: "right",
      width: 160,
      render: (v) => (v ? `${v.toLocaleString("vi-VN")} ₫` : "-"),
    },
    {
      title: "Tóm tắt",
      dataIndex: "inspectionSummary",
      align: "left",
      width: 250,
      render: (text) => {
        if (!text) return "-";
        const words = text.split(" ");
        const shortText = words.slice(0, 15).join(" ");
        const isLong = words.length > 15;

        return (
          <Tooltip title={isLong ? text : null}>
            <Paragraph
              style={{
                margin: 0,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {shortText}
              {isLong && "..."}
            </Paragraph>
          </Tooltip>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Space>
          {/* Chỉ cho tạo hợp đồng nếu trạng thái là ĐẠT KIỂM ĐỊNH */}
          {record.consignment?.status === "INSPECTED_PASS" && (
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onAddAgreement?.(record);
              }}
            >
              Tạo hợp đồng
            </Button>
          )}
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEditDraft?.();
            }}
          >
            Xem nháp
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
      scroll={{ x: 1200 }}
      onRow={(record) => ({
        onClick: () => onRowClick?.(record),
        style: { cursor: "pointer" },
      })}
    />
  );
};

export default StaffAgreementTable;
