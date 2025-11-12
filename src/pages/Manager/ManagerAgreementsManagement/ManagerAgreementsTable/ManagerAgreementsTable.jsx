import React, { useState } from "react";
import { Table, Tag, Space, Button, Tooltip, Typography } from "antd";
import {
  CONSIGNMENT_STATUS_COLOR,
  CONSIGNMENT_STATUS_LABELS,
  DURATION_LABEL,
} from "../../../../utils/constants";

const { Paragraph } = Typography;

const ManagerAgreementsTable = ({
  items,
  loading,
  pagination,
  onChange,
  onViewAgreement,
  onViewSettlement, // ✅ thêm
  onSetPayout, // ✅ thêm
}) => {
  const columns = [
    {
      title: "Chủ sở hữu",
      dataIndex: "ownerName",
      key: "ownerName",
      align: "left",
      width: 180,
      render: (v) => v || "-",
    },
     {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
      align: "left",
      width: 180,
      render: (v) => v || "-",
    },
    {
      title: "Nhân viên phụ trách",
      dataIndex: "staffName",
      key: "staffName",
      align: "left",
      width: 180,
      render: (v) => v || "-",
    },
    {
      title: "Chi nhánh",
      dataIndex: "branchName",
      key: "branchName",
      align: "center",
      width: 150,
      render: (v) => v || "-",
    },
    {
      title: "Hoa hồng (%)",
      dataIndex: "commissionPercent",
      key: "commissionPercent",
      align: "center",
      width: 140,
      render: (v) => (v != null ? `${v}%` : "-"),
    },
    {
      title: "Giá chấp nhận",
      dataIndex: "acceptablePrice",
      key: "acceptablePrice",
      align: "right",
      width: 160,
      render: (v) => (v ? `${v.toLocaleString("vi-VN")} ₫` : "-"),
    },
    {
      title: "Thời hạn hợp đồng",
      dataIndex: "duration",
      key: "duration",
      align: "center",
      width: 160,
      render: (v) => DURATION_LABEL?.[v] || v || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 150,
      render: (status) => {
        const color = CONSIGNMENT_STATUS_COLOR?.[status] || "default";
        const label = CONSIGNMENT_STATUS_LABELS?.[status] || status || "-";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "left",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onViewAgreement?.(record);
            }}
          >
            Hợp đồng
          </Button>

          {record.status === "FINISHED" && (
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onViewSettlement?.(record);
              }}
            >
              Sao kê
            </Button>
          )}

          {record.status === "SIGNED" && (
            <Button
              size="small"
              danger
              onClick={(e) => {
                e.stopPropagation();
                onSetPayout?.(record);
              }}
            >
              Thanh toán
            </Button>
          )}
        </Space>
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
      style={{ width: "100%" }}
      bordered={false}
    />
  );
};

export default ManagerAgreementsTable;
