import React, { useMemo, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Typography,
  Drawer,
  List,
  Tooltip,
} from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import StatusTag from "./StatusTag";
import dayjs from "dayjs";

// Demo: dùng fakeHistory trong lúc chưa nối BE.
// Khi nối BE: truyền prop fetchHistory hoặc gọi service tại đây.
import { fakeHistory } from "@/data/admin/manageListing.fake";

const { Text } = Typography;

const CATEGORY_LABEL = {
  EV_CAR: "Xe ô tô",
  E_MOTORBIKE: "Xe máy điện",
  E_BIKE: "Xe đạp điện",
  BATTERY: "Pin",
};

const yesNoTag = (val) =>
  val ? (
    <Tag color="green" style={{ borderRadius: 999, paddingInline: 10 }}>
      Có
    </Tag>
  ) : (
    <Tag style={{ borderRadius: 999, paddingInline: 10 }}>Không</Tag>
  );

const formatVND = (n) => {
  const num = Number(n);
  if (!isFinite(num)) return "—";
  return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export default function ListingTable({
  loading,
  dataSource,
  total,
  page,
  pageSize,
  onPageChange,
  onApprove,
  onReject,
  onArchive,
  fetchHistory, // optional: async () => [{id, listing_id, code, title, from_status, to_status, by_name, at, note}]
}) {
  const nav = useNavigate();

  // ===== History Drawer (toàn bảng) =====
  const [histOpen, setHistOpen] = useState(false);
  const [histLoading, setHistLoading] = useState(false);
  const [histRows, setHistRows] = useState([]);

  const openHistory = async () => {
    setHistOpen(true);
    setHistLoading(true);
    try {
      const rows =
        (await (fetchHistory ? fetchHistory() : fakeHistory())) || [];
      setHistRows(rows);
    } catch (e) {
      console.error(e);
    } finally {
      setHistLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Tiêu đề",
        dataIndex: "title",
        key: "title",
        width: 340,
        render: (text, row) => (
          <div>
            {/* Giữ link để người dùng thấy rõ, nhưng click dòng cũng điều hướng */}
            <Typography.Link
              onClick={(e) => {
                e.stopPropagation();
                nav(`/admin/listings/${row.id}`);
              }}
              ellipsis
            >
              {text || "—"}
            </Typography.Link>
            <div style={{ color: "rgba(0,0,0,0.45)", lineHeight: 1.1 }}>
              #{row.code || String(row.id).padStart(6, "0")}
            </div>
          </div>
        ),
      },
      {
        title: "Người bán",
        key: "seller",
        width: 200,
        render: (_, row) => (
          <div>
            <div>{row.seller_name || row.sellerName || "—"}</div>
            <Text type="secondary">
              {row.seller_phone || row.sellerPhone || "—"}
            </Text>
          </div>
        ),
      },
      {
        title: "Loại",
        dataIndex: "category",
        key: "category",
        width: 120,
        render: (_, row) => {
          const catKey =
            row.category || row.category_code || row.category_id || "";
          return CATEGORY_LABEL[catKey] || row.category_name || "—";
        },
      },
      {
        title: "Pin & SOH%",
        dataIndex: "soh_percent",
        key: "soh_percent",
        width: 120,
        align: "center",
        render: (v) => (v || v === 0 ? `${v}%` : "—"),
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        width: 150,
        align: "right",
        render: (v) => <Text strong>{formatVND(v)}</Text>,
      },
      {
        title: "Verified",
        dataIndex: "verified",
        key: "verified",
        width: 110,
        align: "center",
        render: (v) => yesNoTag(!!v),
      },
      {
        title: "Ký gửi",
        dataIndex: "is_consigned",
        key: "is_consigned",
        width: 110,
        align: "center",
        render: (v) => yesNoTag(!!v),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 160,
        render: (v) => <StatusTag status={v} />,
      },
      {
        title: "Ngày tạo",
        dataIndex: "created_at",
        key: "created_at",
        width: 180,
        render: (v) => (v ? new Date(v).toLocaleString("vi-VN") : "—"),
      },
      {
        title: "Thao tác",
        key: "actions",
        fixed: "right",
        width: 220,
        render: (_, row) => {
          const isPending = row.status === "PENDING";
          const isActive = row.status === "ACTIVE";
          return (
            <Space size={8}>
              {isPending && (
                <Button
                  type="primary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApprove?.(row);
                  }}
                >
                  Duyệt
                </Button>
              )}
              {isPending && (
                <Button
                  danger
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject?.(row);
                  }}
                >
                  Từ chối
                </Button>
              )}
              {isActive && (
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive?.(row);
                  }}
                >
                  Lưu trữ
                </Button>
              )}
            </Space>
          );
        },
      },
    ],
    [nav, onApprove, onReject, onArchive]
  );

  return (
    <>
      {/* Thanh hành động của Table (nút Lịch sử dùng chung) */}
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}
      >
        <Tooltip title="Xem lịch sử thay đổi trạng thái (toàn bộ danh sách)">
          <Button icon={<HistoryOutlined />} onClick={openHistory}>
            Lịch sử trạng thái
          </Button>
        </Tooltip>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        size="middle"
        bordered={false}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: false,
          onChange: onPageChange,
          showTotal: (t) => `${t} bản ghi`,
        }}
        tableLayout="fixed"
        scroll={{ x: 1200 }}
        onRow={(record) => ({
          onClick: () => nav(`/admin/listings/${record.id}`),
        })}
        // Làm mềm cạnh bảng
        style={{ borderRadius: 12, overflow: "hidden" }}
      />

      {/* Drawer lịch sử (toàn bảng) */}
      <Drawer
        title="Lịch sử thay đổi trạng thái"
        open={histOpen}
        onClose={() => setHistOpen(false)}
        width={560}
      >
        <List
          loading={histLoading}
          dataSource={useMemo(() => {
            // Map id -> title hiện có trên bảng để fill nếu history thiếu tiêu đề
            const id2Title = new Map(
              (dataSource || []).map((r) => [r.id, r.title])
            );

            return (histRows || []).map((h, idx) => {
              const listingId = h.listing_id ?? h.listingId ?? null;
              const codeNum =
                h.code ??
                (listingId ? String(listingId).padStart(6, "0") : null);
              return {
                key: h.id ?? `${listingId ?? "x"}-${idx}`,
                code: codeNum, // để render "#000123" nếu có
                title: h.title ?? (listingId ? id2Title.get(listingId) : ""),
                when: h.at ? dayjs(h.at).format("HH:mm:ss DD/MM/YYYY") : "",
                from: h.from_status ?? h.from ?? "",
                to: h.to_status ?? h.to ?? "",
                by: h.by_name ?? h.by ?? "—",
                note: h.note,
              };
            });
          }, [histRows, dataSource])}
          renderItem={(r) => (
            <List.Item key={r.key}>
              <List.Item.Meta
                title={
                  <Space size={8} wrap>
                    {r.code && <Text strong>#{r.code}</Text>}
                    {r.title && <Text type="secondary">{r.title}</Text>}
                  </Space>
                }
                description={
                  <div>
                    <Space size={6} style={{ marginBottom: 4 }}>
                      <StatusTag status={r.from} />
                      <span>→</span>
                      <StatusTag status={r.to} />
                    </Space>
                    <div style={{ color: "rgba(0,0,0,0.65)" }}>
                      {r.when} • bởi {r.by}
                      {r.note ? ` • ${r.note}` : ""}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
}
