// src/pages/Member/Home/FeaturedProductSection.jsx
import React, { useMemo } from "react";
import { Typography, Empty, Button } from "antd";
import {
  TrophyOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

import CardListing from "@components/CardListing";
import ViewMoreButton from "@/components/ViewMoreButton";
import styles from "./LatestListingsSection.module.scss";

const { Title } = Typography;

export default function FeaturedProductSection({
  items = [],
  totalCount,
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

  // Tính tổng số tin nổi bật
  const total = typeof totalCount === "number" ? totalCount : boostedTop.length;

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
                <CardListing listing={item} onClick={onItemClick} />
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

      <ViewMoreButton 
        count={total} 
        onClick={onViewMore} 
        loading={loading} 
      />
    </section>
  );
}
