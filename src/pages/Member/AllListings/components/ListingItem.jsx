import React from "react";
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
import styles from "../styles/ListingItem.module.scss";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title } = Typography;

function getProductType(listing) {
  const categoryId = listing?.category_id;
  if (categoryId) {
    if (categoryId >= 1 && categoryId <= 3) return "EV_CAR";
    if (categoryId >= 4 && categoryId <= 6) return "E_MOTORBIKE";
    if (categoryId >= 7 && categoryId <= 9) return "E_BIKE";
  }
  if (listing?.category === "BATTERY" || listing?.product_battery_id)
    return "BATTERY";
  return null;
}

function getProductTypeTag(productType) {
  const tags = {
    BATTERY: { text: "Pin", color: "#1B2A41" },
    EV_CAR: { text: "Ô tô điện", color: "#1B2A41" },
    E_MOTORBIKE: { text: "Xe máy điện", color: "#1B2A41" },
    E_BIKE: { text: "Xe đạp điện", color: "#1B2A41" },
  };
  return tags[productType] || { text: "Khác", color: "#1B2A41" };
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
  const productType = getProductType(listing);
  const productTypeTag = getProductTypeTag(productType);
  const isBattery = productType === "BATTERY";
  const price = formatPrice(listing.price);
  const location = getLocation(listing);
  const timeAgo = getTimeAgo(listing);
  const isVerified = !!listing?.verified;
  const title =
    listing.title || `${listing.brand || ""} ${listing.model || ""}`.trim();

  return (
    <div className={styles.listingItem} onClick={() => onClick?.(listing)}>
      <div className={styles.imageWrapper}>
        <img
          src={listing.thumbnailUrl || listing.images?.[0] || listing.imageUrl}
          alt={title}
          className={styles.image}
        />
        {productType && (
          <div className={styles.badge}>
            <span>{productTypeTag.text}</span>
          </div>
        )}
        {isVerified && (
          <div className={styles.verified}>
            <Tag color="red">Đã thẩm định</Tag>
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
            {price.unit && <sup className={styles.priceUnit}>{price.unit}</sup>}
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
          <div className={styles.favorite} onClick={(e) => e.stopPropagation()}>
            <FavoriteButton
              listingId={listing?.id}
              size="small"
              showText={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
