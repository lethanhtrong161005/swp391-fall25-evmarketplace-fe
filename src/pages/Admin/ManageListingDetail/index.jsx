import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Grid,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import MediaGallery from "./_components/MediaGallery";
import InfoCards from "./_components/InfoCards";
import StatusHistory from "./_components/StatusHistory";
import StatusTag from "../ManageListing/_components/StatusTag";
import {
  getListingDetail,
  getListingHistory,
} from "@services/admin/listing.admin.service";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const CATEGORY_LABEL = {
  EV_CAR: "Xe ô tô",
  E_MOTORBIKE: "Xe máy điện",
  E_BIKE: "Xe đạp điện",
  BATTERY: "Pin",
};

const fmtVND = (n) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" }); // MDN Intl.NumberFormat. :contentReference[oaicite:0]{index=0}

const fmtDate = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

export default function ManageListingDetail() {
  const nav = useNavigate();
  const { id } = useParams(); // lấy :id từ route /admin/listings/:id. :contentReference[oaicite:1]{index=1}
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const detail = await getListingDetail(id);
        setListing(detail);
        const hist = await getListingHistory(id);
        setHistory(hist || []);
      } catch (e) {
        console.error(e);
        message.error("Không tải được chi tiết bài đăng");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const metaItems = useMemo(() => {
    if (!listing) return [];
    return [
      {
        label: "Danh mục",
        value: CATEGORY_LABEL[listing.category] || listing.category || "—",
      },
      { label: "Hãng", value: listing.brand || "—" },
      { label: "Model", value: listing.model || "—" },
      { label: "Năm", value: listing.year ?? "—" },
      {
        label: "SOH%",
        value: listing.soh_percent != null ? `${listing.soh_percent}%` : "—",
      },
      {
        label: "Dung lượng pin (kWh)",
        value: listing.battery_capacity_kwh ?? "—",
      },
      {
        label: "Số km đã đi",
        value:
          listing.mileage_km != null
            ? `${listing.mileage_km.toLocaleString()} km`
            : "—",
      },
      { label: "Màu sắc", value: listing.color || "—" },
      { label: "Tỉnh/Thành", value: listing.province || "—" },
      { label: "Quận/Huyện", value: listing.district || "—" },
      { label: "Phường/Xã", value: listing.ward || "—" },
      { label: "Địa chỉ", value: listing.address || "—" },
    ];
  }, [listing]);

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Card>
        <Space align="center" size={12}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => nav("/admin/listings")}
          />
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết bài đăng
          </Title>
        </Space>
      </Card>

      <Card loading={loading}>
        {!listing ? (
          <Skeleton active />
        ) : (
          <Row gutter={[16, 16]}>
            {/* Bên trái: ảnh + mô tả + thông số */}
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {/* Header title + status */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div>
                    <Title level={3} style={{ marginBottom: 4 }}>
                      {listing.title || "—"}
                    </Title>
                    <Text type="secondary">
                      Mã tin: #
                      {listing.code || String(listing.id).padStart(6, "0")}
                    </Text>
                  </div>
                  <StatusTag status={listing.status} /> {/* pill TV. */}
                </div>

                {/* Media */}
                <MediaGallery images={listing.images || []} />

                {/* Mô tả */}
                <Card size="small" title="Mô tả chi tiết">
                  <Text style={{ whiteSpace: "pre-line" }}>
                    {listing.description || "—"}
                  </Text>
                </Card>

                {/* Thông số sản phẩm */}
                <Card size="small" title="Thông số">
                  <Descriptions
                    bordered
                    size={screens.md ? "middle" : "small"}
                    column={screens.lg ? 3 : screens.md ? 2 : 1}
                  >
                    {metaItems.map((it) => (
                      <Descriptions.Item key={it.label} label={it.label}>
                        {it.value}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Card>

                {/* Lịch sử trạng thái */}
                <StatusHistory items={history} />
              </Space>
            </Col>

            {/* Bên phải: price + người bán + info nhanh */}
            <Col xs={24} lg={8}>
              <InfoCards
                price={fmtVND(listing.price)}
                aiPrice={
                  listing.ai_suggested_price
                    ? fmtVND(listing.ai_suggested_price)
                    : null
                }
                seller={{
                  name: listing.seller_name ?? listing.sellerName,
                  phone: listing.seller_phone ?? listing.sellerPhone,
                  email: listing.seller_email ?? listing.sellerEmail,
                }}
                flags={{
                  verified: !!listing.verified,
                  consigned: !!listing.is_consigned,
                  createdAt: fmtDate(listing.created_at),
                }}
              />
            </Col>
          </Row>
        )}
      </Card>
    </Space>
  );
}
