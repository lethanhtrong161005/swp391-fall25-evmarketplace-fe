// src/pages/Member/ProductDetail/components/ProductMedia/ProductMedia.jsx
import React, { useMemo, useCallback } from "react";
import { Carousel, Spin } from "antd";
import { useProductMedia } from "../../hooks/useProductMedia";
import MediaItem from "./components/MediaItem";
import EmptyState from "./components/EmptyState";
import NavigationButtons from "./components/NavigationButtons";
import MediaThumbnails from "./components/MediaThumbnails";
import MediaCounter from "./components/MediaCounter";
import "./ProductMedia.styles.scss";

const ProductMedia = ({
  product,
  showThumbnails = true,
  showNavigation = true,
  className = "",
  ...props
}) => {
  const {
    mediaItems,
    hasMedia,
    currentIndex,
    isLoading,
    canGoPrevious,
    canGoNext,
    carouselRef,
    goToPrevious,
    goToNext,
    goToSlide,
    handleMediaError,
    setCurrentIndex,
  } = useProductMedia(product);

  // Handle carousel change
  const handleCarouselChange = useCallback(
    (index) => {
      setCurrentIndex(index);
    },
    [setCurrentIndex]
  );

  // Memoized carousel props
  const carouselProps = useMemo(
    () => ({
      ref: carouselRef,
      className: "product-media__carousel",
      dots: false, // Tắt dots để dùng custom counter
      infinite: false,
      autoplay: false,
      accessibility: true,
      beforeChange: handleCarouselChange,
      afterChange: handleCarouselChange,
    }),
    [carouselRef, handleCarouselChange]
  );

  // Memoized navigation visibility
  const showNavButtons = showNavigation && hasMedia && mediaItems.length > 1;

  return (
    <div className={`product-media ${className}`} {...props}>
      <div className="product-media__container">
        {isLoading && (
          <div className="product-media__loading-overlay">
            <Spin size="large" />
          </div>
        )}

        <Carousel {...carouselProps}>
          {hasMedia ? (
            mediaItems.map((media, idx) => (
              <MediaItem
                key={media.id || `${media.type}-${idx}`}
                media={media}
                index={idx}
                onError={handleMediaError}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </Carousel>

        {showNavButtons && (
          <NavigationButtons
            onPrevious={goToPrevious}
            onNext={goToNext}
            disabled={isLoading}
            showLeft={canGoPrevious}
            showRight={canGoNext}
          />
        )}

        {/* Media Counter - hiển thị số thứ tự như ảnh 1 */}
        <MediaCounter
          currentIndex={currentIndex}
          totalCount={mediaItems.length}
        />
      </div>

      {showThumbnails && hasMedia && mediaItems.length > 1 && (
        <MediaThumbnails
          mediaItems={mediaItems}
          currentIndex={currentIndex}
          onThumbnailClick={goToSlide}
          showThumbnails={showThumbnails}
        />
      )}
    </div>
  );
};

export default ProductMedia;
