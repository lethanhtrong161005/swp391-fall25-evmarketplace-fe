// src/pages/Member/Home/LatestListingsSection.jsx
import React, { useMemo } from "react";
import { Typography, Empty, Divider, Row, Col } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import ProductCard from "./ProductCard";
import ViewAllLink from "@/components/ViewAllLinkButton/ViewAllLink";

const { Title } = Typography;

export default function LatestListingsSection({
  listings = [],
  totalCount, // tổng số sản phẩm toàn kho (VD: 20)
  onViewMore,
  onListingClick,
  loading = false,
  maxItems = 8, // render 8 tin mới nhất
}) {
  const active = useMemo(
    () => (listings || []).filter((x) => x?.status === "ACTIVE"),
    [listings]
  );

  const newest = useMemo(
    () =>
      [...active]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, maxItems),
    [active, maxItems]
  );

  const total = typeof totalCount === "number" ? totalCount : active.length;
  const handleClick = (item) => onListingClick?.(item);

  return (
    <>
      <section style={{ marginBottom: 32 }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 12 }}
        >
          <Title level={2} style={{ margin: 0 }}>
            <ClockCircleOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            Tin đăng mới nhất
          </Title>

          <ViewAllLink
            count={total}
            label="Xem tất cả tin đăng"
            style={{ marginLeft: "auto" }}
            onClick={() => onViewMore?.()}
          />
        </div>

        {newest.length > 0 ? (
          <Row gutter={[16, 16]}>
            {newest.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard
                  listing={item}
                  onClick={handleClick}
                  size="default"
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            description={
              <span>
                {loading ? "Đang tải dữ liệu..." : "Chưa có tin đăng nào."}
              </span>
            }
          />
        )}
      </section>

      <Divider />
    </>
  );
}
