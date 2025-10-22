// src/pages/Member/ProductDetail/components/ProductMedia/components/MediaThumbnails.jsx
import React, { memo, useCallback, useState, useEffect } from "react";
import { Image } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { MEDIA_TYPES } from "../../../utils/productConstants";
import "./MediaThumbnails.scss";

const MediaThumbnails = memo(
  ({ mediaItems, currentIndex, onThumbnailClick, showThumbnails = true }) => {
    const [windowWidth, setWindowWidth] = useState(0);

    const handleThumbnailClick = useCallback(
      (index) => {
        onThumbnailClick?.(index);
      },
      [onThumbnailClick]
    );

    // Theo dõi resize window
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      // Set initial width
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!showThumbnails || mediaItems.length <= 1) {
      return null;
    }

    // Tính toán số lượng thumbnail cần scroll dựa trên kích thước màn hình
    const getMaxThumbnails = () => {
      if (windowWidth <= 480) return 2; // Mobile
      if (windowWidth <= 768) return 3; // Tablet
      return 4; // Desktop
    };

    const needsScroll = mediaItems.length > getMaxThumbnails();
    const containerClass = `media-thumbnails__container ${
      needsScroll ? "media-thumbnails__container--scrollable" : ""
    }`;

    return (
      <div className="media-thumbnails">
        <div className={containerClass}>
          {mediaItems.map((media, index) => {
            const isActive = index === currentIndex;
            const isImage = media.type === MEDIA_TYPES.IMAGE;
            const isVideo = media.type === MEDIA_TYPES.VIDEO;

            return (
              <div
                key={`thumbnail-${index}`}
                className={`media-thumbnails__item ${
                  isActive ? "media-thumbnails__item--active" : ""
                }`}
                onClick={() => handleThumbnailClick(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleThumbnailClick(index);
                  }
                }}
                aria-label={`Go to media ${index + 1}`}
              >
                <div className="media-thumbnails__image-container">
                  {isImage ? (
                    <Image
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="media-thumbnails__image"
                      preview={false}
                    />
                  ) : (
                    <div className="media-thumbnails__video-placeholder">
                      <PlayCircleOutlined className="media-thumbnails__play-icon" />
                    </div>
                  )}
                </div>
                <div className="media-thumbnails__overlay" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

MediaThumbnails.displayName = "MediaThumbnails";

export default MediaThumbnails;
