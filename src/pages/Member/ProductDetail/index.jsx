// src/pages/Member/ProductDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Image,
  Descriptions,
  Button,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

// Import 2 file data giả
import vehiclesData from "@/data/vehicleData";
import batteriesData from "@/data/batteriesData";

const { Title, Text } = Typography;

// Format tiền
function toVND(n) {
  if (!n) return "";
  return `${Number(n).toLocaleString("vi-VN")} đ`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tìm trong cả 2 data
  const product =
    vehiclesData.find((p) => String(p.id) === id) ||
    batteriesData.find((p) => String(p.id) === id);

  if (!product) {
    return (
      <Card style={{ margin: 24 }}>
        <Title level={4}>Không tìm thấy sản phẩm</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Card>
    );
  }

  const isBattery = product.category?.toUpperCase() === "BATTERY";

  return (
    <Card style={{ margin: 24 }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Row gutter={24}>
        {/* Ảnh sản phẩm */}
        <Col xs={24} md={10}>
          <Image
            src={product.images?.[0]}
            alt={product.title}
            width="100%"
            style={{ borderRadius: 8 }}
          />
        </Col>

        {/* Thông tin chi tiết */}
        <Col xs={24} md={14}>
          <Title level={3}>{product.title}</Title>

          <div style={{ marginBottom: 12 }}>
            {isBattery ? (
              <Tag color="purple">Battery</Tag>
            ) : (
              <Tag color="blue">Vehicle</Tag>
            )}
            {product.verified && <Tag color="green">Đã thẩm định</Tag>}
          </div>

          <Descriptions
            column={1}
            bordered
            size="middle"
            labelStyle={{ fontWeight: 500 }}
          >
            <Descriptions.Item label="Thương hiệu">
              {product.brand}
            </Descriptions.Item>
            <Descriptions.Item label="Model">
              {product.model}
            </Descriptions.Item>

            {isBattery ? (
              <>
                <Descriptions.Item label="Dung lượng">
                  {product.batteryCapacityKwh} kWh
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
                  {product.mileageKm.toLocaleString("vi-VN")} km
                </Descriptions.Item>
                <Descriptions.Item label="Công suất">
                  {product.powerKw} kW
                </Descriptions.Item>
                <Descriptions.Item label="Pin (kWh)">
                  {product.batteryCapacityKwh} kWh
                </Descriptions.Item>
                <Descriptions.Item label="SOH">
                  {product.sohPercent}%
                </Descriptions.Item>
              </>
            )}

            <Descriptions.Item label="Địa điểm">
              {product.city}, {product.province}
            </Descriptions.Item>
          </Descriptions>

          <Text
            strong
            style={{
              color: "#ff4d4f",
              display: "block",
              fontSize: 20,
              marginTop: 16,
            }}
          >
            {toVND(product.price)}
          </Text>
        </Col>
      </Row>
    </Card>
  );
}
