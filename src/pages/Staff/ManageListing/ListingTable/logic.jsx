import React, { useMemo, useState } from "react";
import { Tag, Space, Button, Tooltip } from "antd";
import { HistoryOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import StatusTag from "../StatusTag/StatusTag";
import YesNoTag from "./YesNoTag";

// Demo: dùng fakeHistory trong lúc chưa nối BE.
import { fakeHistory } from "@/data/admin/manageListing.fake";

const CATEGORY_LABEL = {
  EV_CAR: "Xe ô tô",
  E_MOTORBIKE: "Xe máy điện",
  E_BIKE: "Xe đạp điện",
  BATTERY: "Pin",
};

const formatVND = (n) => {
  const num = Number(n);
  if (!isFinite(num)) return "—";
  return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const getCategoryColor = (category) => {
  const colors = {
    EV_CAR: "#1890ff", // Xanh dương cho xe ô tô
    E_MOTORBIKE: "#52c41a", // Xanh lá cho xe máy điện
    E_BIKE: "#faad14", // Vàng cam cho xe đạp điện
    BATTERY: "#722ed1", // Tím cho pin
  };
  return colors[category] || "#8c8c8c"; // Xám mặc định
};

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

  const showGlobalHistory = React.useCallback(async () => {
    try {
      // TODO (BE): thay bằng getGlobalListingHistory()
      const data = await fakeHistory("global");
      setHistoryData(data);
      setHistoryOpen(true);
    } catch (e) {
      console.error("Không tải được lịch sử chung:", e);
    }
  }, []);

  const showHistory = React.useCallback(async (listingId) => {
    try {
      // TODO (BE): thay fakeHistory bằng getListingHistory(listingId)
      const data = await fakeHistory(listingId);
      setHistoryData(data);
      setHistoryOpen(true);
    } catch (e) {
      console.error("Không tải được lịch sử:", e);
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
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                alignItems: "flex-start",
              }}
            >
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/staff/listings/${record.id}`)}
                style={{
                  minWidth: 80,
                  fontWeight: 500,
                  height: 32,
                  borderRadius: 6,
                  fontSize: 13,
                }}
                size="small"
              >
                Chi tiết
              </Button>

              {/* PENDING: Chờ duyệt - Chỉ có thể duyệt hoặc từ chối */}
              {record.status === "PENDING" && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Button
                    type="primary"
                    style={{
                      minWidth: 70,
                      background: "#52c41a",
                      borderColor: "#52c41a",
                      fontWeight: 500,
                      height: 32,
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                    onClick={() => onApprove(record)}
                    size="small"
                  >
                    Duyệt
                  </Button>
                  <Button
                    danger
                    style={{
                      minWidth: 70,
                      fontWeight: 500,
                      height: 32,
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                    onClick={() => onReject(record)}
                    size="small"
                  >
                    Từ chối
                  </Button>
                </div>
              )}

              {/* APPROVED: Đã duyệt - Có thể kích hoạt hoặc chỉnh sửa */}
              {record.status === "APPROVED" && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Button
                    type="primary"
                    style={{
                      minWidth: 80,
                      fontWeight: 500,
                      height: 32,
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                    onClick={() => onActivate(record)}
                    size="small"
                  >
                    Kích hoạt
                  </Button>
                  <Button
                    style={{
                      minWidth: 70,
                      fontWeight: 500,
                      border: "1px solid #1890ff",
                      color: "#1890ff",
                      background: "#fff",
                      height: 32,
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                    onClick={() => onEdit(record)}
                    size="small"
                  >
                    Sửa
                  </Button>
                </div>
              )}

              {/* ACTIVE: Đang hoạt động - Có thể tạm ẩn, chỉnh sửa hoặc lưu trữ */}
              {record.status === "ACTIVE" && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Button
                    style={{
                      minWidth: 70,
                      fontWeight: 500,
                      border: "1px solid #faad14",
                      color: "#faad14",
                      background: "#fff",
                      height: 32,
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                    onClick={() => onDeactivate(record)}
                    size="small"
                  >
                    Ẩn
                  </Button>
                  <Button
                    style={{
                      minWidth: 70,
                      fontWeight: 500,
                      border: "1px solid #1890ff",
                      color: "#1890ff",
                      background: "#fff",
                      height: 32,
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                    onClick={() => onEdit(record)}
                    size="small"
                  >
                    Sửa
                  </Button>
                </div>
              )}

              {/* REJECTED: Đã từ chối - Có thể duyệt lại hoặc xóa hẳn */}
              {record.status === "REJECTED" && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Button
                    type="primary"
                    style={{
                      minWidth: 80,
                      background: "#52c41a",
                      borderColor: "#52c41a",
                      fontWeight: 500,
                      height: 32,
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                    onClick={() => onApprove(record)}
                    size="small"
                  >
                    Duyệt lại
                  </Button>
                  <Button
                    danger
                    style={{
                      minWidth: 70,
                      fontWeight: 500,
                      height: 32,
                      borderRadius: 6,
                      fontSize: 13,
                    }}
                    onClick={() => onDelete(record)}
                    size="small"
                  >
                    Xóa
                  </Button>
                </div>
              )}

              {/* ARCHIVED: Đã lưu trữ - Có thể khôi phục */}
              {record.status === "ARCHIVED" && (
                <Button
                  style={{
                    minWidth: 80,
                    fontWeight: 500,
                    border: "1px solid #52c41a",
                    color: "#52c41a",
                    background: "#fff",
                    height: 32,
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  onClick={() => onRestore(record)}
                  size="small"
                >
                  Khôi phục
                </Button>
              )}

              {/* EXPIRED: Hết hạn - Có thể gia hạn */}
              {record.status === "EXPIRED" && (
                <Button
                  type="primary"
                  style={{
                    minWidth: 80,
                    fontWeight: 500,
                    height: 32,
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  onClick={() => onRenew(record)}
                  size="small"
                >
                  Gia hạn
                </Button>
              )}
            </div>
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
    showGlobalHistory,
    formatVND,
    CATEGORY_LABEL,
  };
}
