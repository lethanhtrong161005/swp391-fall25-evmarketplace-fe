// src/pages/Member/Home/FeaturedProductSection.jsx
import React, { useMemo } from "react";
import { Typography, Row, Col, Empty, Space, Button } from "antd";
import {
  ArrowRightOutlined,
  TrophyOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./LatestListingsSection.module.scss";
import ViewAllLink from "@components/ViewAllLinkButton/ViewAllLink";

const { Title } = Typography;

export default function FeaturedProductSection({
  items = [],
  // totalCount,
  onViewMore,
  onItemClick,
  loading = false,
  maxItems = 10,
  title = "Sản phẩm nổi bật",
}) {
  // Chỉ lấy BOOSTED và giới hạn 10 item đầu
  const boostedTop = useMemo(
    () =>
      [...(items || [])]
        .filter((x) => x?.status === "ACTIVE" && x?.visibility === "BOOSTED")
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, maxItems),
    [items, maxItems]
  );

  // Tính tổng số listing
  // const total = typeof totalCount === "number" ? totalCount : boostedTop.length;

  return (
    <section style={{ margin: "48px 0" }}>
      <Title level={2} style={{ margin: 0, marginBottom: 12 }}>
        <TrophyOutlined style={{ marginRight: 8, color: "#faad14" }} />
        {title}
      </Title>

      {boostedTop.length > 0 ? (
        <div className={styles.sliderWrap}>
          <Button
            shape="circle"
            size="large"
            icon={<LeftOutlined />}
            className={styles.navBtn}
            style={{ visibility: "hidden" }}
          />
          <div className={styles.grid5x}>
            {boostedTop.map((item) => (
              <div key={item.id} className={styles.gridItem}>
                <ProductCard
                  listing={item}
                  onClick={onItemClick}
                  size="default"
                />
              </div>
            ))}
          </div>
          <Button
            shape="circle"
            size="large"
            icon={<RightOutlined />}
            className={styles.navBtn}
            style={{ visibility: "hidden" }}
          />
        </div>
      ) : (
        <Empty
          description={
            <span>
              {loading
                ? "Đang tải dữ liệu sản phẩm nổi bật..."
                : "Chưa có sản phẩm nổi bật."}
            </span>
          }
        />
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <Button type="link" onClick={onViewMore} icon={<ArrowRightOutlined />}>
          Xem thêm
        </Button>
      </div>
    </section>
  );
}
