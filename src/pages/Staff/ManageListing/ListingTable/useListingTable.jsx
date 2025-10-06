import React, { useMemo, useState } from "react";
import { Tag, Space, Button, Tooltip, Dropdown } from "antd";
import { HistoryOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import StatusTag from "../StatusTag/StatusTag";
import YesNoTag from "./YesNoTag";

// Fake data - TODO: Replace with real API
import { fakeHistory } from "@/data/admin/manageListing.fake";

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
  navigate,
}) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // Show history for specific listing
  const showHistory = React.useCallback(async (listingId) => {
    try {
      // TODO: Replace with real API call
      const data = await fakeHistory(listingId);
      setHistoryData(data);
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
        width: 240,
        sorter: (a, b) => a.title.localeCompare(b.title),
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {record.title}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>ID: {record.id}</div>
            <div style={{ fontSize: 12, color: "#888" }}>
              Đăng: {dayjs(record.createdAt).format("DD/MM/YYYY")}
            </div>
          </div>
        ),
      },
      {
        title: "Phân loại",
        dataIndex: "category",
        key: "category",
        width: 120,
        sorter: (a, b) =>
          (CATEGORY_LABEL[a.category] || a.category).localeCompare(
            CATEGORY_LABEL[b.category] || b.category
          ),
        render: (category) => (
          <Tag
            color={getCategoryColor(category)}
            style={{
              fontSize: 12,
              fontWeight: 500,
              margin: 0,
              borderRadius: 6,
            }}
          >
            {CATEGORY_LABEL[category] || category}
          </Tag>
        ),
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        width: 120,
        sorter: (a, b) => Number(a.price) - Number(b.price),
        render: (price) => formatVND(price),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 120,
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (status) => <StatusTag status={status} />,
      },
      {
        title: "Xác minh",
        dataIndex: "verified",
        key: "verified",
        width: 80,
        sorter: (a, b) => a.verified - b.verified,
        render: (verified) => <YesNoTag value={verified} />,
      },
      {
        title: "Ký gửi",
        dataIndex: "isConsigned",
        key: "isConsigned",
        width: 80,
        sorter: (a, b) => a.isConsigned - b.isConsigned,
        render: (isConsigned) => <YesNoTag value={isConsigned} />,
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 200,
        fixed: "right",
        align: "left",
        render: (_, record) => {
          // Build action menu items based on listing status
          const actions = [];
          actions.push({
            key: "detail",
            label: "Xem chi tiết",
            icon: <EyeOutlined />,
            onClick: () => navigate(`/staff/listings/${record.id}`),
          });
          if (record.status === "PENDING") {
            actions.push(
              {
                key: "approve",
                label: "Phê duyệt",
                icon: <HistoryOutlined style={{ color: "#52c41a" }} />,
                onClick: () => onApprove(record),
              },
              {
                key: "reject",
                label: "Từ chối",
                icon: <HistoryOutlined style={{ color: "#ff4d4f" }} />,
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

          // Create dropdown menu items from actions
          const menuItems = actions.map((action) => ({
            key: action.key,
            label: (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {action.icon}
                {action.label}
              </span>
            ),
            onClick: action.onClick,
          }));

          // Render dropdown with actions
          return (
            <Space>
              <Dropdown
                menu={{
                  items: menuItems,
                  onClick: (info) =>
                    menuItems.find((i) => i.key === info.key)?.onClick(),
                }}
                placement="bottomLeft"
                trigger={["click"]}
                disabled={menuItems.length === 0}
              >
                <Button icon={<MoreOutlined />} type="text" size="small" />
              </Dropdown>
            </Space>
          );
        },
      },
    ],
    [
      navigate,
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
