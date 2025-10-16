import React, { useMemo, useState } from "react";
import { Tag, Space, Button, Tooltip, Dropdown } from "antd";
import { HistoryOutlined, MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import StatusTag from "../StatusTag/StatusTag";
import s from "./ListingTable.module.scss";
import YesNoTag from "./YesNoTag";

// TODO: Implement real API for history

// Category mapping for display
const CATEGORY_LABEL = {
  EV_CAR: "Xe ô tô",
  E_MOTORBIKE: "Xe máy điện",
  E_BIKE: "Xe đạp điện",
  BATTERY: "Pin",
};

// Format price to VND currency
const formatVND = (n) => {
  const num = Number(n);
  if (!isFinite(num)) return "—";
  return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// Color mapping for categories
const getCategoryColor = (category) => {
  const colors = {
    EV_CAR: "#1890ff",
    E_MOTORBIKE: "#52c41a",
    E_BIKE: "#faad14",
    BATTERY: "#722ed1",
  };
  return colors[category] || "#8c8c8c";
};

/**
 * Hook for managing listing table functionality
 * Handles actions, columns config, and history display
 */
export function useListingTable({
  onApprove,
  onReject,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  onRestore,
  onRenew,
  onOpenDetail,
}) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // Show history for specific listing
  const showHistory = React.useCallback(async (listingId) => {
    try {
      // TODO: Implement real API call for history
      console.log("Loading history for listing:", listingId);
      setHistoryData([]);
      setHistoryOpen(true);
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "Thông tin chính",
        dataIndex: "title",
        key: "info",
        width: 200,
        sorter: (a, b) => a.title.localeCompare(b.title),
        showSorterTooltip: { title: "Nhấn để sắp xếp" },
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {record.title}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>ID: {record.id}</div>
            {record.brand && record.model && (
              <div style={{ fontSize: 12, color: "#666" }}>
                {record.brand} {record.model}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Phân loại",
        dataIndex: "category",
        key: "category",
        width: 120,
        align: "center",
        showSorterTooltip: { title: "Nhấn để sắp xếp" },
        sorter: (a, b) => {
          const categoryA =
            a.category || (a.batteryCapacityKwh ? "BATTERY" : "VEHICLE");
          const categoryB =
            b.category || (b.batteryCapacityKwh ? "BATTERY" : "VEHICLE");
          return (CATEGORY_LABEL[categoryA] || categoryA).localeCompare(
            CATEGORY_LABEL[categoryB] || categoryB
          );
        },
        render: (_, record) => {
          // Determine category based on battery capacity or other indicators
          let category = record.category;
          if (!category) {
            if (record.batteryCapacityKwh) {
              category = "BATTERY";
            } else {
              category = "VEHICLE"; // Default to vehicle if no category specified
            }
          }

          return (
            <Tag color={getCategoryColor(category)} className={s.uniformTag}>
              {CATEGORY_LABEL[category] || category}
            </Tag>
          );
        },
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        width: 120,
        align: "center",
        showSorterTooltip: { title: "Nhấn để sắp xếp" },
        sorter: (a, b) => Number(a.price) - Number(b.price),
        render: (price) => formatVND(price),
      },
      {
        title: "Ngày đăng bài",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 120,
        align: "center",
        showSorterTooltip: { title: "Nhấn để sắp xếp" },
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 120,
        align: "center",
        showSorterTooltip: { title: "Nhấn để sắp xếp" },
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (status) => <StatusTag status={status} />,
      },
      {
        title: "Xác minh",
        dataIndex: "verified",
        key: "verified",
        width: 80,
        align: "center",
        showSorterTooltip: { title: "Nhấn để sắp xếp" },
        sorter: (a, b) => (a.verified ? 1 : 0) - (b.verified ? 1 : 0),
        render: (_, record) => {
          // For now, we'll assume all items are verified since API doesn't provide this field
          // You can update this logic based on actual API response
          const verified =
            record.verified !== undefined ? record.verified : true;
          return <YesNoTag value={verified} />;
        },
      },
      {
        title: "Ký gửi",
        dataIndex: "isConsigned",
        key: "isConsigned",
        width: 80,
        align: "center",
        showSorterTooltip: { title: "Nhấn để sắp xếp" },
        sorter: (a, b) => (a.isConsigned ? 1 : 0) - (b.isConsigned ? 1 : 0),
        render: (isConsigned) => <YesNoTag value={isConsigned} />,
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 160,
        fixed: "right",
        align: "left",
        render: (_, record) => {
          // Build action menu items based on listing status
          const actions = [];
          const isPending = record.status === "PENDING";
          if (isPending) {
            actions.push(
              {
                key: "approve",
                label: "Phê duyệt",
                onClick: () => onApprove(record),
              },
              {
                key: "reject",
                label: "Từ chối",
                onClick: () => onReject(record),
              }
            );
          }
          if (record.status === "APPROVED") {
            actions.push(
              {
                key: "activate",
                label: "Kích hoạt",
                icon: <HistoryOutlined style={{ color: "#1890ff" }} />,
                onClick: () => onActivate(record),
              },
              {
                key: "edit",
                label: "Sửa",
                icon: <HistoryOutlined style={{ color: "#1890ff" }} />,
                onClick: () => onEdit(record),
              }
            );
          }
          if (record.status === "ACTIVE") {
            actions.push(
              {
                key: "deactivate",
                label: "Ẩn",
                icon: <HistoryOutlined style={{ color: "#faad14" }} />,
                onClick: () => onDeactivate(record),
              },
              {
                key: "edit",
                label: "Sửa",
                icon: <HistoryOutlined style={{ color: "#1890ff" }} />,
                onClick: () => onEdit(record),
              }
            );
          }
          if (record.status === "REJECTED") {
            actions.push(
              {
                key: "approve-again",
                label: "Duyệt lại",
                icon: <HistoryOutlined style={{ color: "#52c41a" }} />,
                onClick: () => onApprove(record),
              },
              {
                key: "delete",
                label: "Xóa",
                icon: <HistoryOutlined style={{ color: "#ff4d4f" }} />,
                onClick: () => onDelete(record),
              }
            );
          }
          if (record.status === "ARCHIVED") {
            actions.push({
              key: "restore",
              label: "Khôi phục",
              icon: <HistoryOutlined style={{ color: "#52c41a" }} />,
              onClick: () => onRestore(record),
            });
          }
          if (record.status === "EXPIRED") {
            actions.push({
              key: "renew",
              label: "Gia hạn",
              icon: <HistoryOutlined style={{ color: "#1890ff" }} />,
              onClick: () => onRenew(record),
            });
          }

          // Create dropdown menu items from actions (excluding inline approve/reject when pending)
          const menuItems = actions
            .filter(
              (a) => !(isPending && (a.key === "approve" || a.key === "reject"))
            )
            .map((action) => ({
              key: action.key,
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {action.icon}
                  {action.label}
                </span>
              ),
              onClick: action.onClick,
            }));

          // Render inline buttons for pending + dropdown for the rest. Stop propagation so row click doesn't fire
          return (
            <Space onClick={(e) => e.stopPropagation()}>
              {isPending && (
                <>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => onApprove(record)}
                  >
                    Duyệt
                  </Button>
                  <Button danger size="small" onClick={() => onReject(record)}>
                    Từ chối
                  </Button>
                </>
              )}
              {menuItems.length > 0 && (
                <Dropdown
                  menu={{
                    items: menuItems,
                    onClick: (info) =>
                      menuItems.find((i) => i.key === info.key)?.onClick(),
                  }}
                  placement="bottomLeft"
                  trigger={["click"]}
                >
                  <Button icon={<MoreOutlined />} type="text" size="small" />
                </Dropdown>
              )}
            </Space>
          );
        },
      },
    ],
    [
      onApprove,
      onReject,
      onEdit,
      onActivate,
      onDeactivate,
      onDelete,
      onRestore,
      onRenew,
    ]
  );

  return {
    columns,
    historyOpen,
    setHistoryOpen,
    historyData,
    showHistory,
    formatVND,
    CATEGORY_LABEL,
  };
}
