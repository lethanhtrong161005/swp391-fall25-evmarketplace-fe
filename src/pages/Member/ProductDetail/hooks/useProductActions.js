// src/pages/Member/ProductDetail/hooks/useProductActions.js
import { useState, useEffect } from "react";
import { message } from "antd";
import { addFavorite, removeFavorite } from "@services/favoriteService";
import { useAuth } from "@hooks/useAuth";

export function useProductActions(product, onShowLoginModal) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  // Khởi tạo trạng thái isFavorite từ dữ liệu sản phẩm
  useEffect(() => {
    if (product?.isFavorited !== undefined) {
      setIsFavorite(product.isFavorited);
    }
  }, [product?.isFavorited]);

  const handleToggleFavorite = async () => {
    if (!product?.id) {
      message.error("Không tìm thấy thông tin sản phẩm");
      return;
    }

    // Kiểm tra trạng thái đăng nhập
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để lưu tin");
      onShowLoginModal?.();
      return;
    }

    const previousState = isFavorite;

    // Optimistic UI: Cập nhật trạng thái ngay lập tức
    setIsFavorite(!isFavorite);
    setIsLoading(true);

    try {
      if (previousState) {
        // Nếu đang là favorite, gọi API xóa
        await removeFavorite(product.id);
        message.success("Đã xóa khỏi danh sách theo dõi");
      } else {
        // Nếu chưa là favorite, gọi API thêm
        await addFavorite(product.id);
        message.success("Đã thêm vào danh sách theo dõi");
      }
    } catch (error) {
      // Nếu API lỗi, hoàn tác lại trạng thái
      setIsFavorite(previousState);
      message.error(error.message || "Có lỗi xảy ra, vui lòng thử lại");
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
