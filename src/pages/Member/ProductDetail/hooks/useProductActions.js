// src/pages/Member/ProductDetail/hooks/useProductActions.js
import { useState } from "react";
import { message } from "antd";

export function useProductActions(product) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement favorite toggle logic
      setIsFavorite(!isFavorite);
      message.success(isFavorite ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích");
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFavorite,
    isLoading,
    handleToggleFavorite,
  };
}
