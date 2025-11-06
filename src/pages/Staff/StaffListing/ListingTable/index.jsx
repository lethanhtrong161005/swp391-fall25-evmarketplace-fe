import React, { useMemo } from "react";
import { Avatar, Table, Tag, Typography, Button, Space, Tooltip } from "antd";
import { EditOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import s from "./styles.module.scss";

const { Text } = Typography;

export default function ListingTable({
  rows = [],
  loading,
  page,
  pageSize,
  total,
  onChange,
  onEdit,
  onCreateOrder,
}) {
  const statusColor = (st) =>
    ({
      PENDING: "gold",
      ACTIVE: "green",
      SOLD: "geekblue",
      HIDDEN: "default",
      EXPIRED: "volcano",
      REJECTED: "red",
    }[st] || "default");

  const columns = useMemo(
    () => [
      {
        title: "",
        key: "thumbnail",
        width: 64,
        render: (_, r) => {
          const url =
            r.thumbnailUrl ||
            (Array.isArray(r.mediaUrls) && r.mediaUrls.length > 0
              ? r.mediaUrls[0]
              : Array.isArray(r.media) && r.media.length > 0
              ? r.media[0].mediaUrl
              : null);
          return <Avatar shape="square" size={48} src={url} />;
        },
      },
      {
        title: "Tiêu đề",
        dataIndex: "title",
        sorter: true,
        ellipsis: true,
        render: (t, r) => (
          <div className={s.titleCell}>
            <div className={s.titleLine}>{t || "(Không tiêu đề)"}</div>
            <div className={s.metaLine}>
              <Text type="secondary">
                {r.brand} {r.model} • {r.year || "-"}
              </Text>
            </div>
          </div>
        ),
      },
      {
        title: "Giá",
        dataIndex: "price",
        sorter: true,
        render: (v) => (v != null ? v.toLocaleString("vi-VN") + " ₫" : "-"),
        align: "right",
      },
      {
        title: "SOH / Km / Pin",
        key: "specs",
        render: (_, r) => (
          <span>
            {r.sohPercent != null && (
              <Tag color="blue">SOH {r.sohPercent}%</Tag>
            )}
            {r.mileageKm != null && (
              <Tag color="geekblue">{r.mileageKm.toLocaleString()} km</Tag>
            )}
            {r.batteryCapacityKwh != null && (
              <Tag color="purple">{r.batteryCapacityKwh} kWh</Tag>
            )}
          </span>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        sorter: true,
        render: (s) => <Tag color={statusColor(s)}>{s}</Tag>,
        width: 120,
      },
      {
        title: "Tỉnh/TP",
        render: (_, r) => r.province || "-",
        width: 140,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        sorter: true,
        width: 180,
      },
      {
        title: "Thao tác",
        key: "actions",
        align: "center",
        width: 150,
        fixed: "right",
        render: (_, record) => (
          <Space>
            <Tooltip title="Chỉnh sửa tin đăng">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => onEdit && onEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Tạo đơn hàng">
              <Button
                type="default"
                icon={<ShoppingCartOutlined />}
                onClick={() => onCreateOrder && onCreateOrder(record)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [onEdit]
  );

  return (
    <Table
      rowKey={(r) => r.id}
      columns={columns}
      dataSource={rows}
      loading={loading}
      size="middle"
      sticky
      scroll={{ x: 1000 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (t, range) =>
          `${range[0]}-${range[1]} / ${t.toLocaleString("vi-VN")}`,
      }}
      onChange={onChange}
    />
  );
}
