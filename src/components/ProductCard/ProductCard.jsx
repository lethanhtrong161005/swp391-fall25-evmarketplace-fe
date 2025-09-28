// src/pages/Member/Home/ProductCard.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Image,
  Typography,
  Tag,
  Row,
  Col,
  Space,
  Empty,
  Grid,
  Badge,
} from "antd";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

/** Tùy bậc "mật độ" để responsive nhẹ nhàng */
const DENSITY = {
  compact: { pad: 8, title: 14, radius: 10, tag: 12 },
  default: { pad: 12, title: 16, radius: 12, tag: 14 },
  large: { pad: 16, title: 18, radius: 14, tag: 14 },
};

/** Nhận diện Pin hay Xe theo nhiều nguồn field */
function isBattery(listing) {
  const t = (
    listing?.category ||
    listing?.type ||
    listing?.itemType ||
    ""
  ).toUpperCase();
  return (
    t === "BATTERY" ||
    listing?.product_battery_id != null ||
    listing?.productBatteryId != null
  );
}

/** Định dạng VND */
function toVND(n) {
  if (n == null) return "";
  const v = Number(n);
  return Number.isNaN(v) ? `${n} đ` : `${v.toLocaleString("vi-VN")} đ`;
}

export default function ProductCard({ listing, onClick, size }) {
  const screens = useBreakpoint();
  const SZ =
    DENSITY[
      size || (screens.xl ? "large" : screens.md ? "default" : "compact")
    ];
  const [imgError, setImgError] = useState(false);

  const kindIsBattery = isBattery(listing);

  const data = useMemo(() => {
    const imageUrl =
      (Array.isArray(listing?.images) && listing.images[0]) ||
      listing?.imageUrl ||
      "";
    const location =
      [listing?.city, listing?.province].filter(Boolean).join(", ") || "-";

    // Chung
    const base = {
      id: listing?.id,
      name:
        listing?.title ||
        `${listing?.brand ?? ""} ${listing?.model ?? ""}`.trim() ||
        "Product name",
      price: listing?.price,
      imageUrl,
      location,
      verified: !!listing?.verified,
    };

    if (kindIsBattery) {
      return {
        ...base,
        type: "BATTERY",
        chemistry: listing?.chemistry || listing?.batteryChemistry || "-",
        capacityKwh:
          listing?.batteryCapacityKwh ??
          listing?.capacityKwh ??
          listing?.capacity_kwh,
        weightKg: listing?.weightKg ?? listing?.weight_kg,
        dimension: listing?.dimension,
      };
    }

    return {
      ...base,
      type: "VEHICLE",
      year: listing?.year ?? "-",
      sohPercent: listing?.sohPercent ?? listing?.soh_percent,
      mileageKm:
        listing?.mileageKm ??
        listing?.mileage_km ??
        (typeof listing?.mileage === "number" ? listing?.mileage : undefined),
      powerKw:
        listing?.powerKw ??
        (typeof listing?.motor_power === "number"
          ? listing?.motor_power / 1000
          : undefined),
    };
  }, [listing, kindIsBattery]);

  const frameStyle = {
    width: "100%",
    aspectRatio: "4 / 3",
    borderRadius: 8,
    overflow: "hidden",
    background: "#f5f5f5",
    border: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };

  return (
    <Card
      hoverable
      onClick={() => onClick?.(listing)}
      // onClick={onClick()}
      styles={{ body: { padding: SZ.pad } }}
      style={{
        borderRadius: SZ.radius,
        position: "relative",
        height: "100%", // luôn full chiều cao Col
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <Link to={`/detail/${listing.id}`} style={{ display: "block" }}> */}
        {/* Tag góc trên: loại BATTERY + Verified cho xe */}
        {kindIsBattery && (
          <Tag
            color="purple"
            style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}
          >
            Battery
          </Tag>
        )}
        {!kindIsBattery && data.verified && (
          <Tag
            color="green"
            style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}
          >
            Đã thẩm định
          </Tag>
        )}

        <div style={frameStyle}>
          {!data.imageUrl || imgError ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text style={{ color: "#8c8c8c" }}>Không có hình ảnh</Text>
              }
            />
          ) : (
            <Image
              src={data.imageUrl}
              alt={data.name}
              width="100%"
              height="100%"
              style={{ objectFit: "cover" }}
              preview={false}
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <div style={{ marginTop: SZ.pad }}>
          <Title level={5} style={{ margin: 0, fontSize: SZ.title }}>
            {data.name}
          </Title>

          {/* Meta line khác nhau theo loại */}
          {kindIsBattery ? (
            <Space direction="vertical" size={2} style={{ marginTop: 6 }}>
              <Text type="secondary">Chemistry: {data.chemistry}</Text>
              <Text type="secondary">{data.location}</Text>
            </Space>
          ) : (
            <Space direction="vertical" size={2} style={{ marginTop: 6 }}>
              <Text type="secondary">Năm: {data.year}</Text>
              <Text type="secondary">{data.location}</Text>
            </Space>
          )}

          {/* Chips thông số */}
          <Row gutter={[6, 6]} style={{ marginTop: 8 }}>
            {kindIsBattery ? (
              <>
                {data.weightKg != null && (
                  <Col>
                    <Tag color="blue" style={{ fontSize: SZ.tag }}>
                      {Number(data.weightKg).toLocaleString("vi-VN")} kg
                    </Tag>
                  </Col>
                )}
                {data.capacityKwh != null && (
                  <Col>
                    <Tag color="green" style={{ fontSize: SZ.tag }}>
                      {Number(data.capacityKwh).toLocaleString("vi-VN")} kWh
                    </Tag>
                  </Col>
                )}
                {data.dimension && (
                  <Col>
                    <Tag color="gold" style={{ fontSize: SZ.tag }}>
                      {data.dimension}
                    </Tag>
                  </Col>
                )}
              </>
            ) : (
              <>
                {data.sohPercent != null && (
                  <Col>
                    <Tag color="blue" style={{ fontSize: SZ.tag }}>
                      SOH: {data.sohPercent}%
                    </Tag>
                  </Col>
                )}
                {data.mileageKm != null && (
                  <Col>
                    <Tag color="green" style={{ fontSize: SZ.tag }}>
                      {Number(data.mileageKm).toLocaleString("vi-VN")} km
                    </Tag>
                  </Col>
                )}
                {data.powerKw != null && (
                  <Col>
                    <Tag color="gold" style={{ fontSize: SZ.tag }}>
                      {data.powerKw} kW
                    </Tag>
                  </Col>
                )}
              </>
            )}
          </Row>

          <Text
            strong
            style={{ color: "#ff4d4f", display: "block", marginTop: 8 }}
          >
            {toVND(data.price)}
          </Text>
        </div>
      {/* </Link> */}
    </Card>
  );
}

