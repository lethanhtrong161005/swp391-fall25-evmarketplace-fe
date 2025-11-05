import React from "react";
import { Table, Tag, Tooltip, Grid, Typography, Button } from "antd";
import dayjs from "dayjs";
import s from "./ContractTable.module.scss";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { isLockedStatus } from "../ContractEditModal/useContractEditModal";

const { Text } = Typography;

const SIGN_META = {
  CLICK: { color: "green", label: "CLICK" },
  OTP: { color: "gold", label: "OTP" },
  PAPER: { color: "blue", label: "PAPER" },
};

const STATUS_META = {
  UPLOADED: { color: "cyan", label: "UPLOADED" },
  CANCELLED: { color: "red", label: "CANCELLED" },
  SIGNED: { color: "green", label: "SIGNED" },
  ACTIVE: { color: "green", label: "ACTIVE" },
  EXPIRED: { color: "volcano", label: "EXPIRED" },
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
  onViewDetail,
  onEdit
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
          </div>
        </div>
      ),
    },

    {
      title: "Khách hàng",
      key: "seller",
      width: 180,
      responsive: ["lg"],
      render: (_, r) => (
        <div className={s.vcol}>
          <span title={r.buyerName}>{r.buyerName || "-"}</span>
          <span title={r.buyerPhoneNumber}>{r.buyerPhoneNumber || "-"}</span>
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


    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 210,
      render: (_, r) => (
        <Space size = "small" className={s.actions} >
          <Button
            size="small"
            type="text"
            icon={<EditOutlined />}
            className={s.actionBtn}
            disabled={isLockedStatus(r.status)}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(r);
            }}
          >
            Sửa
          </Button>

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
            Xem Hợp Đồng
          </Button>
        </Space>
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



