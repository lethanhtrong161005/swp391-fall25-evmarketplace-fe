// src/pages/Member/ProductDetail.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.scss";
import {
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Card,
  Descriptions,
  Carousel,
  Avatar,
  Space,
  List,
  Image,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  BranchesOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { getListingDetail } from "@/services/listingHomeService";

const { Title, Text, Paragraph } = Typography;

// Format tiền
function toVND(n) {
  if (!n) return "";
  return `${Number(n).toLocaleString("vi-VN")} đ`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const carouselRef = useRef();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const mediaItems = useMemo(() => {
    const imgs = (product?.images || []).map((u) => ({
      type: "image",
      url: u,
    }));
    const vids = (product?.videos || []).map((u) => ({
      type: "video",
      url: u,
    }));
    return [...imgs, ...vids];
  }, [product]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const data = await getListingDetail(id);
      if (alive) {
        setProduct(data);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (!loading && !product) {
    return (
      <Card className="product-detail__section">
        <Title level={4}>Không tìm thấy sản phẩm</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Card>
    );
  }

  if (loading || !product) {
    return (
      <Card className="product-detail__section">
        <Title level={4}>Đang tải...</Title>
      </Card>
    );
  }

  const isBattery = product.category === "BATTERY";

  return (
    <div className="product-detail">
      {/* Nút quay lại + Phần ảnh + thông tin chính */}
      <Card className="product-detail__section">
        {/* Nút quay lại */}
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="product-detail__back-btn"
        >
          Quay lại
        </Button>
        <Row gutter={24}>
          <Col xs={24} md={14} className="product-detail__carousel-container">
            <Carousel ref={carouselRef} className="product-detail__carousel">
              {mediaItems.length ? (
                mediaItems.map((m, idx) => (
                  <div
                    key={`${m.type}-${idx}`}
                    className="product-detail__img-wrapper"
                  >
                    {m.type === "image" ? (
                      <Image preview src={m.url} alt={`image-${idx}`} />
                    ) : (
                      <video
                        src={m.url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          background: "#000",
                        }}
                        preload="metadata"
                        playsInline
                        controls
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="product-detail__no-image">
                  <Text>Không có hình ảnh</Text>
                </div>
              )}
            </Carousel>

            <Button
              size="large"
              shape="circle"
              icon={<LeftOutlined />}
              className="product-detail__nav-btn product-detail__nav-btn--left"
              onClick={() => carouselRef.current?.prev()}
            />
            <Button
              size="large"
              shape="circle"
              icon={<RightOutlined />}
              className="product-detail__nav-btn product-detail__nav-btn--right"
              onClick={() => carouselRef.current?.next()}
            />
          </Col>

          {/* Thông tin chính */}
          <Col xs={24} md={10} className="product-detail__info">
            <Title level={3}>{product.title}</Title>

            <Space size="small" className="product-detail__tags">
              {isBattery ? (
                <Tag color="purple">Pin</Tag>
              ) : (
                <Tag color="blue">Phương tiện</Tag>
              )}
              {product.verified && (
                <Tag icon={<CheckCircleOutlined />} color="green">
                  Đã thẩm định
                </Tag>
              )}
              {product.listingExtra?.visibility === "BOOSTED" && (
                <Tag color="gold" icon={<ThunderboltOutlined />}>
                  Tin nổi bật
                </Tag>
              )}
            </Space>

            <div className="product-detail__location">
              <EnvironmentOutlined /> {product.city}, {product.province}
            </div>

            <Title level={2} className="product-detail__price">
              {toVND(product.price)}
            </Title>
            {product.listingExtra?.aiSuggestedPrice && (
              <Text type="secondary">
                Gợi ý AI: {toVND(product.listingExtra.aiSuggestedPrice)}
              </Text>
            )}

            {/* Người bán */}
            <Card size="small" className="product-detail__seller-card">
              <Avatar src={product.seller?.avatarUrl} size={48} />
              <div className="product-detail__seller-info">
                <Text strong>{product.seller?.fullName}</Text>
                <Paragraph
                  className="product-detail__seller-time"
                  type="secondary"
                >
                  {product.seller?.province}, {product.seller?.addressLine}
                </Paragraph>
              </div>
            </Card>

            {/* Các nút hành động */}
            <div className="product-detail__actions">
              {product.verified ? (
                <Button className="product-detail__action-btn product-detail__action-btn--buy">
                  Mua ngay
                </Button>
              ) : (
                <Button type="primary" className="product-detail__action-btn">
                  Liên hệ
                </Button>
              )}
              <Button className="product-detail__action-btn">Yêu thích</Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Mô tả sản phẩm */}
      <Card className="product-detail__section">
        <Title level={4}>Mô tả sản phẩm</Title>
        <Paragraph>
          {product.description ||
            product.productVehicle?.description ||
            product.productBattery?.description ||
            "Chưa có mô tả chi tiết."}
        </Paragraph>
      </Card>

      {/* Thông số kỹ thuật */}
      <Card className="product-detail__section">
        <Title level={4}>Thông số kỹ thuật</Title>
        <Descriptions column={4} size="small" labelStyle={{ fontWeight: 500 }}>
          <Descriptions.Item label="Thương hiệu">
            {product.brand}
          </Descriptions.Item>
          <Descriptions.Item label="Model">{product.model}</Descriptions.Item>

          {isBattery ? (
            <>
              {product.productBattery?.capacityKwh != null && (
                <Descriptions.Item label="Dung lượng">
                  {product.productBattery?.capacityKwh} kWh
                </Descriptions.Item>
              )}
              {product.productBattery?.voltage != null && (
                <Descriptions.Item label="Điện áp">
                  {product.productBattery?.voltage} V
                </Descriptions.Item>
              )}
              {product.productBattery?.weightKg != null && (
                <Descriptions.Item label="Khối lượng">
                  {product.productBattery?.weightKg} kg
                </Descriptions.Item>
              )}
              {product.productBattery?.dimension && (
                <Descriptions.Item label="Kích thước">
                  {product.productBattery?.dimension}
                </Descriptions.Item>
              )}
              {product.sohPercent != null && (
                <Descriptions.Item label="SOH">
                  {product.sohPercent}%
                </Descriptions.Item>
              )}
            </>
          ) : (
            <>
              {product.year != null && (
                <Descriptions.Item label="Năm sản xuất">
                  {product.year}
                </Descriptions.Item>
              )}
              {product.mileageKm != null && (
                <Descriptions.Item label="Quãng đường">
                  {product.mileageKm?.toLocaleString("vi-VN")} km
                </Descriptions.Item>
              )}
              {product.powerKw != null && (
                <Descriptions.Item label="Công suất">
                  {product.powerKw} kW
                </Descriptions.Item>
              )}
              {product.batteryCapacityKwh != null && (
                <Descriptions.Item label="Dung lượng pin">
                  {product.batteryCapacityKwh} kWh
                </Descriptions.Item>
              )}
              {product.sohPercent != null && (
                <Descriptions.Item label="SOH">
                  {product.sohPercent}%
                </Descriptions.Item>
              )}

              {/* Các field từ productVehicle (nếu có) */}
              {product.productVehicle?.rangeKm != null && (
                <Descriptions.Item label="Tầm hoạt động">
                  {product.productVehicle.rangeKm} km
                </Descriptions.Item>
              )}
              {product.productVehicle?.acChargingKw != null && (
                <Descriptions.Item label="Sạc AC">
                  {product.productVehicle.acChargingKw} kW
                </Descriptions.Item>
              )}
              {product.productVehicle?.dcChargingKw != null && (
                <Descriptions.Item label="Sạc DC">
                  {product.productVehicle.dcChargingKw} kW
                </Descriptions.Item>
              )}
              {product.productVehicle?.acConnector && (
                <Descriptions.Item label="Cổng AC">
                  {product.productVehicle.acConnector}
                </Descriptions.Item>
              )}
              {product.productVehicle?.dcConnector && (
                <Descriptions.Item label="Cổng DC">
                  {product.productVehicle.dcConnector}
                </Descriptions.Item>
              )}
            </>
          )}
        </Descriptions>
      </Card>

      {/* Danh sách xe tương thích */}
      {isBattery && product.compatibleModels?.length > 0 && (
        <Card className="product-detail__section">
          <Title level={4}>Tương thích với các dòng xe</Title>
          <List
            dataSource={product.compatibleModels}
            renderItem={(item) => (
              <List.Item>
                <BranchesOutlined style={{ marginRight: 8 }} />
                {item.brand} {item.model} – Tầm hoạt động {item.rangeKm} km
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
}
