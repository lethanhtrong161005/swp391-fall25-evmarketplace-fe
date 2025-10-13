// src/pages/Member/Home/LatestListingsSection.jsx
import React, { useMemo, useState } from "react";
import { Typography, Empty, Divider, Button } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import ProductCard from "@/components/ProductCard/ProductCard";
import ViewAllLink from "@/components/ViewAllLinkButton/ViewAllLink";
import styles from "./LatestListingsSection.module.scss";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

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
            <button
              className={styles.navBtn}
              aria-label="Previous"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={boundedPage === 0}
            >
              <LeftOutlined />
            </button>

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

            <button
              className={styles.navBtn}
              aria-label="Next"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={boundedPage >= totalPages - 1}
            >
              <RightOutlined />
            </button>
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

        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 16 }}
        >
          <Button
            onClick={() => onViewMore?.()}
            shape="round"
            size="large"
            style={{ borderRadius: 999, padding: "8px 20px", fontWeight: 600 }}
          >
            {`Xem thêm ${total.toLocaleString("vi-VN")} tin đăng`}
          </Button>
        </div>
      </section>

      <Divider />
    </>
  );
}
