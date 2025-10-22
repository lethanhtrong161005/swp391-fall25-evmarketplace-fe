// src/pages/Member/ProductDetail/components/ProductMedia/ProductMedia.jsx
import React, { useMemo } from "react";
import { Button, Carousel, Image, Typography, Empty } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useProductMedia } from "../../hooks/useProductMedia";
import "./ProductMedia.styles.scss";

const { Text } = Typography;

// Constants
const FALLBACK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN";

const EMPTY_DESCRIPTION = "Chưa có hình ảnh sản phẩm";

// Media Item Component
const MediaItem = ({ media, index }) => {
  const isImage = media.type === "image";

  if (isImage) {
    return (
      <Image
        src={media.url}
        alt={`Product image ${index + 1}`}
        className="product-media__image"
        fallback={FALLBACK_IMAGE}
        placeholder={
          <div className="product-media__placeholder">
            <PictureOutlined />
          </div>
        }
      />
    );
  }

  return (
    <video
      src={media.url}
      className="product-media__video"
      preload="metadata"
      playsInline
      controls
      poster=""
      aria-label={`Product video ${index + 1}`}
    />
  );
};

// Empty State Component
const EmptyState = () => (
  <div className="product-media__no-image">
    <Empty
      image={
        <PictureOutlined
          style={{
            fontSize: 64,
            color: "#d9d9d9",
          }}
        />
      }
      description={
        <Text type="secondary" style={{ fontSize: 16 }}>
          {EMPTY_DESCRIPTION}
        </Text>
      }
    />
  </div>
);

// Navigation Buttons Component
const NavigationButtons = ({ onPrevious, onNext }) => (
  <>
    <Button
      size="large"
      shape="circle"
      icon={<LeftOutlined />}
      className="product-media__nav-btn product-media__nav-btn--left"
      onClick={onPrevious}
      aria-label="Previous media"
    />
    <Button
      size="large"
      shape="circle"
      icon={<RightOutlined />}
      className="product-media__nav-btn product-media__nav-btn--right"
      onClick={onNext}
      aria-label="Next media"
    />
  </>
);

// Main Component
const ProductMedia = ({ product }) => {
  const { mediaItems, hasMedia, carouselRef, goToPrevious, goToNext } =
    useProductMedia(product);

  // Memoized carousel props
  const carouselProps = useMemo(
    () => ({
      ref: carouselRef,
      className: "product-media__carousel",
      dots: hasMedia && mediaItems.length > 1,
      dotPosition: "bottom",
      infinite: hasMedia && mediaItems.length > 1,
      autoplay: false,
      accessibility: true,
    }),
    [carouselRef, hasMedia, mediaItems.length]
  );

  // Memoized navigation buttons
  const showNavigation = hasMedia && mediaItems.length > 1;

  return (
    <div className="product-media">
      <div className="product-media__container">
        <Carousel {...carouselProps}>
          {hasMedia ? (
            mediaItems.map((media, idx) => (
              <MediaItem
                key={`${media.type}-${idx}`}
                media={media}
                index={idx}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </Carousel>

        {showNavigation && (
          <NavigationButtons onPrevious={goToPrevious} onNext={goToNext} />
        )}
      </div>
    </div>
  );
};

export default ProductMedia;
