// src/pages/Member/ProductDetail/hooks/useProductMedia.js
import { useMemo, useRef } from "react";
import { MEDIA_TYPES } from "../utils/productConstants";

export function useProductMedia(product) {
  const carouselRef = useRef();

  const mediaItems = useMemo(() => {
    if (!product) return [];

    const imgs = (product.images || []).map((url) => ({
      type: MEDIA_TYPES.IMAGE,
      url,
    }));

    const vids = (product.videos || []).map((url) => ({
      type: MEDIA_TYPES.VIDEO,
      url,
    }));

    return [...imgs, ...vids];
  }, [product]);

  const hasMedia = mediaItems.length > 0;
  const currentIndex = 0; // Có thể mở rộng để track current slide

  const goToPrevious = () => {
    carouselRef.current?.prev();
  };

  const goToNext = () => {
    carouselRef.current?.next();
  };

  const goToSlide = (index) => {
    carouselRef.current?.goTo(index);
  };

  return {
    mediaItems,
    hasMedia,
    currentIndex,
    carouselRef,
    goToPrevious,
    goToNext,
    goToSlide,
  };
}
