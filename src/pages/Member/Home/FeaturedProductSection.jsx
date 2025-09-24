// src/pages/Member/Home/FeaturedProductSection.jsx
import React, { useMemo } from "react";
import { Typography, Row, Col, Empty, Space } from "antd";
import { ArrowRightOutlined, TrophyOutlined } from "@ant-design/icons";
import ProductCard from "@/components/ProductCard/ProductCard";
import ViewAllLink from "@/components/ViewAllLinkButton/ViewAllLink";

const { Title } = Typography;

export default function FeaturedProductSection({
  items = [],
  totalCount, // tổng số sản phẩm nổi bật (không chỉ 8)
  onViewMore,
  onItemClick,
  loading = false,
  maxItems = 8,
  title = "Sản phẩm nổi bật",
}) {
  // Lọc & chọn 8 item nổi bật để hiển thị
  const featured8 = useMemo(
    () =>
      [...(items || [])]
        .filter(
          (x) =>
            x?.status === "ACTIVE" &&
            (x?.verified === true || x?.visibility === "BOOSTED")
        )
        .sort(
          (a, b) =>
            (b.visibility === "BOOSTED") - (a.visibility === "BOOSTED") ||
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        .slice(0, maxItems),
    [items, maxItems]
  );

  // Tổng để hiển thị trên nút xem tất cả
  const total = typeof totalCount === "number" ? totalCount : items.length;

  return (
    <section style={{ margin: "48px 0" }}>
      <Space
        align="center"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Title level={2} style={{ margin: 0 }}>
          <TrophyOutlined style={{ marginRight: 8, color: "#faad14" }} />
          {title}
        </Title>

        <ViewAllLink
          count={total}
          label="Xem tất cả"
          icon={<ArrowRightOutlined />}
          onClick={onViewMore}
        />
      </Space>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {featured8.length > 0 ? (
          featured8.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <ProductCard
                listing={item}
                onClick={onItemClick}
                size="default"
              />
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty
              description={
                <span>
                  {loading
                    ? "Đang tải dữ liệu sản phẩm nổi bật..."
                    : "Chưa có sản phẩm nổi bật (đã thẩm định hoặc được BOOST)."}
                </span>
              }
            />
          </Col>
        )}
      </Row>
    </section>
  );
}
