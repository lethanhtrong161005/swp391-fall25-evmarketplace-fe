// src/pages/Member/ProductDetail/components/ProductMedia/components/MediaCounter.jsx
import React, { memo } from "react";
import "./MediaCounter.scss";

const MediaCounter = memo(({ currentIndex, totalCount }) => {
  if (totalCount <= 1) {
    return null;
  }

  return (
    <div className="media-counter">
      <span className="media-counter__text">
        {currentIndex + 1}/{totalCount}
      </span>
    </div>
  );
});

MediaCounter.displayName = "MediaCounter";

export default MediaCounter;
