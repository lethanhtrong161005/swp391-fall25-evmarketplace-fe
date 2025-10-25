// src/pages/Member/ProductDetail/hooks/useProductMedia.js
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { MEDIA_TYPES } from "../utils/productConstants";

export function useProductMedia(product) {
  const carouselRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(new Map());

  const mediaItems = useMemo(() => {
    if (!product) return [];

    const imgs = (product.images || []).map((url, index) => ({
      id: `img-${index}`,
      type: MEDIA_TYPES.IMAGE,
      url,
      index,
    }));

    const vids = (product.videos || []).map((url, index) => ({
      id: `vid-${index}`,
      type: MEDIA_TYPES.VIDEO,
      url,
      index: imgs.length + index,
    }));

    return [...imgs, ...vids];
  }, [product]);

  const hasMedia = mediaItems.length > 0;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < mediaItems.length - 1;

  const goToPrevious = useCallback(() => {
    if (canGoPrevious) {
      carouselRef.current?.prev();
    }
  }, [canGoPrevious]);

  const goToNext = useCallback(() => {
    if (canGoNext) {
      carouselRef.current?.next();
    }
  }, [canGoNext]);

  const goToSlide = useCallback(
    (index) => {
      if (index >= 0 && index < mediaItems.length) {
        carouselRef.current?.goTo(index);
      }
    },
    [mediaItems.length]
  );

  const handleMediaError = useCallback((media, index) => {
    setErrors((prev) =>
      new Map(prev).set(media.id, {
        media,
        index,
        timestamp: Date.now(),
      })
    );
  }, []);

  const clearError = useCallback((mediaId) => {
    setErrors((prev) => {
      const newErrors = new Map(prev);
      newErrors.delete(mediaId);
      return newErrors;
    });
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.closest(".product-media")) {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            goToPrevious();
            break;
          case "ArrowRight":
            e.preventDefault();
            goToNext();
            break;
          case "Home":
            e.preventDefault();
            goToSlide(0);
            break;
          case "End":
            e.preventDefault();
            goToSlide(mediaItems.length - 1);
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext, goToSlide, mediaItems.length]);

  // Reset current index when media changes
  useEffect(() => {
    setCurrentIndex(0);
    setErrors(new Map());
  }, [mediaItems.length]);

  return {
    mediaItems,
    hasMedia,
    currentIndex,
    isLoading,
    errors,
    canGoPrevious,
    canGoNext,
    carouselRef,
    goToPrevious,
    goToNext,
    goToSlide,
    handleMediaError,
    clearError,
    setCurrentIndex,
    setIsLoading,
  };
}
