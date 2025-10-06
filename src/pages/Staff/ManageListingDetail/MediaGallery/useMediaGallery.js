import React, { useMemo, useRef, useState } from "react";

export function useMediaGallery(images) {
  const data = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  const handlePrev = () => ref.current?.prev();
  const handleNext = () => ref.current?.next();
  const handleGoTo = (index) => setActive(index);

  return {
    data,
    active,
    ref,
    handlePrev,
    handleNext,
    handleGoTo,
  };
}
