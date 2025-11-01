import React from "react";
import { Table, Tag, Tooltip, Grid, Typography, Button } from "antd";
import dayjs from "dayjs";
import s from "./ContractTable.module.scss";
import { EyeOutlined } from "@ant-design/icons"; 

const { Text } = Typography;

const SIGN_META = {
  CLICK: { color: "green", label: "CLICK" },
  OTP: { color: "gold", label: "OTP" },
  PAPER: { color: "blue", label: "PAPER" },
};

const STATUS_META = {
  DRAFT: { color: "default", label: "DRAFT" },
  SUBMITTED: { color: "processing", label: "SUBMITTED" },
  APPROVED: { color: "success", label: "APPROVED" },
  PUBLISHED: { color: "cyan", label: "PUBLISHED" },
  RESERVED: { color: "gold", label: "RESERVED" },
  UPLOADED: { color: "cyan", label: "UPLOADED" },
  SIGNED: { color: "green", label: "SIGNED" },
  EXPIRED: { color: "volcano", label: "EXPIRED" },
  HIDDEN: { color: "purple", label: "HIDDEN" },
  DELETED: { color: "red", label: "DELETED" },
};

export default function ContractTable({
  rows,
  loading,
  total,
  page,
  size,
  sortField,
  sortOrder,
  onTableChange,
  onViewDetail, // 👈 thêm prop callback xem chi tiết
}) {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.xl;

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderNo",
      key: "orderNo",
      fixed: "left",
      width: 260,
      onCell: () => ({ style: { whiteSpace: "normal", wordBreak: "break-all" } }),
      render: (val, record) => (
        <div className={s.orderNoCell}>
          <Tooltip title={val}>
            <Text className={s.orderNo} code copyable={{ text: val }} ellipsis={{ tooltip: val }}>
              {val}
            </Text>
          </Tooltip>

          <div className={s.orderNoMeta}>
            {record?.orderCode != null && (
              <span className={s.subtle}>code: {String(record.orderCode)}</span>
            )}
            {/* ❌ bỏ nút Xem file hợp đồng ở đây */}
          </div>
        </div>
      ),
    },

    {
      title: "Người bán",
      key: "seller",
      width: 180,
      responsive: ["lg"],
      render: (_, r) => (
        <div className={s.vcol}>
          <span title={r.sellerName}>{r.sellerName || "-"}</span>
        </div>
      ),
    },
    {
      title: "Chi nhánh",
      dataIndex: "branchName",
      key: "branchName",
      width: 180,
      responsive: ["lg"],
      render: (v) => (
        <div className={s.vcol}>
          <span title={v}>{v}</span>
        </div>
      ),
    },
    {
      title: "Ký",
      dataIndex: "signMethod",
      key: "signMethod",
      width: 120,
      render: (v) => {
        const meta = SIGN_META[v] || { color: "default", label: v };
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (v) => {
        const meta = STATUS_META[v] || { color: "default", label: v };
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: "Hiệu lực từ",
      dataIndex: "effectiveFrom",
      key: "effectiveFrom",
      sorter: true,
      width: 180,
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : <span className={s.subtle}>—</span>),
    },
    {
      title: "Hiệu lực đến",
      dataIndex: "effectiveTo",
      key: "effectiveTo",
      sorter: true,
      width: 180,
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : <span className={s.subtle}>—</span>),
    },

    // ✅ Cột thao tác "Xem" cố định bên phải
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 96,
      render: (_, r) => (
        <Button
          size="small"
          type="link"
          className={s.viewActionBtn}
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail?.(r);
          }}
        >
          Xem
        </Button>
      ),
    },
  ];

  const tableSize = isMobile ? "small" : isTablet ? "middle" : "large";
  const scrollX = isMobile ? 900 : 1300;

  return (
    <Table
      rowKey={(r) => r.id}
      size={tableSize}
      loading={loading}
      columns={columns}
      dataSource={rows}
      onChange={onTableChange}
      pagination={{
        current: page,
        pageSize: size,
        total,
        showSizeChanger: true,
        pageSizeOptions: isMobile ? [5, 10, 20] : [5, 10, 20, 50],
        showTotal: (t) => `Tổng ${t} hợp đồng`,
        showLessItems: isMobile,
        size: isMobile ? "small" : "default",
      }}
      scroll={{ x: scrollX }}
      sticky
      className={s.table}
    />
  );
}


