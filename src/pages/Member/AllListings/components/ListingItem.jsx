import React, { useState } from "react";
import { Typography, Tag } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import FavoriteButton from "@components/FavoriteButton/FavoriteButton";
import LoginModal from "@components/Modal/LoginModal";
import styles from "../styles/ListingItem.module.scss";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title } = Typography;

function getProductType(listing) {
  const categoryId = listing?.category_id ?? listing?.categoryId;
  const category = listing?.category?.toUpperCase();

  if (categoryId === 4) return "BATTERY";
  if (categoryId === 1) return "EV_CAR";
  if (categoryId === 2) return "E_MOTORBIKE";
  if (categoryId === 3) return "E_BIKE";

  if (category === "BATTERY") return "BATTERY";
  if (category === "EV_CAR") return "EV_CAR";
  if (category === "E_MOTORBIKE") return "E_MOTORBIKE";
  if (category === "E_BIKE") return "E_BIKE";

  if (
    listing?.product_battery_id != null ||
    listing?.productBatteryId != null
  ) {
    return "BATTERY";
  }

  return "UNKNOWN";
}

function getProductTypeTag(productType) {
  const tags = {
    BATTERY: { text: "Pin", color: "purple" },
    EV_CAR: { text: "Ô tô điện", color: "blue" },
    E_MOTORBIKE: { text: "Xe máy điện", color: "green" },
    E_BIKE: { text: "Xe đạp điện", color: "orange" },
    UNKNOWN: { text: "Sản phẩm", color: "default" },
  };
  return tags[productType] || tags.UNKNOWN;
}

function formatPrice(price) {
  if (!price) return { value: "Liên hệ", unit: "" };
  const formatted = price.toLocaleString("vi-VN");
  return { value: formatted, unit: "VND" };
}

function getLocation(listing) {
  if (listing?.province) return listing.province.trim();
  if (listing?.city) return listing.city.trim();
  if (listing?.location) return listing.location.trim();
  return null;
}

function getTimeAgo(listing) {
  if (!listing?.createdAt) return null;
  try {
    return dayjs(listing.createdAt).fromNow();
  } catch (error) {
    return null;
  }
}

export default function ListingItem({ listing, onClick }) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const productType = getProductType(listing);
  const productTypeTag = getProductTypeTag(productType);
  const isBattery = productType === "BATTERY";
  const price = formatPrice(listing.price);
  const location = getLocation(listing);
  const timeAgo = getTimeAgo(listing);
  const title =
    listing.title || `${listing.brand || ""} ${listing.model || ""}`.trim();

  const isFeatured = listing?.visibility === "BOOSTED";
  const isConsignment = listing?.isConsigned === true;

  const handleShowLoginModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <div className={styles.listingItem} onClick={() => onClick?.(listing)}>
        <div className={styles.imageWrapper}>
          <img
            src={
              listing.thumbnailUrl || listing.images?.[0] || listing.imageUrl
            }
            alt={title}
            className={styles.image}
          />
          {productType && (
            <div className={styles.badge}>
              <span>{productTypeTag.text}</span>
            </div>
          )}

          {isFeatured && (
            <div className={styles.featuredBadge}>
              <span>Tin nổi bật</span>
            </div>
          )}
          {!isFeatured && isConsignment && (
            <div className={styles.consignmentBadge}>
              <span>Tin ký gửi</span>
            </div>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.topSection}>
            <Title level={4} className={styles.title}>
              {title}
            </Title>
            <div className={styles.price}>
              {price.value}
              {price.unit && (
                <sup className={styles.priceUnit}>{price.unit}</sup>
              )}
            </div>
          </div>
          <div className={styles.bottomSection}>
            <div className={styles.details}>
              {location && (
                <span className={styles.detail}>
                  <EnvironmentOutlined className={styles.icon} />
                  {location}
                </span>
              )}
              {timeAgo && (
                <span className={styles.detail}>
                  <ClockCircleOutlined className={styles.icon} />
                  {timeAgo}
                </span>
              )}
              {!isBattery && listing.year && (
                <span className={styles.detail}>
                  <CalendarOutlined className={styles.icon} />
                  Năm {listing.year}
                </span>
              )}
            </div>
            <div
              className={styles.favorite}
              onClick={(e) => e.stopPropagation()}
            >
              <FavoriteButton
                listingId={listing?.id}
                size="small"
                showText={false}
                onShowLoginModal={handleShowLoginModal}
              />
            </div>
          </div>
        </div>
      </div>

      <LoginModal open={showLoginModal} onClose={handleCloseLoginModal} />
    </>
  );
}
