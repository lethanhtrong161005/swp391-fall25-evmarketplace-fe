// src/pages/Member/ProductDetail.jsx
import React, { useRef } from "react";
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
} from "@ant-design/icons";
import productsData from "@data/ProductsData";

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

  const product = productsData.find((p) => String(p.id) === id);

  if (!product) {
    return (
      <Card className="product-detail__section">
        <Title level={4}>Không tìm thấy sản phẩm</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Card>
    );
  }

  const isBattery = product.category === "BATTERY";
  const isCar = product.category === "EV_CAR";
  const isBike = product.category === "E_MOTORBIKE";
  const isEbike = product.category === "E_BIKE";

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
              {product.images?.length ? (
                product.images.map((img, idx) => (
                  <div key={idx} className="product-detail__img-wrapper">
                    <Image preview src={img} alt={`slide-${idx}`} />
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
              className="product-detail__nav-btn product-detail__nav-btn--left"
              onClick={() => carouselRef.current?.prev()}
            >
              ⬅
            </Button>
            <Button
              size="large"
              className="product-detail__nav-btn product-detail__nav-btn--right"
              onClick={() => carouselRef.current?.next()}
            >
              ➡
            </Button>
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
          {product.productVehicle?.description ||
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
              <Descriptions.Item label="Dung lượng">
                {product.productBattery?.capacityKwh} kWh
              </Descriptions.Item>
              <Descriptions.Item label="Điện áp">
                {product.productBattery?.voltage} V
              </Descriptions.Item>
              <Descriptions.Item label="Khối lượng">
                {product.productBattery?.weightKg} kg
              </Descriptions.Item>
              <Descriptions.Item label="Kích thước">
                {product.productBattery?.dimension}
              </Descriptions.Item>
              <Descriptions.Item label="SOH">
                {product.sohPercent}%
              </Descriptions.Item>
            </>
          ) : (
            <>
              <Descriptions.Item label="Năm sản xuất">
                {product.year}
              </Descriptions.Item>
              <Descriptions.Item label="Quãng đường">
                {product.mileageKm?.toLocaleString("vi-VN")} km
              </Descriptions.Item>
              <Descriptions.Item label="Công suất">
                {product.powerKw} kW
              </Descriptions.Item>
              <Descriptions.Item label="Dung lượng pin">
                {product.batteryCapacityKwh} kWh
              </Descriptions.Item>
              <Descriptions.Item label="SOH">
                {product.sohPercent}%
              </Descriptions.Item>

              {isCar && (
                <>
                  <Descriptions.Item label="Số chỗ">
                    {product.productCarDetail?.seatingCapacity}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khoang hành lý">
                    {product.productCarDetail?.trunkCapacity} L
                  </Descriptions.Item>
                  <Descriptions.Item label="Túi khí">
                    {product.productCarDetail?.airbags}
                  </Descriptions.Item>
                  <Descriptions.Item label="ABS">
                    {product.productCarDetail?.hasAbs ? "Có" : "Không"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Autopilot">
                    {product.productCarDetail?.hasAutopilot ? "Có" : "Không"}
                  </Descriptions.Item>
                </>
              )}

              {isBike && (
                <>
                  <Descriptions.Item label="Loại phanh">
                    {product.productBikeDetail?.brakeType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Kích thước bánh">
                    {product.productBikeDetail?.wheelSize}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khối lượng">
                    {product.productBikeDetail?.weightKg} kg
                  </Descriptions.Item>
                  <Descriptions.Item label="Sạc nhanh">
                    {product.productBikeDetail?.fastCharging ? "Có" : "Không"}
                  </Descriptions.Item>
                </>
              )}

              {isEbike && (
                <>
                  <Descriptions.Item label="Khung xe">
                    {product.productEbikeDetail?.frameMaterial}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tải trọng tối đa">
                    {product.productEbikeDetail?.maxLoad} kg
                  </Descriptions.Item>
                  <Descriptions.Item label="Số líp">
                    {product.productEbikeDetail?.gears}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hỗ trợ bàn đạp">
                    {product.productEbikeDetail?.pedalAssist ? "Có" : "Không"}
                  </Descriptions.Item>
                </>
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
