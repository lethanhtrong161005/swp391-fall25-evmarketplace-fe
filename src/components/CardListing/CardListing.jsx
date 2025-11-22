import React, { useState } from "react";
import { Card, Typography, Tag } from "antd";
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
import "./CardListing.styles.scss";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text } = Typography;

function getProductType(listing) {
  // Kiểm tra cả category_id (snake_case) và categoryId (camelCase)
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
    BATTERY: "Pin",
    EV_CAR: "Ô tô điện",
    E_MOTORBIKE: "Xe máy điện",
    E_BIKE: "Xe đạp điện",
    UNKNOWN: "Sản phẩm",
  };
  return tags[productType] || tags.UNKNOWN;
}

function formatPrice(price) {
  if (price == null || price === 0) return { value: "Liên hệ", unit: "" };
  const value = Number(price);
  const formattedValue = Number.isNaN(value)
    ? price
    : value.toLocaleString("vi-VN");
  return { value: formattedValue, unit: "VND" };
}

function getThumbnail(listing) {
  return (
    listing?.thumbnailUrl ||
    (Array.isArray(listing?.images) && listing.images[0]) ||
    listing?.imageUrl ||
    ""
  );
}

function getTitle(listing) {
  if (listing?.title) return listing.title;
  const brand = listing?.brand || "";
  const model = listing?.model || "";
  return `${brand} ${model}`.trim() || "Sản phẩm";
}

function getLocation(listing) {
  if (listing?.province) return listing.province.trim();
  return null;
}

function getTimeAgo(listing) {
  if (!listing?.createdAt) return null;
  try {
    return dayjs(listing.createdAt).fromNow();
  } catch {
    return null;
  }
}

export default function CardListing({ listing, onClick }) {
  const [imgError, setImgError] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const productType = getProductType(listing);
  const productTypeTag = getProductTypeTag(productType);

  const thumbnail = getThumbnail(listing);
  const title = getTitle(listing);
  const location = getLocation(listing);
  const price = formatPrice(listing?.price);
  const timeAgo = getTimeAgo(listing);

  const isFeatured = listing?.visibility === "BOOSTED";
  const isConsignment = listing?.isConsigned === true;

  const year = listing?.year;

  const handleCardClick = () => {
    onClick?.(listing);
  };

  const handleShowLoginModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <Card
        className="card-listing"
        hoverable
        onClick={handleCardClick}
        cover={
          <div className="card-listing__image-wrapper">
            <div className="card-listing__product-type-badge">
              <span>{productTypeTag}</span>
            </div>

            {isFeatured && (
              <div className="card-listing__listing-type-badge card-listing__listing-type-badge--featured">
                <span>Tin nổi bật</span>
              </div>
            )}
            {!isFeatured && isConsignment && (
              <div className="card-listing__listing-type-badge card-listing__listing-type-badge--consignment">
                <span>Tin ký gửi</span>
              </div>
            )}

            {thumbnail && !imgError ? (
              <img
                src={thumbnail}
                alt={title}
                className="card-listing__image"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="card-listing__image-placeholder">
                <Text type="secondary">Không có hình ảnh</Text>
              </div>
            )}

            <div
              className="card-listing__favorite"
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
        }
      >
        <div className="card-listing__content">
          <h3 className="card-listing__title">{title}</h3>

          <div className="card-listing__info-group">
            {location && (
              <div className="card-listing__location">
                <EnvironmentOutlined />
                <Text type="secondary">{location}</Text>
              </div>
            )}

            {timeAgo && (
              <div className="card-listing__time">
                <ClockCircleOutlined />
                <Text type="secondary">{timeAgo}</Text>
              </div>
            )}

            {year && (
              <div className="card-listing__year">
                <CalendarOutlined />
                <Text type="secondary">Năm {year}</Text>
              </div>
            )}
          </div>

          <div className="card-listing__price">
            {price.value}
            {price.unit && (
              <sup className="card-listing__price-unit">{price.unit}</sup>
            )}
          </div>
        </div>
      </Card>

      <LoginModal open={showLoginModal} onClose={handleCloseLoginModal} />
    </>
  );
}
