import React, { useState, useEffect } from "react";
import { Image, Button, Typography, Row, Col, Empty } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PlayCircleOutlined,
  FileImageOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useProductMedia } from "../../hooks/useProductMedia";
import { MEDIA_TYPES } from "../../utils/productConstants";

const { Text } = Typography;

// ============================================================================
// STYLES
// ============================================================================
const styles = {
  container: {
    width: "100%",
    background: "#fff",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
  main: {
    position: "relative",
    width: "100%",
    height: "400px",
    background: "#f5f5f5",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    border: "1px solid #d9d9d9",
  },
  thumbnails: {
    marginTop: "16px",
  },
  thumbnail: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    border: "2px solid transparent",
    transition: "all 0.3s ease",
  },
  thumbnailActive: {
    border: "3px solid #1890ff",
    transform: "scale(1.05)",
  },
  thumbnailContent: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  navigation: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
  },
  navigationPrev: {
    left: "16px",
  },
  navigationNext: {
    right: "16px",
  },
  navButton: {
    background: "rgba(0, 0, 0, 0.5)",
    border: "none",
    color: "white",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  counter: {
    position: "absolute",
    bottom: "16px",
    right: "16px",
    background: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  error: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "rgba(0, 0, 0, 0.85)",
  },
};

const ProductMedia = ({ product, ...props }) => {
  const { mediaItems, hasMedia } = useProductMedia(product);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorItems, setErrorItems] = useState(new Set());

  // Reset index when media changes
  useEffect(() => {
    setCurrentIndex(0);
    setErrorItems(new Set()); // Reset errors when product changes
  }, [mediaItems.length]);

  const handleMediaError = (index) => {
    setErrorItems((prev) => new Set([...prev, index]));
  };

  const currentMedia = mediaItems[currentIndex];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < mediaItems.length - 1;

  const goToPrevious = () => {
    if (canGoPrevious) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Render error fallback using Empty component
  const renderErrorFallback = (mediaType) => (
    <Empty
      image={
        <ExclamationCircleOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />
      }
      description={
        <Typography.Text type="secondary">
          {mediaType === MEDIA_TYPES.VIDEO ? "Video lỗi" : "Ảnh lỗi"}
        </Typography.Text>
      }
    />
  );

  // Render actual media content
  const renderMediaContent = () => {
    const { type, url } = currentMedia;

    const commonProps = {
      onError: () => handleMediaError(currentIndex),
    };

    if (type === MEDIA_TYPES.IMAGE) {
      return (
        <Image
          src={url}
          alt={`Product image ${currentIndex + 1}`}
          style={styles.image}
          preview={{
            mask: <div style={{ color: "white", fontSize: 16 }}>Xem ảnh</div>,
          }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN/w8E2MRmBuQc0sHlFKyAaxeQAi7BlFSLFCdlm78kXEDgraDA4QGl2C3LIgmS7j6drfq1dqB5f05FdU+/0qTfJpfLHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAELt7Oy8iYhHEXE7Ip5HxI9t254rMtNa6/OI+EtE/Dki3oyIP7TWui5xrKf05nT/fn65exF+sJQd3gAAAABJRU5ErkJggg=="
          {...commonProps}
        />
      );
    }

    if (type === MEDIA_TYPES.VIDEO) {
      return (
        <video
          src={url}
          controls
          style={styles.video}
          onLoadError={() => handleMediaError(currentIndex)}
          {...commonProps}
        />
      );
    }

    return null;
  };

  // Render thumbnail content
  const renderThumbnailContent = (media, index) => {
    const hasError = errorItems.has(index);

    if (hasError) {
      return (
        <div style={styles.thumbnailContent}>
          <Empty
            image={
              <ExclamationCircleOutlined
                style={{ fontSize: 16, color: "#d9d9d9" }}
              />
            }
            description={false}
          />
        </div>
      );
    }

    const commonProps = {
      onError: () => handleMediaError(index),
    };

    if (media.type === MEDIA_TYPES.IMAGE) {
      return (
        <Image
          src={media.url}
          alt={`Thumbnail ${index + 1}`}
          preview={false}
          style={styles.thumbnailImage}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN/w8E2MRmBuQc0sHlFKyAaxeQAi7BlFSLFCdlm78kXEDgraDA4QGl2C3LIgmS7j6drfq1dqB5f05FdU+/0qTfJpfLHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAELt7Oy8iYhHEXE7Ip5HxI9t254rMtNa6/OI+EtE/Dki3oyIP7TWui5xrKf05nT/fn65exF+sJQd3gAAAABJRU5ErkJggg=="
          {...commonProps}
        />
      );
    }

    if (media.type === MEDIA_TYPES.VIDEO) {
      return (
        <div style={styles.thumbnailContent}>
          <PlayCircleOutlined style={{ fontSize: 20 }} />
        </div>
      );
    }

    return null;
  };

  // Render main media
  const renderMainMedia = () => {
    if (!hasMedia) {
      return (
        <div style={styles.main}>
          <Empty
            image={
              <FileImageOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />
            }
            description={
              <Typography.Text type="secondary">
                Không có hình ảnh hoặc video
              </Typography.Text>
            }
          />
        </div>
      );
    }

    const currentHasError = errorItems.has(currentIndex);

    if (currentHasError) {
      return (
        <div style={styles.main}>{renderErrorFallback(currentMedia.type)}</div>
      );
    }

    return <div style={styles.main}>{renderMediaContent()}</div>;
  };

  // Render thumbnails
  const renderThumbnails = () => {
    if (!hasMedia || mediaItems.length <= 1) {
      return null;
    }

    return (
      <Row gutter={[8, 8]} justify="center" style={styles.thumbnails}>
        {mediaItems.map((media, index) => {
          const isActive = index === currentIndex;

          return (
            <Col key={index}>
              <div
                onClick={() => goToSlide(index)}
                style={{
                  ...styles.thumbnail,
                  ...(isActive ? styles.thumbnailActive : {}),
                }}
              >
                {renderThumbnailContent(media, index)}
              </div>
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <div style={styles.container} {...props}>
      {/* Main media container */}
      <div style={{ position: "relative" }}>
        {renderMainMedia()}

        {/* Navigation buttons */}
        {hasMedia && mediaItems.length > 1 && (
          <>
            {canGoPrevious && (
              <Button
                type="primary"
                shape="circle"
                icon={<LeftOutlined />}
                onClick={goToPrevious}
                style={{ ...styles.navigation, ...styles.navigationPrev }}
              />
            )}
            {canGoNext && (
              <Button
                type="primary"
                shape="circle"
                icon={<RightOutlined />}
                onClick={goToNext}
                style={{ ...styles.navigation, ...styles.navigationNext }}
              />
            )}
          </>
        )}

        {/* Media counter */}
        {hasMedia && mediaItems.length > 1 && (
          <div style={styles.counter}>
            {currentIndex + 1}/{mediaItems.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {renderThumbnails()}
    </div>
  );
};

export default ProductMedia;
