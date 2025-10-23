// src/pages/Member/ProductDetail/components/ProductMedia/components/MediaItem.jsx
import React, { memo, useState } from "react";
import { Image } from "antd";
import { PictureOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { MEDIA_TYPES } from "../../../utils/productConstants";
import "./MediaItem.scss";

const FALLBACK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN";

const MediaItem = memo(({ media, index, onError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const isImage = media.type === MEDIA_TYPES.IMAGE;
  const isVideo = media.type === MEDIA_TYPES.VIDEO;

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.(media, index);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const renderImage = () => (
    <div className="media-item__image-container">
      <Image
        src={media.url}
        alt={`Product image ${index + 1}`}
        className="media-item__image"
        fallback={FALLBACK_IMAGE}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={false}
        preview={{
          mask: (
            <div className="media-item__preview-mask">
              <PictureOutlined />
            </div>
          ),
        }}
      />
      {isLoading && (
        <div className="media-item__loading">
          <div className="media-item__spinner" />
        </div>
      )}
    </div>
  );

  const renderVideo = () => (
    <div className="media-item__video-container">
      <video
        src={media.url}
        className="media-item__video"
        preload="metadata"
        playsInline
        controls
        poster=""
        onLoadedData={handleLoad}
        onError={handleError}
        onPlay={handlePlay}
        onPause={handlePause}
        aria-label={`Product video ${index + 1}`}
      />
      {isLoading && (
        <div className="media-item__loading">
          <div className="media-item__spinner" />
        </div>
      )}
      {!isPlaying && (
        <div className="media-item__video-overlay">
          <PlayCircleOutlined className="media-item__play-icon" />
        </div>
      )}
    </div>
  );

  if (hasError) {
    return (
      <div className="media-item__error">
        <PictureOutlined />
        <span>Không thể tải media</span>
      </div>
    );
  }

  return (
    <div className="media-item">
      {isImage && renderImage()}
      {isVideo && renderVideo()}
    </div>
  );
});

MediaItem.displayName = "MediaItem";

export default MediaItem;
