import React, { useState } from "react";
import { Table, Tag, Typography, Tooltip, Space, Button } from "antd";
import dayjs from "dayjs";
import {
  CONSIGNMENT_STATUS_COLOR,
  CONSIGNMENT_STATUS_LABELS,
} from "../../../../utils/constants";
import ConsignmentDetailModal from "../../../Member/MemberConsignment/ConsigmentDetailModal/ConsignmentDetailModal";

const { Paragraph } = Typography;

const StaffAgreementTable = ({
  items,
  loading,
  pagination,
  onChange,
  onAddAgreement,
  onEditDraft,
  onViewAgreement,
  onCreateOrder,
  onRenew,
}) => {
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleRowClick = (record) => {
    setSelectedConsignment(record);
    setIsDetailOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailOpen(false);
    setSelectedConsignment(null);
  };

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "requestOwnerFullName",
      key: "requestOwnerFullName",
      align: "left",
      width: 180,
      render: (v) => v || "-",
    },
    {
      title: "Số điện thoại",
      dataIndex: "requestOwnerPhone",
      key: "requestOwnerPhone",
      align: "center",
      width: 140,
      render: (v) => v || "-",
    },
    {
      title: "Trạng thái ký gửi",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 180,
      render: (status) => {
        const color = CONSIGNMENT_STATUS_COLOR[status] || "default";
        const label = CONSIGNMENT_STATUS_LABELS[status] || status || "-";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Giá đề xuất",
      dataIndex: "suggestedPrice",
      key: "suggestedPrice",
      align: "right",
      width: 160,
      render: (v) => (v ? `${v.toLocaleString("vi-VN")} ₫` : "-"),
    },
    {
      title: "Tóm tắt kiểm định",
      dataIndex: "inspectionSummary",
      key: "inspectionSummary",
      align: "left",
      width: 300,
      render: (text) => {
        if (!text) return "-";
        return (
          <Tooltip title={text}>
            <Paragraph
              style={{
                margin: 0,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {text}
            </Paragraph>
          </Tooltip>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: 160,
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      width: 300,
      render: (_, record) => {
        const { status, agreementIsCreatelisting } = record;
        if (status === "INSPECTED_FAIL") return null;
        if (status === "INSPECTED_PASS")
          return (
            <Space size="small">
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
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditDraft?.(record);
                }}
              >
                Bản nháp
              </Button>
            </Space>
          );
        if (status === "SIGNED")
          return (
            <Space size="small">
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
              {agreementIsCreatelisting && (
                <Button
                  size="small"
                  style={{
                    backgroundColor: "#fa8c16",
                    color: "#fff",
                    border: "none",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateOrder?.(record);
                  }}
                >
                  Tạo bài đăng
                </Button>
              )}
            </Space>
          );
        if (status === "EXPIRED")
          return (
            <Space size="small">
              <Button
                type="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRenew?.(record);
                }}
              >
                Gia hạn
              </Button>
            </Space>
          );
        return null;
      },
    },
  ];

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={pagination}
        onChange={onChange}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" },
        })}
        style={{ width: "100%" }}
        bordered={false}
      />
      <ConsignmentDetailModal
        item={selectedConsignment}
        onClose={handleCloseModal}
        open={isDetailOpen}
      />
    </>
  );
};

export default StaffAgreementTable;
