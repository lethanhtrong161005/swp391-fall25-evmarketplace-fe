// src/pages/Member/Home/LatestListingsSection.jsx
import React, { useMemo, useState } from "react";
import { Typography, Empty, Divider, Button } from "antd";
import {
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

import ProductCard from "@/components/ProductCard/ProductCard";
import ViewMoreButton from "@/components/ViewMoreButton";
import styles from "./LatestListingsSection.module.scss";

const { Title } = Typography;

export default function LatestListingsSection({
  listings = [],
  totalCount, // tổng số sản phẩm toàn kho (VD: 20)
  onViewMore,
  onListingClick,
  loading = false,
  maxItems = 10, // hiển thị tối đa 10 tin, chia 2 trang mỗi trang 5
}) {
  const [page, setPage] = useState(0); // 0-based
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
  const totalPages = Math.max(
    1,
    Math.ceil(Math.min(maxItems, newest.length) / 5)
  );
  const boundedPage = Math.min(page, totalPages - 1);
  const pagedItems = useMemo(() => {
    const start = boundedPage * 5;
    return newest.slice(0, maxItems).slice(start, start + 5);
  }, [newest, maxItems, boundedPage]);
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
        </div>

        {newest.length > 0 ? (
          <div className={styles.sliderWrap}>
            <Button
              shape="circle"
              size="large"
              icon={<LeftOutlined />}
              className={styles.navBtn}
              aria-label="Previous"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={boundedPage === 0}
            />

            <div className={`${styles.grid5x} ${styles.fadeIn}`}>
              {pagedItems.map((item) => (
                <div key={item.id} className={styles.gridItem}>
                  <ProductCard
                    listing={item}
                    onClick={handleClick}
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
              aria-label="Next"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={boundedPage >= totalPages - 1}
            />
          </div>
        ) : (
          <Empty
            description={
              <span>
                {loading ? "Đang tải dữ liệu..." : "Chưa có tin đăng nào."}
              </span>
            }
          />
        )}

        <ViewMoreButton count={total} onClick={onViewMore} loading={loading} />
      </section>

      <Divider />
    </>
  );
}
